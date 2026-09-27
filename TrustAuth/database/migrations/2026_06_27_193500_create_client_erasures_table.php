<?php

/**
 * Migration to create the client_erasures table.
 *
 * This table tracks erasure requests forwarded to third-party clients,
 * providing indices on client_id and status to optimize lookups.
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
        Schema::create('client_erasures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('client_id')->index();
            $table->string('client_name');
            $table->string('status')->index();
            $table->integer('response_code')->nullable();
            $table->integer('attempts')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_erasures');
    }
};
