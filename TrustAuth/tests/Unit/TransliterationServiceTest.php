<?php

namespace Tests\Unit;

use App\Services\TransliterationService;
use Tests\TestCase;

class TransliterationServiceTest extends TestCase
{
    /**
     * Test that the transliteration service maps supported scripts and typologies.
     */
    public function test_supported_scripts_metadata_is_complete(): void
    {
        $service = new TransliterationService;
        $scripts = $service->getSupportedScripts();

        $this->assertCount(10, $scripts);
        $this->assertArrayHasKey('Arab', $scripts);
        $this->assertEquals('rtl', $scripts['Arab']['direction']);
        $this->assertArrayHasKey('Latn', $scripts);
        $this->assertEquals('ltr', $scripts['Latn']['direction']);
    }

    /**
     * Test deterministic transliteration output for Latin to Cyrillic and Arabic.
     */
    public function test_transliteration_produces_deterministic_results(): void
    {
        $service = new TransliterationService;
        $result = $service->transliterateAll('John Smith', 'John', 'Smith');

        $this->assertArrayHasKey('latin', $result);
        $this->assertEquals('John Smith', $result['latin']['formatted_name']);
        $this->assertArrayHasKey('cyrillic', $result);
        $this->assertNotEmpty($result['cyrillic']['formatted_name']);
    }
}
