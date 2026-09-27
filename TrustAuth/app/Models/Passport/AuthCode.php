<?php

namespace App\Models\Passport;

use App\Models\Persona;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Passport\AuthCode as PassportAuthCode;

/**
 * Class AuthCode
 *
 * Extends the default Laravel Passport AuthCode model to associate
 * OAuth 2.0 temporary authorization codes with context-specific user Personas.
 */
class AuthCode extends PassportAuthCode
{
    /**
     * Define the relationship linking this authorization code back to a user Persona.
     * Captures the user's persona choice during the authorization redirect intercept.
     */
    public function persona(): BelongsTo
    {
        // Many authorization codes belong to a single persona
        return $this->belongsTo(Persona::class);
    }
}
