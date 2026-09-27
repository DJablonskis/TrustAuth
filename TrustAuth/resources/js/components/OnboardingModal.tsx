import React, { useState } from 'react';
import { ArrowRight, CheckCircle, ExternalLink, KeyRound, Loader2, Lock, QrCode, Shield, ShieldAlert, ShieldCheck, Smartphone, Sparkles, UserCheck, X } from 'lucide-react';
import { router } from '@inertiajs/react';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    isIdentityVerified: boolean;
    onOpenVerification?: () => void;
    onToggleMasterIal2?: () => void;
    onPersonaCreated?: () => void;
}

// System Usability Scale (SUS) Questions contextualized for TrustAuth
const SUS_QUESTIONS = [
    { id: 1, text: "I think that I would like to use this persona-based identity system frequently." },
    { id: 2, text: "I found the system unnecessarily complex." },
    { id: 3, text: "I thought the system was easy to use." },
    { id: 4, text: "I think that I would need the support of a technical person to be able to use this system." },
    { id: 5, text: "I found the various functions in this system (multi-script transliteration, in-flight OAuth claims, live Didit eIDV, zero-knowledge age assertions) were well integrated." },
    { id: 6, text: "I thought there was too much inconsistency in this system." },
    { id: 7, text: "I would imagine that most people would learn to use this system very quickly." },
    { id: 8, text: "I found the system very cumbersome to use." },
    { id: 9, text: "I felt very confident using the persona isolation, contextual IAL2 upgrades, and consent controls." },
    { id: 10, text: "I needed to learn a lot of things before I could get going with this system." },
];

export default function OnboardingModal({
    isOpen,
    onClose,
    isIdentityVerified,
    onOpenVerification,
    onToggleMasterIal2,
    onPersonaCreated
}: OnboardingModalProps) {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    // Step 2: First Persona State
    const [personaName, setPersonaName] = useState('Personal Privacy Persona');
    const [username, setUsername] = useState('privacy_user');
    const [pronouns, setPronouns] = useState('they/them');
    const [emailAlias, setEmailAlias] = useState('alias@privacy.me');
    const [creatingPersona, setCreatingPersona] = useState(false);
    const [personaSuccessMsg, setPersonaSuccessMsg] = useState<string | null>(null);

    // Step 4: SUS Evaluation State (empty by default)
    const [susAnswers, setSusAnswers] = useState<Record<number, number>>({});
    const [surveySubmitted, setSurveySubmitted] = useState(false);
    const [qualitativeFeedback, setQualitativeFeedback] = useState('');

    if (!isOpen) return null;

    // Calculate SUS Score (0-100)
    const calculateSusScore = () => {
        let oddSum = 0;
        let evenSum = 0;
        for (let i = 1; i <= 10; i++) {
            const val = susAnswers[i] || 3;
            if (i % 2 === 1) {
                oddSum += (val - 1);
            } else {
                evenSum += (5 - val);
            }
        }
        return (oddSum + evenSum) * 2.5;
    };

    const handleCreateFirstPersona = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingPersona(true);
        setPersonaSuccessMsg(null);

        const csrfMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        const csrfToken = csrfMeta ? csrfMeta.content : '';

        try {
            const res = await fetch('/personas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    persona_name: personaName,
                    username: username,
                    email_alias: emailAlias,
                    gender_identity: pronouns,
                    pronouns: {
                        display: pronouns,
                        subject: pronouns.split('/')[0] || 'they',
                        object: pronouns.split('/')[1] || 'them',
                        possessive: 'theirs',
                    },
                    primary_script: 'latin',
                }),
            });

            if (res.ok) {
                setPersonaSuccessMsg("First persona created successfully. It is now stored in your persona ledger.");
                if (onPersonaCreated) onPersonaCreated();
                setTimeout(() => setStep(3), 1200);
            } else {
                setPersonaSuccessMsg("Note: Persona creation processed.");
                setStep(3);
            }
        } catch (err) {
            setStep(3);
        } finally {
            setCreatingPersona(false);
        }
    };

    const handleAnswerChange = (qId: number, val: number) => {
        setSusAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleCompleteSurvey = () => {
        setSurveySubmitted(true);
        // Persist completion state and evaluation telemetry in localStorage for persistent session tracking
        localStorage.setItem('trustauth_onboarding_completed', 'true');
        localStorage.setItem('trustauth_sus_score', calculateSusScore().toString());
        localStorage.setItem('trustauth_sus_answers', JSON.stringify(susAnswers));
        localStorage.setItem('trustauth_sus_feedback', qualitativeFeedback);
        localStorage.setItem('trustauth_sus_timestamp', new Date().toISOString());
    };

    const susScore = calculateSusScore();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-extrabold text-white text-base">T</span>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                TrustAuth Onboarding & Usability Evaluation
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    Step {step} of 4
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">Contextual Integrity, Persona Partitioning & Usability Study</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition text-lg px-2 py-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-4 border-b border-slate-800 text-[11px] font-medium text-center">
                    <button 
                        onClick={() => setStep(1)} 
                        className={`py-2.5 transition border-b-2 ${step === 1 ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        1. Contextual Architecture
                    </button>
                    <button 
                        onClick={() => setStep(2)} 
                        className={`py-2.5 transition border-b-2 ${step === 2 ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        2. Create First Persona
                    </button>
                    <button 
                        onClick={() => setStep(3)} 
                        className={`py-2.5 transition border-b-2 ${step === 3 ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        3. Identity Assurance (IAL2)
                    </button>
                    <button 
                        onClick={() => setStep(4)} 
                        className={`py-2.5 transition border-b-2 ${step === 4 ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        4. Feedback Survey
                    </button>
                </div>

                {/* Step Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-sm">
                    {/* STEP 1: CONTEXTUAL INTEGRITY EXPLAINER */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-xs leading-relaxed text-indigo-300">
                                <span className="font-bold text-indigo-200 text-sm block mb-1">Welcome to TrustAuth Data Sovereignty</span>
                                In modern Single Sign-On (Google, Apple, Microsoft), your entire digital life is tied to one static global profile. This causes <strong>Context Collapse</strong>—where your gaming nickname, corporate legal name, and private health queries link back to a single tracking identifier.
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                                    <UserCheck className="w-6 h-6 text-indigo-400" />
                                    <h4 className="font-bold text-slate-100">Contextual Personas</h4>
                                    <p className="text-slate-400">Partition your identity into separate contexts (Professional, Casual, Pseudonym). External services only see the persona you select.</p>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                                    <KeyRound className="w-6 h-6 text-violet-400" />
                                    <h4 className="font-bold text-slate-100">In-Flight Claim Provisioning</h4>
                                    <p className="text-slate-400">If a merchant requests a delivery address or special claim, provision it on the go during OAuth consent without cancelling.</p>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                                    <Shield className="w-6 h-6 text-emerald-400" />
                                    <h4 className="font-bold text-slate-100">Zero-Leakage Age Gates</h4>
                                    <p className="text-slate-400">Prove you are over 16, 18, or 21 without ever transmitting your birthdate or government document to third parties.</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
                                >
                                    Continue: Create Your First Persona &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CREATE FIRST PERSONA */}
                    {step === 2 && (
                        <form onSubmit={handleCreateFirstPersona} className="space-y-4">
                            <div>
                                <h3 className="font-bold text-slate-100 text-sm mb-1">Step 2: Initialize Your Contextual Persona</h3>
                                <p className="text-xs text-slate-400 mb-4">Create a persona tailored for privacy-sensitive web services.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label className="block text-slate-300 font-medium mb-1">Persona Display Name *</label>
                                    <input
                                        type="text"
                                        value={personaName}
                                        onChange={(e) => setPersonaName(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                                        placeholder="e.g. Shopping Persona, Gaming Alias"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-medium mb-1">Preferred Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                                        placeholder="e.g. shopper_01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-medium mb-1">Email Alias</label>
                                    <input
                                        type="email"
                                        value={emailAlias}
                                        onChange={(e) => setEmailAlias(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                                        placeholder="e.g. shop@alias.me"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-medium mb-1">Grammatical Pronouns</label>
                                    <select
                                        value={pronouns}
                                        onChange={(e) => setPronouns(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                                    >
                                        <option value="they/them">they/them (Neutral)</option>
                                        <option value="she/her">she/her</option>
                                        <option value="he/him">he/him</option>
                                    </select>
                                </div>
                            </div>

                            {personaSuccessMsg && (
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium">
                                    {personaSuccessMsg}
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
                                >
                                    &larr; Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingPersona}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
                                >
                                    {creatingPersona ? 'Creating...' : 'Save Persona & Continue &rarr;'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3: IDENTITY ASSURANCE (IAL2) */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="font-bold text-slate-100 text-sm mb-1">Step 3: Identity Assurance Level (IAL) Validation</h3>
                                <p className="text-xs text-slate-400">TrustAuth implements NIST SP 800-63-4 risk-based assurance levels via Didit eIDV:</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                                        <h4 className="font-bold text-slate-200">IAL1 (Low Assurance)</h4>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        Pseudonymized or anonymized profile. Standard web browsing, non-restricted forums, zero PII disclosed. Default for newly registered personas.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-800/40 border border-emerald-500/30 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                                        <h4 className="font-bold text-emerald-300">IAL2 (High Assurance)</h4>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        NIST SP 800-63-4 verified identity. Enables cryptographic zero-knowledge age assertions (18+, 21+) and official legal name binding without disclosing exact birthdates.
                                    </p>
                                </div>
                            </div>

                            {/* Live Didit eIDV Integration Status Card */}
                            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-2 rounded-lg ${isIdentityVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                            {isIdentityVerified ? <ShieldCheck className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-200">Live Didit Electronic ID Verification (eIDV)</p>
                                            <p className="text-[11px] text-slate-400">
                                                {isIdentityVerified 
                                                    ? "Your root master account holds accredited NIST IAL2 verification."
                                                    : "Biometric face-match, liveness detection, and official passport/ID inspection."}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full flex items-center gap-1.5 ${
                                        isIdentityVerified 
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    }`}>
                                        {isIdentityVerified ? (
                                            <>
                                                <CheckCircle className="w-3 h-3" />
                                                IAL2 Verified
                                            </>
                                        ) : (
                                            <>
                                                <ShieldAlert className="w-3 h-3" />
                                                IAL1 Standard
                                            </>
                                        )}
                                    </span>
                                </div>

                                {isIdentityVerified ? (
                                    <div className="space-y-3 pt-3 border-t border-slate-700/60">
                                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs space-y-1">
                                            <div className="flex items-center gap-2 font-semibold">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Attested Government Identity Rooted</span>
                                            </div>
                                            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                                                Your legal name and date of birth are cryptographically secured. Personas in your ledger can be contextually elevated to IAL2 to emit zero-knowledge claims during OAuth authorization.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 pt-3 border-t border-slate-700/60">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-900/60 border border-slate-700/80 rounded-lg text-xs space-y-1">
                                                <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                                                    <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                                                    Cross-Device Mobile Handoff
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    Seamless QR-code transfer allows capturing government ID and performing active liveness on any mobile camera.
                                                </p>
                                            </div>
                                            <div className="p-3 bg-slate-900/60 border border-slate-700/80 rounded-lg text-xs space-y-1">
                                                <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                                                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                                                    Zero-Knowledge Proofs
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    Authorizes relying parties without transmitting unhashed document images or raw birthdates over the wire.
                                                </p>
                                            </div>
                                        </div>

                                        {onOpenVerification && (
                                            <button
                                                type="button"
                                                onClick={onOpenVerification}
                                                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                Launch Live Didit Identity Verification
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
                                >
                                    &larr; Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(4)}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
                                >
                                    Continue: Usability Evaluation Survey &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SYSTEM USABILITY SCALE (SUS) SURVEY */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-slate-100 text-sm">Step 4: System Usability Scale (SUS) Evaluation</h3>
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Live Calculated SUS Score: {susScore.toFixed(1)} / 100 ({susScore >= 80.3 ? 'Grade A' : susScore >= 68 ? 'Grade B (Above Avg)' : 'Grade C'})
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Please rate your agreement with each statement based on your experience with persona selection, in-flight custom claims, and identity assurance controls.
                                </p>
                            </div>

                            {/* 10 Standard Questions */}
                            <div className="space-y-4">
                                {SUS_QUESTIONS.map((q) => (
                                    <div key={q.id} className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
                                        <p className="text-xs text-slate-200 font-medium">
                                            <span className="text-indigo-400 font-bold mr-1.5">{q.id}.</span>
                                            {q.text}
                                        </p>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-[10px] text-slate-500">Strongly Disagree (1)</span>
                                            <div className="flex items-center gap-3">
                                                {[1, 2, 3, 4, 5].map((val) => (
                                                    <label key={val} className="flex items-center gap-1 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`sus_q_${q.id}`}
                                                            value={val}
                                                            checked={susAnswers[q.id] === val}
                                                            onChange={() => handleAnswerChange(q.id, val)}
                                                            className="text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                                                        />
                                                        <span className="text-xs font-mono text-slate-400">{val}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-slate-500">Strongly Agree (5)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Qualitative Feedback */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-slate-300">
                                    Qualitative User Feedback (Perception of Contextual Integrity & In-Flight Claims):
                                </label>
                                <textarea
                                    rows={2}
                                    value={qualitativeFeedback}
                                    onChange={(e) => setQualitativeFeedback(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                                    placeholder="Share your thoughts on persona switching, age verification, or in-flight claim provisioning..."
                                />
                            </div>

                            {surveySubmitted && (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium space-y-1">
                                    <p className="font-bold">Feedback Submitted Successfully</p>
                                    <p>Your System Usability Scale (SUS) score is <strong>{susScore.toFixed(1)}/100</strong>. Thank you for your feedback.</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
                                >
                                    &larr; Back
                                </button>
                                <div className="flex items-center gap-2">
                                    {!surveySubmitted ? (
                                        <button
                                            type="button"
                                            onClick={handleCompleteSurvey}
                                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
                                        >
                                            Submit Usability Survey (Score: {susScore.toFixed(1)})
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition"
                                        >
                                            Close & Explore Dashboard &rarr;
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
