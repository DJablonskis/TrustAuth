<?php

namespace Tests\Feature;

use App\Models\Persona;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\Passport;
use Tests\TestCase;

class PersonaTest extends TestCase
{
    // Refresh the in-memory SQLite database before each test run
    use RefreshDatabase;

    /**
     * Test retrieving a list of personas for an authenticated user.
     */
    public function test_user_can_list_their_personas(): void
    {
        // Set up a user and seed 2 personas
        $user = User::factory()->create();
        Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Work Persona',
            'given_name' => 'Jane',
            'family_name' => 'Doe',
        ]);
        Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Gaming Persona',
            'username' => 'GhostHunter',
        ]);

        // Authenticate the user via Passport actingAs helper
        Passport::actingAs($user);

        // Fetch index route
        $response = $this->getJson('/api/v1/personas');

        // Assert JSON structure and quantity matches
        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.persona_name', 'Work Persona')
            ->assertJsonPath('data.1.username', 'GhostHunter');
    }

    /**
     * Test creating a new persona via the API endpoint.
     */
    public function test_user_can_create_a_persona(): void
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Post request with persona properties
        $response = $this->postJson('/api/v1/personas', [
            'persona_name' => 'Social Identity',
            'given_name' => 'Alex',
            'family_name' => 'Smith',
            'email_alias' => 'alex.smith@social.me',
            'gender_identity' => 'They/Them',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.persona_name', 'Social Identity')
            ->assertJsonPath('data.gender_identity', 'They/Them');

        // Confirm DB persistence
        $this->assertDatabaseHas('personas', [
            'user_id' => $user->id,
            'persona_name' => 'Social Identity',
            'given_name' => 'Alex',
        ]);
    }

    /**
     * Test content negotiation formatting for different regional language configurations.
     */
    public function test_name_formatting_changes_based_on_content_negotiation(): void
    {
        $user = User::factory()->create();
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Hungarian Persona',
            'given_name' => 'János', // Given Name
            'family_name' => 'Kovács', // Family Name
        ]);

        Passport::actingAs($user);

        // --- SCENARIO A: English US request locale ---
        // Expected name structure: Given Name first ("János Kovács")
        $responseEn = $this->withHeaders([
            'Accept-Language' => 'en-US,en;q=0.9',
        ])->getJson("/api/v1/personas/{$persona->id}");

        $responseEn->assertStatus(200)
            ->assertJsonPath('data.formatted_name', 'János Kovács');

        // --- SCENARIO B: Hungarian locale ---
        // Expected name structure: Family Name first ("Kovács János")
        $responseHu = $this->withHeaders([
            'Accept-Language' => 'hu-HU,hu;q=0.9',
        ])->getJson("/api/v1/personas/{$persona->id}");

        $responseHu->assertStatus(200)
            ->assertJsonPath('data.formatted_name', 'Kovács János');
    }

    /**
     * Test that user cannot view another user's persona (Broken Object Level Authorization prevention).
     */
    public function test_cannot_access_other_users_personas(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $personaB = Persona::create([
            'user_id' => $userB->id,
            'persona_name' => 'Secret Persona',
            'username' => 'AgentX',
        ]);

        // Authenticate User A
        Passport::actingAs($userA);

        // Request User B's persona resource
        $response = $this->getJson("/api/v1/personas/{$personaB->id}");

        // Assert 403 Forbidden BOLA mitigation
        $response->assertStatus(403);
    }

    /**
     * Test toggling the simulated age verification flag.
     */
    public function test_user_can_toggle_simulated_age_verification(): void
    {
        $user = User::factory()->create([
            'name' => 'Verified Legal Name',
            'is_identity_verified' => true,
        ]);
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Teenager Profile',
            'is_age_verified' => false,
            'legal_name' => null,
        ]);

        Passport::actingAs($user);

        // Trigger verification toggle
        $response = $this->postJson("/api/v1/personas/{$persona->id}/verify-age");

        $response->assertStatus(200)
            ->assertJsonPath('data.is_age_verified', true)
            ->assertJsonPath('data.legal_name', 'Verified Legal Name');

        // Confirm database updates
        $this->assertTrue($persona->fresh()->is_age_verified);
        $this->assertEquals('Verified Legal Name', $persona->fresh()->legal_name);
    }

    /**
     * Test avatar uploads with md5 checksum cache-busting suffixes.
     */
    public function test_avatar_upload_attaches_version_hash(): void
    {
        $user = User::factory()->create();
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Graphic Profile',
        ]);

        Passport::actingAs($user);
        Storage::fake('public');

        // Create a fake image upload file
        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->postJson("/api/v1/personas/{$persona->id}/avatar", [
            'avatar' => $file,
        ]);

        $response->assertStatus(200);

        // Retrieve saved URL path
        $path = $persona->fresh()->avatar_path;

        // Assert the URL ends with a cache-busting version parameter (?v=...)
        $this->assertStringContainsString('?v=', $path);
    }
}
