import { Head, Link, useForm } from '@inertiajs/react';
import { Zap } from 'lucide-react';
import React from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Sign In — TrustAuth" />
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

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
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-xs text-slate-400">
                        Or{' '}
                        <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition">
                            create a new decentralized master identity
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
                        <form className="space-y-5" onSubmit={submit}>
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="user@example.com"
                                    className="block w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Password
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
                                    <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30 h-4 w-4"
                                    />
                                    <span className="text-xs text-slate-400">Remember session</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/25 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
                            >
                                {processing ? 'Authenticating...' : 'Sign in to Dashboard'}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-800" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-900 px-3 text-slate-500 font-medium tracking-wider">
                                        Evaluation Quickpass
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href="/login-as-test"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/70 hover:bg-slate-800 hover:text-white transition shadow-sm"
                                >
                                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Instant Demo User Sign-in</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
