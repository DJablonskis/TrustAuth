<?php

/**
 * Migration to update the personas table.
 *
 * Adds the avatar_path and is_age_verified columns, with an index on
 * is_age_verified to optimize query lookups for age verification status.
 */

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
        Schema::table('personas', function (Blueprint $table) {
            $table->string('avatar_path')->nullable();
            $table->boolean('is_age_verified')->default(false)->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personas', function (Blueprint $table) {
            $table->dropIndex(['is_age_verified']);
            $table->dropColumn(['avatar_path', 'is_age_verified']);
        });
    }
};
