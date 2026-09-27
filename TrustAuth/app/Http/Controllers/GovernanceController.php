<?php

namespace App\Http\Controllers;

use App\Jobs\SendGdprErasureWebhook;
use App\Models\Passport\AuthCode;
use App\Models\Passport\Token;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Passport\Client;

/**
 * Manages user privacy governance, allowing users to:
 * 1. View connected clients/applications with active authorization tokens.
 * 2. View audit logs of GDPR Article 17 erasure webhook requests.
 * 3. Revoke active authorization tokens/auth codes for a given client ID and trigger a GDPR erasure process.
 */
class GovernanceController extends Controller
{
    /**
     * Display the governance interface.
     *
     * Retrieves all active, non-revoked OAuth access tokens for the authenticated user
     * along with their associated clients, and fetches the history of client erasure requests.
     * Renders the 'governance' Inertia view (or returns JSON for API requests).
     *
     * @return Response|JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $personaIds = $user->personas->pluck('id')->push($user->id)->unique()->toArray();

        // Retrieve connected Passport clients with active user/persona tokens
        $tokens = Token::whereIn('user_id', $personaIds)
            ->where('revoked', false)
            ->with('client')
            ->orderBy('created_at', 'desc')
            ->get();

        // Group tokens by client_id to represent each unique application once with session stats
        $connectedClients = $tokens->groupBy('client_id')->map(function ($clientTokens, $clientId) {
            $first = $clientTokens->first();
            $client = $first->client;

            // Aggregate all scopes granted across active tokens for this client
            $allScopes = $clientTokens->flatMap(function ($token) {
                return is_array($token->scopes) ? $token->scopes : json_decode($token->scopes ?? '[]', true);
            })->filter()->unique()->values()->toArray();

            return [
                'id' => $first->id,
                'client_id' => $clientId,
                'client' => [
                    'id' => $clientId,
                    'name' => $client ? $client->name : 'Unknown Application',
                ],
                'token_count' => $clientTokens->count(),
                'scopes' => $allScopes,
                'last_active_at' => $first->created_at ? $first->created_at->toIso8601String() : null,
            ];
        })->values();

        // Retrieve GDPR erasure log details for this user
        $erasureLogs = DB::table('client_erasures')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'data' => [
                    'connected_clients' => $connectedClients,
                    'erasure_logs' => $erasureLogs,
                ],
            ]);
        }

        return Inertia::render('governance', [
            'connectedClients' => $connectedClients,
            'erasureLogs' => $erasureLogs,
        ]);
    }

    /**
     * Revoke all active tokens/auth codes and initiate GDPR right-to-erasure webhook dispatch.
     *
     * Invalidates all active access tokens and temporary authorization codes issued to
     * the specified client ID for the authenticated user, registers a pending client erasure
     * record in the database, and dispatches the outbound webhook job to run asynchronously.
     *
     * @return RedirectResponse|JsonResponse
     */
    public function revokeAndErase(Request $request)
    {
        $request->validate([
            'client_id' => 'required|string',
        ]);

        $user = $request->user();
        $clientId = $request->input('client_id');
        $personaIds = $user->personas->pluck('id')->push($user->id)->unique()->toArray();

        // 1. Revoke all active user and persona tokens for this client
        Token::whereIn('user_id', $personaIds)
            ->where('client_id', $clientId)
            ->where('revoked', false)
            ->update(['revoked' => true]);

        // 2. Revoke all active authorization codes for this client
        AuthCode::whereIn('user_id', $personaIds)
            ->where('client_id', $clientId)
            ->where('revoked', false)
            ->update(['revoked' => true]);

        // 3. Resolve client name for audit logging
        $client = Client::find($clientId);
        $clientName = $client ? $client->name : 'Unknown Client';

        // 4. Insert client erasure log record
        $erasureId = (string) Str::uuid();
        DB::table('client_erasures')->insert([
            'id' => $erasureId,
            'user_id' => $user->id,
            'client_id' => $clientId,
            'client_name' => $clientName,
            'status' => 'pending',
            'attempts' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 5. Dispatch SendGdprErasureWebhook job to execute in the background
        SendGdprErasureWebhook::dispatch($erasureId);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => "Successfully revoked access for client ID {$clientId} and dispatched GDPR erasure webhook.",
                'data' => [
                    'erasure_id' => $erasureId,
                    'status' => 'pending',
                ],
            ]);
        }

        return redirect()->back();
    }
}
