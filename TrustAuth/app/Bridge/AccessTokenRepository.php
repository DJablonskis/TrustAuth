<?php

namespace App\Bridge;

use App\Models\Persona;
use Laravel\Passport\Bridge\AccessTokenRepository as PassportAccessTokenRepository;
use Laravel\Passport\Events\AccessTokenCreated;
use Laravel\Passport\Passport;
use League\OAuth2\Server\Entities\AccessTokenEntityInterface;

/**
 * Extends Passport AccessTokenRepository to store the persona_id foreign key
 * when persisting access tokens.
 */
class AccessTokenRepository extends PassportAccessTokenRepository
{
    /**
     * Persist a new access token to database storage.
     * Overridden to map the custom persona_id relation.
     */
    public function persistNewAccessToken(AccessTokenEntityInterface $accessTokenEntity): void
    {
        $userId = $accessTokenEntity->getUserIdentifier();
        $persona = Persona::find($userId);
        $personaId = $persona ? $persona->id : null;

        Passport::token()->forceFill([
            'id' => $id = $accessTokenEntity->getIdentifier(),
            'user_id' => $userId,
            'persona_id' => $personaId,
            'client_id' => $clientId = $accessTokenEntity->getClient()->getIdentifier(),
            'scopes' => $accessTokenEntity->getScopes(),
            'revoked' => false,
            'expires_at' => $accessTokenEntity->getExpiryDateTime(),
        ])->save();

        // Dispatch the system access token created event
        $this->events->dispatch(
            new AccessTokenCreated($id, $userId, $clientId)
        );
    }
}
