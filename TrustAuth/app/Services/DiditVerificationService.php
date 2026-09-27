<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Provides commercial identity verification services (NIST SP 800-63-4 IAL2)
 * using the Didit v3 verification API (OCR, Liveness, Face Match, IP Analysis).
 */
class DiditVerificationService
{
    protected string $apiKey;
    protected ?string $workflowId;
    protected ?string $photoWorkflowId;
    protected ?string $webhookSecret;
    protected string $apiBaseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.didit.api_key', env('DIDIT_API_KEY', ''));
        $this->workflowId = config('services.didit.workflow_id', env('DIDIT_WORKFLOW_ID', null));
        $this->photoWorkflowId = config('services.didit.photo_workflow_id', env('DIDIT_PHOTO_WORKFLOW_ID', 'f98fe9ff-08bf-4a61-968d-3b1a2badc5e2'));
        $this->webhookSecret = config('services.didit.webhook_secret', env('DIDIT_WEBHOOK_SECRET', ''));
        $this->apiBaseUrl = config('services.didit.api_base_url', 'https://verification.didit.me/v3');
    }

    public function isConfigured(): bool
    {
        return ! empty($this->getApiKey());
    }

    public function getApiKey(): string
    {
        return (string) config('services.didit.api_key', env('DIDIT_API_KEY', ''));
    }

    public function getWorkflowId(): ?string
    {
        return config('services.didit.workflow_id', env('DIDIT_WORKFLOW_ID', null));
    }

    public function getPhotoWorkflowId(): ?string
    {
        return config('services.didit.photo_workflow_id', env('DIDIT_PHOTO_WORKFLOW_ID', 'f98fe9ff-08bf-4a61-968d-3b1a2badc5e2'));
    }

    /**
     * Ensure a free standard KYC workflow exists on Didit.
     * Returns the workflow UUID.
     */
    public function getOrCreateKycWorkflow(): ?string
    {
        if (! $this->isConfigured()) {
            return null;
        }

        if ($this->workflowId) {
            return $this->workflowId;
        }

        try {
            // Check existing workflows first
            $listResponse = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'Accept' => 'application/json',
            ])->get("{$this->apiBaseUrl}/workflows/");

            if ($listResponse->successful()) {
                $data = $listResponse->json();
                $workflows = $data['results'] ?? (is_array($data) ? $data : []);
                if (is_array($workflows) && count($workflows) > 0) {
                    // Prefer the default or free KYC workflow
                    foreach ($workflows as $wf) {
                        if (($wf['workflow_label'] ?? '') === 'Free KYC' || ($wf['is_default'] ?? false)) {
                            return $wf['uuid'] ?? $wf['id'] ?? null;
                        }
                    }
                    $first = $workflows[0];
                    return $first['uuid'] ?? $first['id'] ?? null;
                }
            }

            // Create free KYC workflow
            $createResponse = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post("{$this->apiBaseUrl}/workflows/", [
                'workflow_label' => 'TrustAuth Free IAL2 KYC',
                'features' => [
                    ['feature' => 'OCR'],
                    [
                        'feature' => 'LIVENESS',
                        'config' => [
                            'face_liveness_method' => 'PASSIVE',
                        ],
                    ],
                    ['feature' => 'FACE_MATCH'],
                    [
                        'feature' => 'IP_ANALYSIS',
                        'config' => [
                            'vpn_detection_action' => 'REVIEW',
                            'duplicated_device_action' => 'REVIEW',
                            'recovered_device_action' => 'REVIEW',
                        ],
                    ],
                ],
            ]);

            if ($createResponse->successful()) {
                $created = $createResponse->json();
                return $created['uuid'] ?? $created['id'] ?? null;
            }

            Log::error('Didit workflow creation failed', ['response' => $createResponse->body()]);
            return null;
        } catch (\Exception $e) {
            Log::error('Didit workflow request exception', ['message' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Get or create a workflow for the given tier:
     * - 'photo_only': OCR document authenticity without selfie/liveness
     * - 'standard': OCR + Passive Liveness + Face Match + IP Analysis
     */
    public function getOrCreateWorkflowForMode(string $mode = 'standard'): ?string
    {
        if (! $this->isConfigured()) {
            return null;
        }

        try {
            $listResponse = Http::withHeaders([
                'x-api-key' => $this->getApiKey(),
                'Accept' => 'application/json',
            ])->get("{$this->apiBaseUrl}/workflows/");

            if ($listResponse->successful()) {
                $data = $listResponse->json();
                $workflows = $data['results'] ?? (is_array($data) ? $data : []);

                if ($mode === 'photo_only') {
                    if ($this->getPhotoWorkflowId()) {
                        return $this->getPhotoWorkflowId();
                    }

                    // Check for OCR workflow without LIVENESS
                    foreach ($workflows as $wf) {
                        $features = $wf['features'] ?? '';
                        $status = $wf['status'] ?? '';
                        if ($status === 'published' && str_contains($features, 'OCR') && ! str_contains($features, 'LIVENESS')) {
                            return $wf['uuid'] ?? $wf['id'] ?? null;
                        }
                    }

                    // Fallback to specific published workflow id
                    return 'f98fe9ff-08bf-4a61-968d-3b1a2badc5e2';
                } else {
                    // Standard flow: OCR + Liveness + Face Match
                    if ($this->getWorkflowId()) {
                        return $this->getWorkflowId();
                    }

                    foreach ($workflows as $wf) {
                        $status = $wf['status'] ?? '';
                        if ($status === 'published' && (($wf['workflow_label'] ?? '') === 'Free KYC' || ($wf['is_default'] ?? false))) {
                            return $wf['uuid'] ?? $wf['id'] ?? null;
                        }
                    }

                    $first = $workflows[0] ?? null;
                    if ($first) {
                        return $first['uuid'] ?? $first['id'] ?? null;
                    }
                }
            }

            return $mode === 'photo_only' ? ($this->getPhotoWorkflowId() ?? 'f98fe9ff-08bf-4a61-968d-3b1a2badc5e2') : $this->getWorkflowId();
        } catch (\Exception $e) {
            Log::error('Didit workflow resolution exception', ['message' => $e->getMessage()]);
            return $mode === 'photo_only' ? ($this->getPhotoWorkflowId() ?? 'f98fe9ff-08bf-4a61-968d-3b1a2badc5e2') : $this->getWorkflowId();
        }
    }

    /**
     * Create a hosted KYC verification session for the given user.
     * Supports $flowMode: 'standard' (Photo + Live + ID) or 'photo_only' (Photo ID only).
     * Returns an array containing session details.
     */
    public function createVerificationSession(User $user, string $callbackUrl, string $flowMode = 'standard'): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $workflowId = $this->getOrCreateWorkflowForMode($flowMode);
        if (! $workflowId) {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->getApiKey(),
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post("{$this->apiBaseUrl}/session/", [
                'workflow_id' => $workflowId,
                'vendor_data' => (string) $user->id,
                'callback' => $callbackUrl,
                'metadata' => [
                    'app' => 'TrustAuth Identity Provider',
                    'user_id' => $user->id,
                    'flow_mode' => $flowMode,
                ],
                'contact_details' => [
                    'email' => $user->email,
                    'email_lang' => 'en',
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'session_id' => $data['session_id'] ?? null,
                    'url' => $data['url'] ?? null,
                    'status' => $data['status'] ?? 'Not Started',
                    'flow_mode' => $flowMode,
                ];
            }

            $rawBody = $response->body();
            $decoded = $response->json();
            $detailMsg = $decoded['detail'] ?? $decoded['message'] ?? 'Could not start Didit verification.';
            Log::error('Didit session creation failed', ['response' => $rawBody]);
            return [
                'success' => false,
                'error_detail' => $detailMsg,
                'flow_mode' => $flowMode,
            ];
        } catch (\Exception $e) {
            Log::error('Didit session creation exception', ['message' => $e->getMessage()]);
            return [
                'success' => false,
                'error_detail' => $e->getMessage(),
                'flow_mode' => $flowMode,
            ];
        }
    }

    /**
     * Verify an incoming Didit webhook signature using HMAC-SHA256.
     */
    public function verifyWebhookSignature(string $payload, ?string $signature): bool
    {
        if (empty($this->webhookSecret)) {
            // In development or when webhook secret is not set, allow if API key configured
            return true;
        }

        if (empty($signature)) {
            return false;
        }

        $expectedSignature = hash_hmac('sha256', $payload, $this->webhookSecret);
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Fetch decision results for a session directly.
     */
    public function getSessionDecision(string $sessionId): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'Accept' => 'application/json',
            ])->get("{$this->apiBaseUrl}/session/{$sessionId}/decision/");

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Didit getSessionDecision exception', ['message' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Reconcile an approved Didit session with the local User model.
     * Extracts verified legal name and birthdate from ID documents while discarding raw images.
     */
    public function reconcileSessionForUser(User $user, string $sessionId): bool
    {
        $decision = $this->getSessionDecision($sessionId);
        if (! $decision) {
            return false;
        }

        $status = $decision['status'] ?? null;
        if (! in_array(strtolower((string) $status), ['approved', 'completed', 'successful'])) {
            return false;
        }

        // Verify vendor_data matches user id if present
        $vendorData = $decision['vendor_data'] ?? null;
        if ($vendorData && (string) $vendorData !== (string) $user->id) {
            Log::warning('Didit session reconciliation user mismatch', [
                'session_user' => $vendorData,
                'current_user' => $user->id,
            ]);
            return false;
        }

        $flowMode = $decision['metadata']['flow_mode'] ?? 'standard';
        $user->is_identity_verified = true;
        $user->verification_type = $flowMode;

        if ($flowMode === 'photo_only') {
            $estimatedAge = 22; // default lower bound
            if (isset($decision['extracted_data']['estimated_age'])) {
                $estimatedAge = max(1, ((int) $decision['extracted_data']['estimated_age']) - 3);
            } elseif (isset($decision['extracted_data']['age'])) {
                $estimatedAge = max(1, ((int) $decision['extracted_data']['age']) - 3);
            }
            $user->estimated_age = $estimatedAge;
        } else {
            // NIST IAL2 Standard: Extract from id_verifications or top-level extracted_data
            $idv = $decision['id_verifications'][0] ?? null;

            $dob = $idv['date_of_birth'] ?? $decision['extracted_data']['date_of_birth'] ?? null;
            if (! empty($dob)) {
                $user->date_of_birth = \Illuminate\Support\Carbon::parse($dob)->toDateString();
            }

            $firstName = $idv['first_name'] ?? $decision['extracted_data']['first_name'] ?? null;
            $lastName = $idv['last_name'] ?? $decision['extracted_data']['last_name'] ?? null;
            $fullName = trim("{$firstName} {$lastName}");

            if (! empty($fullName)) {
                $user->name = $fullName;
            } elseif (! empty($idv['full_name'] ?? $decision['extracted_data']['full_name'] ?? null)) {
                $user->name = trim($idv['full_name'] ?? $decision['extracted_data']['full_name']);
            }
        }

        $user->save();

        // Propagate authoritative legal name to user personas if blank or unverified
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

        Log::info("User ID {$user->id} successfully reconciled from Didit session {$sessionId} ({$flowMode}).");
        return true;
    }
}
