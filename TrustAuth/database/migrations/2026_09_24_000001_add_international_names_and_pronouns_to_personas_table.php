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
        Schema::table('personas', function (Blueprint $table) {
            $table->json('localized_names')->nullable()->after('cultural_ordering');
            $table->json('pronouns')->nullable()->after('localized_names');
            $table->string('primary_script', 10)->default('Latn')->after('pronouns');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personas', function (Blueprint $table) {
            $table->dropColumn(['localized_names', 'pronouns', 'primary_script']);
        });
    }
};
