import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Check, CheckCircle, Package, Shield, UserCheck, X } from 'lucide-react';
import React, { useState } from 'react';
import { Persona } from '../../types';

interface Scope {
    id: string;
    description: string;
}

interface ConsentProps {
    client: {
        id: string;
        name: string;
    };
    scopes: Scope[];
    authToken: string;
    personas: Persona[];
    isIdentityVerified: boolean;
    userAge?: number | null;
    authParams: Record<string, string>;
}

/**
 * OAuth Consent Intercept Component
 * 
 * Replaces the default binary OAuth consent page with a premium, context-aware
 * persona selection carousel interface. Users choose which minimized identity
 * representation (Persona) is shared with the requesting application.
 */
export default function Consent({
    client,
    scopes,
    authToken,
    personas = [],
    isIdentityVerified,
    userAge,
    authParams
}: ConsentProps) {
    // Maintain local reactive persona state to allow in-flight persona provisioning and edits
    const [personaList, setPersonaList] = useState<Persona[]>(personas);
    const [activeIndex, setActiveIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // In-flight persona / claim provisioning states
    const [isProvisioningOpen, setIsProvisioningOpen] = useState(false);
    const [provisionMode, setProvisionMode] = useState<'edit' | 'create'>('edit');
    const [formData, setFormData] = useState({
        persona_name: '',
        username: '',
        email_alias: '',
        given_name: '',
        family_name: '',
        pronoun_display: '',
        shipping_address: '',
        is_age_verified: false,
    });
    const [saving, setSaving] = useState(false);
    const [provisionError, setProvisionError] = useState<string | null>(null);

    const selectedPersona = personaList[activeIndex];
    
    // Check if client is requesting age assurance or legal identity KYC scopes
    const ageScopes = scopes.filter(s => s.id === 'age_verified' || s.id === 'age_over_18' || /^age_(?:is_)?over_\d+$/.test(s.id));
    const requiresAgeScope = ageScopes.length > 0;
    const requiresLegalName = scopes.some(s => s.id === 'legal_name');
    const hasShippingScope = scopes.some(s => s.id === 'shipping_address');

    // Extract maximum age gate threshold across requested scopes
    const ageThresholds = ageScopes.map(s => {
        if (s.id === 'age_verified') return 16;
        if (s.id === 'age_over_18') return 18;
        const match = s.id.match(/^age_(?:is_)?over_(\d+)$/);
        return match ? parseInt(match[1], 10) : 18;
    });
    const maxAgeThreshold = ageThresholds.length > 0 ? Math.max(...ageThresholds) : 18;
    const userMeetsAge = userAge !== null && userAge !== undefined ? userAge >= maxAgeThreshold : true;

    // Check if custom claims like shipping_address are missing on the active persona
    const isShippingBlocked = hasShippingScope && (!selectedPersona?.custom_claims?.shipping_address || selectedPersona.custom_claims.shipping_address.trim() === '');

    // Determine if authorization is blocked due to lack of master verification, persona settings, age gate, or unconfigured custom claims
    const isAgeBlocked = requiresAgeScope && (!isIdentityVerified || !selectedPersona?.is_age_verified || !userMeetsAge);
    const isLegalBlocked = requiresLegalName && !isIdentityVerified;
    const isBlocked = isAgeBlocked || isLegalBlocked || isShippingBlocked;

    const openEditModal = () => {
        if (!selectedPersona) return;
        setProvisionMode('edit');
        setFormData({
            persona_name: selectedPersona.persona_name || '',
            username: selectedPersona.username || '',
            email_alias: selectedPersona.email_alias || '',
            given_name: selectedPersona.given_name || '',
            family_name: selectedPersona.family_name || '',
            pronoun_display: (selectedPersona as any).pronouns?.display || selectedPersona.gender_identity || '',
            shipping_address: selectedPersona.custom_claims?.shipping_address || '',
            is_age_verified: selectedPersona.is_age_verified || false,
        });
        setProvisionError(null);
        setIsProvisioningOpen(true);
    };

    const openCreateModal = () => {
        setProvisionMode('create');
        setFormData({
            persona_name: `${client.name} Persona`,
            username: '',
            email_alias: '',
            given_name: '',
            family_name: '',
            pronoun_display: 'they/them',
            shipping_address: '',
            is_age_verified: isIdentityVerified,
        });
        setProvisionError(null);
        setIsProvisioningOpen(true);
    };

    const handleSaveClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setProvisionError(null);

        const csrfMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        const csrfToken = csrfMeta ? csrfMeta.content : '';

        try {
            const payload: any = {
                persona_name: formData.persona_name,
                username: formData.username || undefined,
                email_alias: formData.email_alias || undefined,
                given_name: formData.given_name || undefined,
                family_name: formData.family_name || undefined,
                gender_identity: formData.pronoun_display || undefined,
                pronouns: formData.pronoun_display ? {
                    display: formData.pronoun_display,
                    subject: formData.pronoun_display.split('/')[0] || 'they',
                    object: formData.pronoun_display.split('/')[1] || 'them',
                    possessive: 'theirs'
                } : undefined,
                custom_claims: hasShippingScope && formData.shipping_address ? {
                    ...(selectedPersona?.custom_claims || {}),
                    shipping_address: formData.shipping_address,
                } : undefined,
            };

            if (provisionMode === 'create') {
                const res = await fetch('/personas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify(payload),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed to create persona.');
                
                if (formData.is_age_verified && json.data?.id) {
                    await fetch(`/personas/${json.data.id}/verify-age`, {
                        method: 'POST',
                        headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    });
                    json.data.is_age_verified = true;
                }

                setPersonaList([...personaList, json.data]);
                setActiveIndex(personaList.length);
            } else {
                const res = await fetch(`/personas/${selectedPersona.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify(payload),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed to update persona.');

                if (formData.is_age_verified !== selectedPersona.is_age_verified) {
                    await fetch(`/personas/${selectedPersona.id}/verify-age`, {
                        method: 'POST',
                        headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    });
                    json.data.is_age_verified = formData.is_age_verified;
                }

                const updatedList = personaList.map((p, i) => i === activeIndex ? { ...p, ...json.data } : p);
                setPersonaList(updatedList);
            }

            setIsProvisioningOpen(false);
            setErrorMessage(null);
        } catch (err: any) {
            setProvisionError(err.message || 'An unexpected error occurred.');
        } finally {
            setSaving(false);
        }
    };

    /**
     * Submit authorization approval post request back to the server.
     */
    const handleApprove = () => {
        if (!selectedPersona) {
            setErrorMessage("Please select or create a persona first.");

            return;
        }

        if (isAgeBlocked) {
            setErrorMessage("This application requires verified age credentials. Verify your master identity or enable age disclosure on this persona.");

            return;
        }

        if (isLegalBlocked) {
            setErrorMessage("This application requires verified legal identity (IAL2) for KYC compliance. Please complete master identity verification first.");

            return;
        }

        if (isShippingBlocked) {
            setErrorMessage("This application requests a Delivery Address. Click 'Configure Claims on the Go' below to provide this detail before authorizing.");

            return;
        }

        setSubmitting(true);
        setErrorMessage(null);

        // Native form submission allows the browser to follow top-level cross-origin 302 redirects to relying parties
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/oauth/authorize';

        const csrfMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        const csrfToken = csrfMeta ? csrfMeta.content : '';

        const fields: Record<string, string> = {
            _token: csrfToken,
            persona_id: String(selectedPersona.id),
            state: authParams.state || '',
            client_id: client.id,
            auth_token: authToken,
        };

        for (const [key, val] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = val;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    };

    /**
     * Handle authorization denial redirect.
     */
    const handleDeny = () => {
        // Redirect back to cancel the request
        window.location.href = authParams.redirect_uri 
            ? `${authParams.redirect_uri}?error=access_denied&state=${authParams.state || ''}`
            : '/';
    };

    /**
     * Helper to render dynamic naming ordering preview.
     */
    const getPreviewName = (persona: Persona) => {
        if (persona.cultural_ordering === 'family_given') {
            return `${persona.family_name || ''} ${persona.given_name || ''}`.trim();
        }

        return `${persona.given_name || ''} ${persona.family_name || ''}`.trim() || persona.preferred_name || persona.username;
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
            <Head title="Authorize App - TrustAuth" />
            
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
                
                {/* Header branding info */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-2xl font-bold mb-2">
                        T
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        App Authorization
                    </h1>
                    <p className="text-slate-400 text-sm">
                        <span className="font-semibold text-slate-200">{client.name}</span> is requesting connection access to your TrustAuth account.
                    </p>
                </div>

                {errorMessage && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                        {errorMessage}
                    </div>
                )}

                {/* Requested Permissions section */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Requested Scopes</h3>
                    <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3">
                        {scopes.map(scope => (
                            <div key={scope.id} className="flex items-start space-x-3 text-sm">
                                <div className="mt-0.5 w-4 h-4 rounded-full border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                    <Check className="w-2.5 h-2.5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-200">{scope.id === '*' ? 'Full Profile Access' : scope.id}</p>
                                    <p className="text-slate-400 text-xs">{scope.description || 'Access and modify details.'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Persona Carousel Selector */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Authorization Persona</h3>
                        <span className="text-xs text-indigo-400 font-medium">
                            {personas.length > 0 ? `${activeIndex + 1} of ${personas.length}` : '0 Personas'}
                        </span>
                    </div>

                    {personas.length === 0 ? (
                        <div className="text-center p-6 bg-slate-950 border border-dashed border-slate-850 rounded-xl space-y-3">
                            <p className="text-slate-400 text-sm">You do not have any identity personas configured.</p>
                            <a href="/dashboard" className="inline-block text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                                Create a Persona in Dashboard →
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Carousel slide box */}
                            <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                                            {selectedPersona.avatar_path ? (
                                                <img src={selectedPersona.avatar_path} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                                                    {selectedPersona.persona_name.substring(0, 1).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-200">{selectedPersona.persona_name}</h4>
                                            <p className="text-slate-500 text-xs">@{selectedPersona.username}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Persona verification badge */}
                                    <div className="flex items-center space-x-1.5">
                                        {selectedPersona.is_age_verified ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Age Shared
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-450 border border-slate-750">
                                                Age Hidden
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Shared Data preview cards */}
                                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-900/60 text-xs">
                                    <div className="bg-slate-900/40 p-2 rounded-lg">
                                        <p className="text-slate-500 font-medium">Shared Name</p>
                                        <p className="text-slate-300 font-semibold truncate">{getPreviewName(selectedPersona)}</p>
                                    </div>
                                    <div className="bg-slate-900/40 p-2 rounded-lg">
                                        <p className="text-slate-500 font-medium">Email Alias</p>
                                        <p className="text-slate-300 font-semibold truncate">{selectedPersona.email_alias || 'Not Shared'}</p>
                                    </div>
                                    <div className="bg-slate-900/40 p-2 rounded-lg">
                                        <p className="text-slate-500 font-medium">Gender Identity</p>
                                        <p className="text-slate-300 font-semibold truncate">{selectedPersona.gender_identity || 'Not Shared'}</p>
                                    </div>
                                    <div className="bg-slate-900/40 p-2 rounded-lg">
                                        <p className="text-slate-500 font-medium">Regional ordering</p>
                                        <p className="text-slate-300 font-semibold truncate">
                                            {selectedPersona.cultural_ordering === 'family_given' ? 'Family First' : 'Given First'}
                                        </p>
                                    </div>
                                    {hasShippingScope && (
                                         <div className="bg-slate-900/40 p-2 rounded-lg col-span-2 border border-orange-500/20">
                                             <p className="text-orange-400 font-medium">Delivery Address</p>
                                             <p className="text-slate-200 font-semibold truncate">
                                                 {selectedPersona.custom_claims?.shipping_address || 'Not Configured (Click Configure Below)'}
                                             </p>
                                         </div>
                                     )}
                                 </div>

                                 {/* Carousel Controls */}
                                 <div className="flex items-center justify-between pt-2">
                                     <button 
                                         type="button"
                                         disabled={activeIndex === 0}
                                         onClick={() => setActiveIndex(activeIndex - 1)}
                                         className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-755 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 transition"
                                     >
                                         &larr; Prev
                                     </button>
                                     <button 
                                         type="button"
                                         disabled={activeIndex === personaList.length - 1}
                                         onClick={() => setActiveIndex(activeIndex + 1)}
                                         className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-755 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 transition"
                                     >
                                         Next &rarr;
                                     </button>
                                 </div>
                                 {/* In-Flight Claim Customization & Persona Creation */}
                                 <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                                     <button 
                                         type="button" 
                                         onClick={openEditModal}
                                         className="font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
                                     >
                                         <span>Configure Claims on the Go</span>
                                     </button>
                                     <button 
                                         type="button" 
                                         onClick={openCreateModal}
                                         className="font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                                     >
                                         <span>+ New Tailored Persona</span>
                                     </button>
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>

                 {/* Age Verification Warning Panel */}
                 {requiresAgeScope && (
                     <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed transition ${
                         isAgeBlocked 
                             ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                             : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                     }`}>
                         <div className="text-base mt-0.5">
                             {isAgeBlocked ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <Shield className="w-4 h-4 text-emerald-400" />}
                         </div>
                         <div className="space-y-1">
                             <p className="font-bold">
                                 {isAgeBlocked ? 'Age Gate Requirement Not Satisfied' : 'Zero-Knowledge Age Assurance Qualified'}
                             </p>
                             {isAgeBlocked ? (
                                 <p>
                                     {!isIdentityVerified 
                                         ? "Your master account identity has not completed IAL2 verification. Please approve age verification in your user dashboard first."
                                         : !userMeetsAge 
                                             ? `This service requires age over ${maxAgeThreshold}, but your verified account age is ${userAge}. Access cannot be authorized.`
                                             : "This persona is configured to hide your age status. Click 'Configure Claims on the Go' above to disclose age verification for this service."}
                                 </p>
                             ) : (
                                 <p>
                                     Zero-knowledge proof active. TrustAuth will assert that your age meets the required threshold (over {maxAgeThreshold}) as a signed boolean flag, without revealing your date of birth or actual age.
                                 </p>
                             )}
                         </div>
                     </div>
                 )}

                 {/* KYC Legal Identity Warning Panel */}
                 {requiresLegalName && (
                     <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed transition ${
                         isLegalBlocked 
                             ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                             : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                     }`}>
                         <div className="text-base mt-0.5">
                             <UserCheck className="w-4 h-4 text-indigo-400" />
                         </div>
                         <div className="space-y-1">
                             <p className="font-bold">KYC / Legal Name Disclosure</p>
                             {isLegalBlocked ? (
                                 <p>
                                     This relying party requests legal name disclosure for KYC compliance. You must complete master IAL2 identity verification before consenting.
                                 </p>
                             ) : (
                                 <p>Your verified legal name ({selectedPersona?.legal_name || 'Legal Name'}) will be transmitted exclusively to this partner.</p>
                             )}
                         </div>
                     </div>
                 )}

                 {/* Shipping Address Custom Claim Warning Panel */}
                 {hasShippingScope && (
                     <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed transition ${
                         isShippingBlocked 
                             ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' 
                             : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                     }`}>
                         <div className="text-base mt-0.5">
                             {isShippingBlocked ? <Package className="w-4 h-4 text-amber-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                         </div>
                         <div className="space-y-1">
                             <p className="font-bold">
                                 {isShippingBlocked ? 'Delivery Address Claim Required' : 'Delivery Address Configured'}
                             </p>
                             {isShippingBlocked ? (
                                 <p>
                                     This e-commerce application requires a delivery address. Use <span className="font-semibold text-white">Configure Claims on the Go</span> above to set an address on this persona, or select another persona.
                                 </p>
                             ) : (
                                 <p>
                                     Configured shipping address: <span className="font-medium text-white">{selectedPersona?.custom_claims?.shipping_address}</span>
                                 </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Confirm/Deny buttons */}
                <div className="flex items-center space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={handleDeny}
                        className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sm font-semibold text-slate-300 transition active:scale-[0.98]"
                    >
                        Cancel & Deny
                    </button>
                    <button
                        type="button"
                        disabled={submitting || isBlocked || personaList.length === 0}
                        onClick={handleApprove}
                        className="flex-grow-[2] py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-white transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                    >
                        {submitting ? 'Authorizing...' : 'Authorize & Connect'}
                    </button>
                </div>

            </div>

            {/* IN-FLIGHT PERSONA PROVISIONING MODAL */}
            {isProvisioningOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <div>
                                <h3 className="font-bold text-sm text-slate-100">
                                    {provisionMode === 'create' ? `Create Tailored Persona for ${client.name}` : `Update Claims: ${selectedPersona.persona_name}`}
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    Configure missing scopes in-flight securely without aborting OAuth flow.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsProvisioningOpen(false)}
                                className="h-7 w-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white text-xs transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {provisionError && (
                            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                                {provisionError}
                            </div>
                        )}

                        <form onSubmit={handleSaveClaim} className="space-y-3 text-xs">
                            <div>
                                <label className="block text-slate-400 font-semibold mb-1">Persona Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.persona_name}
                                    onChange={e => setFormData({ ...formData, persona_name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. Partner Profile"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-slate-400 font-semibold mb-1">Username / Alias</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                                        placeholder="user_123"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 font-semibold mb-1">Email Alias</label>
                                    <input
                                        type="email"
                                        value={formData.email_alias}
                                        onChange={e => setFormData({ ...formData, email_alias: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                                        placeholder="alias@domain.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 font-semibold mb-1">Grammatical Pronouns</label>
                                <input
                                    type="text"
                                    value={formData.pronoun_display}
                                    onChange={e => setFormData({ ...formData, pronoun_display: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                                    placeholder="they/them or she/her"
                                />
                            </div>

                            {hasShippingScope && (
                                <div>
                                    <label className="block text-orange-400 font-semibold mb-1">Shipping / Delivery Address *</label>
                                    <input
                                        type="text"
                                        value={formData.shipping_address}
                                        onChange={e => setFormData({ ...formData, shipping_address: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
                                        placeholder="e.g. 10 High Street, London, EC1A 1AA"
                                    />
                                </div>
                            )}

                            {isIdentityVerified && (
                                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                                    <div>
                                        <span className="font-semibold text-slate-200">Share Verified Age Status</span>
                                        <p className="text-[10px] text-slate-500">Allow this persona to assert age claims (16+/18+).</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_age_verified}
                                        onChange={e => setFormData({ ...formData, is_age_verified: e.target.checked })}
                                        className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsProvisioningOpen(false)}
                                    className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : (provisionMode === 'create' ? 'Create & Select' : 'Apply Changes')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
