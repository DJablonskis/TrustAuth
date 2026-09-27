import { Head, Link } from '@inertiajs/react';
import { BookOpen, KeyRound, Shield, UserCheck, Zap } from 'lucide-react';
import React from 'react';

interface Props {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function Welcome({ auth }: Props) {
    const isLoggedIn = !!auth?.user;

    return (
        <>
            <Head title="TrustAuth — Identity Provider" />
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
                {/* Background Ambient Lighting */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

                {/* Top Navigation */}
                <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <span className="font-extrabold text-white text-lg">T</span>
                            </div>
                            <div>
                                <span className="font-bold text-lg tracking-tight text-white block">TrustAuth</span>
                                <span className="text-[10px] text-slate-400 font-medium block -mt-1 tracking-wide">IDENTITY PROVIDER</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/docs"
                                className="text-xs font-semibold px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-850 rounded-lg transition flex items-center gap-1.5"
                            >
                                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                                <span>API & Developer Docs</span>
                            </Link>

                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-2"
                                >
                                    <span>Open Dashboard ({auth.user?.name})</span>
                                    <span>→</span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2.5">
                                    <Link
                                        href="/login"
                                        className="text-xs font-semibold px-3.5 py-2 text-slate-300 hover:text-white transition"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20 transition"
                                    >
                                        Create Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
                            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                            Decoupled OIDC & OAuth 2.0 Persona Architecture
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                            Identity without <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                                Context Collapse
                            </span>
                        </h1>

                        <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            Separate your real-world legal root from contextual digital personas. Selective claim disclosure, parametric zero-knowledge age verification, and automated GDPR Article 17 outbound erasure webhooks.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-xl shadow-indigo-600/25 flex items-center gap-2"
                                >
                                    <span>Go to Identity Dashboard</span>
                                    <span>→</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/register"
                                        className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-xl shadow-indigo-600/25 flex items-center gap-2"
                                    >
                                        <span>Get Started Free</span>
                                        <span>→</span>
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition"
                                    >
                                        Sign In to Personas
                                    </Link>
                                    <a
                                        href="/login-as-test"
                                        className="px-5 py-3 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition flex items-center gap-1.5"
                                    >
                                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Quick Demo Login</span>
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Feature Pillars */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                                <UserCheck className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-base font-bold text-slate-100 mb-2">Contextual Personas</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Present specific aliases, avatars, pronouns, and custom claims to gaming platforms, workplace portals, or e-commerce without linking your underlying master identity.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                                <Shield className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-base font-bold text-slate-100 mb-2">Didit Commercial KYC & Zero-DOB Age Gates</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Automated document OCR, 3D passive selfie liveness, and zero-knowledge age assertions (<code className="text-emerald-400">age_is_over_21</code>). Full IAL2 proof without birthdate leakage or persistent image storage.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition">
                            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-lg mb-4">
                                <KeyRound className="w-5 h-5 text-violet-400" />
                            </div>
                            <h3 className="text-base font-bold text-slate-100 mb-2">GDPR Article 17 Erasure Ledger</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Single-click revocation triggers cryptographically signed outbound HMAC webhooks to downstream consumer apps, executing verifiable data erasure.
                            </p>
                        </div>
                    </div>

                    {/* Developer Teaser Strip */}
                    <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                                For Developers & Partners
                            </div>
                            <h4 className="text-lg font-bold text-slate-100">Integrate TrustAuth in 5 Minutes</h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-xl">
                                Standard OIDC discovery endpoint, RFC 9110 content negotiation across 10 alphabets, and ready-to-use Node.js, Python, and cURL snippets.
                            </p>
                        </div>
                        <Link
                            href="/docs"
                            className="shrink-0 px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition flex items-center gap-2"
                        >
                            <span>Browse Developer Docs</span>
                            <span>→</span>
                        </Link>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p>© 2026 TrustAuth Project. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <Link href="/docs" className="hover:text-slate-300 transition">API Documentation</Link>
                            <Link href="/governance" className="hover:text-slate-300 transition">Privacy Hub</Link>
                            <Link href="/login" className="hover:text-slate-300 transition">Sign In</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
