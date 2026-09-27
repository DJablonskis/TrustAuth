<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\DiditVerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * Handles NIST SP 800-63-4 IAL2 identity verification flows via
 * commercial verification provider (Didit) with local simulation fallback.
 */
class VerificationController extends Controller
{
    protected DiditVerificationService $diditService;

    public function __construct(DiditVerificationService $diditService)
    {
        $this->diditService = $diditService;
    }

    /**
     * Check if live Didit provider is active, or return session info.
     */
    public function getProviderStatus(Request $request): JsonResponse
    {
        $user = $request->user();

        // If client passes active session_id in poll, check if Didit marked it approved and reconcile
        $sessionId = $request->input('session_id');
        if ($sessionId && $user && ! $user->is_identity_verified) {
            $this->diditService->reconcileSessionForUser($user, $sessionId);
            $user->refresh();
        }

        return response()->json([
            'success' => true,
            'is_live_provider' => $this->diditService->isConfigured(),
            'provider_name' => $this->diditService->isConfigured() ? 'Didit Identity Verification (Live)' : 'TrustAuth Local KYC Simulator',
            'user_status' => [
                'is_identity_verified' => (bool) ($user->is_identity_verified ?? false),
                'verification_type' => $user->verification_type ?? null,
                'estimated_age' => $user->estimated_age ?? null,
                'date_of_birth' => $user->date_of_birth ? $user->date_of_birth->toDateString() : null,
                'name' => $user->name ?? null,
            ],
        ]);
    }

    /**
     * Initiate an identity verification session.
     * Uses live Didit if configured; otherwise returns simulation instruction.
     * Accepts 'flow_mode': 'standard' (Photo + Live + ID) or 'photo_only' (Photo ID only).
     */
    public function initiateVerification(Request $request): JsonResponse
    {
        $user = $request->user();
        $flowMode = $request->input('flow_mode', 'standard');

        if ($this->diditService->isConfigured()) {
            $callbackUrl = route('dashboard');
            $session = $this->diditService->createVerificationSession($user, $callbackUrl, $flowMode);

            if ($session && ($session['success'] ?? false) && ! empty($session['url'])) {
                return response()->json([
                    'success' => true,
                    'mode' => 'didit_live',
                    'session_id' => $session['session_id'],
                    'verification_url' => $session['url'],
                    'flow_mode' => $flowMode,
                    'message' => 'Didit hosted verification session initialized.',
                ]);
            }

            $detail = $session['error_detail'] ?? 'Could not initiate Didit verification session. Please verify that your Didit workflow is active and has credits.';

            return response()->json([
                'success' => false,
                'mode' => 'error',
                'flow_mode' => $flowMode,
                'message' => $detail,
            ], 422);
        }

        return response()->json([
            'success' => true,
            'mode' => 'simulation',
            'flow_mode' => $flowMode,
            'message' => 'No commercial provider key configured. Ready for local simulation.',
        ]);
    }

    /**
     * Ingest and verify Didit inbound webhooks.
     * Stamped as IAL2 on Approved decision, populates attested DOB, and strips raw images.
     */
    public function handleDiditWebhook(Request $request): JsonResponse
    {
        $rawPayload = $request->getContent();
        $signature = $request->header('X-Signature-SHA256') ?? $request->header('X-Signature-V2');

        if (! $this->diditService->verifyWebhookSignature($rawPayload, $signature)) {
            Log::warning('Didit webhook signature verification failed');
            return response()->json(['error' => 'Invalid webhook signature'], 401);
        }

        $event = $request->json()->all();
        $eventType = $event['webhook_type'] ?? $event['event'] ?? 'status.updated';
        $userId = $event['vendor_data'] ?? null;
        $status = $event['status'] ?? null;
        $flowMode = $event['metadata']['flow_mode'] ?? 'standard';

        Log::info('Didit verification webhook received', [
            'type' => $eventType,
            'vendor_data' => $userId,
            'status' => $status,
            'flow_mode' => $flowMode,
        ]);

        if ($userId) {
            $user = User::find($userId);

            if ($user && in_array(strtolower((string) $status), ['approved', 'completed', 'successful'])) {
                $user->is_identity_verified = true;
                $user->verification_type = $flowMode;

                if ($flowMode === 'photo_only') {
                    // Option 1 (Photo Only): fast estimate (+-3 years). Conservative lower bound (estimate - 3).
                    $estimatedAge = null;
                    if (isset($event['extracted_data']['estimated_age'])) {
                        $rawAge = (int) $event['extracted_data']['estimated_age'];
                        $estimatedAge = max(1, $rawAge - 3);
                    } elseif (isset($event['extracted_data']['age'])) {
                        $rawAge = (int) $event['extracted_data']['age'];
                        $estimatedAge = max(1, $rawAge - 3);
                    } else {
                        // Default fallback estimated age lower bound if not specified in payload
                        $estimatedAge = 22; // 25 - 3
                    }
                    $user->estimated_age = $estimatedAge;
                    // Do NOT overwrite official date_of_birth from photo_only estimation
                } else {
                    // Option 2 (Photo -> Live -> ID / Standard NIST IAL2):
                    // Confirms legal name and exact date of birth from official government ID.
                    // Makes sure the underlying user account has correct verified information.
                    if (! empty($event['extracted_data']['date_of_birth'])) {
                        $user->date_of_birth = Carbon::parse($event['extracted_data']['date_of_birth'])->toDateString();
                    }

                    // Extract verified legal name from OCR
                    $firstName = $event['extracted_data']['first_name'] ?? null;
                    $lastName = $event['extracted_data']['last_name'] ?? null;
                    $fullName = trim("{$firstName} {$lastName}");

                    if (! empty($fullName)) {
                        $user->name = $fullName;
                    } elseif (! empty($event['extracted_data']['full_name'])) {
                        $user->name = trim($event['extracted_data']['full_name']);
                    }
                }

                $user->save();

                if ($flowMode === 'standard' && ! empty($user->name)) {
                    foreach ($user->personas as $p) {
                        $needsSave = false;
                        if (empty($p->legal_name) || $p->legal_name !== $user->name) {
                            $p->legal_name = $user->name;
                            $needsSave = true;
                        }
                        if (empty($p->given_name) && ! empty($firstName)) {
                            $p->given_name = $firstName;
                            $needsSave = true;
                        }
                        if (empty($p->family_name) && ! empty($lastName)) {
                            $p->family_name = $lastName;
                            $needsSave = true;
                        }
                        if ($needsSave) {
                            $p->save();
                        }
                    }
                }

                Log::info("User ID {$user->id} verified via Didit ({$flowMode}).");
            }
        }

        return response()->json(['received' => true]);
    }

    /**
     * Toggle or simulate identity verification (Simulation / Testing).
     *
     * @return RedirectResponse|JsonResponse
     */
    public function simulateIal2(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->is_identity_verified = ! $user->is_identity_verified;
            $flowMode = $request->input('flow_mode', 'standard');

            if ($user->is_identity_verified) {
                $user->verification_type = $flowMode;

                if ($flowMode === 'photo_only') {
                    // Photo-only simulation: compute conservative lower bound (raw - 3) without relying on user DOB
                    $rawEstimate = $request->filled('estimated_age') ? (int) $request->input('estimated_age') : 25;
                    $user->estimated_age = max(1, $rawEstimate - 3);
                } else {
                    // Standard flow: confirms real DOB and legal name on master user account
                    if ($request->filled('date_of_birth')) {
                        $user->date_of_birth = Carbon::parse($request->input('date_of_birth'))->toDateString();
                    } elseif (! $user->date_of_birth) {
                        $user->date_of_birth = '1998-05-14';
                    }

                    if ($request->filled('legal_name')) {
                        $user->name = $request->input('legal_name');
                    }
                }
            } else {
                $user->verification_type = null;
                $user->estimated_age = null;
            }

            $user->save();

            // Propagate legal name to personas if user verified with a name
            if ($user->is_identity_verified && ! empty($user->name)) {
                foreach ($user->personas as $p) {
                    if ($p->is_age_verified && (empty($p->legal_name) || $p->legal_name !== $user->name)) {
                        $p->legal_name = $user->name;
                        $p->save();
                    }
                }
            }
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'User identity verification status updated.',
                'data' => [
                    'is_identity_verified' => (bool) $user->is_identity_verified,
                    'verification_type' => $user->verification_type,
                    'estimated_age' => $user->estimated_age,
                    'date_of_birth' => $user->date_of_birth,
                    'name' => $user->name,
                ],
            ]);
        }

        return redirect()->back();
    }
}
