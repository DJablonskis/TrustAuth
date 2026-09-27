<?php

namespace App\Http\Controllers;

use App\Jobs\SendGdprErasureWebhook;
use App\Models\Passport\Token;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Passport\Client;

/**
 * Admin portal to monitor registered client apps, token distribution,
 * and outbound GDPR erasure webhooks.
 */
class AdminGovernanceController extends Controller
{
    /**
     * Display the Admin Governance & Partner Telemetry Dashboard.
     *
     * @return Response|JsonResponse
     */
    public function index(Request $request)
    {
        // 1. Fetch all registered OAuth clients (partners/consumers)
        $clients = Client::all();

        // 2. Fetch all access tokens with associated scopes
        $tokens = Token::all();

        // 3. Compute telemetry metrics per partner client
        $partnerTelemetry = $clients->map(function ($client) use ($tokens) {
            $clientTokens = $tokens->where('client_id', $client->id);
            $activeTokens = $clientTokens->where('revoked', false)->filter(function ($t) {
                return ! $t->expires_at || $t->expires_at->isFuture();
            });
            $revokedTokens = $clientTokens->where('revoked', true);
            $expiredTokens = $clientTokens->where('revoked', false)->filter(function ($t) {
                return $t->expires_at && $t->expires_at->isPast();
            });

            // Extract unique granted scopes across this partner's active tokens
            $uniqueScopes = $clientTokens->flatMap(function ($token) {
                return is_array($token->scopes) ? $token->scopes : json_decode($token->scopes ?? '[]', true);
            })->filter()->unique()->values()->toArray();

            // Total erasure webhook attempts for this client
            $erasures = DB::table('client_erasures')->where('client_id', $client->id)->get();
            $failedErasures = $erasures->where('status', 'failed')->count();
            $completedErasures = $erasures->where('status', 'completed')->count();
            $pendingErasures = $erasures->where('status', 'pending')->count();

            // Abuse score heuristic: high failed erasure ratio or abnormal failure rate
            $isAbusingWebhooks = ($erasures->count() > 0 && ($failedErasures / max($erasures->count(), 1)) > 0.3)
                || $erasures->contains(fn ($e) => $e->attempts >= 3 && $e->status !== 'completed');

            return [
                'id' => $client->id,
                'name' => $client->name,
                'redirect' => is_array($client->redirect_uris) ? implode(', ', $client->redirect_uris) : (string) $client->redirect_uris,
                'personal_access_client' => (bool) $client->personal_access_client,
                'password_client' => (bool) $client->password_client,
                'revoked' => (bool) $client->revoked,
                'created_at' => $client->created_at ? $client->created_at->toIso8601String() : null,
                'tokens' => [
                    'total' => $clientTokens->count(),
                    'active' => $activeTokens->count(),
                    'revoked' => $revokedTokens->count(),
                    'expired' => $expiredTokens->count(),
                ],
                'scopes' => $uniqueScopes,
                'erasures' => [
                    'total' => $erasures->count(),
                    'completed' => $completedErasures,
                    'failed' => $failedErasures,
                    'pending' => $pendingErasures,
                ],
                'is_abusing_webhooks' => $isAbusingWebhooks,
            ];
        });

        // 4. Retrieve all system-wide GDPR erasure records
        $allErasureLogs = DB::table('client_erasures')
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        // 5. Global platform summary KPI metrics
        $globalStats = [
            'total_partners' => $clients->count(),
            'active_partners' => $clients->where('revoked', false)->count(),
            'suspended_partners' => $clients->where('revoked', true)->count(),
            'total_tokens_minted' => $tokens->count(),
            'active_tokens' => $tokens->where('revoked', false)->filter(fn ($t) => ! $t->expires_at || $t->expires_at->isFuture())->count(),
            'total_erasures' => $allErasureLogs->count(),
            'failed_erasures' => $allErasureLogs->where('status', 'failed')->count(),
            'completed_erasures' => $allErasureLogs->where('status', 'completed')->count(),
            'webhook_success_rate' => $allErasureLogs->count() > 0
                ? round(($allErasureLogs->where('status', 'completed')->count() / $allErasureLogs->count()) * 100, 1)
                : 100.0,
        ];

        // 6. Registered users list for sovereign IAL oversight
        $users = \App\Models\User::withCount('personas')->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'is_identity_verified' => (bool) $u->is_identity_verified,
                'verification_type' => $u->verification_type,
                'estimated_age' => $u->estimated_age,
                'date_of_birth' => $u->date_of_birth ? $u->date_of_birth->format('Y-m-d') : null,
                'personas_count' => $u->personas_count,
                'created_at' => $u->created_at ? $u->created_at->toIso8601String() : null,
            ];
        });

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'data' => [
                    'global_stats' => $globalStats,
                    'partners' => $partnerTelemetry,
                    'erasure_logs' => $allErasureLogs,
                    'users' => $users,
                ],
            ]);
        }

        return Inertia::render('admin/governance', [
            'globalStats' => $globalStats,
            'partners' => $partnerTelemetry,
            'erasureLogs' => $allErasureLogs,
            'users' => $users,
        ]);
    }

    /**
     * Toggle partner client suspension state (Revoke/Activate).
     *
     * @return RedirectResponse|JsonResponse
     */
    public function toggleClientStatus(Request $request, string $clientId)
    {
        $client = Client::findOrFail($clientId);

        // Toggle revoked state
        $client->revoked = ! $client->revoked;
        $client->save();

        // If client is being suspended, cascade revoke all active access tokens
        if ($client->revoked) {
            Token::where('client_id', $client->id)
                ->where('revoked', false)
                ->update(['revoked' => true]);
        }

        $statusStr = $client->revoked ? 'suspended' : 'activated';

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => "Partner client {$client->name} was {$statusStr}.",
                'data' => $client,
            ]);
        }

        return redirect()->back();
    }

    /**
     * Manually override a user's IAL assurance level (Admin intervention).
     *
     * @return RedirectResponse|JsonResponse
     */
    public function toggleUserIal(Request $request, int $userId)
    {
        $user = \App\Models\User::findOrFail($userId);
        $user->is_identity_verified = ! $user->is_identity_verified;
        $user->save();

        $level = $user->is_identity_verified ? 'IAL2 (High Assurance)' : 'IAL1 (Standard)';

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => "User {$user->name} assurance status updated to {$level}.",
                'data' => [
                    'user_id' => $user->id,
                    'is_identity_verified' => (bool) $user->is_identity_verified,
                ],
            ]);
        }

        return redirect()->back();
    }

    /**
     * Manually re-dispatch a failed GDPR erasure webhook.
     *
     * @return RedirectResponse|JsonResponse
     */
    public function retryErasureWebhook(Request $request, string $erasureId)
    {
        $erasure = DB::table('client_erasures')->where('id', $erasureId)->first();

        if (! $erasure) {
            abort(404, 'Erasure record not found.');
        }

        // Reset status to pending and re-dispatch job
        DB::table('client_erasures')->where('id', $erasureId)->update([
            'status' => 'pending',
            'updated_at' => now(),
        ]);

        SendGdprErasureWebhook::dispatch($erasureId);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => "Erasure webhook {$erasureId} re-dispatched to worker queue.",
            ]);
        }

        return redirect()->back();
    }
}
