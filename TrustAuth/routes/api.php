<?php

use App\Http\Controllers\GovernanceController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Retrieve authenticated user data
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

// Context-Aware Identity API routes segment (v1)
// Protected by Passport API bearer token authorization (auth:api)
Route::middleware('auth:api')->prefix('v1')->group(function () {

    // Standard REST resource mapping for Persona management
    Route::apiResource('personas', PersonaController::class);

    // Route to toggle simulated IAL2 document/age verification status
    Route::post('personas/{persona}/verify-age', [PersonaController::class, 'toggleAgeVerification']);

    // Route to upload persona avatar images with cache-busting MD5 suffixes
    Route::post('personas/{persona}/avatar', [PersonaController::class, 'uploadAvatar']);

    // Route to toggle simulated user-level identity verification status (IAL2)
    Route::post('user/verify-identity', [VerificationController::class, 'simulateIal2']);

    // Route to list connected third-party integrations and outbound GDPR webhook logs
    Route::get('governance', [GovernanceController::class, 'index']);

    // Route to revoke client integration access and dispatchRight to Erasure webhooks
    Route::post('governance/revoke', [GovernanceController::class, 'revokeAndErase']);

    // Standard OpenID Connect UserInfo endpoint delivering context-minimized, content-negotiated profile
    Route::get('userinfo', [PersonaController::class, 'userInfo']);

    // ICU Transliterator endpoint across 10 world alphabets
    Route::post('personas/transliterate', [PersonaController::class, 'transliterate']);
});

// Standard OpenID Connect UserInfo alias at root /api/userinfo
Route::get('/userinfo', [PersonaController::class, 'userInfo'])->middleware('auth:api');
