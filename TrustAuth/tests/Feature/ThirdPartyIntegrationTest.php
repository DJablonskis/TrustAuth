<?php

namespace Tests\Feature;

use App\Models\Persona;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Client;
use Tests\TestCase;

/**
 * Class ThirdPartyIntegrationTest
 *
 * Simulates a full OAuth 2.0 authorization code flow for third-party logins
 * using different persona contexts. Verifies user persona selection, scope-based
 * age verification checks, and custom JWT claim modifications.
 */
class ThirdPartyIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * The ID of the mock third-party client.
     */
    private const CLIENT_ID = '9c565d7a-1111-2222-3333-444444444444';

    /**
     * The secret of the mock third-party client.
     */
    private const CLIENT_SECRET = 'mock_secret_key_phrase_1234567890';

    /**
     * The redirect URI of the mock third-party client.
     */
    private const REDIRECT_URI = 'http://localhost/callback';

    /**
     * Set up the OAuth client for tests.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Create standard authorization code grant client
        Client::factory()->create([
            'id' => self::CLIENT_ID,
            'name' => 'Mock Client App',
            'secret' => self::CLIENT_SECRET,
            'redirect_uris' => [self::REDIRECT_URI],
            'grant_types' => ['authorization_code', 'refresh_token'],
            'revoked' => false,
        ]);
    }

    /**
     * Test the full OAuth 2.0 authorization code flow with the Professional persona.
     * Asserts that:
     * - The authorization request redirects to the Inertia consent screen.
     * - The consent screen contains the seeded personas.
     * - Selecting the Professional persona with scope 'age_verified' succeeds.
     * - Exchanging the authorization code yields an access token with correct claims ('sub' and 'is_over_16').
     */
    public function test_oauth_flow_with_professional_persona_succeeds(): void
    {
        // 1. Create a user with seeded personas (Professional, Gamer, Anonymous)
        $user = User::factory()->create(['is_identity_verified' => true]);

        $professional = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Professional Persona',
            'username' => 'johndoe_corp',
            'is_age_verified' => true,
        ]);

        $gamer = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Gamer Persona',
            'username' => 'pixel_paladin',
            'is_age_verified' => false,
        ]);

        $anonymous = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Anonymous Ghost Persona',
            'username' => 'anon_ghost_88',
            'is_age_verified' => false,
        ]);

        // 2. Mock authorization requests to CustomAuthorizationController
        $authResponse = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query([
                'client_id' => self::CLIENT_ID,
                'redirect_uri' => self::REDIRECT_URI,
                'response_type' => 'code',
                'scope' => 'age_verified',
                'state' => 'xyz123',
            ]));

        // 3. Verify redirection lands on Inertia consent screen containing the personas
        $authResponse->assertStatus(200);
        $authResponse->assertInertia(fn ($page) => $page
            ->component('oauth/consent')
            ->has('client')
            ->has('personas', 3) // Verify the page has all 3 seeded personas
            ->has('authToken')
        );

        $authToken = $authResponse->inertiaPage()['props']['authToken'];

        // 4. Post to CustomApproveAuthorizationController selecting the Professional persona with scope 'age_verified'
        $approveResponse = $this->actingAs($user)
            ->post('/oauth/authorize', [
                'persona_id' => $professional->id,
                'client_id' => self::CLIENT_ID,
                'auth_token' => $authToken,
                'state' => 'xyz123',
            ]);

        $approveResponse->assertStatus(302);
        $this->assertStringContainsString(self::REDIRECT_URI.'?code=', $approveResponse->headers->get('Location'));

        // Extract authorization code from redirect URL
        parse_str(parse_url($approveResponse->headers->get('Location'), PHP_URL_QUERY), $query);
        $code = $query['code'];

        // 5. Exchange the authorization code at the Passport token endpoint to receive the access token
        $tokenResponse = $this->postJson('/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => self::CLIENT_ID,
            'client_secret' => self::CLIENT_SECRET,
            'redirect_uri' => self::REDIRECT_URI,
            'code' => $code,
        ]);

        $tokenResponse->assertStatus(200);
        $accessToken = $tokenResponse->json('access_token');
        $this->assertNotEmpty($accessToken);

        // 6. Parse the JWT claims of the returned access token
        $jwt = $this->parseJwt($accessToken);

        // Assert 'sub' claim matches the Professional persona ID, and includes 'is_over_16: true'
        $this->assertEquals($professional->id, $jwt->claims()->get('sub'));
        $this->assertTrue($jwt->claims()->get('is_over_16'));
    }

    /**
     * Test that selecting the Gamer persona (which does not have age verified)
     * is blocked and throws a 403 Forbidden status code when the 'age_verified' scope is requested.
     */
    public function test_oauth_flow_with_gamer_persona_fails_for_age_verified_scope(): void
    {
        // 1. Create a user with seeded personas (Professional, Gamer, Anonymous)
        $user = User::factory()->create(['is_identity_verified' => true]);

        $professional = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Professional Persona',
            'username' => 'johndoe_corp',
            'is_age_verified' => true,
        ]);

        $gamer = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Gamer Persona',
            'username' => 'pixel_paladin',
            'is_age_verified' => false,
        ]);

        $anonymous = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Anonymous Ghost Persona',
            'username' => 'anon_ghost_88',
            'is_age_verified' => false,
        ]);

        // 2. Initiate authorize request with scope 'age_verified'
        $authResponse = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query([
                'client_id' => self::CLIENT_ID,
                'redirect_uri' => self::REDIRECT_URI,
                'response_type' => 'code',
                'scope' => 'age_verified',
                'state' => 'xyz123',
            ]));

        $authResponse->assertStatus(200);
        $authToken = $authResponse->inertiaPage()['props']['authToken'];

        // 3. Post to CustomApproveAuthorizationController selecting the Gamer persona
        // Assert token exchange is blocked or throws a 403 (Gamer is not age-verified)
        $approveResponse = $this->actingAs($user)
            ->post('/oauth/authorize', [
                'persona_id' => $gamer->id,
                'client_id' => self::CLIENT_ID,
                'auth_token' => $authToken,
                'state' => 'xyz123',
            ]);

        $approveResponse->assertStatus(403);
    }

    /**
     * Helper to decode token and parse JWT claims.
     */
    protected function parseJwt(string $token): object
    {
        $parts = explode('.', $token);
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);

        return new class($payload)
        {
            public function __construct(private array $payload) {}

            public function claims()
            {
                return new class($this->payload)
                {
                    public function __construct(private array $payload) {}

                    public function get($key)
                    {
                        return $this->payload[$key] ?? null;
                    }
                };
            }
        };
    }
}
