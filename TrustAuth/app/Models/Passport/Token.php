<?php

namespace App\Models\Passport;

use App\Models\Persona;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Passport\Token as PassportToken;

/**
 * Class Token
 *
 * Extends the default Laravel Passport Token model to associate
 * OAuth 2.0 access tokens with context-specific user Personas.
 */
class Token extends PassportToken
{
    /**
     * Define the relationship linking this token back to a user Persona.
     * Used to identify which persona is active for a given client request.
     */
    public function persona(): BelongsTo
    {
        // Many access tokens belong to a single persona
        return $this->belongsTo(Persona::class);
    }
}
