<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Passport\Bridge\User as BridgeUser;
use Laravel\Passport\Http\Controllers\ApproveAuthorizationController;
use Psr\Http\Message\ResponseInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Extends default Passport ApproveAuthorizationController to inject
 * the selected user Persona ID context prior to minting the OAuth Authorization Code.
 */
class CustomApproveAuthorizationController extends ApproveAuthorizationController
{
    /**
     * Approve the authorization request.
     * Overridden to validate persona ownership and override the subject identifier.
     */
    public function approve(Request $request, ResponseInterface $psrResponse): Response
    {
        // Enforce validations: requires persona selection input parameters
        $request->validate([
            'persona_id' => 'required|integer',
        ]);

        // Secure context: Ensure the persona belongs strictly to the authenticated user
        $persona = $request->user()->personas()->findOrFail($request->input('persona_id'));

        // Temporarily store selected persona context inside the session for bridge usage
        session()->put('selected_persona_id', $persona->id);

        // Fetch serialization object from user session storage
        $authRequest = $this->getAuthRequestFromSession($request);

        // Extract requested scopes
        $scopes = collect($authRequest->getScopes())->map(
            fn ($scope) => $scope->getIdentifier()
        );

        $user = $request->user();

        // Enforce verified age scope validation limits
        if ($scopes->contains('age_verified')) {
            if (! $user->is_identity_verified || ! $persona->is_age_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Age verification assertion failed. Master profile must be verified and persona disclosure enabled.',
                ], 403);
            }
        }

        // Enforce age_over_18 validation
        if ($scopes->contains('age_over_18')) {
            $userAge = method_exists($user, 'age') ? ($user->age() ?? 0) : 0;
            if (! $user->is_identity_verified || ! $persona->is_age_verified || $userAge < 18) {
                return response()->json([
                    'success' => false,
                    'message' => 'Age over 18 requirement not satisfied.',
                ], 403);
            }
        }

        // Enforce dynamic parametric age gates: age_is_over_{N} or age_over_{N}
        foreach ($scopes as $scope) {
            if (preg_match('/^age_(?:is_)?over_(\d+)$/', $scope, $matches)) {
                $threshold = (int) $matches[1];
                $userAge = method_exists($user, 'age') ? ($user->age() ?? 0) : 0;
                if (! $user->is_identity_verified || ! $persona->is_age_verified || $userAge < $threshold) {
                    return response()->json([
                        'success' => false,
                        'message' => "Age requirement ({$threshold}+) not satisfied.",
                    ], 403);
                }
            }
        }

        // Enforce custom claim scopes fulfillment on the chosen persona (e.g. shipping_address)
        $standardScopes = ['openid', 'profile', 'email', 'phone', 'address', 'age_verified', 'age_over_18', 'legal_name', 'pseudonym', 'pronouns'];
        foreach ($scopes as $scope) {
            if (! in_array($scope, $standardScopes) && ! preg_match('/^age_(?:is_)?over_\d+$/', $scope)) {
                $customClaims = $persona->custom_claims ?? [];
                if (empty($customClaims[$scope])) {
                    return response()->json([
                        'success' => false,
                        'message' => "Selected persona is missing the requested claim for scope: {$scope}. Please configure it on the persona before consenting.",
                    ], 422);
                }
            }
        }

        // Override the user identifier within the authorization code request to Persona ID
        $authRequest->setUser(new BridgeUser($persona->id));

        // Mark authorization approved
        $authRequest->setAuthorizationApproved(true);

        // Complete the authorization code payload generation
        return $this->withErrorHandling(fn () => $this->convertResponse(
            $this->server->completeAuthorizationRequest($authRequest, $psrResponse)
        ), $authRequest->getGrantTypeId() === 'implicit');
    }
}
