import React from 'react';
import { ArrowUpRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Persona } from '../types';

interface PersonaCardProps {
    persona: Persona;
    isIdentityVerified: boolean;
    onEdit: (p: Persona) => void;
    onDelete: (id: number, name: string) => void;
    onToggleAge: (id: number) => void;
    onOpenVerification?: () => void;
}

/**
 * PersonaCard Component
 *
 * Renders an isolated context-aware persona card displaying identity assurance level (IAL1 vs IAL2),
 * localized writing script tags, cultural name ordering, and contextual IAL2 upgrade actions.
 */
export default function PersonaCard({
    persona,
    isIdentityVerified,
    onEdit,
    onDelete,
    onToggleAge,
    onOpenVerification,
}: PersonaCardProps) {
    const isIal2 = persona.is_age_verified && isIdentityVerified;
    const localizedKeys = Object.keys(persona.localized_names || {});
    const pronounDisplay = persona.pronouns?.display || persona.gender_identity || 'they/them';

    return (
        <div className={`group border rounded-2xl p-5 bg-slate-900/40 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg flex flex-col justify-between min-w-0 overflow-hidden ${
            isIal2 
                ? 'border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/5' 
                : 'border-slate-800 hover:border-slate-700'
        }`}>
            {/* Header: Name and Avatar */}
            <div className="flex justify-between items-start gap-2 mb-4 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-11 w-11 shrink-0 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700/50">
                        {persona.avatar_path ? (
                            <img src={persona.avatar_path} alt={persona.persona_name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="font-bold text-sm text-slate-400">
                                {(persona.persona_name || 'P').charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <h4 className="font-bold text-slate-200 group-hover:text-white transition duration-200 truncate" title={persona.persona_name}>
                                {persona.persona_name}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                                {pronounDisplay}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                            {isIal2 ? 'High-Assurance Context (IAL2)' : 'Low-Assurance Context (IAL1)'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {/* Age verification & IAL assurance elevation control */}
                    {isIdentityVerified ? (
                        <button
                            type="button"
                            onClick={() => onToggleAge(persona.id)}
                            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all border shrink-0 ${
                                persona.is_age_verified 
                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20' 
                                    : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/30 hover:text-white shadow-sm shadow-indigo-500/10'
                            }`}
                            title={persona.is_age_verified ? 'Click to demote persona to low-assurance context' : 'Account has IAL2 approval. Click to bind IAL2 verified attributes to this persona.'}
                        >
                            {persona.is_age_verified ? (
                                <>
                                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                    <span>IAL2 Verified</span>
                                </>
                            ) : (
                                <>
                                    <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                                    <span>Upgrade to IAL2</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onOpenVerification ? onOpenVerification() : onToggleAge(persona.id)}
                            className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all border shrink-0 bg-amber-500/10 text-amber-300/90 border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-200"
                            title="Master identity is unverified (IAL1). Click to launch live identity proofing to unlock IAL2 elevation."
                        >
                            <ShieldAlert className="w-3 h-3 text-amber-400" />
                            <span>Verify ID for IAL2</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Script Availability Badges */}
            {localizedKeys.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1 min-w-0">
                    {localizedKeys.slice(0, 5).map(key => (
                        <span key={key} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                            {key.toUpperCase()}
                        </span>
                    ))}
                    {localizedKeys.length > 5 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                            +{localizedKeys.length - 5} scripts
                        </span>
                    )}
                </div>
            )}

            {/* Details Grid */}
            <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3 mb-4 text-slate-400 min-w-0">
                {persona.username && (
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <span className="text-slate-500 shrink-0">Username:</span>
                        <span className="font-medium text-slate-300 truncate max-w-[65%] text-right font-mono text-[11px]" title={persona.username}>
                            {persona.username}
                        </span>
                    </div>
                )}
                {persona.email_alias && (
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <span className="text-slate-500 shrink-0">Email Alias:</span>
                        <span className="font-medium text-slate-300 truncate max-w-[65%] text-right text-[11px]" title={persona.email_alias}>
                            {persona.email_alias}
                        </span>
                    </div>
                )}
                {(persona.given_name || persona.family_name) && (
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <span className="text-slate-500 shrink-0">Western Name:</span>
                        <span className="font-medium text-slate-300 truncate max-w-[65%] text-right" title={`${persona.given_name || ''} ${persona.family_name || ''}`.trim()}>
                            {persona.cultural_ordering === 'family_given' 
                                ? `${persona.family_name || ''} ${persona.given_name || ''}`.trim()
                                : `${persona.given_name || ''} ${persona.family_name || ''}`.trim()
                            }
                        </span>
                    </div>
                )}
                {persona.legal_name && (
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <span className="text-slate-500 shrink-0">Legal Name:</span>
                        <span className="font-medium text-slate-300 truncate max-w-[65%] text-right" title={persona.legal_name}>
                            {persona.legal_name}
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-2 mt-auto pt-2 border-t border-slate-800/40">
                <button
                    type="button"
                    onClick={() => onEdit(persona)}
                    className="text-[11px] font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition"
                >
                    Edit & Studio
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(persona.id, persona.persona_name)}
                    className="text-[11px] font-semibold text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-md hover:bg-red-500/10 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
