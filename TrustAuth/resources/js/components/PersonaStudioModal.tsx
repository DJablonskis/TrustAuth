import React, { useState } from 'react';
import { CheckCircle, Lock, Sparkles, X } from 'lucide-react';
import { LocalizedNameComponent, Persona, PronounSet, WORLD_SCRIPTS } from '../types';

export interface PersonaFormData {
    persona_name: string;
    username: string;
    email_alias: string;
    legal_name: string;
    preferred_name: string;
    family_name: string;
    given_name: string;
    gender_identity: string;
    cultural_ordering: 'given_family' | 'family_given';
    primary_script: string;
    localized_names: Record<string, LocalizedNameComponent>;
    pronouns: PronounSet;
}

interface PersonaStudioModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingPersona: Persona | null;
    formData: PersonaFormData;
    onChangeField: <K extends keyof PersonaFormData>(field: K, value: PersonaFormData[K]) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: Partial<Record<keyof PersonaFormData, string>>;
    isIdentityVerified: boolean;
}

/**
 * PersonaStudioModal Component
 *
 * Dedicated editor for configuring context-aware personas, deterministic multi-script ICU transliteration,
 * cultural name orderings, and sovereign grammatical pronouns.
 */
export default function PersonaStudioModal({
    isOpen,
    onClose,
    editingPersona,
    formData,
    onChangeField,
    onSubmit,
    processing,
    errors,
    isIdentityVerified,
}: PersonaStudioModalProps) {
    const [modalTab, setModalTab] = useState<'profile' | 'scripts' | 'pronouns'>('profile');
    const [selectedScriptCode, setSelectedScriptCode] = useState<string>('latin');
    const [isTransliterating, setIsTransliterating] = useState<boolean>(false);
    const [transliterationMessage, setTransliterationMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    // One-Click Deterministic Multi-Script Transliteration
    const handleAutoTransliterate = async () => {
        const nameToUse = (formData.given_name || formData.family_name)
            ? `${formData.given_name || ''} ${formData.family_name || ''}`.trim()
            : (formData.preferred_name || formData.persona_name);

        if (!nameToUse) {
            alert('Please provide a Given/Family Name or Display Name before auto-transliterating.');
            return;
        }

        setIsTransliterating(true);
        setTransliterationMessage('Generating deterministic ICU transliterations across 10 scripts...');

        try {
            const tokenMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
            const csrfToken = tokenMeta ? tokenMeta.content : '';

            const res = await fetch('/personas/transliterate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    name: nameToUse,
                    given_name: formData.given_name || nameToUse,
                    family_name: formData.family_name || '',
                }),
            });

            if (!res.ok) throw new Error('Transliteration service encountered an error.');

            const resJson = await res.json();
            if (resJson.success && resJson.data) {
                const updated = { ...formData.localized_names };
                WORLD_SCRIPTS.forEach(s => {
                    const variant = resJson.data[s.code] || resJson.data[s.iso];
                    if (variant) {
                        updated[s.code] = {
                            formatted_name: variant.formatted_name || variant.full_name,
                            given_name: variant.given_name,
                            family_name: variant.family_name,
                            direction: s.dir,
                            script: s.code,
                            script_name: s.name,
                            script_type: s.type,
                        };
                    }
                });
                onChangeField('localized_names', updated);
                setTransliterationMessage('Transliteration completed across all 10 world alphabets using native ICU rules.');
            }
        } catch (e: any) {
            setTransliterationMessage('Error: ' + e.message);
        } finally {
            setIsTransliterating(false);
        }
    };

    // Update individual script attribute
    const updateScriptField = (scriptCode: string, field: 'formatted_name' | 'given_name' | 'family_name', val: string) => {
        const scriptDef = WORLD_SCRIPTS.find(s => s.code === scriptCode);
        const existing = formData.localized_names[scriptCode] || {
            direction: scriptDef?.dir || 'ltr',
            script: scriptCode,
            script_name: scriptDef?.name || scriptCode,
            script_type: scriptDef?.type || 'Alphabet',
        };

        onChangeField('localized_names', {
            ...formData.localized_names,
            [scriptCode]: {
                ...existing,
                [field]: val,
            },
        });
    };

    // Pronoun preset helper
    const applyPronounPreset = (subject: string, object: string, possessive: string) => {
        onChangeField('pronouns', {
            subject,
            object,
            possessive,
            display: `${subject}/${object}`,
        });
    };

    const currentScriptDef = WORLD_SCRIPTS.find(s => s.code === selectedScriptCode) || WORLD_SCRIPTS[0];
    const currentScriptData = formData.localized_names[selectedScriptCode] || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                
                {/* Modal Header with Tabs */}
                <div className="p-6 border-b border-slate-800 bg-slate-950/40">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-100">
                                {editingPersona ? `Edit Persona: ${editingPersona.persona_name}` : 'Create Persona'}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Set up profile attributes, name scripts, and display settings.
                            </p>
                        </div>
                        <button 
                            type="button"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 gap-1 text-xs">
                        <button
                            type="button"
                            onClick={() => setModalTab('profile')}
                            className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                                modalTab === 'profile'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            1. Profile & Claims
                        </button>
                        <button
                            type="button"
                            onClick={() => setModalTab('scripts')}
                            className={`flex-1 py-2 px-3 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
                                modalTab === 'scripts'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <span>2. Name Alphabets</span>
                            {Object.keys(formData.localized_names).length > 0 && (
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setModalTab('pronouns')}
                            className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                                modalTab === 'pronouns'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            3. Pronouns
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* TAB 1: Profile & Identity */}
                    {modalTab === 'profile' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Persona Display Name *</label>
                                <input 
                                    type="text" 
                                    value={formData.persona_name} 
                                    onChange={e => onChangeField('persona_name', e.target.value)} 
                                    placeholder="e.g., Work Professional, Diplomatic Profile, Gaming Alias"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    required 
                                />
                                {errors.persona_name && <p className="text-red-400 text-xs mt-1">{errors.persona_name}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Username / Pseudonym</label>
                                    <input 
                                        type="text" 
                                        value={formData.username} 
                                        onChange={e => onChangeField('username', e.target.value)} 
                                        placeholder="Leave empty for auto-generated ghost alias"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Alias</label>
                                    <input 
                                        type="email" 
                                        value={formData.email_alias} 
                                        onChange={e => onChangeField('email_alias', e.target.value)} 
                                        placeholder="alias@privacy.me"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Given Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.given_name} 
                                        onChange={e => onChangeField('given_name', e.target.value)} 
                                        placeholder="e.g. John"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Family Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.family_name} 
                                        onChange={e => onChangeField('family_name', e.target.value)} 
                                        placeholder="e.g. Smith"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.preferred_name} 
                                        onChange={e => onChangeField('preferred_name', e.target.value)} 
                                        placeholder="e.g. DJ"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs font-semibold text-slate-300">Legal Name</label>
                                        {isIdentityVerified && (
                                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <CheckCircle className="w-2.5 h-2.5" />
                                                Verified from ID
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={formData.legal_name} 
                                            onChange={e => onChangeField('legal_name', e.target.value)} 
                                            disabled={isIdentityVerified}
                                            placeholder={isIdentityVerified ? "Attested from verified ID" : "e.g. John Smith"}
                                            className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 ${
                                                isIdentityVerified 
                                                    ? 'text-slate-400 cursor-not-allowed bg-slate-900/60 pr-8' 
                                                    : 'text-slate-100'
                                            }`} 
                                        />
                                        {isIdentityVerified && (
                                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" title="Locked: Verified from ID">
                                                <Lock className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                    </div>
                                    {isIdentityVerified && (
                                        <p className="text-[10px] text-slate-500 mt-1">
                                            Legal name is verified from ID and cannot be edited.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cultural Name Ordering</label>
                                    <select 
                                        value={formData.cultural_ordering} 
                                        onChange={e => onChangeField('cultural_ordering', e.target.value as 'given_family' | 'family_given')} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="given_family">Given, Family (Western standard)</option>
                                        <option value="family_given">Family, Given (Eastern / Hungarian / East Asian)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Native Script</label>
                                    <select 
                                        value={formData.primary_script} 
                                        onChange={e => onChangeField('primary_script', e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                                    >
                                        {WORLD_SCRIPTS.map(s => (
                                            <option key={s.code} value={s.code}>{s.name} ({s.type})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Multi-Script Studio */}
                    {modalTab === 'scripts' && (
                        <div className="space-y-6">
                            {/* Action Header Banner */}
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                                            <span>Multi-Script Transliteration</span>
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">PHP intl</span>
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Converts name across supported alphabets locally using PHP ICU transliteration.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAutoTransliterate}
                                        disabled={isTransliterating}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>{isTransliterating ? 'Generating...' : 'Generate Other Scripts'}</span>
                                    </button>
                                </div>

                                {transliterationMessage && (
                                    <div className="text-xs font-mono text-emerald-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                                        {transliterationMessage}
                                    </div>
                                )}
                            </div>

                            {/* Horizontal Script Selector Pills */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-slate-400">Select Writing System to Review / Override:</label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                    {WORLD_SCRIPTS.map(s => {
                                        const hasData = Boolean(formData.localized_names[s.code]?.formatted_name);
                                        const isSelected = selectedScriptCode === s.code;

                                        return (
                                            <button
                                                key={s.code}
                                                type="button"
                                                onClick={() => setSelectedScriptCode(s.code)}
                                                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between min-w-0 ${
                                                    isSelected 
                                                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' 
                                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between w-full mb-1 min-w-0 gap-1">
                                                    <span className="font-bold text-xs truncate">{s.name}</span>
                                                    {hasData && (
                                                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
                                                    )}
                                                </div>
                                                <span className="text-[10px] opacity-75 truncate">{s.dir.toUpperCase()} • {s.users}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Active Script Customization Card */}
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div>
                                        <h5 className="font-bold text-sm text-slate-200">
                                            {currentScriptDef.name} ({currentScriptDef.type})
                                        </h5>
                                        <p className="text-xs text-slate-500">
                                            Languages: {currentScriptDef.languages} • Text Direction: <span className="font-mono text-indigo-400 uppercase">{currentScriptDef.dir}</span>
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                        currentScriptDef.dir === 'rtl' 
                                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                                            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                    }`}>
                                        {currentScriptDef.dir.toUpperCase()} Layout
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                                            Formatted Name in {currentScriptDef.name}
                                        </label>
                                        <input 
                                            type="text" 
                                            dir={currentScriptDef.dir}
                                            value={currentScriptData.formatted_name || ''} 
                                            onChange={e => updateScriptField(selectedScriptCode, 'formatted_name', e.target.value)} 
                                            placeholder={currentScriptDef.sample}
                                            className={`w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 ${
                                                currentScriptDef.dir === 'rtl' ? 'text-right font-serif text-base' : ''
                                            }`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Given Name Component</label>
                                            <input 
                                                type="text" 
                                                dir={currentScriptDef.dir}
                                                value={currentScriptData.given_name || ''} 
                                                onChange={e => updateScriptField(selectedScriptCode, 'given_name', e.target.value)} 
                                                className={`w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 ${
                                                    currentScriptDef.dir === 'rtl' ? 'text-right font-serif' : ''
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Family Name Component</label>
                                            <input 
                                                type="text" 
                                                dir={currentScriptDef.dir}
                                                value={currentScriptData.family_name || ''} 
                                                onChange={e => updateScriptField(selectedScriptCode, 'family_name', e.target.value)} 
                                                className={`w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 ${
                                                    currentScriptDef.dir === 'rtl' ? 'text-right font-serif' : ''
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Live RFC 9110 HTTP Negotiation Simulation Box */}
                                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                        RFC 9110 Accept-Language Content Negotiation Output:
                                    </span>
                                    <div className="font-mono text-emerald-400">
                                        {`GET /api/v1/userinfo (Accept-Language: ${selectedScriptCode}) -> `}
                                        <span className="font-bold text-white">
                                            "{currentScriptData.formatted_name || currentScriptDef.sample}"
                                        </span>
                                        <span className="text-slate-500"> [{currentScriptDef.dir.toUpperCase()}]</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: Pronouns & Grammar */}
                    {modalTab === 'pronouns' && (
                        <div className="space-y-6">
                            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                                <h4 className="text-sm font-bold text-slate-200 mb-1">Inclusive Sovereign Pronoun Architecture</h4>
                                <p className="text-xs text-slate-400">
                                    Pronouns are transmitted within standard OpenID Connect profile claims to ensure relying third-party apps address data sovereigns with proper grammatical respect.
                                </p>
                            </div>

                            {/* Presets */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-slate-400">Quick Presets:</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => applyPronounPreset('they', 'them', 'theirs')}
                                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 text-xs font-semibold transition"
                                    >
                                        They / Them / Theirs
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPronounPreset('she', 'her', 'hers')}
                                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 text-xs font-semibold transition"
                                    >
                                        She / Her / Hers
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyPronounPreset('he', 'him', 'his')}
                                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 text-xs font-semibold transition"
                                    >
                                        He / Him / His
                                    </button>
                                </div>
                            </div>

                            {/* Grammar Fields */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Subject Pronoun</label>
                                    <input 
                                        type="text" 
                                        value={formData.pronouns.subject || ''} 
                                        onChange={e => onChangeField('pronouns', { ...formData.pronouns, subject: e.target.value })} 
                                        placeholder="they"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Object Pronoun</label>
                                    <input 
                                        type="text" 
                                        value={formData.pronouns.object || ''} 
                                        onChange={e => onChangeField('pronouns', { ...formData.pronouns, object: e.target.value })} 
                                        placeholder="them"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Possessive Pronoun</label>
                                    <input 
                                        type="text" 
                                        value={formData.pronouns.possessive || ''} 
                                        onChange={e => onChangeField('pronouns', { ...formData.pronouns, possessive: e.target.value })} 
                                        placeholder="theirs"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1">Display Tag</label>
                                    <input 
                                        type="text" 
                                        value={formData.pronouns.display || ''} 
                                        onChange={e => onChangeField('pronouns', { ...formData.pronouns, display: e.target.value })} 
                                        placeholder="they/them"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500" 
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                    Relying Party UI Claim Preview:
                                </span>
                                <div className="text-slate-300">
                                    Third-party applications will address this persona as:{' '}
                                    <span className="font-bold text-indigo-400">
                                        {formData.persona_name || 'User'} ({formData.pronouns.display || 'they/them'})
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Submit */}
                    <div className="pt-4 flex justify-between items-center border-t border-slate-800">
                        <div className="text-xs text-slate-500">
                            {modalTab === 'profile' && 'Tab 1 of 3: Identity Claims'}
                            {modalTab === 'scripts' && 'Tab 2 of 3: Multi-Script Studio'}
                            {modalTab === 'pronouns' && 'Tab 3 of 3: Pronouns & Grammar'}
                        </div>

                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-950 hover:bg-slate-800 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 shadow-md shadow-indigo-600/20"
                            >
                                {editingPersona ? 'Save Persona Profile' : 'Create Sovereign Persona'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
