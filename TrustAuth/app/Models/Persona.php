<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Representation of a user's Persona/digital identity.
 *
 * Each user can manage multiple personas with differing levels of identity
 * assurance, customized profile information, structured pronouns, and
 * multi-script localized representations supporting the world's 10 major writing systems.
 *
 * @property int $id
 * @property int $user_id
 * @property string $persona_name
 * @property string|null $username
 * @property string|null $email_alias
 * @property string|null $avatar_path
 * @property string|null $legal_name
 * @property string|null $preferred_name
 * @property string|null $family_name
 * @property string|null $given_name
 * @property string|null $gender_identity
 * @property string $cultural_ordering
 * @property array<string, mixed>|null $localized_names
 * @property array<string, mixed>|null $pronouns
 * @property string $primary_script
 * @property bool $is_age_verified
 * @property-read User $user
 */
class Persona extends Model
{
    protected $fillable = [
        'user_id',
        'persona_name',
        'username',
        'email_alias',
        'avatar_path',
        'legal_name',
        'preferred_name',
        'family_name',
        'given_name',
        'gender_identity',
        'cultural_ordering',
        'localized_names',
        'pronouns',
        'primary_script',
        'custom_claims',
        'is_age_verified',
    ];

    protected $casts = [
        'is_age_verified' => 'boolean',
        'localized_names' => 'array',
        'pronouns' => 'array',
        'custom_claims' => 'array',
    ];

    /**
     * Attach or update a dynamic claim on this persona.
     */
    public function setCustomClaim(string $key, mixed $value): static
    {
        $claims = $this->custom_claims ?? [];
        $claims[$key] = $value;
        $this->custom_claims = $claims;

        return $this;
    }

    /**
     * Retrieve a dynamic custom claim by key.
     */
    public function getCustomClaim(string $key): mixed
    {
        return $this->custom_claims[$key] ?? null;
    }

    /**
     * @return BelongsTo<User, Persona>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<WebhookLog, Persona>
     */
    public function webhookLogs(): HasMany
    {
        return $this->hasMany(WebhookLog::class);
    }

    /**
     * Resolves the culturally and linguistically appropriate name representation
     * based on incoming RFC 9110 HTTP Accept-Language headers.
     *
     * Supports the 10 major global writing systems:
     * Latin, Arabic, Devanagari, Bengali, Cyrillic, Kana, Hangul, Hebrew, Greek, Georgian.
     *
     * @return array<string, mixed>
     */
    public function resolveNameForLocale(?string $acceptLanguageHeader = null): array
    {
        $header = $acceptLanguageHeader ?? 'en-US';
        $preferences = $this->parseAcceptLanguage($header);
        $localized = $this->localized_names ?? [];

        // Language-to-script mapping
        $langScriptMap = [
            'ar' => 'Arab', 'ur' => 'Arab', 'fa' => 'Arab', 'ps' => 'Arab',
            'hi' => 'Deva', 'mr' => 'Deva', 'ne' => 'Deva', 'sa' => 'Deva',
            'bn' => 'Beng', 'as' => 'Beng',
            'ru' => 'Cyrl', 'uk' => 'Cyrl', 'bg' => 'Cyrl', 'sr' => 'Cyrl', 'be' => 'Cyrl',
            'ja' => 'Kana',
            'ko' => 'Hang',
            'he' => 'Hebr', 'yi' => 'Hebr',
            'el' => 'Grek',
            'ka' => 'Geor',
            'lt' => 'Latn', 'en' => 'Latn', 'es' => 'Latn', 'fr' => 'Latn', 'de' => 'Latn', 'pt' => 'Latn',
        ];

        // Script aliases mapping (ISO code, slug, English name, and language codes)
        $scriptAliases = [
            'Grek' => ['Grek', 'grek', 'greek', 'el'],
            'Arab' => ['Arab', 'arab', 'arabic', 'ar', 'ur', 'fa', 'ps'],
            'Cyrl' => ['Cyrl', 'cyrl', 'cyrillic', 'ru', 'uk', 'bg', 'sr', 'be'],
            'Deva' => ['Deva', 'deva', 'devanagari', 'hi', 'mr', 'ne', 'sa'],
            'Beng' => ['Beng', 'beng', 'bengali', 'bn', 'as'],
            'Kana' => ['Kana', 'kana', 'katakana', 'hiragana', 'ja', 'japanese'],
            'Hang' => ['Hang', 'hang', 'hangul', 'ko', 'korean'],
            'Hebr' => ['Hebr', 'hebr', 'hebrew', 'he', 'yi'],
            'Geor' => ['Geor', 'geor', 'georgian', 'ka'],
            'Latn' => ['Latn', 'latn', 'latin', 'en', 'es', 'pt', 'lt', 'fr', 'de', 'it'],
        ];

        // 1. Try matching preferred languages in order of client quality weight (q)
        foreach ($preferences as $lang) {
            $langCode = strtolower(explode('-', $lang)[0]);

            // Direct key match in localized_names (case-insensitive)
            foreach ($localized as $key => $var) {
                if (strtolower((string) $key) === $langCode) {
                    return $this->buildLocalizedPayload($var, $lang, 'exact_language', $langCode);
                }
            }

            // Script mapping match
            if (isset($langScriptMap[$langCode])) {
                $scriptCode = $langScriptMap[$langCode];
                $aliases = $scriptAliases[$scriptCode] ?? [$scriptCode];

                foreach ($aliases as $alias) {
                    foreach ($localized as $key => $var) {
                        if (strtolower((string) $key) === strtolower($alias)) {
                            return $this->buildLocalizedPayload($var, $lang, 'script_mapping', $scriptCode);
                        }
                    }
                }
            }
        }

        // 2. Check if Hungarian or Chinese ordering is requested by locale
        $isEastern = false;
        foreach ($preferences as $lang) {
            if (str_starts_with(strtolower($lang), 'hu') || str_starts_with(strtolower($lang), 'zh')) {
                $isEastern = true;
                break;
            }
        }

        // 3. Fallback to default primary Latin representation
        $ordering = $this->cultural_ordering ?? 'given_family';
        if ($isEastern) {
            $ordering = 'family_given';
        }

        if ($ordering === 'family_given') {
            $formatted = trim(($this->family_name ?? '').' '.($this->given_name ?? ''));
        } else {
            $formatted = trim(($this->given_name ?? '').' '.($this->family_name ?? ''));
        }

        if (empty($formatted)) {
            $formatted = $this->preferred_name ?: ($this->legal_name ?: ($this->username ?? 'Anonymous'));
        }

        return [
            'formatted_name' => $formatted,
            'script' => strtolower($this->primary_script ?: 'latin'),
            'script_name' => 'Latin',
            'script_type' => 'Alphabet',
            'direction' => 'ltr',
            'name_components' => [
                'given_name' => $this->given_name,
                'family_name' => $this->family_name,
                'patronymic' => null,
                'phonetic_name' => null,
                'ordering' => $ordering,
            ],
            'pronouns' => $this->pronouns ?? [
                'subject' => 'they',
                'object' => 'them',
                'possessive' => 'theirs',
                'display' => 'they/them',
            ],
            'negotiated_locale' => $preferences[0] ?? 'en-US',
            'match_quality' => 'fallback_primary',
            'available_scripts' => array_keys($localized),
        ];
    }

    /**
     * Build the normalized return payload for a matched localized variant.
     *
     * @param  array<string, mixed>  $variant
     * @return array<string, mixed>
     */
    protected function buildLocalizedPayload(array $variant, string $locale, string $matchQuality, ?string $resolvedScript = null): array
    {
        $ordering = $variant['ordering'] ?? ($this->cultural_ordering ?? 'given_family');
        $given = $variant['given_name'] ?? '';
        $family = $variant['family_name'] ?? '';
        $patronymic = $variant['patronymic'] ?? null;

        $formatted = $variant['formatted_name'] ?? ($variant['full_name'] ?? '');
        if (empty($formatted)) {
            if ($ordering === 'family_given') {
                $formatted = trim($family.' '.$given.($patronymic ? ' '.$patronymic : ''));
            } else {
                $formatted = trim($given.($patronymic ? ' '.$patronymic : '').' '.$family);
            }
        }

        $script = $variant['script'] ?? ($resolvedScript ?? 'latin');
        $scriptLower = strtolower($script);
        $isoToSlug = [
            'latn' => 'latin',
            'arab' => 'arabic',
            'deva' => 'devanagari',
            'beng' => 'bengali',
            'cyrl' => 'cyrillic',
            'kana' => 'kana',
            'hang' => 'hangul',
            'hebr' => 'hebrew',
            'grek' => 'greek',
            'geor' => 'georgian',
        ];
        $canonicalScript = $isoToSlug[$scriptLower] ?? $scriptLower;
        $direction = $variant['direction'] ?? (in_array($canonicalScript, ['arab', 'arabic', 'hebr', 'hebrew']) ? 'rtl' : 'ltr');

        return [
            'formatted_name' => $formatted,
            'script' => $canonicalScript,
            'script_name' => $variant['script_name'] ?? ucfirst($canonicalScript),
            'script_type' => $variant['script_type'] ?? 'Alphabet',
            'direction' => $direction,
            'name_components' => [
                'given_name' => $given ?: $this->given_name,
                'family_name' => $family ?: $this->family_name,
                'patronymic' => $patronymic,
                'phonetic_name' => $variant['phonetic_name'] ?? null,
                'ordering' => $ordering,
            ],
            'pronouns' => $this->pronouns ?? [
                'subject' => 'they',
                'object' => 'them',
                'possessive' => 'theirs',
                'display' => 'they/them',
            ],
            'negotiated_locale' => $locale,
            'match_quality' => $matchQuality,
            'available_scripts' => array_keys($this->localized_names ?? []),
        ];
    }

    /**
     * Parses RFC 9110 Accept-Language header into ordered array of language tags by weight.
     *
     * @return array<int, string>
     */
    protected function parseAcceptLanguage(string $header): array
    {
        $languages = [];
        $parts = explode(',', $header);

        foreach ($parts as $part) {
            $part = trim($part);
            if (empty($part)) {
                continue;
            }

            $subparts = explode(';q=', $part);
            $lang = trim($subparts[0]);
            $quality = isset($subparts[1]) ? (float) trim($subparts[1]) : 1.0;

            if ($lang !== '*') {
                $languages[$lang] = $quality;
            }
        }

        arsort($languages);

        return array_keys($languages);
    }
}
