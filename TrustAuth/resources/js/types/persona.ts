/**
 * Script definition for multi-script transliteration engine
 */
export interface ScriptDefinition {
    code: string;
    iso: string;
    name: string;
    type: string;
    dir: 'ltr' | 'rtl';
    users: string;
    languages: string;
    sample: string;
}

export const WORLD_SCRIPTS: ScriptDefinition[] = [
    { code: 'latin', iso: 'Latn', name: 'Latin', type: 'Alphabet', dir: 'ltr', users: '~4.9+ billion', languages: 'English, Spanish, Portuguese, Lithuanian', sample: 'John Smith' },
    { code: 'arabic', iso: 'Arab', name: 'Arabic', type: 'Abjad / Alphabet', dir: 'rtl', users: '~660–830 million', languages: 'Arabic, Urdu, Persian, Pashto', sample: 'جُهن سمِته' },
    { code: 'devanagari', iso: 'Deva', name: 'Devanagari', type: 'Abugida', dir: 'ltr', users: '~480–610 million', languages: 'Hindi, Marathi, Nepali, Sanskrit', sample: 'जॊह्न् स्मिथ्' },
    { code: 'bengali', iso: 'Beng', name: 'Bengali-Assamese', type: 'Abugida', dir: 'ltr', users: '~300 million', languages: 'Bengali, Assamese', sample: 'জোহ্ন্ স্মিথ্' },
    { code: 'cyrillic', iso: 'Cyrl', name: 'Cyrillic', type: 'Alphabet', dir: 'ltr', users: '~250–350 million', languages: 'Russian, Ukrainian, Bulgarian, Serbian', sample: 'Йохн Смитх' },
    { code: 'kana', iso: 'Kana', name: 'Kana (Katakana)', type: 'Syllabary', dir: 'ltr', users: '~120–125 million', languages: 'Japanese', sample: 'ジョーン スミテー' },
    { code: 'hangul', iso: 'Hang', name: 'Hangul', type: 'Alphabet', dir: 'ltr', users: '~80 million', languages: 'Korean', sample: '좋느 스밑흐' },
    { code: 'hebrew', iso: 'Hebr', name: 'Hebrew', type: 'Abjad', dir: 'rtl', users: '~9–14 million', languages: 'Hebrew, Yiddish', sample: 'זֳהן סמִטה' },
    { code: 'greek', iso: 'Grek', name: 'Greek', type: 'Alphabet', dir: 'ltr', users: '~11–13 million', languages: 'Greek', sample: 'Ἰὁν Σμιθ' },
    { code: 'georgian', iso: 'Geor', name: 'Georgian (Mkhedruli)', type: 'Alphabet', dir: 'ltr', users: '~4–4.5 million', languages: 'Georgian', sample: 'Jოჰნ Sმითჰ' },
];

/**
 * Localized name component in a specific alphabet
 */
export interface LocalizedNameComponent {
    formatted_name?: string;
    full_name?: string;
    given_name?: string;
    family_name?: string;
    direction?: 'ltr' | 'rtl';
    script?: string;
    script_name?: string;
    script_type?: string;
}

/**
 * Grammatical pronouns configuration
 */
export interface PronounSet {
    subject?: string;
    object?: string;
    possessive?: string;
    display?: string;
}

/**
 * Core Persona Entity
 */
export interface Persona {
    id: number;
    user_id: number;
    persona_name: string;
    username: string | null;
    email_alias: string | null;
    legal_name: string | null;
    preferred_name: string | null;
    family_name: string | null;
    given_name: string | null;
    gender_identity: string | null;
    cultural_ordering: 'given_family' | 'family_given' | null;
    is_age_verified: boolean;
    avatar_path: string | null;
    primary_script?: string | null;
    localized_names?: Record<string, LocalizedNameComponent> | null;
    pronouns?: PronounSet | null;
    custom_claims?: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

/**
 * Connected third-party OAuth application client
 */
export interface ConnectedClient {
    id: string;
    client: {
        id: string;
        name: string;
    };
    token_count?: number;
    scopes?: string[];
    last_active_at?: string;
}

/**
 * GDPR Article 17 Right to Erasure audit log
 */
export interface ErasureLog {
    id: string;
    user_id?: number;
    client_id: string;
    client_name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | string;
    attempts: number;
    response_code?: number | null;
    last_attempt_at?: string | null;
    created_at: string;
}

/**
 * Authenticated root user details
 */
export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    date_of_birth?: string | null;
    is_identity_verified?: boolean;
    verification_type?: string | null;
    estimated_age?: number | null;
}
