module.exports = function renderHome(webhookLogs, config) {
    const { TRUSTAUTH_BASE, CLIENT_ID, REDIRECT_URI } = config;
    
    let logsHtml = webhookLogs.length === 0 
        ? '<p class="text-sm text-slate-500 italic py-4">No webhook calls received yet. Trigger a revocation on TrustAuth to send webhooks here.</p>'
        : webhookLogs.map((log) => `
            <div class="border-b border-slate-800 py-4 last:border-0">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-mono text-emerald-400 font-semibold">${log.timestamp}</span>
                    <div class="flex items-center gap-1.5">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">HMAC-SHA256 VERIFIED</span>
                        <span class="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">event: ${log.payload.event}</span>
                    </div>
                </div>
                <div class="text-[10px] text-slate-400 mb-1 font-mono">Nonce: ${log.nonce || 'N/A'} | Sig: ${log.signature || 'Verified'}</div>
                <pre class="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800/80">${JSON.stringify(log.payload, null, 2)}</pre>
            </div>
        `).join('');

    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left panel: Trigger buttons -->
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h2 class="text-xl font-bold mb-2 text-indigo-400">Initiate Login Flow</h2>
                    <p class="text-sm text-slate-400 mb-6">Redirect to TrustAuth Identity Provider. Authenticate and select a persona card.</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Standard Auth (IAL1) -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <h3 class="font-semibold text-slate-200 text-sm">Standard OIDC</h3>
                                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">IAL1/IAL2</span>
                                </div>
                                <p class="text-xs text-slate-400 mb-3">Requests basic profile and email alias.</p>
                            </div>
                            <a href="${TRUSTAUTH_BASE}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile+email" 
                               class="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition">
                                Login Standard
                            </a>
                        </div>

                        <!-- Age Verification Auth (IAL2) -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <h3 class="font-semibold text-slate-200 text-sm">Age Assured</h3>
                                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">UK Safety Act</span>
                                </div>
                                <p class="text-xs text-slate-400 mb-3">Requests boolean age verification (is_over_16).</p>
                            </div>
                            <a href="${TRUSTAUTH_BASE}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile+email+age_verified" 
                               class="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition shadow-md shadow-violet-600/10">
                                Login with Age Gate
                            </a>
                        </div>

                        <!-- Adult & Pronouns (IAL2) -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <h3 class="font-semibold text-slate-200 text-sm">Adult & Pronouns</h3>
                                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">18+ / Grammar</span>
                                </div>
                                <p class="text-xs text-slate-400 mb-3">Requests age 18+ and grammatical pronoun cases.</p>
                            </div>
                            <a href="${TRUSTAUTH_BASE}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile+email+age_over_18+pronouns" 
                               class="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition">
                                Login Adult + Pronouns
                            </a>
                        </div>

                        <!-- KYC Legal Identity (Strict IAL2) -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <h3 class="font-semibold text-slate-200 text-sm">KYC Legal Name</h3>
                                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Strict IAL2</span>
                                </div>
                                <p class="text-xs text-slate-400 mb-3">Requests verified legal passport name for AML.</p>
                            </div>
                            <a href="${TRUSTAUTH_BASE}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile+email+legal_name" 
                               class="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition">
                                Login KYC Compliance
                            </a>
                        </div>

                        <!-- Dynamic Parametric Age Gate (age_is_over_21) -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <h3 class="font-semibold text-slate-200 text-sm">Parametric Age Gate</h3>
                                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Dynamic ZK</span>
                                </div>
                                <p class="text-xs text-slate-400 mb-3">Zero-knowledge proof for age_is_over_21 & age_is_over_18 without birthdate leakage.</p>
                            </div>
                            <a href="${TRUSTAUTH_BASE}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile+email+age_is_over_21+age_is_over_18" 
                               class="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition">
                                Login Age Gate (21+)
                            </a>
                        </div>

                        <!-- Zero-PII Pseudonym Scope (IAL1) -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <h3 class="font-semibold text-slate-200 text-sm">Zero-PII Pairwise Pseudonym</h3>
                                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Zero-Leakage</span>
                                </div>
                                <p class="text-xs text-slate-400 mb-3">Requests strictly a non-correlatable pairwise pseudonym, disclosing 0 personal data.</p>
                            </div>
                            <a href="${TRUSTAUTH_BASE}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=pseudonym" 
                               class="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-600 rounded-lg transition">
                                Login Anonymous / Pseudonym
                            </a>
                        </div>

                        <!-- E-Commerce Checkout (Custom shipping_address Scope) -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition flex flex-col justify-between sm:col-span-2">
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <h3 class="font-semibold text-slate-200 text-sm">E-Commerce Checkout (Custom Scope)</h3>
                                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">In-Flight Provisioning</span>
                                </div>
                                <p class="text-xs text-slate-400 mb-3">Requests custom <code>shipping_address</code> scope. If missing on persona, provision it in-flight without aborting!</p>
                            </div>
                            <a href="${TRUSTAUTH_BASE}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile+shipping_address" 
                               class="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition">
                                Login E-Commerce (Requires Shipping Address)
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right panel: Outbound GDPR Webhook monitor -->
            <div class="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <h2 class="text-lg font-bold text-slate-200">GDPR Erasure Logs</h2>
                    <button onclick="window.location.reload()" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center">
                        Refresh Logs
                    </button>
                </div>
                <div class="flex-grow overflow-y-auto max-h-[450px]">
                    ${logsHtml}
                </div>
            </div>
        </div>
    `;
};
