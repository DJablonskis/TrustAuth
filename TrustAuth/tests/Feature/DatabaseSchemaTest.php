<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * Feature tests for database schema validation.
 *
 * Verifies that fields and table structures added during migrations
 * exist as expected.
 */
class DatabaseSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_personas_table_has_new_columns(): void
    {
        $this->assertTrue(Schema::hasColumn('personas', 'avatar_path'), 'avatar_path column is missing from personas table');
        $this->assertTrue(Schema::hasColumn('personas', 'is_age_verified'), 'is_age_verified column is missing from personas table');
    }

    public function test_client_erasures_table_exists_with_required_columns(): void
    {
        $this->assertTrue(Schema::hasTable('client_erasures'), 'client_erasures table does not exist');

        $columns = [
            'id',
            'user_id',
            'client_id',
            'client_name',
            'status',
            'response_code',
            'attempts',
            'last_attempt_at',
            'created_at',
            'updated_at',
        ];

        foreach ($columns as $column) {
            $this->assertTrue(Schema::hasColumn('client_erasures', $column), "Column {$column} is missing from client_erasures table");
        }
    }
}
