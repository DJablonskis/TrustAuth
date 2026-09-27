<?php

namespace Tests\Feature;

use App\Models\Persona;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class ScopeAndClaimNegotiationTest
 *
 * Validates OpenID Connect Core 1.0 scope filtering and data minimization (GDPR Art. 5(1)(c)),
 * testing selective disclosure across:
 * 1. Standard OIDC Scopes (profile, email)
 * 2. Privacy-preserving Age Assurance (age_verified, age_over_18)
 * 3. Grammatical Pronouns (pronouns)
 * 4. KYC Legal Identity (legal_name)
 * 5. Zero-PII Pairwise Pseudonyms (pseudonym)
 */
class ScopeAndClaimNegotiationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that /api/v1/userinfo strictly filters attributes based on granted scopes (Data Minimization).
     */
    public function test_userinfo_respects_scope_filtering(): void
    {
        $user = User::factory()->create(['is_identity_verified' => true]);
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Tech Specialist',
            'username' => 'tech_guru_99',
            'email_alias' => 'tech.guru@trustauth.dev',
            'given_name' => 'John',
            'family_name' => 'Smith',
            'is_age_verified' => true,
        ]);

        // 1. Token with ONLY 'email' scope
        Passport::actingAs($user, ['email']);

        $responseEmail = $this->getJson('/api/v1/userinfo');
        $responseEmail->assertStatus(200)
            ->assertJsonPath('sub', (string) $persona->id)
            ->assertJsonPath('email', 'tech.guru@trustauth.dev')
            ->assertJsonMissing(['preferred_username', 'picture']);

        // 2. Token with ONLY 'profile' scope
        Passport::actingAs($user, ['profile']);

        $responseProfile = $this->getJson('/api/v1/userinfo');
        $responseProfile->assertStatus(200)
            ->assertJsonPath('sub', (string) $persona->id)
            ->assertJsonPath('preferred_username', 'tech_guru_99')
            ->assertJsonPath('name', 'John Smith')
            ->assertJsonMissing(['email']);
    }

    /**
     * Test that age assurance claims are only asserted when requested and verified.
     */
    public function test_age_assurance_requires_ial2(): void
    {
        $verifiedUser = User::factory()->create(['is_identity_verified' => true]);
        $ial2Persona = Persona::create([
            'user_id' => $verifiedUser->id,
            'persona_name' => 'Verified Adult',
            'is_age_verified' => true,
        ]);

        // Request IAL2 persona with age scopes
        Passport::actingAs($verifiedUser, ['profile', 'age_verified', 'age_over_18']);

        $response = $this->getJson('/api/v1/userinfo');
        $response->assertStatus(200)
            ->assertJsonPath('is_over_16', true)
            ->assertJsonPath('is_over_18', true)
            ->assertJsonPath('identity_assurance_level', 'IAL2');

        // Switch to unverified age persona
        $ial2Persona->update(['is_age_verified' => false]);

        $responseUnverified = $this->getJson('/api/v1/userinfo');
        $responseUnverified->assertStatus(200)
            ->assertJsonPath('is_over_16', false)
            ->assertJsonPath('is_over_18', false)
            ->assertJsonPath('identity_assurance_level', 'IAL1');
    }

    /**
     * Test that grammatical pronouns scope returns decomposed pronoun grammatical cases.
     */
    public function test_pronouns_scope_discloses_cases(): void
    {
        $user = User::factory()->create();
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Inclusive Dev',
            'pronouns' => [
                'subject' => 'they',
                'object' => 'them',
                'possessive' => 'theirs',
                'display' => 'they/them',
            ],
        ]);

        Passport::actingAs($user, ['pronouns']);

        $response = $this->getJson('/api/v1/userinfo');
        $response->assertStatus(200)
            ->assertJsonPath('pronouns.subject', 'they')
            ->assertJsonPath('pronouns.object', 'them')
            ->assertJsonPath('pronouns.possessive', 'theirs')
            ->assertJsonPath('pronouns.display', 'they/them');
    }

    /**
     * Test that legal_name scope strictly enforces IAL2 verification requirement.
     */
    public function test_legal_name_scope_enforces_kyc(): void
    {
        $unverifiedUser = User::factory()->create(['is_identity_verified' => false]);
        $persona = Persona::create([
            'user_id' => $unverifiedUser->id,
            'persona_name' => 'Financial Client',
            'legal_name' => 'John Smith Legal',
        ]);

        Passport::actingAs($unverifiedUser, ['legal_name']);

        // 1. Unverified user -> legal_name is redacted/null
        $response = $this->getJson('/api/v1/userinfo');
        $response->assertStatus(200)
            ->assertJsonPath('legal_name', null);

        // 2. Verify master identity (IAL2)
        $unverifiedUser->update(['is_identity_verified' => true]);

        $responseVerified = $this->getJson('/api/v1/userinfo');
        $responseVerified->assertStatus(200)
            ->assertJsonPath('legal_name', 'John Smith Legal');
    }

    /**
     * Test that pseudonym scope yields pairwise non-correlatable pseudonyms with zero PII.
     */
    public function test_pseudonym_scope_derives_pairwise_id(): void
    {
        $user = User::factory()->create(['is_identity_verified' => true]);
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Secret Persona',
            'username' => 'secret_user',
            'email_alias' => 'secret@privacy.me',
        ]);

        Passport::actingAs($user, ['pseudonym']);

        // Client A
        $responseA = $this->withHeader('X-Client-ID', 'client-alpha')->getJson('/api/v1/userinfo');
        $responseA->assertStatus(200)
            ->assertJsonMissing(['name', 'email', 'preferred_username'])
            ->assertJsonStructure(['sub', 'pairwise_pseudonym']);

        $pseudoA = $responseA->json('pairwise_pseudonym');
        $this->assertNotEmpty($pseudoA);

        // Client B
        $responseB = $this->withHeader('X-Client-ID', 'client-beta')->getJson('/api/v1/userinfo');
        $pseudoB = $responseB->json('pairwise_pseudonym');
        $this->assertNotEmpty($pseudoB);

        // Assert pairwise unlinkability: pseudonyms across different clients differ even for same persona!
        $this->assertNotEquals($pseudoA, $pseudoB);
    }

    /**
     * Test dynamic parametric age gates (age_is_over_{N}) calculate precise boolean assertions
     * based on attested birthdate without leaking date_of_birth or actual age.
     */
    public function test_parametric_age_gates_hide_dob(): void
    {
        // 20-year-old user (born 20 years ago today)
        $user = User::factory()->create([
            'is_identity_verified' => true,
            'date_of_birth' => now()->subYears(20)->toDateString(),
        ]);

        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'College Student',
            'is_age_verified' => true,
        ]);

        // Request multiple parametric age gate scopes: 13, 16, 18, 21, 65
        Passport::actingAs($user, [
            'profile',
            'age_is_over_13',
            'age_is_over_18',
            'age_is_over_21',
            'age_is_over_65',
        ]);

        $response = $this->getJson('/api/v1/userinfo');
        $response->assertStatus(200)
            ->assertJsonPath('age_is_over_13', true)
            ->assertJsonPath('age_is_over_18', true)
            ->assertJsonPath('age_is_over_21', false)
            ->assertJsonPath('age_is_over_65', false)
            // Ensure zero-knowledge privacy: neither DOB nor numeric age are leaked
            ->assertJsonMissing(['date_of_birth', 'birthdate', 'age']);

        // Test persona privacy override: If persona turns off age disclosure, assertions return false
        $persona->update(['is_age_verified' => false]);

        $responseHidden = $this->getJson('/api/v1/userinfo');
        $responseHidden->assertStatus(200)
            ->assertJsonPath('age_is_over_13', false)
            ->assertJsonPath('age_is_over_18', false)
            ->assertJsonPath('age_is_over_21', false);
    }

    /**
     * Test ScopeRepository dynamically resolves parametric age gate scopes.
     */
    public function test_scope_repository_resolves_parametric_age(): void
    {
        $scopeRepo = app(\Laravel\Passport\Bridge\ScopeRepository::class);

        $scope21 = $scopeRepo->getScopeEntityByIdentifier('age_is_over_21');
        $this->assertNotNull($scope21);
        $this->assertEquals('age_is_over_21', $scope21->getIdentifier());

        $scope65 = $scopeRepo->getScopeEntityByIdentifier('age_over_65');
        $this->assertNotNull($scope65);
        $this->assertEquals('age_over_65', $scope65->getIdentifier());

        // Arbitrary non-existent non-age scope should still return null
        $invalidScope = $scopeRepo->getScopeEntityByIdentifier('invalid_random_scope_xyz');
        $this->assertNull($invalidScope);
    }
}
