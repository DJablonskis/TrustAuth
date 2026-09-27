import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, BookOpen, CheckCircle, Clock, Shield, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface PartnerClient {
    id: string;
    name: string;
    redirect: string;
    personal_access_client: boolean;
    password_client: boolean;
    revoked: boolean;
    created_at: string | null;
    tokens: {
        total: number;
        active: number;
        revoked: number;
        expired: number;
    };
    scopes: string[];
    erasures: {
        total: number;
        completed: number;
        failed: number;
        pending: number;
    };
    is_abusing_webhooks: boolean;
}

interface ErasureLog {
    id: string;
    user_id: number;
    client_id: string;
    client_name: string;
    status: 'pending' | 'completed' | 'failed';
    attempts: number;
    response_code?: number | null;
    last_attempt_at?: string | null;
    created_at: string;
}

interface GlobalStats {
    total_partners: number;
    active_partners: number;
    suspended_partners: number;
    total_tokens_minted: number;
    active_tokens: number;
    total_erasures: number;
    failed_erasures: number;
    completed_erasures: number;
    webhook_success_rate: number;
}

interface UserRecord {
    id: number;
    name: string;
    email: string;
    is_identity_verified: boolean;
    verification_type?: string | null;
    estimated_age?: number | null;
    date_of_birth: string | null;
    personas_count: number;
    created_at: string | null;
}

interface Props {
    globalStats: GlobalStats;
    partners: PartnerClient[];
    erasureLogs: ErasureLog[];
    users?: UserRecord[];
}

export default function AdminGovernance({ globalStats, partners = [], erasureLogs = [], users = [] }: Props) {
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'abusive'>('all');
    const [adminSection, setAdminSection] = useState<'partners' | 'users' | 'webhooks'>('partners');

    // Toggle user IAL status
    const handleToggleUserIal = (user: UserRecord) => {
        const nextState = user.is_identity_verified ? 'IAL1 (Standard)' : 'IAL2 (High Assurance)';
        if (!confirm(`Are you sure you want to manually change ${user.name}'s identity assurance to ${nextState}?`)) {
            return;
        }

        setActionLoading(`user_${user.id}`);
        router.post(`/admin/governance/users/${user.id}/toggle-ial`, {}, {
            onFinish: () => setActionLoading(null),
            preserveScroll: true,
        });
    };

    // Toggle partner suspension state
    const handleToggleStatus = (clientId: string, clientName: string, isRevoked: boolean) => {
        const actionWord = isRevoked ? 'activate' : 'suspend';
        if (!confirm(`Are you sure you want to ${actionWord} partner "${clientName}"? Suspended clients cannot mint tokens.`)) {
            return;
        }

        setActionLoading(clientId);
        router.post(`/admin/governance/clients/${clientId}/toggle-status`, {}, {
            onFinish: () => setActionLoading(null),
            preserveScroll: true,
        });
    };

    // Retry failed webhook
    const handleRetryWebhook = (erasureId: string) => {
        setActionLoading(erasureId);
        router.post(`/admin/governance/erasures/${erasureId}/retry`, {}, {
            onFinish: () => setActionLoading(null),
            preserveScroll: true,
        });
    };

    // Filter partners
    const filteredPartners = partners.filter(p => {
        if (filterStatus === 'active') return !p.revoked;
        if (filterStatus === 'suspended') return p.revoked;
        if (filterStatus === 'abusive') return p.is_abusing_webhooks;
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
            <Head title="Super Admin - Partner & Webhook Control" />

            {/* Top Navigation */}
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold tracking-tight text-white">TrustAuth Super Admin</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                                Partner Control
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Relying Party Telemetry, Token Distributions & Webhook Health</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
                    >
                        User Dashboard
                    </Link>
                    <Link
                        href="/governance"
                        className="text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
                    >
                        User Privacy Hub
                    </Link>
                    <Link
                        href="/docs"
                        className="text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                    >
                        <BookOpen className="w-3.5 h-3.5 text-white" />
                        <span>API Docs</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
                {/* Global KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Registered Partners</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-indigo-400">{globalStats.total_partners}</span>
                            <span className="text-xs text-slate-500">({globalStats.active_partners} active, {globalStats.suspended_partners} suspended)</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Active OAuth Tokens</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-emerald-400">{globalStats.active_tokens}</span>
                            <span className="text-xs text-slate-500">/ {globalStats.total_tokens_minted} minted total</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">GDPR Webhook Success</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-violet-400">{globalStats.webhook_success_rate}%</span>
                            <span className="text-xs text-slate-500">({globalStats.completed_erasures} ok, {globalStats.failed_erasures} failed)</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Abuse & Flapping Alerts</div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-extrabold ${globalStats.failed_erasures > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                                {partners.filter(p => p.is_abusing_webhooks).length}
                            </span>
                            <span className="text-xs text-slate-500">abusive partner endpoints</span>
                        </div>
                    </div>
                </div>

                {/* Section 1: Partner Applications Management */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <span>Connected Applications</span>
                                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                                    {filteredPartners.length} of {partners.length}
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                View token usage, granted scopes, and toggle active status.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 py-1.5 rounded-lg font-medium transition ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                All ({partners.length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('active')}
                                className={`px-3 py-1.5 rounded-lg font-medium transition ${filterStatus === 'active' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                Active ({partners.filter(p => !p.revoked).length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('suspended')}
                                className={`px-3 py-1.5 rounded-lg font-medium transition ${filterStatus === 'suspended' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                Suspended ({partners.filter(p => p.revoked).length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('abusive')}
                                className={`px-3 py-1.5 rounded-lg font-medium transition ${filterStatus === 'abusive' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                Abusive / Flapping ({partners.filter(p => p.is_abusing_webhooks).length})
                            </button>
                        </div>
                    </div>

                    {/* Partners Table */}
                    <div className="overflow-x-auto border border-slate-800 rounded-xl">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                                <tr>
                                    <th className="p-3">Partner Client</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Active Tokens</th>
                                    <th className="p-3">Token Breakdown</th>
                                    <th className="p-3">Granted Scopes</th>
                                    <th className="p-3">Erasure Webhooks</th>
                                    <th className="p-3 text-right">Admin Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80 text-slate-300">
                                {filteredPartners.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-850/50 transition">
                                        <td className="p-3">
                                            <div className="font-bold text-slate-100">{client.name}</div>
                                            <div className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]" title={client.id}>
                                                ID: {client.id}
                                            </div>
                                            <div className="text-[10px] text-slate-400 truncate max-w-[220px]" title={client.redirect}>
                                                URI: {client.redirect}
                                            </div>
                                        </td>

                                        <td className="p-3">
                                            {client.revoked ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                                    Suspended
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                    Operational
                                                </span>
                                            )}
                                            {client.is_abusing_webhooks && (
                                                <div className="mt-1">
                                                     <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                                         <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" /><span>Flapping Webhook</span>
                                                     </span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="p-3">
                                            <span className="text-base font-extrabold text-emerald-400">{client.tokens.active}</span>
                                            <span className="text-[11px] text-slate-500 ml-1">sessions</span>
                                        </td>

                                        <td className="p-3 font-mono text-[11px] space-y-0.5 text-slate-400">
                                            <div>Total: <span className="text-slate-200">{client.tokens.total}</span></div>
                                            <div>Revoked: <span className="text-rose-400">{client.tokens.revoked}</span></div>
                                            <div>Expired: <span className="text-slate-500">{client.tokens.expired}</span></div>
                                        </td>

                                        <td className="p-3">
                                            <div className="flex flex-wrap gap-1 max-w-[240px]">
                                                {client.scopes.length > 0 ? (
                                                    client.scopes.map(s => (
                                                        <span key={s} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-indigo-300 border border-slate-700">
                                                            {s}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-500 text-[11px] italic">No active scopes</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-3 font-mono text-[11px]">
                                            <div className="text-slate-300">Dispatched: {client.erasures.total}</div>
                                            <div className="text-emerald-400">Success: {client.erasures.completed}</div>
                                            {client.erasures.failed > 0 && (
                                                <div className="text-rose-400 font-bold">Failed: {client.erasures.failed}</div>
                                            )}
                                        </td>

                                        <td className="p-3 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(client.id, client.name, client.revoked)}
                                                disabled={actionLoading === client.id}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm ${
                                                    client.revoked
                                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                                                } disabled:opacity-50`}
                                            >
                                                {actionLoading === client.id ? 'Updating...' : client.revoked ? 'Activate' : 'Suspend'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 2: User Sovereign Identity & IAL Assurance Override */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <span>Master Sovereign Identities & IAL Assurance Levels</span>
                                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                                    {users.length} Users
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Administrative oversight for NIST SP 800-63-4 IAL elevation and manual assurance override.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-800 rounded-xl">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                                <tr>
                                    <th className="p-3">User / Sovereign Root</th>
                                    <th className="p-3">Current IAL Level</th>
                                    <th className="p-3">Attested Birthdate</th>
                                    <th className="p-3">Active Personas</th>
                                    <th className="p-3">Registered Since</th>
                                    <th className="p-3 text-right">Admin IAL Override</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80 text-slate-300">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-850/50 transition">
                                        <td className="p-3">
                                            <div className="font-bold text-slate-100">{u.name}</div>
                                            <div className="text-[11px] text-slate-400">{u.email}</div>
                                            <div className="font-mono text-[10px] text-slate-500">UID: {u.id}</div>
                                        </td>
                                        <td className="p-3">
                                            {u.is_identity_verified ? (
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                        IAL2 (High Assurance)
                                                    </span>
                                                    <div className="text-[10px] text-slate-400 font-mono">
                                                        {u.verification_type === 'photo_only' ? 'Photo Only (Est. Age)' : 'Standard (Live ID)'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                                    IAL1 (Standard)
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3 font-mono text-[11px]">
                                            {u.verification_type === 'photo_only' ? (
                                                <span className="text-indigo-300 font-semibold">
                                                    Est. {u.estimated_age ? `${u.estimated_age}+ yrs` : 'Lower bound active'}
                                                </span>
                                            ) : u.date_of_birth ? (
                                                <span className="text-slate-300">{u.date_of_birth}</span>
                                            ) : (
                                                <span className="text-slate-500 italic">Unpopulated</span>
                                            )}
                                        </td>
                                        <td className="p-3 font-bold text-indigo-400">
                                            {u.personas_count} personas
                                        </td>
                                        <td className="p-3 text-[10px] text-slate-500">
                                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-3 text-right">
                                            <button
                                                onClick={() => handleToggleUserIal(u)}
                                                disabled={actionLoading === `user_${u.id}`}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm ${
                                                    u.is_identity_verified
                                                        ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30'
                                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                                } disabled:opacity-50`}
                                            >
                                                {actionLoading === `user_${u.id}`
                                                    ? 'Updating...'
                                                    : u.is_identity_verified
                                                        ? 'Demote to IAL1'
                                                        : 'Elevate to IAL2'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 2: Global GDPR Erasure Webhooks Audit Log */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <span>GDPR Erasure Webhook Log</span>
                                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                                    Last {erasureLogs.length} Events
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                Outbound HMAC-SHA256 erasure webhooks and delivery status.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-800 rounded-xl">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                                <tr>
                                    <th className="p-3">Erasure UUID</th>
                                    <th className="p-3">Partner Client</th>
                                    <th className="p-3">Persona Subject</th>
                                    <th className="p-3">Delivery Status</th>
                                    <th className="p-3">Attempts</th>
                                    <th className="p-3">HTTP Code</th>
                                    <th className="p-3">Timestamp</th>
                                    <th className="p-3 text-right">Intervention</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80 text-slate-300">
                                {erasureLogs.length > 0 ? (
                                    erasureLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-slate-850/50 transition font-mono">
                                            <td className="p-3 text-slate-400 text-[10px]">
                                                {log.id.slice(0, 8)}...{log.id.slice(-4)}
                                            </td>
                                            <td className="p-3 font-sans font-bold text-slate-200">
                                                {log.client_name}
                                            </td>
                                            <td className="p-3 text-slate-400">
                                                sub:{log.user_id}
                                            </td>
                                            <td className="p-3 font-sans">
                                                {log.status === 'completed' && (
                                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /><span>Completed</span>
                                                    </span>
                                                )}
                                                {log.status === 'pending' && (
                                                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /><span>Pending Dispatch</span>
                                                    </span>
                                                )}
                                                {log.status === 'failed' && (
                                                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-semibold flex items-center gap-1">
                                                        <XCircle className="w-3 h-3" /><span>Failed Exhausted</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 text-slate-300">
                                                {log.attempts} / 3
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                    log.response_code === 200 
                                                        ? 'bg-emerald-500/10 text-emerald-400' 
                                                        : log.response_code 
                                                            ? 'bg-rose-500/10 text-rose-400' 
                                                            : 'bg-slate-800 text-slate-500'
                                                }`}>
                                                    {log.response_code ? `${log.response_code}` : 'None'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-[10px] text-slate-500 font-sans">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="p-3 text-right font-sans">
                                                {log.status === 'failed' && (
                                                    <button
                                                        onClick={() => handleRetryWebhook(log.id)}
                                                        disabled={actionLoading === log.id}
                                                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold transition disabled:opacity-50"
                                                    >
                                                        {actionLoading === log.id ? 'Dispatching...' : 'Force Retry'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="p-6 text-center text-slate-500 italic font-sans">
                                            No webhook erasure records in the audit ledger.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

