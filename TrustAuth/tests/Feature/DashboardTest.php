<?php

namespace Tests\Feature;

use App\Models\Persona;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Class DashboardTest
 *
 * Feature tests to verify the Dashboard web route capabilities:
 * 1. GET 'dashboard' is protected by auth.
 * 2. GET 'dashboard' returns the list of user personas and their identity verification state.
 * 3. The page renders components and lists correctly using Inertia page assertions.
 */
class DashboardTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that guest users are redirected to login when trying to access the dashboard.
     */
    public function test_guest_is_redirected_from_dashboard(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    /**
     * Test that GET 'dashboard' returns the personas and the user's is_identity_verified state.
     */
    public function test_user_can_access_dashboard(): void
    {
        $user = User::factory()->create([
            'is_identity_verified' => true,
        ]);

        Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Work Profile',
            'given_name' => 'Jane',
            'family_name' => 'Doe',
            'is_age_verified' => true,
        ]);

        Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Gaming Profile',
            'username' => 'GhostHunter',
            'is_age_verified' => false,
        ]);

        $this->actingAs($user);

        $response = $this->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('personas', 2)
            ->where('isIdentityVerified', true)
            ->where('personas.0.persona_name', 'Work Profile')
            ->where('personas.1.persona_name', 'Gaming Profile')
        );
    }
}
