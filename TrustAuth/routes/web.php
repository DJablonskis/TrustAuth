<?php

use App\Http\Controllers\AdminGovernanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomApproveAuthorizationController;
use App\Http\Controllers\CustomAuthorizationController;
use App\Http\Controllers\GovernanceController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\VerificationController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Root entrypoint rendering the Inertia landing page
Route::inertia('/', 'welcome')->name('home');

// Interactive Developer Documentation & API Reference Portal
Route::inertia('/docs', 'docs')->name('docs');

// Authentication routes (Guest)
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login']);
    Route::get('register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('register', [AuthController::class, 'register']);
});

// Logout route (Auth)
Route::post('logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Administrative test login route to bypass auth configurations in local demos
Route::get('login-as-test', function () {
    if (!app()->environment('local')) {
        abort(403, 'This route is only available in the development environment.');
    }

    Auth::login(User::first() ?: User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]));

    return redirect()->route('dashboard');
})->name('login-as-test');

// Custom OAuth Intercept Redirect Endpoints (Overriding Passport defaults)
// Protected by web sessions and auth middleware to force initial login
Route::middleware(['web', 'auth'])->group(function () {

    // Renders the context-aware consent panel carousel
    Route::get('oauth/authorize', [CustomAuthorizationController::class, 'authorize']);

    // Processes persona selection consent submissions
    Route::post('oauth/authorize', [CustomApproveAuthorizationController::class, 'approve']);

    // Identity verification endpoints (NIST SP 800-63-4 IAL2)
    Route::get('verification/provider-status', [VerificationController::class, 'getProviderStatus'])->name('verification.provider-status');
    Route::post('verification/initiate', [VerificationController::class, 'initiateVerification'])->name('verification.initiate');
    Route::post('verification/simulate-ial2', [VerificationController::class, 'simulateIal2'])->name('verification.simulate-ial2');

    // Retrieve connected Passport clients and client erasure logs
    Route::get('governance', [GovernanceController::class, 'index'])->name('governance.index');

    // Revoke active client tokens and auth codes and trigger GDPR erasure webhook
    Route::post('governance/revoke', [GovernanceController::class, 'revokeAndErase'])->name('governance.revoke');

    // Super Admin Partner & Webhook Abuse Management
    Route::get('admin/governance', [AdminGovernanceController::class, 'index'])->name('admin.governance.index');
    Route::post('admin/governance/clients/{client}/toggle-status', [AdminGovernanceController::class, 'toggleClientStatus'])->name('admin.governance.client.toggle');
    Route::post('admin/governance/users/{user}/toggle-ial', [AdminGovernanceController::class, 'toggleUserIal'])->name('admin.governance.user.toggle-ial');
    Route::post('admin/governance/erasures/{erasure}/retry', [AdminGovernanceController::class, 'retryErasureWebhook'])->name('admin.governance.erasure.retry');

    // Render the front-end personas dashboard (Grouped Persona View)
    Route::get('dashboard', [PersonaController::class, 'index'])->name('dashboard');

    // Web routes for Persona management
    Route::post('personas', [PersonaController::class, 'store'])->name('personas.store');
    Route::put('personas/{persona}', [PersonaController::class, 'update'])->name('personas.update');
    Route::post('personas/{persona}/claims', [PersonaController::class, 'addClaim'])->name('personas.claims.add');
    Route::delete('personas/{persona}', [PersonaController::class, 'destroy'])->name('personas.destroy');
    Route::post('personas/{persona}/verify-age', [PersonaController::class, 'toggleAgeVerification'])->name('personas.verify-age');
    Route::post('personas/transliterate', [PersonaController::class, 'transliterate'])->name('personas.transliterate');
});

// Inbound Didit Verification Webhook (Publicly accessible, verified via HMAC signature)
Route::post('webhooks/didit', [VerificationController::class, 'handleDiditWebhook'])->name('webhooks.didit');
