<?php

namespace Tests\Feature;

use App\Jobs\SendGdprErasureWebhook;
use App\Models\Passport\AuthCode;
use App\Models\Passport\Token;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Laravel\Passport\Client;
use Tests\TestCase;

/**
 * Class GovernanceTest
 *
 * Feature tests to verify connected client management and GDPR erasure flows,
 * asserting that:
 * 1. The governance page lists connected Passport clients and client erasure logs.
 * 2. Revoking access invalidates Passport user tokens and auth codes, inserts a pending log entry, and dispatches the GDPR webhook job.
 */
class GovernanceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that index returns connected clients with active tokens and erasure logs.
     */
    public function test_index_returns_clients_and_erasure_logs(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create client
        $client = Client::factory()->create([
            'id' => 'test-client-id-1',
            'name' => 'Test App 1',
        ]);

        // Create active token for user & client
        Token::create([
            'id' => 'token-1',
            'user_id' => $user->id,
            'client_id' => $client->id,
            'scopes' => '[]',
            'revoked' => false,
            'expires_at' => now()->addDays(1),
        ]);

        // Create a revoked token (should not show up as active connection)
        Token::create([
            'id' => 'token-2',
            'user_id' => $user->id,
            'client_id' => $client->id,
            'scopes' => '[]',
            'revoked' => true,
            'expires_at' => now()->addDays(1),
        ]);

        // Insert client erasure logs
        DB::table('client_erasures')->insert([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'client_id' => $client->id,
            'client_name' => $client->name,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->get('/governance');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('governance')
            ->has('connectedClients')
            ->has('erasureLogs')
        );
    }

    /**
     * Test that revokeAndErase successfully invalidates Passport user tokens/auth codes
     * and dispatches the background GDPR erasure webhook job.
     */
    public function test_revoke_invalidates_tokens_and_dispatches_job(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $this->actingAs($user);

        $client = Client::factory()->create([
            'id' => 'test-client-id-2',
            'name' => 'Test App 2',
        ]);

        // Create active token
        $token = Token::create([
            'id' => 'token-3',
            'user_id' => $user->id,
            'client_id' => $client->id,
            'scopes' => '[]',
            'revoked' => false,
            'expires_at' => now()->addDays(1),
        ]);

        // Create active auth code
        $authCode = AuthCode::create([
            'id' => 'code-1',
            'user_id' => $user->id,
            'client_id' => $client->id,
            'scopes' => '[]',
            'revoked' => false,
            'expires_at' => now()->addDays(1),
        ]);

        $response = $this->post('/governance/revoke', [
            'client_id' => $client->id,
        ]);

        $response->assertRedirect();

        // Assert tokens and auth codes are revoked
        $this->assertTrue((bool) $token->fresh()->revoked);
        $this->assertTrue((bool) $authCode->fresh()->revoked);

        // Assert database record exists in client_erasures
        $this->assertDatabaseHas('client_erasures', [
            'user_id' => $user->id,
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        // Assert GDPR job was dispatched
        Queue::assertPushed(SendGdprErasureWebhook::class);
    }
}
