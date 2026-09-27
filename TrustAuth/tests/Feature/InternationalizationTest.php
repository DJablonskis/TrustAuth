<?php

namespace Tests\Feature;

use App\Models\Persona;
use App\Models\User;
use App\Services\TransliterationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class InternationalizationTest
 *
 * Verifies the multi-script identity architecture:
 * 1. ICU Transliteration across 10 world alphabets with deterministic output.
 * 2. RFC 9110 HTTP Content Negotiation via Accept-Language header.
 * 3. Bidirectional text support (RTL for Arabic and Hebrew, LTR for others).
 * 4. Pronoun and localized name data persistence.
 * 5. OpenID Connect /api/v1/userinfo endpoint profile delivery.
 */
class InternationalizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that TransliterationService deterministically converts names to all 10 world alphabets.
     */
    public function test_transliteration_supports_alphabets(): void
    {
        $service = new TransliterationService;

        $variants = $service->transliterateAll('John Smith', 'John', 'Smith');

        // Verify all 10 scripts are present
        $this->assertArrayHasKey('latin', $variants);
        $this->assertArrayHasKey('arabic', $variants);
        $this->assertArrayHasKey('devanagari', $variants);
        $this->assertArrayHasKey('bengali', $variants);
        $this->assertArrayHasKey('cyrillic', $variants);
        $this->assertArrayHasKey('kana', $variants);
        $this->assertArrayHasKey('hangul', $variants);
        $this->assertArrayHasKey('hebrew', $variants);
        $this->assertArrayHasKey('greek', $variants);
        $this->assertArrayHasKey('georgian', $variants);

        // Verify script metadata properties
        $this->assertEquals('rtl', $variants['arabic']['direction']);
        $this->assertEquals('rtl', $variants['hebrew']['direction']);
        $this->assertEquals('ltr', $variants['greek']['direction']);
        $this->assertEquals('ltr', $variants['cyrillic']['direction']);

        // Verify Cyrillic transliteration output is non-empty and contains Cyrillic characters
        $this->assertNotEmpty($variants['cyrillic']['formatted_name']);
        $this->assertMatchesRegularExpression('/[\x{0400}-\x{04FF}]/u', $variants['cyrillic']['formatted_name']);

        // Verify Greek transliteration output contains Greek characters
        $this->assertNotEmpty($variants['greek']['formatted_name']);
        $this->assertMatchesRegularExpression('/[\x{0370}-\x{03FF}]/u', $variants['greek']['formatted_name']);
    }

    /**
     * Test RFC 9110 Content Negotiation via Accept-Language header on GET /api/v1/personas/{id}.
     */
    public function test_negotiation_resolves_script_and_direction(): void
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'International Diplomat',
            'given_name' => 'John',
            'family_name' => 'Smith',
            'primary_script' => 'latin',
            'localized_names' => [
                'greek' => [
                    'formatted_name' => 'Ἰὁν Σμιθ',
                    'given_name' => 'Ἰὁν',
                    'family_name' => 'Σμιθ',
                ],
                'arabic' => [
                    'formatted_name' => 'جُهن سمِته',
                    'given_name' => 'جُهن',
                    'family_name' => 'سمِته',
                ],
                'cyrillic' => [
                    'formatted_name' => 'Йохн Смитх',
                    'given_name' => 'Йохн',
                    'family_name' => 'Смитх',
                ],
            ],
            'pronouns' => [
                'subject' => 'he',
                'object' => 'him',
                'possessive' => 'his',
            ],
        ]);

        // Scenario 1: Requesting Greek locale (el-GR)
        $responseGr = $this->withHeaders([
            'Accept-Language' => 'el-GR,el;q=0.9,en;q=0.8',
        ])->getJson("/api/v1/personas/{$persona->id}");

        $responseGr->assertStatus(200)
            ->assertJsonPath('data.formatted_name', 'Ἰὁν Σμιθ')
            ->assertJsonPath('data.script', 'greek')
            ->assertJsonPath('data.direction', 'ltr');

        // Scenario 2: Requesting Arabic locale (ar-EG)
        $responseAr = $this->withHeaders([
            'Accept-Language' => 'ar-EG,ar;q=0.9',
        ])->getJson("/api/v1/personas/{$persona->id}");

        $responseAr->assertStatus(200)
            ->assertJsonPath('data.formatted_name', 'جُهن سمِته')
            ->assertJsonPath('data.script', 'arabic')
            ->assertJsonPath('data.direction', 'rtl');

        // Scenario 3: Requesting Russian locale (ru-RU)
        $responseRu = $this->withHeaders([
            'Accept-Language' => 'ru-RU,ru;q=0.9',
        ])->getJson("/api/v1/personas/{$persona->id}");

        $responseRu->assertStatus(200)
            ->assertJsonPath('data.formatted_name', 'Йохн Смитх')
            ->assertJsonPath('data.script', 'cyrillic');
    }

    /**
     * Test graceful fallback to Latin / primary script when Accept-Language matches no localized script.
     */
    public function test_negotiation_falls_back_gracefully(): void
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'European Citizen',
            'given_name' => 'John',
            'family_name' => 'Doe',
            'primary_script' => 'latin',
            'localized_names' => [],
        ]);

        // Requesting Dutch locale with no stored custom variant: default Western given-family ordering
        $responseNl = $this->withHeaders([
            'Accept-Language' => 'nl-NL,nl;q=0.9',
        ])->getJson("/api/v1/personas/{$persona->id}");

        $responseNl->assertStatus(200)
            ->assertJsonPath('data.formatted_name', 'John Doe')
            ->assertJsonPath('data.script', 'latin')
            ->assertJsonPath('data.direction', 'ltr');

        // Requesting Chinese locale: triggers Eastern cultural ordering (Family Name first)
        $responseZh = $this->withHeaders([
            'Accept-Language' => 'zh-CN,zh;q=0.9',
        ])->getJson("/api/v1/personas/{$persona->id}");

        $responseZh->assertStatus(200)
            ->assertJsonPath('data.formatted_name', 'Doe John')
            ->assertJsonPath('data.name_components.ordering', 'family_given');
    }

    /**
     * Test OpenID Connect /api/v1/userinfo endpoint delivers context-minimized, content-negotiated profile.
     */
    public function test_userinfo_returns_negotiated_claims(): void
    {
        $user = User::factory()->create([
            'is_identity_verified' => true,
        ]);
        Passport::actingAs($user);

        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Public Diplomat',
            'given_name' => 'Elena',
            'family_name' => 'Papadopoulos',
            'username' => 'elena_p',
            'email_alias' => 'elena@privacy.me',
            'is_age_verified' => true,
            'localized_names' => [
                'greek' => [
                    'formatted_name' => 'Έλενα Παπαδοπούλου',
                    'given_name' => 'Έλενα',
                    'family_name' => 'Παπαδοπούλου',
                ],
            ],
            'pronouns' => [
                'subject' => 'she',
                'object' => 'her',
                'possessive' => 'her',
            ],
        ]);

        // Call /api/v1/userinfo with Greek Accept-Language header
        $response = $this->withHeaders([
            'Accept-Language' => 'el-GR,el;q=0.9',
        ])->getJson('/api/v1/userinfo');

        $response->assertStatus(200)
            ->assertJsonPath('name', 'Έλενα Παπαδοπούλου')
            ->assertJsonPath('script', 'greek')
            ->assertJsonPath('direction', 'ltr')
            ->assertJsonPath('preferred_username', 'elena_p')
            ->assertJsonPath('email', 'elena@privacy.me')
            ->assertJsonPath('is_over_16', true)
            ->assertJsonPath('identity_assurance_level', 'IAL2')
            ->assertJsonPath('pronouns.subject', 'she');
    }

    /**
     * Test POST /api/v1/personas/transliterate endpoint generates valid 10-script variants.
     */
    public function test_transliterate_api_generates_variants(): void
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        $response = $this->postJson('/api/v1/personas/transliterate', [
            'name' => 'Alexander Hamilton',
            'given_name' => 'Alexander',
            'family_name' => 'Hamilton',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'latin',
                    'arabic',
                    'devanagari',
                    'bengali',
                    'cyrillic',
                    'kana',
                    'hangul',
                    'hebrew',
                    'greek',
                    'georgian',
                ],
            ]);
    }
}
