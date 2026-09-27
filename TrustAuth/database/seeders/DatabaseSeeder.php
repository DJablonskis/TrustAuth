<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Laravel\Passport\Client;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with various edge cases for demonstration.
     */
    public function run(): void
    {
        // ---------------------------------------------------------
        // 1. Case: Admin User
        // ---------------------------------------------------------
        $admin = User::factory()->create([
            'name' => 'John Smith',
            'email' => 'admin@trustauth.dev',
            'password' => Hash::make('password'),
            'is_identity_verified' => true,
            'verification_type' => 'standard',
            'date_of_birth' => '1980-01-01',
        ]);
        
        $admin->personas()->create([
            'persona_name' => 'Admin Persona',
            'username' => 'sys_admin',
            'email_alias' => 'admin.sys@trustauth.dev',
            'legal_name' => 'John Smith',
            'given_name' => 'John',
            'family_name' => 'Smith',
            'is_age_verified' => true,
        ]);

        // ---------------------------------------------------------
        // 2. Case: Standard Verified User (Image & ID Approved, Over Age)
        // ---------------------------------------------------------
        $verifiedUser = User::factory()->create([
            'name' => 'Jane Verified',
            'email' => 'verified@example.com',
            'password' => Hash::make('password'),
            'is_identity_verified' => true,
            'verification_type' => 'standard',
            'date_of_birth' => '1995-05-15', // 30+ years old
        ]);

        $verifiedUser->personas()->createMany([
            [
                'persona_name' => 'Professional Identity',
                'username' => 'jane_corp',
                'email_alias' => 'jane.doe@company.com',
                'legal_name' => 'Jane Doe',
                'given_name' => 'Jane',
                'family_name' => 'Doe',
                'gender_identity' => 'female',
                'cultural_ordering' => 'given_family',
                'is_age_verified' => true,
            ],
            [
                'persona_name' => 'E-commerce Persona',
                'username' => 'shopper_jane',
                'email_alias' => 'jane.shopper@market.com',
                'given_name' => 'Jane',
                'family_name' => 'Shopper',
                'is_age_verified' => true,
                'custom_claims' => [
                    'shipping_address' => '123 Market St, London, UK'
                ]
            ],
            [
                'persona_name' => 'Gaming Pseudonym',
                'username' => 'night_owl99',
                'email_alias' => 'nightowl@gaming.net',
                'given_name' => 'Night',
                'family_name' => 'Owl',
                'is_age_verified' => false,
            ]
        ]);

        // ---------------------------------------------------------
        // 3. Case: Under Age User (Photo Only Approved, Under 18)
        // ---------------------------------------------------------
        $underageUser = User::factory()->create([
            'name' => 'Timmy Underage',
            'email' => 'underage@example.com',
            'password' => Hash::make('password'),
            'is_identity_verified' => true,
            'verification_type' => 'photo_only',
            'estimated_age' => 15,
            'date_of_birth' => null, // Photo-only verification doesn't extract DOB
        ]);

        $underageUser->personas()->create([
            'persona_name' => 'School Persona',
            'username' => 'timmy_student',
            'email_alias' => 'timmy@school.edu',
            'given_name' => 'Timmy',
            'family_name' => 'Student',
            'is_age_verified' => true, // verified identity, but User age is < 18
        ]);

        // ---------------------------------------------------------
        // 4. Case: Unverified User (Missing Field Requests / In-Flight Provisioning)
        // ---------------------------------------------------------
        $unverifiedUser = User::factory()->create([
            'name' => 'Anonymous Ghost',
            'email' => 'anonymous@example.com',
            'password' => Hash::make('password'),
            'is_identity_verified' => false,
            'verification_type' => null,
            'date_of_birth' => null,
        ]);

        $unverifiedUser->personas()->create([
            'persona_name' => 'Crypto Trader',
            'username' => 'satoshis_ghost',
            'email_alias' => 'trader@crypto.net',
            'given_name' => 'Crypto',
            'family_name' => 'Trader',
            'is_age_verified' => false,
            // NO shipping_address so it can trigger the in-flight provisioning UI
        ]);

        // ---------------------------------------------------------
        // 5. OAuth Clients
        // ---------------------------------------------------------
        Client::factory()->create([
            'id' => '9cc42f60-d621-4f9e-bd9d-0985fe6a12b6',
            'name' => 'Mock Partner App (Standard)',
            'secret' => 'mock-client-secret-12345',
            'redirect_uris' => ['http://localhost:3000/callback'],
            'grant_types' => ['authorization_code', 'refresh_token'],
            'revoked' => false,
        ]);
        
        Client::factory()->create([
            'id' => '8bb31e50-c510-3e8d-ac8c-0985fe6a11a5',
            'name' => 'Strict Partner App (Age & Shipping)',
            'secret' => 'strict-client-secret-98765',
            'redirect_uris' => ['http://localhost:3000/callback'],
            'grant_types' => ['authorization_code', 'refresh_token'],
            'revoked' => false,
        ]);
    }
}
