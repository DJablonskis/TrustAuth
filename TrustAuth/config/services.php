<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // GDPR Article 17 Data Erasure Webhook Configuration
    'gdpr' => [
        'webhook_url' => env('GDPR_WEBHOOK_URL', 'http://localhost:3000/gdpr/erase'),
        'webhook_secret' => env('GDPR_WEBHOOK_SECRET', 'mock-client-secret-12345'),
    ],

    // Didit Commercial Identity Verification Service (NIST SP 800-63-4 IAL2)
    'didit' => [
        'api_key' => env('DIDIT_API_KEY', ''),
        'workflow_id' => env('DIDIT_WORKFLOW_ID', null),
        'photo_workflow_id' => env('DIDIT_PHOTO_WORKFLOW_ID', 'f98fe9ff-08bf-4a61-968d-3b1a2badc5e2'),
        'webhook_secret' => env('DIDIT_WEBHOOK_SECRET', ''),
        'api_base_url' => env('DIDIT_API_BASE_URL', 'https://verification.didit.me/v3'),
    ],

];
