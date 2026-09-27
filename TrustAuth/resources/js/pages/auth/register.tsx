import { Head, Link, useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import React from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        date_of_birth: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Create Account — TrustAuth" />
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

                <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="flex justify-center">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <span className="font-extrabold text-white text-xl">T</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">TrustAuth</span>
                        </Link>
                    </div>
                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-100">
                        Create your master identity
                    </h2>
                    <p className="mt-2 text-center text-xs text-slate-400">
                        Already have an identity root?{' '}
                        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition">
                            Sign in to existing account
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
                        <form className="space-y-4" onSubmit={submit}>
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Full Legal Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. John Smith"
                                    className="block w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Primary Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    className="block w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Date of Birth (Optional for Parametric Age Gates)
                                </label>
                                <input
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className="block w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition [color-scheme:dark]"
                                />
                                <p className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span>Preserved on master ID only. Relying parties receive only boolean verification flags.</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Master Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••••••"
                                    className="block w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••••••"
                                    className="block w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/25 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
                                >
                                    {processing ? 'Registering Root Identity...' : 'Initialize Identity & Enter'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                By registering, you initialize an encrypted sovereign root. You can create multiple selective-disclosure personas afterwards.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
