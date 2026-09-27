<?php

namespace App\Providers;

use App\Bridge\AccessToken;
use App\Bridge\AccessTokenRepository;
use App\Bridge\AuthCodeRepository;
use App\Http\Controllers\CustomAuthorizationController;
use App\Models\Passport\AuthCode;
use App\Models\Passport\Token;
use App\Services\PersonaUserProvider;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind concrete custom Passport bridge repositories to override default storage actions
        $this->app->bind(
            \Laravel\Passport\Bridge\AuthCodeRepository::class,
            AuthCodeRepository::class
        );

        $this->app->bind(
            \Laravel\Passport\Bridge\AccessTokenRepository::class,
            AccessTokenRepository::class
        );

        $this->app->bind(
            \Laravel\Passport\Bridge\ScopeRepository::class,
            \App\Bridge\ScopeRepository::class
        );

        // Contextual guard for custom authorization controller
        $this->app->when(CustomAuthorizationController::class)
            ->needs(StatefulGuard::class)
            ->give(fn () => Auth::guard(config('passport.guard', 'web')));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        // Register custom models for Laravel Passport to link tokens to Personas
        Passport::useTokenModel(Token::class);
        Passport::useAuthCodeModel(AuthCode::class);

        // Register the custom AccessToken bridge entity to append dynamic JWT claims
        Passport::useAccessTokenEntity(AccessToken::class);

        // Initialize the default authorization view contract singleton binding
        Passport::authorizationView('oauth/consent');

        // Register standardized OAuth 2.0 / OIDC scopes for personas, age assurance, and KYC compliance
        Passport::tokensCan([
            'openid' => 'Authenticate identity and issue OIDC ID tokens.',
            'profile' => 'Access your context-specific user profile details.',
            'email' => 'Access your configured email alias address.',
            'shipping_address' => 'Access delivery shipping address configured for this persona.',
            'pronouns' => 'Disclose grammatical pronoun cases and gender identity.',
            'age_verified' => 'Request verified age assertions (is_over_16) under UK Online Safety Act.',
            'age_over_18' => 'Request verified adult assertions (is_over_18) for age-restricted services.',
            'legal_name' => 'Access verified legal passport name for KYC / AML compliance.',
            'pseudonym' => 'Enforce zero-PII anonymous interaction via pairwise pseudonyms.',
        ]);

        // Register custom Eloquent User Provider resolving users by Persona identifiers
        Auth::provider('persona_eloquent', function ($app, array $config) {
            return new PersonaUserProvider($app['hash'], $config['model']);
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
