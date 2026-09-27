<?php

namespace App\Services;

use Transliterator;

/**
 * Service for deterministic server-side transliteration across 10 major world writing systems.
 *
 * Utilizes native PHP ICU (International Components for Unicode) Transliterator (ext-intl)
 * to convert names deterministically without external third-party service calls or PII leakage,
 * directly fulfilling GDPR Article 5(1)(c) data minimization.
 */
class TransliterationService
{
    /**
     * Map of supported scripts with ISO 15924 codes, typologies, directions, and transliteration rules.
     *
     * @var array<string, array<string, mixed>>
     */
    protected array $scripts = [
        'Latn' => [
            'code' => 'Latn',
            'name' => 'Latin',
            'script_type' => 'Alphabet',
            'direction' => 'ltr',
            'primary_languages' => ['en', 'es', 'pt', 'lt', 'fr', 'de', 'it'],
            'transliterator_rule' => null, // Source is Latin
            'sample_languages' => 'English, Spanish, Portuguese, Lithuanian',
            'estimated_users' => '~4.9+ billion',
        ],
        'Arab' => [
            'code' => 'Arab',
            'name' => 'Arabic',
            'script_type' => 'Abjad / Alphabet',
            'direction' => 'rtl',
            'primary_languages' => ['ar', 'ur', 'fa', 'ps'],
            'transliterator_rule' => 'Any-Arabic',
            'sample_languages' => 'Arabic, Urdu, Persian, Pashto',
            'estimated_users' => '~660–830 million',
        ],
        'Deva' => [
            'code' => 'Deva',
            'name' => 'Devanagari',
            'script_type' => 'Abugida',
            'direction' => 'ltr',
            'primary_languages' => ['hi', 'mr', 'ne', 'sa'],
            'transliterator_rule' => 'Any-Devanagari',
            'sample_languages' => 'Hindi, Marathi, Nepali, Sanskrit',
            'estimated_users' => '~480–610 million',
        ],
        'Beng' => [
            'code' => 'Beng',
            'name' => 'Bengali-Assamese',
            'script_type' => 'Abugida',
            'direction' => 'ltr',
            'primary_languages' => ['bn', 'as'],
            'transliterator_rule' => 'Any-Bengali',
            'sample_languages' => 'Bengali, Assamese',
            'estimated_users' => '~300 million',
        ],
        'Cyrl' => [
            'code' => 'Cyrl',
            'name' => 'Cyrillic',
            'script_type' => 'Alphabet',
            'direction' => 'ltr',
            'primary_languages' => ['ru', 'uk', 'bg', 'sr', 'be'],
            'transliterator_rule' => 'Any-Cyrillic',
            'sample_languages' => 'Russian, Ukrainian, Bulgarian, Serbian',
            'estimated_users' => '~250–350 million',
        ],
        'Kana' => [
            'code' => 'Kana',
            'name' => 'Kana (Katakana/Hiragana)',
            'script_type' => 'Syllabary',
            'direction' => 'ltr',
            'primary_languages' => ['ja'],
            'transliterator_rule' => 'Any-Katakana',
            'sample_languages' => 'Japanese',
            'estimated_users' => '~120–125 million',
        ],
        'Hang' => [
            'code' => 'Hang',
            'name' => 'Hangul',
            'script_type' => 'Featural Alphabet',
            'direction' => 'ltr',
            'primary_languages' => ['ko'],
            'transliterator_rule' => 'Any-Hangul',
            'sample_languages' => 'Korean',
            'estimated_users' => '~80 million',
        ],
        'Hebr' => [
            'code' => 'Hebr',
            'name' => 'Hebrew',
            'script_type' => 'Abjad',
            'direction' => 'rtl',
            'primary_languages' => ['he', 'yi'],
            'transliterator_rule' => 'Any-Hebrew',
            'sample_languages' => 'Hebrew, Yiddish',
            'estimated_users' => '~9–14 million',
        ],
        'Grek' => [
            'code' => 'Grek',
            'name' => 'Greek',
            'script_type' => 'Alphabet',
            'direction' => 'ltr',
            'primary_languages' => ['el'],
            'transliterator_rule' => 'Any-Greek',
            'sample_languages' => 'Greek',
            'estimated_users' => '~11–13 million',
        ],
        'Geor' => [
            'code' => 'Geor',
            'name' => 'Georgian (Mkhedruli)',
            'script_type' => 'Alphabet',
            'direction' => 'ltr',
            'primary_languages' => ['ka'],
            'transliterator_rule' => 'Any-Georgian',
            'sample_languages' => 'Georgian',
            'estimated_users' => '~4–4.5 million',
        ],
    ];

    /**
     * Transliterate a name across all 10 supported world writing systems.
     *
     * @return array<string, array<string, mixed>>
     */
    public function transliterateAll(string $fullName, ?string $givenName = null, ?string $familyName = null): array
    {
        $fullName = trim($fullName);
        $results = [];

        $slugMap = [
            'Latn' => 'latin',
            'Arab' => 'arabic',
            'Deva' => 'devanagari',
            'Beng' => 'bengali',
            'Cyrl' => 'cyrillic',
            'Kana' => 'kana',
            'Hang' => 'hangul',
            'Hebr' => 'hebrew',
            'Grek' => 'greek',
            'Geor' => 'georgian',
        ];

        foreach ($this->scripts as $code => $meta) {
            $slug = $slugMap[$code] ?? strtolower($code);

            if ($code === 'Latn') {
                $entry = [
                    'script' => $code,
                    'slug' => $slug,
                    'script_name' => $meta['name'],
                    'script_type' => $meta['script_type'],
                    'direction' => $meta['direction'],
                    'full_name' => $fullName,
                    'formatted_name' => $fullName,
                    'given_name' => $givenName ?? $fullName,
                    'family_name' => $familyName ?? '',
                    'phonetic_name' => null,
                    'primary_languages' => $meta['primary_languages'],
                ];

                $results[$code] = $entry;
                $results[$slug] = $entry;

                continue;
            }

            $transliterator = null;
            if ($meta['transliterator_rule'] && class_exists('Transliterator')) {
                $transliterator = Transliterator::create($meta['transliterator_rule'])
                    ?? Transliterator::create('Latin-'.$meta['name']);
            }

            $transFull = $transliterator ? $transliterator->transliterate($fullName) : $fullName;
            $transGiven = ($transliterator && $givenName) ? $transliterator->transliterate($givenName) : $transFull;
            $transFamily = ($transliterator && $familyName) ? $transliterator->transliterate($familyName) : '';

            // Clean up any untransliterated Latin artifacts in Georgian if needed
            if ($code === 'Geor' && $transliterator) {
                $cleaned = str_replace(['y', 'Y'], ['i', 'I'], $fullName);
                $transFull = $transliterator->transliterate($cleaned);
                $transGiven = $givenName ? $transliterator->transliterate(str_replace(['y', 'Y'], ['i', 'I'], $givenName)) : $transFull;
                $transFamily = $familyName ? $transliterator->transliterate(str_replace(['y', 'Y'], ['i', 'I'], $familyName)) : '';
            }

            $entry = [
                'script' => $code,
                'slug' => $slug,
                'script_name' => $meta['name'],
                'script_type' => $meta['script_type'],
                'direction' => $meta['direction'],
                'full_name' => $transFull,
                'formatted_name' => $transFull,
                'given_name' => $transGiven,
                'family_name' => $transFamily,
                'phonetic_name' => $code === 'Kana' ? $transFull : null,
                'primary_languages' => $meta['primary_languages'],
            ];

            $results[$code] = $entry;
            $results[$slug] = $entry;
        }

        return $results;
    }

    /**
     * Get the supported script definitions.
     *
     * @return array<string, array<string, mixed>>
     */
    public function getSupportedScripts(): array
    {
        return $this->scripts;
    }
}
