<?php

namespace Tests\Feature;

use App\Models\Persona;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Passport\Client;
use Laravel\Passport\Passport;
use Tests\TestCase;

/**
 * Class InFlightClaimProvisioningTest
 *
 * Mocks and validates the real-world scenario where a relying party (e.g. e-commerce merchant)
 * requests a scope (e.g. 'shipping_address') that does not currently exist on the user's persona.
 *
 * The user provisions the claim securely "on the fly" via the API during the OAuth authorization
 * transaction without aborting the session, and the relying party successfully receives the
 * provisioned claim on the /api/v1/userinfo endpoint with strict data minimization.
 */
class InFlightClaimProvisioningTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test full end-to-end OAuth flow:
     * 1. Partner requests 'profile' and 'shipping_address' scopes.
     * 2. Active persona initially lacks 'shipping_address'.
     * 3. User provisions 'shipping_address' in-flight via POST /personas/{id}/claims.
     * 4. User completes authorization.
     * 5. Relying party exchanges code and calls /api/v1/userinfo to receive the newly provisioned address.
     */
    public function test_partner_can_request_shipping_address(): void
    {
        // Step 1: Create User and initial Persona with NO shipping_address
        $user = User::factory()->create([
            'is_identity_verified' => true,
        ]);

        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Online Shopper Persona',
            'username' => 'alex_smith',
            'given_name' => 'Alex',
            'family_name' => 'Smith',
            'custom_claims' => null, // Initially empty!
        ]);

        $this->assertNull($persona->getCustomClaim('shipping_address'));

        // Step 2: Register Relying Party (Partner Client)
        $client = Client::factory()->create([
            'name' => 'Nordic Goods Merchant',
            'secret' => 'merchant-secret-777',
            'redirect_uris' => ['https://merchant.example.com/callback'],
            'grant_types' => ['authorization_code'],
            'revoked' => false,
        ]);

        // Step 3: Partner initiates OAuth request with 'profile' and 'shipping_address'
        $this->actingAs($user);

        $authResponse = $this->get('/oauth/authorize?'.http_build_query([
            'client_id' => $client->id,
            'redirect_uri' => 'https://merchant.example.com/callback',
            'response_type' => 'code',
            'scope' => 'profile shipping_address',
            'state' => 'xyzState123',
        ]));

        $authResponse->assertStatus(200);

        // Verify pending authorization session state was established
        $this->assertTrue(session()->has('authToken'));
        $this->assertTrue(session()->has('authRequest'));
        $authToken = session()->get('authToken');

        // Step 4: During the consent prompt, the user discovers the missing shipping address
        // and provisions it directly on the active persona via the secure in-flight API
        $provisionResponse = $this->postJson("/personas/{$persona->id}/claims", [
            'claim_key' => 'shipping_address',
            'claim_value' => '10 High Street, London, EC1A 1AA',
        ]);

        $provisionResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.custom_claims.shipping_address', '10 High Street, London, EC1A 1AA');

        // Confirm database record now possesses the custom claim
        $persona->refresh();
        $this->assertEquals('10 High Street, London, EC1A 1AA', $persona->getCustomClaim('shipping_address'));

        // Step 5: User approves the OAuth transaction with this updated persona
        $approveResponse = $this->post('/oauth/authorize', [
            'state' => 'xyzState123',
            'client_id' => $client->id,
            'auth_token' => $authToken,
            'persona_id' => $persona->id,
        ]);

        $approveResponse->assertStatus(302);
        $redirectUrl = $approveResponse->headers->get('Location');
        $this->assertStringContainsString('https://merchant.example.com/callback', $redirectUrl);
        $this->assertStringContainsString('code=', $redirectUrl);

        // Extract authorization code from callback redirect
        parse_str(parse_url($redirectUrl, PHP_URL_QUERY), $queryParams);
        $authCode = $queryParams['code'];
        $this->assertNotEmpty($authCode);

        // Step 6: Relying party swaps Authorization Code for Access Token
        $tokenResponse = $this->postJson('/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => $client->id,
            'client_secret' => 'merchant-secret-777',
            'redirect_uri' => 'https://merchant.example.com/callback',
            'code' => $authCode,
        ]);

        $tokenResponse->assertStatus(200);
        $accessToken = $tokenResponse->json('access_token');
        $this->assertNotEmpty($accessToken);

        // Step 7: Relying party queries /api/v1/userinfo using Bearer token
        $userinfoResponse = $this->withHeader('Authorization', 'Bearer '.$accessToken)
            ->getJson('/api/v1/userinfo');

        $userinfoResponse->assertStatus(200)
            ->assertJsonPath('sub', (string) $persona->id)
            ->assertJsonPath('preferred_username', 'alex_smith')
            ->assertJsonPath('name', 'Alex Smith')
            ->assertJsonPath('shipping_address', '10 High Street, London, EC1A 1AA')
            // Assert Data Minimization: Unrequested PII is NOT disclosed
            ->assertJsonMissing(['email', 'legal_name', 'date_of_birth', 'birthdate']);
    }

    /**
     * Test OWASP API1:2023 (BOLA / IDOR) protection:
     * A user cannot provision or manipulate claims on a persona belonging to another account.
     */
    public function test_claim_provisioning_enforces_access_control(): void
    {
        $victim = User::factory()->create();
        $victimPersona = Persona::create([
            'user_id' => $victim->id,
            'persona_name' => 'Victim Persona',
        ]);

        $attacker = User::factory()->create();
        $this->actingAs($attacker);

        // Attacker attempts to inject shipping_address into victim's persona
        $attackResponse = $this->postJson("/personas/{$victimPersona->id}/claims", [
            'claim_key' => 'shipping_address',
            'claim_value' => 'Hacker St 1337',
        ]);

        $attackResponse->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Unauthorized action.');

        $victimPersona->refresh();
        $this->assertNull($victimPersona->custom_claims);
    }

    /**
     * Test input validation for in-flight claim keys.
     */
    public function test_in_flight_claim_provisioning_validates_claim_keys(): void
    {
        $user = User::factory()->create();
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Test Persona',
        ]);

        $this->actingAs($user);

        // Attempt invalid key with spaces and special symbols
        $response = $this->postJson("/personas/{$persona->id}/claims", [
            'claim_key' => '<script>alert(1)</script>',
            'claim_value' => 'Some Value',
        ]);

        $response->assertStatus(422);
        $this->assertArrayHasKey('claim_key', $response->json('errors'));
    }

    /**
     * Test that an authorization request for an unprovisioned custom claim
     * rejects approval attempts until the claim is configured.
     */
    public function test_unprovisioned_claim_blocks_approval(): void
    {
        $user = User::factory()->create();
        $persona = Persona::create([
            'user_id' => $user->id,
            'persona_name' => 'Bare Persona',
            'custom_claims' => null,
        ]);

        $client = Client::factory()->create([
            'name' => 'Store Client',
            'redirect_uris' => ['https://store.example.com/callback'],
            'grant_types' => ['authorization_code'],
            'revoked' => false,
        ]);

        $this->actingAs($user);

        // Initiate auth session with shipping_address scope
        $authUrl = '/oauth/authorize?client_id='.$client->id.'&redirect_uri='.urlencode('https://store.example.com/callback').'&response_type=code&scope=shipping_address';
        $authResponse = $this->get($authUrl);
        $authResponse->assertStatus(200);
        $authToken = session()->get('authToken');

        // Attempt to approve without provisioning the shipping_address claim
        $approveResponse = $this->post('/oauth/authorize', [
            'auth_token' => $authToken,
            'persona_id' => $persona->id,
        ]);

        $approveResponse->assertStatus(422)
            ->assertJsonPath('success', false);

        $this->assertStringContainsString('missing the requested claim', $approveResponse->json('message'));
    }
}
