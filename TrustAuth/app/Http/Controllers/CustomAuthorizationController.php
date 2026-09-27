<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Passport\Bridge\User as BridgeUser;
use Laravel\Passport\Contracts\AuthorizationViewResponse;
use Laravel\Passport\Http\Controllers\AuthorizationController;
use Laravel\Passport\Passport;
use League\OAuth2\Server\Exceptions\OAuthServerException;
use League\OAuth2\Server\RequestTypes\AuthorizationRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Intercepts default Passport OAuth authorization requests to inject
 * custom Inertia user consent interfaces.
 */
class CustomAuthorizationController extends AuthorizationController
{
    /**
     * Intercept and authorize a client request.
     * Replaces standard Blade template outputs with a React SPA view.
     *
     * @return Response|AuthorizationViewResponse|\Inertia\Response
     */
    public function authorize(
        ServerRequestInterface $psrRequest,
        Request $request,
        ResponseInterface $psrResponse,
        AuthorizationViewResponse $viewResponse
    ): Response|AuthorizationViewResponse {

        // Replicate standard Passport validation checks
        $authRequest = $this->withErrorHandling(
            fn (): AuthorizationRequestInterface => $this->server->validateAuthorizationRequest($psrRequest),
            ($psrRequest->getQueryParams()['response_type'] ?? null) === 'token'
        );

        $prompt = $request->string('prompt')->explode(' ')->map(trim(...))->filter()->values();

        if ($prompt->contains('none')) {
            $prompt = collect(['none']);
        }

        // Force login redirection if guest
        if ($this->guard->guest()) {
            $prompt->contains('none')
                ? throw OAuthServerException::loginRequired($authRequest)
                : $this->promptForLogin($request);
        }

        if ($prompt->contains('login') && ! $request->session()->get('promptedForLogin', false)) {
            $this->guard->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $this->promptForLogin($request);
        }

        $request->session()->forget('promptedForLogin');

        $user = $this->guard->user();
        $authRequest->setUser(new BridgeUser($user->getAuthIdentifier()));

        $scopes = $this->parseScopes($authRequest);
        $client = $this->clients->find($authRequest->getClient()->getIdentifier());

        // Identify scopes that map to custom claims (not standard OIDC fields)
        $standardScopes = ['openid', 'profile', 'email', 'phone', 'address', 'age_verified', 'age_over_18', 'legal_name'];
        $customClaimScopes = collect($scopes)->filter(function ($scope) use ($standardScopes) {
            $id = $scope->id;
            // Standard OIDC scopes and parametric age gates are not custom claims
            if (in_array($id, $standardScopes) || preg_match('/^age_(?:is_)?over_\d+$/', $id)) {
                return false;
            }
            return true;
        });

        // Check if any persona can fulfill the custom claim scopes
        $hasUnprovisionedClaims = false;
        if ($customClaimScopes->isNotEmpty()) {
            $personaCheck = $user->personas()->get();
            $hasUnprovisionedClaims = $customClaimScopes->contains(function ($scope) use ($personaCheck) {
                // If NO persona has this custom claim provisioned, force consent
                return !$personaCheck->contains(function ($persona) use ($scope) {
                    return isset($persona->custom_claims[$scope->id]);
                });
            });
        }

        // Bypass authorization if pre-consented or marked skip — BUT not if custom claims are unprovisioned
        if (!$hasUnprovisionedClaims && $prompt->doesntContain('consent') &&
            ($client->skipsAuthorization($user, $scopes) || $this->hasGrantedScopes($user, $client, $scopes))) {
            return $this->approveRequest($authRequest, $psrResponse);
        }

        if ($prompt->contains('none')) {
            throw OAuthServerException::consentRequired($authRequest);
        }

        // Cache OAuth credentials in current user session
        $request->session()->put('authToken', $authToken = Str::random());
        $request->session()->put('authRequest', serialize($authRequest));

        // Retrieve user personas
        $personas = $user->personas()->get();

        // Render dynamic Inertia consent panel, converting it to standard response to comply with typehints
        return Inertia::render('oauth/consent', [
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
            ],
            'scopes' => $scopes,
            'authToken' => $authToken,
            'personas' => $personas,
            'isIdentityVerified' => (bool) $user->is_identity_verified,
            'userAge' => method_exists($user, 'age') ? $user->age() : null,
            'authParams' => $request->all(),
        ])->toResponse($request);
    }

    /**
     * Transform authorization request scopes into displayable Scope models.
     *
     * @return array<\Laravel\Passport\Scope>
     */
    protected function parseScopes(AuthorizationRequestInterface $authRequest): array
    {
        return collect($authRequest->getScopes())->map(function ($scopeEntity) {
            $id = $scopeEntity->getIdentifier();

            if (Passport::hasScope($id)) {
                return Passport::scopesFor([$id])[0] ?? new \Laravel\Passport\Scope($id, $id);
            }

            if (preg_match('/^age_(?:is_)?over_(\d+)$/', $id, $matches)) {
                return new \Laravel\Passport\Scope(
                    $id,
                    "Zero-knowledge assertion verifying age is over {$matches[1]} without revealing date of birth."
                );
            }

            return new \Laravel\Passport\Scope($id, 'Requested application scope.');
        })->unique('id')->values()->all();
    }
}
