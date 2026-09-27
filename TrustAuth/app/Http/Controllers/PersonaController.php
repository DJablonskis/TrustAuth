<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Services\TransliterationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Handles context-aware Persona CRUD management, HTTP Content Negotiation (RFC 9110),
 * deterministic multi-script transliteration across 10 world alphabets,
 * cache-busting avatar updates, and standard OpenID Connect UserInfo profile delivery.
 */
class PersonaController extends Controller
{
    /**
     * Display a listing of personas for the authenticated user.
     *
     * @return Response|JsonResponse|RedirectResponse
     */
     public function index(Request $request)
    {
        $user = $request->user();

        // Dual-channel reconciliation: If redirected back from Didit with verificationSessionId
        $sessionId = $request->query('verificationSessionId');
        if ($sessionId && $user) {
            $diditService = app(\App\Services\DiditVerificationService::class);
            $diditService->reconcileSessionForUser($user, $sessionId);

            // Clean redirect removing query parameters to present a clean dashboard URL
            return redirect()->route('dashboard');
        }

        $personas = $user->personas;

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'data' => $personas,
            ]);
        }

        return Inertia::render('dashboard', [
            'personas' => $personas,
            'isIdentityVerified' => (bool) $user->is_identity_verified,
            'verificationType' => $user->verification_type,
            'estimatedAge' => $user->estimated_age,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'date_of_birth' => $user->date_of_birth ? $user->date_of_birth->format('Y-m-d') : null,
                'verification_type' => $user->verification_type,
                'estimated_age' => $user->estimated_age,
            ],
        ]);
    }

    /**
     * Store a newly created persona in storage.
     *
     * @return JsonResponse|RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'persona_name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255',
            'email_alias' => 'nullable|email|max:255',
            'legal_name' => 'nullable|string|max:255',
            'preferred_name' => 'nullable|string|max:255',
            'family_name' => 'nullable|string|max:255',
            'given_name' => 'nullable|string|max:255',
            'gender_identity' => 'nullable|string|max:255',
            'cultural_ordering' => 'nullable|string|in:given_family,family_given',
            'localized_names' => 'nullable|array',
            'pronouns' => 'nullable|array',
            'primary_script' => 'nullable|string|max:10',
        ]);

        $validated['user_id'] = $request->user()->id;

        // Enforce verified legal name from ID if user is identity verified
        if ($request->user()->is_identity_verified && ! empty($request->user()->name)) {
            $validated['legal_name'] = $request->user()->name;
        }

        // Ghost Mode (Anonymity): If no username is provided, randomize attribute to respect IAL1
        if (empty($validated['username'])) {
            $validated['username'] = 'user_'.Str::random(10);
        }

        $persona = Persona::create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Persona created successfully.',
                'data' => $persona,
            ], 201);
        }

        return redirect()->back();
    }

    /**
     * Display the specified persona with dynamic RFC 9110 Accept-Language negotiation.
     */
    public function show(Request $request, Persona $persona): JsonResponse
    {
        // Verify ownership access to prevent BOLA (OWASP API1:2023)
        if ($persona->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to persona.',
            ], 403);
        }

        $localeHeader = $request->header('Accept-Language', 'en-US');
        $negotiated = $persona->resolveNameForLocale($localeHeader);

        return response()->json([
            'success' => true,
            'data' => array_merge($persona->toArray(), [
                'formatted_name' => $negotiated['formatted_name'],
                'script' => $negotiated['script'],
                'script_name' => $negotiated['script_name'],
                'script_type' => $negotiated['script_type'],
                'direction' => $negotiated['direction'],
                'name_components' => $negotiated['name_components'],
                'pronouns' => $negotiated['pronouns'],
                'negotiated_locale' => $negotiated['negotiated_locale'],
                'match_quality' => $negotiated['match_quality'],
                'available_scripts' => $negotiated['available_scripts'],
            ]),
        ]);
    }

    /**
     * Standard OpenID Connect UserInfo Endpoint.
     *
     * Returns the context-minimized, content-negotiated profile for the active OAuth bearer token.
     */
    public function userInfo(Request $request): JsonResponse
    {
        $user = $request->user();

        // Resolve active persona linked to this token
        $persona = null;
        if (method_exists($user, 'token') && $user->token() && isset($user->token()->persona_id)) {
            $persona = Persona::find($user->token()->persona_id);
        }

        // Fallback to first persona owned by user
        if (! $persona) {
            $persona = $user->personas()->first();
        }

        if (! $persona) {
            return response()->json([
                'error' => 'invalid_token',
                'error_description' => 'No active persona profile associated with this identity.',
            ], 404);
        }

        $localeHeader = $request->header('Accept-Language', 'en-US');
        $negotiated = $persona->resolveNameForLocale($localeHeader);

        $hasToken = method_exists($user, 'token') && $user->token();
        $token = $hasToken ? $user->token() : null;
        $tokenScopes = [];
        if ($token) {
            if (isset($token->scopes) && is_array($token->scopes)) {
                $tokenScopes = $token->scopes;
            } elseif (isset($token->oauth_scopes) && is_array($token->oauth_scopes)) {
                $tokenScopes = $token->oauth_scopes;
            }
        }
        $hasExplicitScopes = ! empty($tokenScopes) && ! in_array('*', $tokenScopes);

        $canProfile = ! $hasExplicitScopes || $user->tokenCan('profile');
        $canEmail = ! $hasExplicitScopes || $user->tokenCan('email');
        $canPronouns = ! $hasExplicitScopes || $user->tokenCan('pronouns');
        $canAgeVerified = ! $hasExplicitScopes || $user->tokenCan('age_verified');
        $canAgeOver18 = ! $hasExplicitScopes || $user->tokenCan('age_over_18');
        $canLegalName = $user->tokenCan('legal_name'); // Strict: must be explicitly requested
        $canPseudonym = $user->tokenCan('pseudonym'); // Strict: must be explicitly requested

        $claims = [
            'sub' => (string) $persona->id,
            'identity_assurance_level' => ($persona->is_age_verified && $user->is_identity_verified) ? 'IAL2' : 'IAL1',
        ];

        if ($canProfile) {
            $claims['name'] = $negotiated['formatted_name'];
            $claims['given_name'] = $negotiated['name_components']['given_name'];
            $claims['family_name'] = $negotiated['name_components']['family_name'];
            $claims['preferred_username'] = $persona->username;
            $claims['picture'] = $persona->avatar_path;
            $claims['script'] = $negotiated['script'];
            $claims['direction'] = $negotiated['direction'];
            $claims['negotiated_locale'] = $negotiated['negotiated_locale'];
            $claims['available_scripts'] = $negotiated['available_scripts'];
        }

        if ($canEmail) {
            $claims['email'] = $persona->email_alias;
        }

        if ($canPronouns) {
            $claims['pronouns'] = $negotiated['pronouns'] ?? $persona->pronouns;
        }

        $userAge = method_exists($user, 'age') ? ($user->age() ?? 25) : 25;

        if ($canAgeVerified) {
            $claims['is_over_16'] = (bool) ($persona->is_age_verified && ($userAge >= 16));
        }

        if ($canAgeOver18) {
            $claims['is_over_18'] = (bool) ($persona->is_age_verified && $user->is_identity_verified && ($userAge >= 18));
        }

        // Process dynamic parametric age scopes: age_is_over_{N} or age_over_{N}
        foreach ($tokenScopes as $scope) {
            if (preg_match('/^age_(?:is_)?over_(\d+)$/', $scope, $matches)) {
                $threshold = (int) $matches[1];
                $isOver = (bool) ($persona->is_age_verified && $user->is_identity_verified && ($userAge >= $threshold));
                $claims[$scope] = $isOver;
                $claims["age_is_over_{$threshold}"] = $isOver;
            }
        }

        if ($canLegalName) {
            $claims['legal_name'] = $user->is_identity_verified ? ($persona->legal_name ?: $user->name) : null;
        }

        // Process dynamic custom claims matching granted scopes (e.g. shipping_address)
        if ($persona && ! empty($persona->custom_claims)) {
            foreach ($tokenScopes as $scope) {
                if (isset($persona->custom_claims[$scope])) {
                    $claims[$scope] = $persona->custom_claims[$scope];
                }
            }
        }

        if ($canPseudonym) {
            $clientId = ($hasToken && isset($user->token()->client_id))
                ? $user->token()->client_id
                : ($request->header('X-Client-ID') ?: 'client');
            $claims['pairwise_pseudonym'] = hash('sha256', $user->id.':'.$clientId.':'.$persona->id);
        }

        return response()->json($claims);
    }

    /**
     * Deterministic ICU Transliteration Endpoint across 10 world alphabets.
     */
    public function transliterate(Request $request, TransliterationService $transliterationService): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'given_name' => 'nullable|string|max:255',
            'family_name' => 'nullable|string|max:255',
        ]);

        $variants = $transliterationService->transliterateAll(
            $request->input('name'),
            $request->input('given_name'),
            $request->input('family_name')
        );

        return response()->json([
            'success' => true,
            'data' => $variants,
        ]);
    }

    /**
     * Update the specified persona in storage.
     *
     * @return JsonResponse|RedirectResponse
     */
    public function update(Request $request, Persona $persona)
    {
        // Verify ownership access to prevent BOLA (OWASP API1:2023)
        if ($persona->user_id !== $request->user()->id) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized action.',
                ], 403);
            }
            abort(403);
        }

        $validated = $request->validate([
            'persona_name' => 'sometimes|required|string|max:255',
            'username' => 'nullable|string|max:255',
            'email_alias' => 'nullable|email|max:255',
            'legal_name' => 'nullable|string|max:255',
            'preferred_name' => 'nullable|string|max:255',
            'family_name' => 'nullable|string|max:255',
            'given_name' => 'nullable|string|max:255',
            'gender_identity' => 'nullable|string|max:255',
            'cultural_ordering' => 'nullable|string|in:given_family,family_given',
            'localized_names' => 'nullable|array',
            'pronouns' => 'nullable|array',
            'primary_script' => 'nullable|string|max:10',
            'custom_claims' => 'nullable|array',
        ]);

        // Enforce verified legal name from ID if user is identity verified (disallowing tampering)
        if ($request->user()->is_identity_verified && ! empty($request->user()->name)) {
            $validated['legal_name'] = $request->user()->name;
        }

        $persona->update($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Persona updated successfully.',
                'data' => $persona,
            ]);
        }

        return redirect()->back();
    }

    /**
     * In-flight claim provisioning on an active persona.
     * Allows user to securely create or update a scope/claim on the go during OAuth consent.
     */
    public function addClaim(Request $request, Persona $persona): JsonResponse
    {
        // Enforce OWASP API1:2023 (BOLA) verification
        if ($persona->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.',
            ], 403);
        }

        $validated = $request->validate([
            'claim_key' => ['required', 'string', 'max:100', 'regex:/^[a-zA-Z0-9_\-]+$/'],
            'claim_value' => ['required'],
        ]);

        $persona->setCustomClaim($validated['claim_key'], $validated['claim_value']);
        $persona->save();

        return response()->json([
            'success' => true,
            'message' => "Claim '{$validated['claim_key']}' provisioned successfully on persona.",
            'data' => $persona->fresh(),
        ]);
    }

    /**
     * Remove the specified persona from database.
     *
     * @return JsonResponse|RedirectResponse
     */
    public function destroy(Request $request, Persona $persona)
    {
        // Verify ownership access to prevent BOLA (OWASP API1:2023)
        if ($persona->user_id !== $request->user()->id) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized action.',
                ], 403);
            }
            abort(403);
        }

        $persona->delete();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Persona deleted successfully.',
            ]);
        }

        return redirect()->back();
    }

    /**
     * Toggle the simulated identity verification flag for a persona.
     *
     * @return JsonResponse|RedirectResponse
     */
    public function toggleAgeVerification(Request $request, Persona $persona)
    {
        if ($persona->user_id !== $request->user()->id) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized action.',
                ], 403);
            }
            abort(403);
        }

        $persona->is_age_verified = ! $persona->is_age_verified;

        $user = $request->user();
        if ($persona->is_age_verified && $user && $user->is_identity_verified && ! empty($user->name)) {
            $persona->legal_name = $user->name;
        }

        $persona->save();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Age verification flag toggled.',
                'data' => [
                    'persona_id' => $persona->id,
                    'is_age_verified' => $persona->is_age_verified,
                    'legal_name' => $persona->legal_name,
                ],
            ]);
        }

        return redirect()->back();
    }

    /**
     * Upload an avatar image for a persona with cache-busting MD5 suffix.
     */
    public function uploadAvatar(Request $request, Persona $persona): JsonResponse
    {
        if ($persona->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.',
            ], 403);
        }

        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $file = $request->file('avatar');
        if (! $file) {
            return response()->json(['success' => false, 'message' => 'File missing.'], 400);
        }

        $hash = md5_file($file->getPathname()) ?: md5((string) time());
        $fileName = 'avatar_'.$persona->id.'_'.substr($hash, 0, 8).'.'.$file->getClientOriginalExtension();

        if ($persona->avatar_path) {
            $parsedPath = parse_url($persona->avatar_path, PHP_URL_PATH);
            $existingPath = str_replace(Storage::disk('public')->url(''), '', $parsedPath ?? $persona->avatar_path);
            if (! empty($existingPath)) {
                Storage::disk('public')->delete($existingPath);
            }
        }

        $path = $file->storeAs('avatars', $fileName, 'public');
        $url = Storage::disk('public')->url($path).'?v='.substr($hash, 0, 8);
        $persona->avatar_path = $url;
        $persona->save();

        return response()->json([
            'success' => true,
            'message' => 'Avatar updated successfully.',
            'data' => [
                'avatar_url' => $persona->avatar_path,
                'avatar_path' => $persona->avatar_path,
            ],
        ]);
    }
}
