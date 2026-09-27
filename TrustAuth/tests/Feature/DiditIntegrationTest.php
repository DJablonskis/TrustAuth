<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\DiditVerificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DiditIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_provider_status_returns_simulator_when_unconfigured(): void
    {
        config(['services.didit.api_key' => '']);
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson(route('verification.provider-status'));

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'is_live_provider' => false,
                'provider_name' => 'TrustAuth Local KYC Simulator',
            ]);
    }

    public function test_provider_status_returns_live_didit_when_configured(): void
    {
        config(['services.didit.api_key' => 'valid-api-key']);
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson(route('verification.provider-status'));

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'is_live_provider' => true,
                'provider_name' => 'Didit Identity Verification (Live)',
            ]);
    }

    public function test_initiate_verification_returns_simulation_mode_when_unconfigured(): void
    {
        config(['services.didit.api_key' => '']);
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('verification.initiate'));

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'mode' => 'simulation',
            ]);
    }

    public function test_webhook_elevates_user_to_ial2(): void
    {
        $user = User::factory()->create([
            'is_identity_verified' => false,
            'date_of_birth' => null,
        ]);

        $payload = [
            'event' => 'status.updated',
            'webhook_type' => 'status.updated',
            'vendor_data' => (string) $user->id,
            'status' => 'Approved',
            'extracted_data' => [
                'date_of_birth' => '1998-05-14',
            ],
        ];

        $response = $this->postJson(route('webhooks.didit'), $payload);

        $response->assertOk()
            ->assertJson(['received' => true]);

        $user->refresh();
        $this->assertTrue($user->is_identity_verified);
        $this->assertEquals('1998-05-14', $user->date_of_birth ? $user->date_of_birth->format('Y-m-d') : null);
    }

    public function test_webhook_calculates_conservative_age(): void
    {
        $user = User::factory()->create([
            'is_identity_verified' => false,
            'date_of_birth' => '2000-01-01', // User-provided DOB that MUST NOT be trusted in photo_only
            'estimated_age' => null,
            'verification_type' => null,
        ]);

        $payload = [
            'event' => 'status.updated',
            'webhook_type' => 'status.updated',
            'vendor_data' => (string) $user->id,
            'status' => 'Approved',
            'metadata' => [
                'flow_mode' => 'photo_only',
            ],
            'extracted_data' => [
                'estimated_age' => 24, // Estimate with +-3 years variance
            ],
        ];

        $response = $this->postJson(route('webhooks.didit'), $payload);

        $response->assertOk()
            ->assertJson(['received' => true]);

        $user->refresh();
        $this->assertTrue($user->is_identity_verified);
        $this->assertEquals('photo_only', $user->verification_type);
        // Smallest age = 24 - 3 = 21
        $this->assertEquals(21, $user->estimated_age);
        // Age method returns the conservative estimated age (21), NOT the calculated age from date_of_birth (26)
        $this->assertEquals(21, $user->age());
        // User meets 21+ gate, but fails 22+ gate
        $this->assertTrue($user->isOverAge(21));
        $this->assertFalse($user->isOverAge(22));
    }

    public function test_webhook_confirms_legal_name_and_dob(): void
    {
        $user = User::factory()->create([
            'name' => 'Initial User Name',
            'is_identity_verified' => false,
            'date_of_birth' => null,
        ]);

        $payload = [
            'event' => 'status.updated',
            'webhook_type' => 'status.updated',
            'vendor_data' => (string) $user->id,
            'status' => 'Approved',
            'metadata' => [
                'flow_mode' => 'standard',
            ],
            'extracted_data' => [
                'first_name' => 'Alexander',
                'last_name' => 'Hamilton',
                'date_of_birth' => '1995-01-11',
            ],
        ];

        $response = $this->postJson(route('webhooks.didit'), $payload);

        $response->assertOk()
            ->assertJson(['received' => true]);

        $user->refresh();
        $this->assertTrue($user->is_identity_verified);
        $this->assertEquals('standard', $user->verification_type);
        $this->assertEquals('Alexander Hamilton', $user->name);
        $this->assertEquals('1995-01-11', $user->date_of_birth ? $user->date_of_birth->format('Y-m-d') : null);
        $this->assertTrue($user->isOverAge(21));
    }
}
