module.exports = function renderSuccess(decodedPayload, accessToken) {
    return `
        <div class="space-y-6">
            <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 shadow-xl flex items-center space-x-4">
                <div class="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl font-bold">&#10003;</div>
                <div>
                    <h2 class="text-xl font-bold text-emerald-400">Authentication Successful</h2>
                    <p class="text-xs text-slate-400">Tokens successfully issued by TrustAuth. Selected identity claims & live OpenID Connect profile are shown below.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Token payload data -->
                <div class="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 class="font-bold text-slate-200">Decoded JWT Payload</h3>
                    <pre class="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 border border-slate-800 overflow-x-auto">${JSON.stringify(decodedPayload, null, 2)}</pre>
                </div>

                <!-- Session Metadata -->
                <div class="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                    <div class="space-y-4">
                        <h3 class="font-bold text-slate-200">Session Metadata & Privacy Claims</h3>
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                                <span class="block text-slate-500 font-semibold mb-1">Target Persona ID (sub)</span>
                                <span class="font-mono text-slate-300">${decodedPayload.sub || 'N/A'}</span>
                            </div>
                            <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                                <span class="block text-slate-500 font-semibold mb-1">Age Verification</span>
                                <span class="font-semibold ${decodedPayload.is_over_16 ? 'text-emerald-400' : (decodedPayload.is_over_18 ? 'text-amber-400' : 'text-slate-400')}">
                                    ${decodedPayload.is_over_18 ? 'verified_over_18' : (decodedPayload.is_over_16 ? 'verified_over_16' : 'not_requested / unverified')}
                                </span>
                            </div>
                            <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800 col-span-2">
                                <span class="block text-slate-500 font-semibold mb-1">Active Scopes</span>
                                <div class="flex flex-wrap gap-1">
                                    ${(decodedPayload.scopes || []).map(s => `<span class="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono text-[10px]">${s}</span>`).join('') || '<span class="text-slate-500">None</span>'}
                                </div>
                            </div>
                            ${decodedPayload.pronouns ? `
                            <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800 col-span-2">
                                <span class="block text-slate-500 font-semibold mb-1">Grammatical Pronouns</span>
                                <span class="text-amber-400 font-medium">${decodedPayload.pronouns.display || decodedPayload.pronouns.subject + '/' + decodedPayload.pronouns.object}</span>
                            </div>` : ''}
                        </div>
                        <div class="bg-slate-900/60 p-4 rounded-lg border border-slate-800 text-xs">
                            <span class="block text-slate-500 font-semibold mb-2">Bearer Access Token</span>
                            <textarea readonly class="w-full h-16 bg-slate-950 text-slate-400 font-mono p-2 rounded border border-slate-800 text-[10px] resize-none focus:outline-none">${accessToken}</textarea>
                        </div>
                    </div>
                    <a href="/" class="inline-flex justify-center w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg transition text-slate-300">
                        Back to Launcher
                    </a>
                </div>
            </div>

            <!-- Live OIDC UserInfo REST API Panel -->
            <div class="bg-slate-950/40 border border-indigo-900/40 rounded-2xl p-6 shadow-xl space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">GET /api/v1/userinfo</span>
                            <h3 class="font-bold text-slate-100">Live OIDC Profile Consumption (RFC 9110 Content Negotiation)</h3>
                        </div>
                        <p class="text-xs text-slate-400 mt-1">This third-party client queries TrustAuth's headless REST API with bearer token authentication. Click a locale below to test live script negotiation across world alphabets:</p>
                    </div>
                    <span id="status-badge" class="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">200 OK</span>
                </div>

                <!-- Locale Switcher Buttons -->
                <div class="flex flex-wrap gap-2 text-xs">
                    <button onclick="fetchUserInfo('en-US')" class="locale-btn px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition">English (Latin)</button>
                    <button onclick="fetchUserInfo('el-GR')" class="locale-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Greek (Ελληνικά)</button>
                    <button onclick="fetchUserInfo('ar-SA')" class="locale-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Arabic (العربية RTL)</button>
                    <button onclick="fetchUserInfo('ja-JP')" class="locale-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Japanese (カタカナ)</button>
                    <button onclick="fetchUserInfo('ru-RU')" class="locale-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Russian (Кириллица)</button>
                    <button onclick="fetchUserInfo('hi-IN')" class="locale-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Hindi (देवनागरी)</button>
                    <button onclick="fetchUserInfo('ko-KR')" class="locale-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Korean (한국어)</button>
                    <button onclick="fetchUserInfo('he-IL')" class="locale-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Hebrew (עברית RTL)</button>
                    <button onclick="fetchUserInfo('ka-GE')" class="locale-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Georgian (ქართული)</button>
                    <button onclick="fetchUserInfo('lt-LT')" class="locale-btn px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Lithuanian (Lietuvių)</button>
                </div>

                <!-- Live UserInfo Response Output -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2">
                        <pre id="userinfo-raw" class="bg-slate-950 p-4 rounded-xl text-xs font-mono text-cyan-300 border border-slate-800 overflow-x-auto min-h-[180px]">Loading UserInfo...</pre>
                    </div>
                    <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                        <div>
                            <span class="block text-slate-500 font-semibold mb-0.5">Negotiated Name:</span>
                            <span id="ui-name" class="font-bold text-base text-white">...</span>
                        </div>
                        <div>
                            <span class="block text-slate-500 font-semibold mb-0.5">Resolved Script:</span>
                            <span id="ui-script" class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">...</span>
                        </div>
                        <div>
                            <span class="block text-slate-500 font-semibold mb-0.5">Direction:</span>
                            <span id="ui-direction" class="font-mono text-slate-300">...</span>
                        </div>
                        <div>
                            <span class="block text-slate-500 font-semibold mb-0.5">Assurance Level:</span>
                            <span id="ui-assurance" class="font-semibold text-emerald-400">...</span>
                        </div>
                    </div>
                </div>

                <script>
                    const token = ${JSON.stringify(accessToken)};
                    function fetchUserInfo(lang) {
                        document.querySelectorAll('.locale-btn').forEach(b => {
                            b.classList.remove('bg-indigo-600', 'text-white');
                            b.classList.add('bg-slate-800', 'text-slate-300');
                        });
                        if (window.event && window.event.target) {
                            window.event.target.classList.remove('bg-slate-800', 'text-slate-300');
                            window.event.target.classList.add('bg-indigo-600', 'text-white');
                        }
                        document.getElementById('status-badge').textContent = 'Fetching...';
                        fetch('/fetch-userinfo?token=' + encodeURIComponent(token) + '&lang=' + encodeURIComponent(lang))
                            .then(res => res.json())
                            .then(data => {
                                document.getElementById('status-badge').textContent = '200 OK';
                                document.getElementById('userinfo-raw').textContent = JSON.stringify(data, null, 2);
                                document.getElementById('ui-name').textContent = data.name || data.formatted_name || 'N/A';
                                document.getElementById('ui-script').textContent = (data.script || 'latin').toUpperCase();
                                document.getElementById('ui-direction').textContent = (data.direction || 'ltr').toUpperCase();
                                document.getElementById('ui-assurance').textContent = data.identity_assurance_level || 'IAL1';
                            })
                            .catch(err => {
                                document.getElementById('status-badge').textContent = 'Error';
                                document.getElementById('userinfo-raw').textContent = 'Error: ' + err.message;
                            });
                    }
                    fetchUserInfo('en-US');
                </script>
            </div>
        </div>
    `;
};
