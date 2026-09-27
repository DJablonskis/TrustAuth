import React, { useState } from 'react';
import { AlertTriangle, Camera, CheckCircle, ExternalLink, HelpCircle, Info, Loader2, Shield, ShieldAlert, Sparkles, UserCheck, X } from 'lucide-react';
import { router } from '@inertiajs/react';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    isIdentityVerified: boolean;
    verificationType?: string | null;
    estimatedAge?: number | null;
    dateOfBirth?: string | null;
    legalName?: string | null;
    onVerified?: () => void;
}

export default function VerificationModal({
    isOpen,
    onClose,
    isIdentityVerified,
    verificationType,
    estimatedAge,
    dateOfBirth,
    legalName,
    onVerified
}: VerificationModalProps) {
    const [verificationStep, setVerificationStep] = useState<'idle' | 'initiating' | 'attesting' | 'complete'>('idle');
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isLiveDidit, setIsLiveDidit] = useState<boolean>(true);
    const [providerName, setProviderName] = useState<string>('Didit Identity Verification Network');
    const [diditSessionUrl, setDiditSessionUrl] = useState<string | null>(null);
    const [flowMode, setFlowMode] = useState<'photo_only' | 'standard'>('photo_only');
    const [isChangingMode, setIsChangingMode] = useState<boolean>(false);
    const [creditExplanation, setCreditExplanation] = useState<string | null>(null);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            setVerificationStep('idle');
            setStatusMessage('');
            setDiditSessionUrl(null);
            setActiveSessionId(null);
            setIsChangingMode(false);
            setCreditExplanation(null);

            fetch('/verification/provider-status')
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        setIsLiveDidit(Boolean(res.is_live_provider));
                        setProviderName(res.provider_name);
                    }
                })
                .catch(() => {});
        }
    }, [isOpen]);

    // Active session poller: checks if webhook elevated the account or reconciles approved session in the background
    React.useEffect(() => {
        if (!isOpen || verificationStep !== 'attesting') return;

        const pollUrl = activeSessionId 
            ? `/verification/provider-status?session_id=${encodeURIComponent(activeSessionId)}` 
            : '/verification/provider-status';

        const interval = setInterval(() => {
            fetch(pollUrl)
                .then(r => r.json())
                .then(res => {
                    if (res.success && res.user_status?.is_identity_verified) {
                        setVerificationStep('complete');
                        setStatusMessage('Verification attestation confirmed and synchronized!');
                        if (onVerified) onVerified();
                    }
                })
                .catch(() => {});
        }, 3000);

        return () => clearInterval(interval);
    }, [isOpen, verificationStep, activeSessionId, onVerified]);

    if (!isOpen) return null;

    const handleStartVerification = async () => {
        setVerificationStep('initiating');
        setCreditExplanation(null);
        setStatusMessage('Initializing verification handshake with Didit v3 API...');

        try {
            const tokenMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
            const csrf = tokenMeta ? tokenMeta.content : '';

            const resp = await fetch('/verification/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify({
                    flow_mode: flowMode,
                }),
            });

            const json = await resp.json();

            if (json.success && json.mode === 'didit_live' && json.verification_url) {
                setDiditSessionUrl(json.verification_url);
                if (json.session_id) {
                    setActiveSessionId(json.session_id);
                }
                setVerificationStep('attesting');
                setStatusMessage('Didit secure verification session is active. Complete the verification in the opened window.');
                
                const popup = window.open(json.verification_url, 'didit_verification', 'width=600,height=750,menubar=no,toolbar=no,location=no,status=no');
                if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                    // Browser popup blocker prevented automatic window; user can click Re-open button
                    setStatusMessage('Popup blocked by browser. Please click the "Open Verification Window" button below.');
                }
                return;
            }

            if (isLiveDidit) {
                // When live Didit provider is active, never auto-approve. Present clear explanation of provider constraints.
                setVerificationStep('idle');
                const errMsg = json.message || '';
                if (errMsg.toLowerCase().includes('credits') || errMsg.toLowerCase().includes('top up') || errMsg.toLowerCase().includes('workflow')) {
                    setCreditExplanation(
                        flowMode === 'photo_only'
                            ? "Didit Free Tier: Facial age estimation requires a custom workflow on Didit. Because custom workflows require active credits on Didit, please proceed with Option 2 (Photo → Live → ID), which includes 500 free monthly verifications on Didit's standard KYC pipeline."
                            : (json.message || 'Could not initiate Didit session. Please check provider status.')
                    );
                } else {
                    setStatusMessage(json.message || 'Failed to initiate Didit session.');
                }
                return;
            }

            // Fallback simulation ONLY if live provider is completely unconfigured
            setStatusMessage('Simulating verification outcome for ' + (flowMode === 'photo_only' ? 'Photo Only (-3y conservative bound)' : 'Standard (Legal Name & DOB sync)') + '...');
            setTimeout(() => {
                router.post('/verification/simulate-ial2', {
                    flow_mode: flowMode,
                    estimated_age: 25,
                    date_of_birth: '1998-05-14',
                    legal_name: 'Dr. John Doe',
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setVerificationStep('complete');
                        setStatusMessage('Identity assertion successfully stored.');
                        if (onVerified) onVerified();
                    },
                    onError: () => {
                        setVerificationStep('idle');
                        setStatusMessage('Verification service encountered an error.');
                    }
                });
            }, 800);
        } catch (err) {
            console.error(err);
            setVerificationStep('idle');
            setStatusMessage('Failed to connect to verification service.');
        }
    };

    const handleRevoke = () => {
        router.post('/verification/simulate-ial2', {}, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 text-slate-100">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-100">
                                Sovereign Identity & Age Verification
                            </h3>
                            <p className="text-xs text-slate-400">Accredited Electronic Proofing & Zero-Knowledge Attestation</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 text-xs">
                    {isIdentityVerified && !isChangingMode && verificationStep !== 'complete' ? (
                        <div className="space-y-5">
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-emerald-300 text-sm">Account Verified</p>
                                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                            {verificationType === 'photo_only' ? 'Photo Only (Est. Age)' : 'NIST IAL2 (Standard)'}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed">
                                        {verificationType === 'photo_only' ? (
                                            <>
                                                Verified via <strong>Photo Only</strong>. Conservative lower-bound age is enforced{' '}
                                                {estimatedAge ? <span className="text-emerald-400 font-bold">({estimatedAge}+ years old)</span> : null} without storing or relying on an exact birthdate.
                                            </>
                                        ) : (
                                            <>
                                                Verified via <strong>Photo → Live → ID</strong> (Full NIST IAL2). Legal name and exact birthdate are confirmed on master root{' '}
                                                {dateOfBirth ? <span className="text-emerald-400 font-mono">({dateOfBirth})</span> : null}. Personas can still selectively disclose attributes or output boolean age gates without birthdate leakage.
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-slate-400">
                                <span className="font-semibold text-slate-300 block">Verification Status Controls:</span>
                                <p>Your account identity assurance level is active. You can re-run verification with a different tier below. Level adjustments and revocations are governed via the Administrator Panel.</p>
                            </div>

                            <div className="flex justify-end items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsChangingMode(true);
                                        setVerificationStep('idle');
                                    }}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition"
                                >
                                    Re-verify with Different Option
                                </button>
                            </div>
                        </div>
                    ) : verificationStep === 'complete' ? (
                        <div className="space-y-5 text-center py-4">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-base font-bold text-slate-100">Attestation Succeeded</h4>
                                <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
                                    Your verification has been recorded. Your sovereign personas can now output authenticated age assertions and verified claims.
                                </p>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-600/20"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    ) : verificationStep !== 'idle' ? (
                        <div className="space-y-6 text-center py-8">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto animate-pulse">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-slate-200">
                                    {diditSessionUrl ? 'Commercial Verification in Progress' : 'Initiating Handshake'}
                                </h4>
                                <p className="text-indigo-300 max-w-md mx-auto leading-relaxed font-mono text-[11px]">
                                    {statusMessage}
                                </p>
                            </div>

                            {diditSessionUrl && (
                                <div className="flex justify-center gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => window.open(diditSessionUrl, '_blank', 'width=600,height=750')}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Re-open Verification Window</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVerificationStep('idle');
                                            setDiditSessionUrl(null);
                                            setStatusMessage('');
                                        }}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                                    >
                                        Start Over
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Provider Badge */}
                            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-semibold text-slate-300">Identity Provider:</span>
                                    <span className="text-xs text-white font-medium">{providerName}</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                    Live eIDV
                                </span>
                            </div>

                            {/* Credit/Provider Policy Alert */}
                            {creditExplanation && (
                                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs space-y-2">
                                    <div className="flex items-center gap-2 font-bold text-amber-300">
                                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                                        <span>Commercial Provider Quota Notice</span>
                                    </div>
                                    <p className="leading-relaxed text-[11px] text-amber-200/90">{creditExplanation}</p>
                                    <div className="pt-1 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFlowMode('standard');
                                                setCreditExplanation(null);
                                            }}
                                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 shadow"
                                        >
                                            <UserCheck className="w-3 h-3" />
                                            <span>Switch to Free Tier (Option 2: NIST IAL2)</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCreditExplanation(null)}
                                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 mb-2">
                                    Choose Verification Approach:
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {/* Option 1: Photo Only */}
                                    <button
                                        type="button"
                                        onClick={() => setFlowMode('photo_only')}
                                        className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                                            flowMode === 'photo_only'
                                                ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                                                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-lg ${flowMode === 'photo_only' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                                                        <Camera className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-xs font-bold text-white">Option 1: Photo Only</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                                                    Fast & Less Intrusive
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                                                Rapid optical analysis of government ID or photo. Computes estimated age with a <strong>&plusmn;3 year variance</strong>.
                                            </p>
                                        </div>

                                        <div className="pt-2 border-t border-slate-800/80 text-[10px] space-y-1">
                                            <div className="text-indigo-300 font-medium flex items-center gap-1">
                                                <Info className="w-3 h-3 shrink-0" />
                                                <span>Conservative: Always takes lowest bound (Age &minus; 3)</span>
                                            </div>
                                            <div className="text-slate-400">
                                                Does not store or rely on exact birthdates. Not 100% accurate, but zero birthdate exposure.
                                            </div>
                                        </div>
                                    </button>

                                    {/* Option 2: Photo -> Live -> ID */}
                                    <button
                                        type="button"
                                        onClick={() => setFlowMode('standard')}
                                        className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                                            flowMode === 'standard'
                                                ? 'bg-emerald-600/15 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                                                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-lg ${flowMode === 'standard' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                                        <UserCheck className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-xs font-bold text-white">Option 2: Photo &rarr; Live &rarr; ID</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                                    NIST IAL2 Full
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                                                Full accredited pipeline: Document OCR, 3D passive selfie liveness, and 1:1 facial biometric matching.
                                            </p>
                                        </div>

                                        <div className="pt-2 border-t border-slate-800/80 text-[10px] space-y-1">
                                            <div className="text-emerald-300 font-medium flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3 shrink-0" />
                                                <span>Confirms exact legal name & date of birth</span>
                                            </div>
                                            <div className="text-slate-400">
                                                Synchronizes master user root. Personas can still remain pseudonymized and hide DOB.
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Summary callout */}
                            <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl text-slate-400 text-[11px] flex items-start gap-2.5">
                                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-slate-200 font-semibold">Zero-Knowledge Guarantee: </span>
                                    <span>
                                        Verification runs directly through Didit's secure encrypted gateway. TrustAuth immediately purges document images post-verification.
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleStartVerification}
                                    className={`px-5 py-2.5 rounded-xl font-bold transition shadow-lg flex items-center gap-2 text-white ${
                                        flowMode === 'photo_only'
                                            ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                                            : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                                    }`}
                                >
                                    <span>
                                        {flowMode === 'photo_only' ? 'Launch Photo Verification \u2192' : 'Launch Full NIST IAL2 Verification \u2192'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

