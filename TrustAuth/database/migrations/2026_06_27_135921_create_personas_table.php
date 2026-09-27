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
        Schema::create('personas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('persona_name');
            $table->string('username')->nullable();
            $table->string('email_alias')->nullable();
            $table->string('legal_name')->nullable();
            $table->string('preferred_name')->nullable();
            $table->string('family_name')->nullable();
            $table->string('given_name')->nullable();
            $table->string('gender_identity')->nullable();
            $table->string('cultural_ordering')->default('given_family');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};
