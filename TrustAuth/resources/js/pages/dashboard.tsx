import { router } from '@inertiajs/react';
import { BookOpen, ClipboardList, ExternalLink, Lock, Plus, Shield, UserCheck } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import OnboardingModal from '../components/OnboardingModal';
import PersonaCard from '../components/PersonaCard';
import PersonaStudioModal from '../components/PersonaStudioModal';
import VerificationModal from '../components/VerificationModal';
import { usePersonaManager } from '../hooks/usePersonaManager';
import { AuthenticatedUser, Persona } from '../types';

interface DashboardProps {
    personas: Persona[];
    isIdentityVerified: boolean;
    verificationType?: string | null;
    estimatedAge?: number | null;
    user?: AuthenticatedUser;
}

// User personas and verification status dashboard
export default function Dashboard({
    personas = [],
    isIdentityVerified = false,
    verificationType,
    estimatedAge,
    user,
}: DashboardProps) {
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    const {
        editingPersona,
        isModalOpen,
        formData,
        processing,
        errors,
        startEdit,
        openCreateModal,
        closeModal,
        handleSubmit,
        handleDeletePersona,
        handleTogglePersonaAgeVerification,
        handleToggleMasterIal2,
        updateFormField,
    } = usePersonaManager();

    // Auto-prompt onboarding wizard for fresh users
    useEffect(() => {
        const completed = localStorage.getItem('trustauth_onboarding_completed');
        if (!completed && personas.length <= 1) {
            setIsOnboardingOpen(true);
        }
    }, [personas.length]);

    // Group personas: IAL2 (is_age_verified is true AND isIdentityVerified is true) vs IAL1 (otherwise)
    const ial2Personas = personas.filter(p => p.is_age_verified && isIdentityVerified);
    const ial1Personas = personas.filter(p => !(p.is_age_verified && isIdentityVerified));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100 font-sans antialiased">
            {/* Top Navigation & Status Bar */}
            <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-20 px-6 py-3.5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <a href="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition">
                            <span className="font-extrabold text-white text-lg">T</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition">
                                    TrustAuth
                                </h1>
                                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    User Dashboard
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">Manage identity personas and privacy settings</p>
                        </div>
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    {/* Identity Assurance Level Status */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700/60">
                        <span className="text-[11px] text-slate-400 font-medium">Assurance:</span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isIdentityVerified 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isIdentityVerified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {isIdentityVerified ? 'IAL2 Verified' : 'IAL1 Self-Asserted'}
                        </span>
                    </div>

                    <div className="h-5 w-px bg-slate-800 hidden sm:block" />

                    <button
                        type="button"
                        onClick={() => router.visit('/governance')}
                        className="text-xs font-semibold px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 rounded-lg transition shadow-sm flex items-center gap-1.5"
                    >
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Privacy Hub</span>
                    </button>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg transition shadow-md shadow-emerald-600/10 flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Persona</span>
                    </button>

                    <div className="h-5 w-px bg-slate-800 hidden sm:block" />

                    {/* User profile identifier and Sign Out */}
                    <div className="flex items-center gap-2.5 pl-1">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-semibold text-slate-200 leading-none">{user?.name || 'Master User'}</p>
                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{user?.email || 'Authenticated'}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="text-xs font-semibold px-2.5 py-1.5 bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 text-slate-400 border border-slate-700/60 rounded-lg transition"
                            title="Sign out of sovereign root session"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Visual statistics cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm min-w-0">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1 truncate">Total Personas</div>
                        <div className="text-3xl font-extrabold text-indigo-400">{personas.length}</div>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm min-w-0">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1 truncate">IAL2 High-Assurance</div>
                        <div className="text-3xl font-extrabold text-emerald-400">{ial2Personas.length}</div>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm min-w-0">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1 truncate">IAL1 Low-Assurance</div>
                        <div className="text-3xl font-extrabold text-amber-400">{ial1Personas.length}</div>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm min-w-0">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1 truncate">World Alphabets</div>
                        <div className="text-3xl font-extrabold text-violet-400">10 Scripts</div>
                    </div>
                </div>

                {/* Main side-by-side grouped view */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* IAL2 Column */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap justify-between items-center border-b border-emerald-500/20 pb-3 gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                                    IAL2 Personas (High Assurance)
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">Requires verified identity. Uses verified name and age attributes.</p>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {ial2Personas.length}
                                </span>
                                {isIdentityVerified && (
                                    <button
                                        type="button"
                                        onClick={() => setIsVerificationModalOpen(true)}
                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5"
                                        title="View IAL2 details and attestation"
                                    >
                                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Manage IAL2</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {ial2Personas.length === 0 ? (
                            <div className="border border-dashed border-slate-800 bg-slate-900/20 rounded-2xl p-8 text-center text-slate-500 space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-300">No verified IAL2 personas</p>
                                    <p className="text-xs mt-1 max-w-sm mx-auto text-slate-400">
                                        {!isIdentityVerified 
                                            ? 'Verify your identity (IAL2) to unlock high-assurance selective disclosure and zero-knowledge age assertions.' 
                                            : 'Your master identity is IAL2 verified. Create a persona or toggle age verification on an existing persona to move it here.'}
                                    </p>
                                </div>
                                {!isIdentityVerified && (
                                    <button
                                        type="button"
                                        onClick={() => setIsVerificationModalOpen(true)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md shadow-emerald-600/20"
                                    >
                                        <UserCheck className="w-3.5 h-3.5" />
                                        <span>Verify Identity (IAL2) Now</span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ial2Personas.map(persona => (
                                    <PersonaCard 
                                        key={persona.id} 
                                        persona={persona} 
                                        isIdentityVerified={isIdentityVerified}
                                        onEdit={startEdit}
                                        onDelete={handleDeletePersona}
                                        onToggleAge={handleTogglePersonaAgeVerification}
                                        onOpenVerification={() => setIsVerificationModalOpen(true)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* IAL1 Column */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
                                    IAL1 Personas (Low Assurance)
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">Anonymized, pseudonymized, or pending identity verification.</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {ial1Personas.length}
                            </span>
                        </div>

                        {ial1Personas.length === 0 ? (
                            <div className="border border-dashed border-slate-800 bg-slate-900/20 rounded-2xl p-8 text-center text-slate-500">
                                <p className="text-sm font-medium">No IAL1 personas</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ial1Personas.map(persona => (
                                    <PersonaCard 
                                        key={persona.id} 
                                        persona={persona} 
                                        isIdentityVerified={isIdentityVerified}
                                        onEdit={startEdit}
                                        onDelete={handleDeletePersona}
                                        onToggleAge={handleTogglePersonaAgeVerification}
                                        onOpenVerification={() => setIsVerificationModalOpen(true)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>

            {/* CREATE / EDIT PERSONA MODAL */}
            <PersonaStudioModal
                isOpen={isModalOpen}
                onClose={closeModal}
                editingPersona={editingPersona}
                formData={formData}
                onChangeField={updateFormField}
                onSubmit={handleSubmit}
                processing={processing}
                errors={errors}
                isIdentityVerified={isIdentityVerified}
            />

            {/* Professional Footer for Secondary / Administrative / Dev Utilities */}
            <footer className="border-t border-slate-900 bg-slate-950/80 mt-16 py-8 px-6 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-xs">
                            T
                        </div>
                        <span>TrustAuth Identity Provider</span>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap text-slate-400">
                        <button
                            type="button"
                            onClick={() => router.visit('/governance')}
                            className="hover:text-slate-200 transition"
                        >
                            Privacy &amp; Erasure
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit('/docs')}
                            className="hover:text-slate-200 transition flex items-center gap-1"
                        >
                            <span>Developer Docs &amp; API</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOnboardingOpen(true)}
                            className="hover:text-slate-200 transition flex items-center gap-1"
                        >
                            <ClipboardList className="w-3 h-3 text-indigo-400" />
                            <span>Product Feedback</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit('/admin/governance')}
                            className="hover:text-rose-400 transition flex items-center gap-1 text-slate-500 hover:text-slate-300"
                            title="Relying party telemetry and webhook mitigation"
                        >
                            <Shield className="w-3 h-3 text-slate-500" />
                            <span>Partner Governance</span>
                        </button>
                    </div>
                </div>
            </footer>

            {/* Interactive Onboarding & Feedback Modal */}
            <OnboardingModal
                isOpen={isOnboardingOpen}
                onClose={() => setIsOnboardingOpen(false)}
                isIdentityVerified={isIdentityVerified}
                onOpenVerification={() => setIsVerificationModalOpen(true)}
                onToggleMasterIal2={handleToggleMasterIal2}
                onPersonaCreated={() => router.reload({ only: ['personas'] })}
            />

            {/* Commercial Government Document & Identity Verification Modal (NIST SP 800-63-4 IAL2) */}
            <VerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                isIdentityVerified={isIdentityVerified}
                verificationType={verificationType || user?.verification_type}
                estimatedAge={estimatedAge || user?.estimated_age}
                dateOfBirth={user?.date_of_birth}
                legalName={user?.name}
                onVerified={() => router.reload({ only: ['personas', 'isIdentityVerified', 'verificationType', 'estimatedAge', 'user'] })}
            />
        </div>
    );
}
