<?php

namespace App\Bridge;

use App\Models\Persona;
use Laravel\Passport\Bridge\AccessToken as PassportAccessToken;
use League\OAuth2\Server\Entities\Traits\AccessTokenTrait;
use League\OAuth2\Server\Entities\Traits\EntityTrait;
use League\OAuth2\Server\Entities\Traits\TokenEntityTrait;

/**
 * Custom Passport AccessToken entity. Uses League traits directly to access
 * private JWT properties and append custom claims (e.g. is_over_16) during signing.
 */
class AccessToken extends PassportAccessToken
{
    // Import traits to allow subclass access to private properties in PHP scope
    use AccessTokenTrait, EntityTrait, TokenEntityTrait;

    /**
     * Generate a string representation (JWT) of the access token.
     * Overridden to customize claims on token generation.
     */
    public function toString(): string
    {
        $this->initJwtConfiguration();

        // Build token with standard parameters
        $builder = $this->jwtConfiguration->builder()
            ->permittedFor($this->getClient()->getIdentifier())
            ->identifiedBy($this->getIdentifier())
            ->issuedAt(new \DateTimeImmutable)
            ->canOnlyBeUsedAfter(new \DateTimeImmutable)
            ->expiresAt($this->getExpiryDateTime())
            ->relatedTo($this->getUserIdentifier() ?? $this->getClient()->getIdentifier())
            ->withClaim('scopes', $this->getScopes());

        // Extract scope identifiers
        $scopeIds = collect($this->getScopes())->map(
            fn ($scope) => $scope->getIdentifier()
        );

        $persona = Persona::with('user')->find($this->getUserIdentifier());
        $user = $persona?->user;

        // If age assurance scopes are active, compute parametric and standardized zero-knowledge age assertions
        if ($persona && $user && $user->is_identity_verified && $persona->is_age_verified) {
            $userAge = $user->age() ?? 25;

            if ($scopeIds->contains('age_verified')) {
                $builder = $builder->withClaim('is_over_16', $userAge >= 16);
            }
            if ($scopeIds->contains('age_over_18')) {
                $builder = $builder->withClaim('is_over_18', $userAge >= 18);
            }

            // Dynamic parametric age gates: age_is_over_{N} or age_over_{N}
            foreach ($scopeIds as $scopeId) {
                if (preg_match('/^age_(?:is_)?over_(\d+)$/', $scopeId, $matches)) {
                    $threshold = (int) $matches[1];
                    $isOver = ($userAge >= $threshold);
                    $builder = $builder->withClaim($scopeId, $isOver);
                    $builder = $builder->withClaim("age_is_over_{$threshold}", $isOver);
                }
            }
        }

        // If 'pronouns' scope is active, attach grammatical pronoun set
        if ($scopeIds->contains('pronouns')) {
            if ($persona && $persona->pronouns) {
                $builder = $builder->withClaim('pronouns', $persona->pronouns);
            }
        }

        // If custom claims match granted scopes, include them in token claims (e.g. shipping_address)
        if ($persona && ! empty($persona->custom_claims)) {
            foreach ($scopeIds as $scopeId) {
                if (isset($persona->custom_claims[$scopeId])) {
                    $builder = $builder->withClaim($scopeId, $persona->custom_claims[$scopeId]);
                }
            }
        }

        // Return signed string representation using default configuration signer keys
        return $builder->getToken(
            $this->jwtConfiguration->signer(),
            $this->jwtConfiguration->signingKey()
        )->toString();
    }
}
