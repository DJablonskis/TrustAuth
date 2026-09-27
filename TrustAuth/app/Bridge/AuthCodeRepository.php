<?php

namespace App\Bridge;

use Laravel\Passport\Bridge\AuthCodeRepository as PassportAuthCodeRepository;
use Laravel\Passport\Passport;
use League\OAuth2\Server\Entities\AuthCodeEntityInterface;

/**
 * Extends the Passport Bridge AuthCodeRepository to capture and save the
 * user's selected Persona ID during authorization code creation.
 */
class AuthCodeRepository extends PassportAuthCodeRepository
{
    /**
     * Persist a new authorization code to the database.
     * Overridden to associate the code with the active persona.
     */
    public function persistNewAuthCode(AuthCodeEntityInterface $authCodeEntity): void
    {
        // First invoke default Passport persistence mapping
        parent::persistNewAuthCode($authCodeEntity);

        // Retrieve the context-specific Persona ID stored in session or request parameters
        $personaId = request()->input('persona_id') ?? session()->get('selected_persona_id');

        if ($personaId) {
            // Bind the active persona ID to this authorization code database row
            Passport::authCode()
                ->whereKey($authCodeEntity->getIdentifier())
                ->update(['persona_id' => $personaId]);
        }
    }
}
