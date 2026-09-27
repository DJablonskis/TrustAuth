<?php

namespace Tests\Feature;

use App\Jobs\SendGdprErasureWebhook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Class VerificationAndWebhookTest
 *
 * Feature tests to verify that:
 * 1. The identity verification toggle functions and persists properly in the database.
 * 2. The SendGdprErasureWebhook job correctly dispatches HTTP POST requests and records results.
 */
class VerificationAndWebhookTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the identity verification route toggles the is_identity_verified property
     * on the authenticated user and persists this state.
     */
    public function test_identity_verification_toggle_functions_and_persists(): void
    {
        // 1. Create a user and authenticate.
        $user = User::factory()->create([
            'is_identity_verified' => false,
        ]);

        $this->actingAs($user);

        // 2. Call the toggle endpoint to switch to verified.
        $response = $this->post('/verification/simulate-ial2');

        $response->assertRedirect();
        $this->assertTrue($user->fresh()->is_identity_verified);

        // 3. Call the toggle endpoint again to switch back to unverified.
        $response = $this->post('/verification/simulate-ial2');

        $response->assertRedirect();
        $this->assertFalse($user->fresh()->is_identity_verified);
    }

    /**
     * Test that SendGdprErasureWebhook dispatches the POST request and updates the client_erasures table on success.
     */
    public function test_gdpr_webhook_updates_status_on_success(): void
    {
        Http::fake([
            'https://client.example.com/gdpr/erase' => Http::response([], 200),
        ]);

        $user = User::factory()->create();
        $erasureId = (string) Str::uuid();

        DB::table('client_erasures')->insert([
            'id' => $erasureId,
            'user_id' => $user->id,
            'client_id' => 'test-client-123',
            'client_name' => 'Test Client',
            'status' => 'pending',
            'attempts' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Dispatch job synchronously
        SendGdprErasureWebhook::dispatchSync($erasureId);

        // Assert HTTP POST request was made
        Http::assertSent(function ($request) use ($user) {
            return $request->url() === 'https://client.example.com/gdpr/erase'
                && $request->method() === 'POST'
                && $request['user_id'] === $user->id;
        });

        // Assert database record has been updated
        $erasure = DB::table('client_erasures')->where('id', $erasureId)->first();
        $this->assertEquals(1, $erasure->attempts);
        $this->assertEquals('completed', $erasure->status);
        $this->assertEquals(200, $erasure->response_code);
        $this->assertNotNull($erasure->last_attempt_at);
    }

    /**
     * Test that SendGdprErasureWebhook records response code and failure status on HTTP errors.
     */
    public function test_gdpr_webhook_logs_failure(): void
    {
        Http::fake([
            'https://client.example.com/gdpr/erase' => Http::response(['error' => 'Internal Server Error'], 500),
        ]);

        $user = User::factory()->create();
        $erasureId = (string) Str::uuid();

        DB::table('client_erasures')->insert([
            'id' => $erasureId,
            'user_id' => $user->id,
            'client_id' => 'test-client-123',
            'client_name' => 'Test Client',
            'status' => 'pending',
            'attempts' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Dispatch job synchronously
        try {
            SendGdprErasureWebhook::dispatchSync($erasureId);
        } catch (\Exception $e) {
            // Expected connection failure in test environment
        }

        // Assert database record has been updated to reflect the failure and response code
        $erasure = DB::table('client_erasures')->where('id', $erasureId)->first();
        $this->assertEquals(1, $erasure->attempts);
        $this->assertEquals('failed', $erasure->status);
        $this->assertEquals(500, $erasure->response_code);
    }
}
