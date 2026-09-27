<?php

namespace Tests\Feature;

use App\Models\Persona;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Client;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class OAuthInterceptTest
 *
 * Verifies custom OAuth intercept workflows, persona bindings, subject claim mutations,
 * and age verification assertion claim validations.
 */
class OAuthInterceptTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Set up Passport client assets.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Seed a standard authorization code grant client
        Client::factory()->create([
            'id' => '9c565d7a-1111-2222-3333-444444444444',
            'name' => 'Mock Client App',
            'secret' => 'mock_secret_key_phrase_1234567890',
            'redirect_uris' => ['http://localhost/callback'],
            'grant_types' => ['authorization_code', 'refresh_token'],
            'revoked' => false,
        ]);
    }

    /**
     * Test authorization redirect gets intercepted to render the Inertia consent view.
     */
    public function test_authorization_redirect_renders_inertia_consent(): void
    {
        $user = User::factory()->create();

        // Perform request actingAs the authenticated user
        $response = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query([
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'redirect_uri' => 'http://localhost/callback',
                'response_type' => 'code',
                'scope' => 'profile',
                'state' => 'xyz123',
            ]));

        // Assert redirect intercepts and renders the Inertia screen
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('oauth/consent')
            ->has('client')
            ->has('personas')
            ->has('authToken')
        );
    }

    /**
     * Test approving the request binds the selected persona to the auth code.
     */
    public function test_approving_request_binds_persona(): void
    {
        $user = User::factory()->create();
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Gaming Identity',
            'username' => 'GamerPro',
        ]);

        // Access the authorization screen first to set session tokens
        $authResponse = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query([
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'redirect_uri' => 'http://localhost/callback',
                'response_type' => 'code',
                'scope' => 'profile',
                'state' => 'xyz123',
            ]));

        $authToken = $authResponse->inertiaPage()['props']['authToken'];

        // Post approval response simulating the persona selection
        $approveResponse = $this->actingAs($user)
            ->post('/oauth/authorize', [
                'persona_id' => $persona->id,
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'auth_token' => $authToken,
                'state' => 'xyz123',
            ]);

        // Assert redirection back to client callback with authorization code
        $approveResponse->assertStatus(302);
        $this->assertStringContainsString('http://localhost/callback?code=', $approveResponse->headers->get('Location'));

        // Extract code from redirect URL
        parse_str(parse_url($approveResponse->headers->get('Location'), PHP_URL_QUERY), $query);
        $code = $query['code'];

        // Confirm database stores authorization code bound to the selected Persona
        $this->assertDatabaseHas('oauth_auth_codes', [
            'persona_id' => $persona->id,
        ]);
    }

    /**
     * Test that exchanging the auth code customizes JWT subject claim to the Persona ID.
     */
    public function test_token_exchange_customizes_jwt_subject(): void
    {
        $user = User::factory()->create();
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Work Profile',
            'username' => 'Developer',
        ]);

        // 1. Generate auth code
        $authResponse = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query([
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'redirect_uri' => 'http://localhost/callback',
                'response_type' => 'code',
                'scope' => 'profile',
                'state' => 'xyz123',
            ]));

        $authToken = $authResponse->inertiaPage()['props']['authToken'];

        $approveResponse = $this->actingAs($user)
            ->post('/oauth/authorize', [
                'persona_id' => $persona->id,
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'auth_token' => $authToken,
                'state' => 'xyz123',
            ]);

        parse_str(parse_url($approveResponse->headers->get('Location'), PHP_URL_QUERY), $query);
        $code = $query['code'];

        // 2. Exchange authorization code for token
        $tokenResponse = $this->postJson('/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => '9c565d7a-1111-2222-3333-444444444444',
            'client_secret' => 'mock_secret_key_phrase_1234567890',
            'redirect_uri' => 'http://localhost/callback',
            'code' => $code,
        ]);

        $tokenResponse->assertStatus(200);
        $accessToken = $tokenResponse->json('access_token');

        // Confirm database token record is bound to persona
        $this->assertDatabaseHas('oauth_access_tokens', [
            'user_id' => $persona->id, // Resolved subject stored as user_id in DB
            'persona_id' => $persona->id,
        ]);

        // Parse token JWT claims to confirm context minimization
        $jwt = $this->parseJwt($accessToken);
        $this->assertEquals($persona->id, $jwt->claims()->get('sub'));
    }

    /**
     * Test that age verification scope blocks unverified parent accounts.
     */
    public function test_age_verification_scope_blocks_unverified_accounts(): void
    {
        $user = User::factory()->create(['is_identity_verified' => false]);
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Profile',
            'is_age_verified' => true,
        ]);

        // Initiate authorize request
        $authResponse = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query([
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'redirect_uri' => 'http://localhost/callback',
                'response_type' => 'code',
                'scope' => 'age_verified',
                'state' => 'xyz123',
            ]));

        $authToken = $authResponse->inertiaPage()['props']['authToken'];

        // Attempt approval: Should return a 403 Forbidden since user is not verified
        $approveResponse = $this->actingAs($user)
            ->post('/oauth/authorize', [
                'persona_id' => $persona->id,
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'auth_token' => $authToken,
                'state' => 'xyz123',
            ]);

        $approveResponse->assertStatus(403);
    }

    /**
     * Test that age verification scope blocks if persona hides age disclosure.
     */
    public function test_age_verification_scope_blocks_if_persona_hides_disclosure(): void
    {
        $user = User::factory()->create(['is_identity_verified' => true]);
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Profile',
            'is_age_verified' => false, // Hidden disclosure
        ]);

        // Initiate authorize request
        $authResponse = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query([
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'redirect_uri' => 'http://localhost/callback',
                'response_type' => 'code',
                'scope' => 'age_verified',
                'state' => 'xyz123',
            ]));

        $authToken = $authResponse->inertiaPage()['props']['authToken'];

        // Attempt approval: Should return a 403 Forbidden since persona hides age
        $approveResponse = $this->actingAs($user)
            ->post('/oauth/authorize', [
                'persona_id' => $persona->id,
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'auth_token' => $authToken,
                'state' => 'xyz123',
            ]);

        $approveResponse->assertStatus(403);
    }

    /**
     * Test that age verification scope succeeds and appends custom claims when verified.
     */
    public function test_age_verification_appends_over_16_claim(): void
    {
        $user = User::factory()->create(['is_identity_verified' => true]);
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Profile',
            'is_age_verified' => true,
        ]);

        // 1. Authorize
        $authResponse = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query([
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'redirect_uri' => 'http://localhost/callback',
                'response_type' => 'code',
                'scope' => 'age_verified',
                'state' => 'xyz123',
            ]));

        $authToken = $authResponse->inertiaPage()['props']['authToken'];

        $approveResponse = $this->actingAs($user)
            ->post('/oauth/authorize', [
                'persona_id' => $persona->id,
                'client_id' => '9c565d7a-1111-2222-3333-444444444444',
                'auth_token' => $authToken,
                'state' => 'xyz123',
            ]);

        parse_str(parse_url($approveResponse->headers->get('Location'), PHP_URL_QUERY), $query);
        $code = $query['code'];

        // 2. Exchange token
        $tokenResponse = $this->postJson('/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => '9c565d7a-1111-2222-3333-444444444444',
            'client_secret' => 'mock_secret_key_phrase_1234567890',
            'redirect_uri' => 'http://localhost/callback',
            'code' => $code,
        ]);

        $tokenResponse->assertStatus(200);
        $accessToken = $tokenResponse->json('access_token');

        // 3. Confirm is_over_16 assertion claim is present in JWT payload
        $jwt = $this->parseJwt($accessToken);
        $this->assertTrue($jwt->claims()->get('is_over_16'));
    }

    /**
     * Helper to decode token and parse JWT claims.
     */
    protected function parseJwt(string $token)
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
