<?php

namespace Tests\Feature;

use App\Jobs\SendGdprErasureWebhook;
use App\Models\Passport\Token;
use App\Models\Persona;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Passport\Client;
use Tests\TestCase;

/**
 * Class HmacWebhookSecurityTest
 *
 * Feature tests verifying:
 * 1. Cryptographic HMAC-SHA256 digital signatures on outbound GDPR Article 17 webhooks.
 * 2. Replay attack defense headers (X-Timestamp, X-Nonce).
 * 3. Client pre-shared secret resolution.
 * 4. Governance token revocation and audit logging across persona subject IDs.
 */
class HmacWebhookSecurityTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that outbound GDPR webhooks include valid HMAC-SHA256 signatures and replay headers.
     */
    public function test_gdpr_webhook_has_valid_signature(): void
    {
        $secretKey = 'test-relying-party-secret-9876';
        config(['services.gdpr.webhook_secret' => $secretKey]);

        // Create a Passport client with specific secret
        $client = Client::factory()->create([
            'id' => (string) Str::uuid(),
            'name' => 'Secure Relying Party',
            'secret' => $secretKey,
            'redirect_uris' => ['https://client.example.com/callback'],
            'grant_types' => ['authorization_code'],
            'revoked' => false,
        ]);

        $user = User::factory()->create();
        $erasureId = (string) Str::uuid();

        DB::table('client_erasures')->insert([
            'id' => $erasureId,
            'user_id' => $user->id,
            'client_id' => $client->id,
            'client_name' => $client->name,
            'status' => 'pending',
            'attempts' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $webhookUrl = config('services.gdpr.webhook_url') ?: 'http://localhost:3000/gdpr/erase';
        Http::fake([
            $webhookUrl => Http::response(['success' => true], 200),
            '*' => Http::response(['success' => true], 200),
        ]);

        // Dispatch webhook job
        SendGdprErasureWebhook::dispatchSync($erasureId);

        // Verify request payload, cryptographic headers, and HMAC authenticity
        Http::assertSent(function ($request) use ($user, $client, $erasureId, $secretKey) {
            $hasSignature = $request->hasHeader('X-Signature-SHA256');
            $hasTimestamp = $request->hasHeader('X-Timestamp');
            $hasNonce = $request->hasHeader('X-Nonce');

            if (! $hasSignature || ! $hasTimestamp || ! $hasNonce) {
                return false;
            }

            $rawBody = $request->body();
            $signatureHeader = $request->header('X-Signature-SHA256')[0];
            $expectedSignature = hash_hmac('sha256', $rawBody, $secretKey);

            $payload = json_decode($rawBody, true);

            return hash_equals($expectedSignature, $signatureHeader)
                && $payload['event'] === 'identity.erasure_request'
                && $payload['erasure_id'] === $erasureId
                && $payload['user_id'] === $user->id
                && $payload['client_id'] === $client->id;
        });

        // Verify database log reflects successful completion
        $record = DB::table('client_erasures')->where('id', $erasureId)->first();
        $this->assertEquals('completed', $record->status);
        $this->assertEquals(200, $record->response_code);
        $this->assertEquals(1, $record->attempts);
    }

    /**
     * Test that GovernanceController revokes tokens issued under persona IDs (preventing dangling authorizations).
     */
    public function test_governance_revokes_tokens_by_persona(): void
    {
        $user = User::factory()->create();
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Pseudonymous Dev',
        ]);

        $clientId = (string) Str::uuid();
        Client::factory()->create([
            'id' => $clientId,
            'name' => 'Demo App',
            'secret' => 'secret123',
            'redirect_uris' => ['http://localhost/callback'],
            'grant_types' => ['authorization_code'],
            'revoked' => false,
        ]);

        // In TrustAuth, OAuth tokens store persona->id as user_id to enforce subject isolation
        $tokenId = Str::random(40);
        DB::table('oauth_access_tokens')->insert([
            'id' => $tokenId,
            'user_id' => $persona->id, // Persona ID subject
            'client_id' => $clientId,
            'name' => 'Persona Token',
            'scopes' => '["profile","email"]',
            'revoked' => false,
            'created_at' => now(),
            'updated_at' => now(),
            'expires_at' => now()->addDays(1),
        ]);

        $this->actingAs($user);

        Http::fake();

        // Call revokeAndErase
        $response = $this->postJson('/governance/revoke', [
            'client_id' => $clientId,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        // Verify the token issued under persona.id was marked revoked
        $revokedToken = DB::table('oauth_access_tokens')->where('id', $tokenId)->first();
        $this->assertTrue((bool) $revokedToken->revoked);

        // Verify client_erasures record created
        $this->assertDatabaseHas('client_erasures', [
            'user_id' => $user->id,
            'client_id' => $clientId,
        ]);
    }
}
