import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { ConnectedClient, ErasureLog } from '../types';

/**
 * Props Interface
 * Interface for the properties passed down to the Governance view component by the controller.
 */
interface Props {
    connectedClients: ConnectedClient[]; // List of active client connections
    erasureLogs: ErasureLog[]; // Log of GDPR right-to-erasure webhook jobs
}

// GDPR erasure requests and connected clients view
export default function Governance({ connectedClients = [], erasureLogs = [] }: Props) {
    // Search query states for filtering connected clients and logs
    const [clientSearch, setClientSearch] = useState('');
    const [logSearch, setLogSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    /**
     * Handles the revocation and erasure request flow.
     * Invokes confirmation dialog and posts to the revocation backend.
     */
    const handleRevokeAndErase = (clientId: string, clientName: string) => {
        const confirmMsg = `WARNING: Revoking "${clientName}" will immediately invalidate all active access tokens and invoke a GDPR Article 17 Right to Erasure webhook to erase your data from their systems. Are you sure you want to proceed?`;
        
        if (window.confirm(confirmMsg)) {
            // Initiate Inertia post request to trigger backend revocation and job queuing
            router.post('/governance/revoke', { client_id: clientId }, {
                preserveScroll: true,
                onSuccess: () => {
                    // Successfully initiated revocation
                }
            });
        }
    };

    // Filter connected applications based on search query
    const filteredClients = connectedClients.filter(conn =>
        conn.client.name.toLowerCase().includes(clientSearch.toLowerCase())
    );

    // Filter erasure logs based on search query and selected status filter
    const filteredLogs = erasureLogs.filter(log => {
        const matchesSearch = log.client_name.toLowerCase().includes(logSearch.toLowerCase()) ||
                             log.id.toLowerCase().includes(logSearch.toLowerCase());
        const matchesStatus = statusFilter === 'all' || log.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    /**
     * Maps log status value to CSS class strings for badge coloring.
     */
    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
            case 'pending':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
            case 'processing':
                return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25 animate-pulse';
            case 'failed':
            default:
                return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
        }
    };

    /**
     * Format timestamp to a human-readable format.
     */
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans antialiased">
            {/* Header & Navigation Bar */}
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    {/* Brand Logo Symbol */}
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="font-extrabold text-white text-lg">T</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                            TrustAuth Active Governance
                        </h1>
                        <p className="text-xs text-slate-400">Connected apps and data erasure requests</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Back to Identity Dashboard link */}
                    <Link
                        href="/dashboard"
                        className="text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg transition-all shadow-sm flex items-center gap-2"
                    >
                        {/* Simple arrow left icon */}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Identity Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
                {/* Info Block explaining Right to Erasure / GDPR Article 17 compliance */}
                <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-5 pointer-events-none">
                        <svg className="w-64 h-64 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-indigo-300">Privacy-Preserving Governance</h3>
                            <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
                                Under GDPR Article 17, you hold the absolute right to have your personal data erased from third-party systems. 
                                TrustAuth manages this via a secure Intercepting Filter architecture. Revoking access invalidates OAuth tokens 
                                and instantly schedules an asynchronous callback webhook that instructs client applications to delete your associated user attributes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid for Active Connections & Erasure History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Active Connections Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-200">Connected Applications</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Active OAuth client integrations.</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                {connectedClients.length}
                            </span>
                        </div>

                        {/* Search Input for Connected Clients */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search integrations..."
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                            />
                        </div>

                        {/* Connected Applications List */}
                        {filteredClients.length === 0 ? (
                            <div className="border border-dashed border-slate-800 bg-slate-900/20 rounded-2xl p-8 text-center text-slate-500">
                                <p className="text-xs font-medium">No matching active connections.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredClients.map((app) => (
                                    <div 
                                        key={app.client.id || app.id} 
                                        className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col justify-between gap-4 hover:border-slate-700/60 transition group"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* App Logo Placeholder */}
                                            <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700/50 group-hover:border-indigo-500/30 transition">
                                                <span className="font-bold text-xs text-slate-400 group-hover:text-indigo-400 transition">
                                                    {(app.client.name || 'A').substring(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="font-semibold text-sm text-slate-200 group-hover:text-white transition truncate">
                                                        {app.client.name}
                                                    </h4>
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                                        {app.token_count || 1} {(app.token_count || 1) === 1 ? 'session' : 'sessions'}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                                                    Client ID: <span className="font-mono text-slate-400">{app.client.id}</span>
                                                </p>
                                                {app.scopes && app.scopes.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {app.scopes.map((scope) => (
                                                            <span key={scope} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                                                                {scope}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-[10px]">
                                            <span className="text-slate-500">
                                                {app.last_active_at ? `Active ${new Date(app.last_active_at).toLocaleDateString()}` : 'Authorized'}
                                            </span>
                                            <button
                                                onClick={() => handleRevokeAndErase(app.client.id, app.client.name)}
                                                className="text-[10px] font-bold bg-rose-600/90 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-600/10 text-white px-3.5 py-1.5 rounded-lg transition"
                                            >
                                                Revoke & Erase
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Erasure Request History Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-3 gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-200">Erasure Request History</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Audit log of outbound GDPR deletion requests.</p>
                            </div>
                            
                            <div className="flex gap-2">
                                {/* Status Filter selector */}
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Input for Logs */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search logs by client or UUID..."
                                value={logSearch}
                                onChange={(e) => setLogSearch(e.target.value)}
                                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                            />
                        </div>

                        {/* Erasure Logs List */}
                        {filteredLogs.length === 0 ? (
                            <div className="border border-dashed border-slate-800 bg-slate-900/20 rounded-2xl p-12 text-center text-slate-500">
                                <p className="text-xs font-medium">No matching right-to-erasure logs found.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden border border-slate-800/80 rounded-2xl bg-slate-900/40 backdrop-blur-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-900/80">
                                                <th className="px-5 py-4">Client / Log Details</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4 text-center">Webhook Retries</th>
                                                <th className="px-5 py-4 text-right">Requested At</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {filteredLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-800/20 transition group">
                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-xs text-slate-200 group-hover:text-slate-100 transition">
                                                            {log.client_name}
                                                        </div>
                                                        <div className="text-[9px] text-slate-500 font-mono mt-1">
                                                            ID: {log.id}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadgeClass(log.status)}`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center text-xs font-medium text-slate-300">
                                                        {log.attempts} / 3
                                                    </td>
                                                    <td className="px-5 py-4 text-right text-[10px] text-slate-400 font-medium">
                                                        {formatDate(log.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
