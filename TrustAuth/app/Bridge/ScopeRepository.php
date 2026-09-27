<?php

namespace App\Bridge;

use Illuminate\Support\Collection;
use Laravel\Passport\Bridge\Scope;
use Laravel\Passport\Bridge\ScopeRepository as PassportScopeRepository;
use Laravel\Passport\Client;
use Laravel\Passport\Passport;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\ScopeEntityInterface;

/**
 * Custom ScopeRepository supporting dynamic parametric age gate scopes:
 * 'age_is_over_{number}' or 'age_over_{number}' (e.g. age_is_over_13, age_is_over_18, age_is_over_21, age_is_over_65).
 */
class ScopeRepository extends PassportScopeRepository
{
    /**
     * Determine if a scope identifier corresponds to a dynamic parametric age gate scope.
     */
    public static function isParametricAgeScope(string $identifier): bool
    {
        return (bool) preg_match('/^age_(?:is_)?over_\d+$/', $identifier);
    }

    /**
     * Extract the numerical age threshold from a parametric scope identifier.
     */
    public static function extractAgeThreshold(string $identifier): ?int
    {
        if (preg_match('/^age_(?:is_)?over_(\d+)$/', $identifier, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    /**
     * {@inheritdoc}
     */
    public function getScopeEntityByIdentifier(string $identifier): ?ScopeEntityInterface
    {
        if (Passport::hasScope($identifier) || self::isParametricAgeScope($identifier)) {
            return new Scope($identifier);
        }

        return null;
    }

    /**
     * {@inheritdoc}
     */
    public function finalizeScopes(
        array $scopes,
        string $grantType,
        ClientEntityInterface $clientEntity,
        ?string $userIdentifier = null,
        ?string $authCodeId = null
    ): array {
        return collect($scopes)
            ->unless(in_array($grantType, ['password', 'personal_access', 'client_credentials']),
                fn (Collection $scopes): Collection => $scopes->reject(
                    fn (ScopeEntityInterface $scope): bool => $scope->getIdentifier() === '*'
                )
            )
            ->filter(fn (ScopeEntityInterface $scope): bool => 
                Passport::hasScope($scope->getIdentifier()) || self::isParametricAgeScope($scope->getIdentifier())
            )
            ->when($this->clients->findActive($clientEntity->getIdentifier()),
                fn (Collection $scopes, Client $client): Collection => $scopes->filter(
                    fn (ScopeEntityInterface $scope): bool => $client->hasScope($scope->getIdentifier())
                )
            )
            ->values()
            ->all();
    }
}
