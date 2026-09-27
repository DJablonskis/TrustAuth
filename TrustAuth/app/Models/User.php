<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Passport\HasApiTokens;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'date_of_birth', 'password', 'is_identity_verified', 'verification_type', 'estimated_age'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public function personas(): HasMany
    {
        return $this->hasMany(Persona::class);
    }

    /**
     * Compute current age from attested date of birth or conservative estimated age.
     * For 'photo_only' mode: uses the conservative smallest age (estimate - 3 years) and never relies on user-provided DOB.
     * For 'standard' mode: uses the officially verified date_of_birth from government ID OCR.
     * Defaults to 25 if identity is verified but explicit birthdate was unpopulated in legacy seeders.
     */
    public function age(): ?int
    {
        if ($this->verification_type === 'photo_only') {
            return $this->estimated_age;
        }

        if ($this->date_of_birth) {
            return Carbon::parse($this->date_of_birth)->age;
        }

        if ($this->estimated_age) {
            return $this->estimated_age;
        }

        return $this->is_identity_verified ? 25 : null;
    }

    /**
     * Check if user meets an arbitrary age gate threshold without revealing exact date of birth.
     */
    public function isOverAge(int $threshold): bool
    {
        if (! $this->is_identity_verified) {
            return false;
        }

        $age = $this->age();

        return $age !== null && $age >= $threshold;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'password' => 'hashed',
            'is_identity_verified' => 'boolean',
            'estimated_age' => 'integer',
        ];
    }
}
