<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('verification_type')->nullable()->after('is_identity_verified'); // 'photo_only' or 'standard'
            $table->integer('estimated_age')->nullable()->after('verification_type'); // Conservative lower bound age (e.g. estimate - 3)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['verification_type', 'estimated_age']);
        });
    }
};
