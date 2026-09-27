<?php

namespace App\Services;

use App\Models\Persona;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Extends the default EloquentUserProvider to resolve users contextually
 * through their active Persona ID. This allows the JWT subject claim ('sub')
 * to contain the minimized Persona ID while still returning the correct
 * authenticated parent User model in Laravel.
 */
class PersonaUserProvider extends EloquentUserProvider
{
    /**
     * Retrieve a user by their unique identifier.
     * Overridden to handle Persona ID lookup mapping.
     *
     * @param  mixed  $identifier
     * @return Authenticatable|null
     */
    public function retrieveById($identifier)
    {
        // First check if the identifier maps to a valid Persona record
        $persona = Persona::find($identifier);

        if ($persona) {
            // Context minimization: load and return the parent User model
            return $persona->user;
        }

        // Fallback to default user table query lookup
        return parent::retrieveById($identifier);
    }
}
