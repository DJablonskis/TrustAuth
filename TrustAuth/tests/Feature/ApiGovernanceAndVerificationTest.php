<?php

namespace Tests\Feature;

use App\Models\Passport\AuthCode;
use App\Models\Passport\Token;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Laravel\Passport\Client;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class ApiGovernanceAndVerificationTest
 *
 * Verifies that privacy governance and identity verification features
 * are fully accessible via bearer-authenticated JSON API requests.
 */
class ApiGovernanceAndVerificationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that user IAL2 identity verification status can be toggled via API.
     */
    public function test_identity_verification_can_be_toggled(): void
    {
        $user = User::factory()->create(['is_identity_verified' => false]);
        Passport::actingAs($user);

        // 1. Send API toggle request
        $response = $this->postJson('/api/v1/user/verify-identity');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_identity_verified' => true,
                ],
            ]);

        $this->assertTrue((bool) $user->fresh()->is_identity_verified);

        // 2. Toggle again to verify reversal
        $response2 = $this->postJson('/api/v1/user/verify-identity');

        $response2->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_identity_verified' => false,
                ],
            ]);

        $this->assertFalse((bool) $user->fresh()->is_identity_verified);
    }

    /**
     * Test that active integrations and GDPR erasure logs can be listed via API.
     */
    public function test_clients_and_erasure_logs_can_be_listed(): void
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Create a fake Passport client
        $client = Client::factory()->create([
            'id' => 'test-client-id-1',
            'name' => 'Test Partner App',
        ]);

        // Create active token
        Token::create([
            'id' => 'token-1',
            'user_id' => $user->id,
            'client_id' => $client->id,
            'scopes' => '[]',
            'revoked' => false,
            'expires_at' => now()->addDays(1),
        ]);

        // Create a GDPR erasure entry
        DB::table('client_erasures')->insert([
            'id' => '11111111-1111-1111-1111-111111111111',
            'user_id' => $user->id,
            'client_id' => $client->id,
            'client_name' => $client->name,
            'status' => 'completed',
            'attempts' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->getJson('/api/v1/governance');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'connected_clients',
                    'erasure_logs',
                ],
            ]);

        $this->assertCount(1, $response->json('data.connected_clients'));
        $this->assertCount(1, $response->json('data.erasure_logs'));
    }

    /**
     * Test that integration access can be revoked and GDPR webhook job dispatched via API.
     */
    public function test_client_access_can_be_revoked(): void
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Fake external webhook endpoint
        Http::fake([
            'https://client.example.com/gdpr/erase' => Http::response(['success' => true], 200),
        ]);

        // Create a fake Passport client
        $client = Client::factory()->create([
            'id' => 'test-client-id-2',
            'name' => 'Audit Partner App',
        ]);

        // Create active token and auth code
        $token = Token::create([
            'id' => 'token-2',
            'user_id' => $user->id,
            'client_id' => $client->id,
            'scopes' => '[]',
            'revoked' => false,
            'expires_at' => now()->addDays(1),
        ]);

        $authCode = AuthCode::create([
            'id' => 'authcode-2',
            'user_id' => $user->id,
            'client_id' => $client->id,
            'scopes' => '[]',
            'revoked' => false,
            'expires_at' => now()->addDays(1),
        ]);

        // Send API revocation request
        $response = $this->postJson('/api/v1/governance/revoke', [
            'client_id' => $client->id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => "Successfully revoked access for client ID {$client->id} and dispatched GDPR erasure webhook.",
            ]);

        // Verify tokens are revoked in the database
        $this->assertTrue((bool) $token->fresh()->revoked);
        $this->assertTrue((bool) $authCode->fresh()->revoked);

        // Verify pending log entry in client_erasures table
        $this->assertDatabaseHas('client_erasures', [
            'user_id' => $user->id,
            'client_id' => $client->id,
            'status' => 'completed',
        ]);
    }
}
