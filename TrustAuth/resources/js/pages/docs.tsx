import { Head, Link } from '@inertiajs/react';
import { BookOpen, Globe, KeyRound, Layers, Lightbulb, Rocket, Shield, Sliders } from 'lucide-react';
import React, { useState } from 'react';

export default function Docs() {
    const [activeTab, setActiveTab] = useState<'quickstart' | 'scopes' | 'multiscript' | 'webhooks' | 'custom_claims'>('quickstart');
    const [codeLang, setCodeLang] = useState<'javascript' | 'python' | 'curl'>('javascript');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
            <Head title="Developer Documentation & API Reference - TrustAuth" />

            {/* Top Navigation */}
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-extrabold text-white text-base">T</span>
                        </div>
                        <div>
                            <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                                TrustAuth
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    Developer Docs
                                </span>
                            </span>
                            <p className="text-[11px] text-slate-400">OAuth 2.0 / OIDC Identity Provider & Privacy API</p>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
                    >
                        User Dashboard
                    </Link>
                    <a
                        href="http://localhost:3000"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                    >
                        <span>Launch Mock Client (:3000)</span>
                        <span>↗</span>
                    </a>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <aside className="lg:col-span-1 space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">
                        Documentation Guides
                    </div>
                    <button
                        onClick={() => setActiveTab('quickstart')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 ${
                            activeTab === 'quickstart'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                    >
                        <Rocket className="w-3.5 h-3.5 shrink-0" />
                        <span>1. OAuth 2.0 Quickstart</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('scopes')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 ${
                            activeTab === 'scopes'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                    >
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>2. Scope & Age Gates Taxonomy</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('custom_claims')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 ${
                            activeTab === 'custom_claims'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span>3. In-Flight Custom Claims</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('multiscript')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 ${
                            activeTab === 'multiscript'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                    >
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span>4. Multi-Script Names (RFC 9110)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('webhooks')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2.5 ${
                            activeTab === 'webhooks'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                    >
                        <KeyRound className="w-3.5 h-3.5 shrink-0" />
                        <span>5. GDPR HMAC Webhooks</span>
                    </button>

                    <div className="pt-6 px-3">
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
                            <span className="font-bold text-slate-300 block">Default Dev Credentials</span>
                            <div className="font-mono text-[11px] space-y-1 text-slate-400">
                                <div><span className="text-slate-500">Client ID:</span> 9cc42f60-d621-4f9e-bd9d-0985fe6a12b6</div>
                                <div><span className="text-slate-500">Secret:</span> mock-client-secret-12345</div>
                                <div><span className="text-slate-500">IdP Base:</span> http://localhost:8000</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="lg:col-span-3 space-y-8">
                    {/* TAB 1: QUICKSTART */}
                    {activeTab === 'quickstart' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-2">
                                    OAuth 2.0 & OpenID Connect Quickstart
                                </h1>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Integrate TrustAuth with any OAuth 2.0 compliant client application. TrustAuth implements standard Authorization Code Grant with persona-based selective disclosure.
                                </p>
                            </div>

                            {/* Flow Diagram */}
                            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Authentication Protocol Flow</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                                        <span className="text-indigo-400 font-bold block">1. User Redirection</span>
                                        <p className="text-slate-400">Redirect user to <code className="text-indigo-300">/oauth/authorize</code> with scopes.</p>
                                    </div>
                                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                                        <span className="text-indigo-400 font-bold block">2. Code Exchange</span>
                                        <p className="text-slate-400">Swap returned authorization code for a Bearer JWT at <code className="text-indigo-300">/oauth/token</code>.</p>
                                    </div>
                                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                                        <span className="text-indigo-400 font-bold block">3. Profile Retrieval</span>
                                        <p className="text-slate-400">Call <code className="text-indigo-300">/api/v1/userinfo</code> with Bearer token to get minimized profile.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Code Selector */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Client Implementation Example</h3>
                                    <div className="flex gap-2">
                                        {(['javascript', 'python', 'curl'] as const).map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => setCodeLang(lang)}
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                                    codeLang === lang
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                                }`}
                                            >
                                                {lang === 'javascript' ? 'Node.js' : lang === 'python' ? 'Python' : 'cURL'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {codeLang === 'javascript' && (
                                    <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`// 1. Redirect to TrustAuth consent screen
const authUrl = 'http://localhost:8000/oauth/authorize?' + new URLSearchParams({
  client_id: '9cc42f60-d621-4f9e-bd9d-0985fe6a12b6',
  redirect_uri: 'http://localhost:3000/callback',
  response_type: 'code',
  scope: 'profile email shipping_address age_is_over_21'
});
res.redirect(authUrl);

// 2. Exchange authorization code for access token in callback
const tokenRes = await axios.post('http://localhost:8000/oauth/token', {
  grant_type: 'authorization_code',
  client_id: '9cc42f60-d621-4f9e-bd9d-0985fe6a12b6',
  client_secret: 'mock-client-secret-12345',
  redirect_uri: 'http://localhost:3000/callback',
  code: req.query.code
});
const accessToken = tokenRes.data.access_token;

// 3. Query context-minimized OIDC profile
const userinfo = await axios.get('http://localhost:8000/api/v1/userinfo', {
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Accept-Language': 'el-GR' // Request Greek localized name
  }
});
console.log(userinfo.data);`}
                                    </pre>
                                )}

                                {codeLang === 'python' && (
                                    <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`import requests

# 1. Swap authorization code for bearer token
token_res = requests.post('http://localhost:8000/oauth/token', data={
    'grant_type': 'authorization_code',
    'client_id': '9cc42f60-d621-4f9e-bd9d-0985fe6a12b6',
    'client_secret': 'mock-client-secret-12345',
    'redirect_uri': 'https://my-app.com/callback',
    'code': auth_code
})
access_token = token_res.json()['access_token']

# 2. Fetch context-minimized userinfo
headers = {
    'Authorization': f'Bearer {access_token}',
    'Accept-Language': 'ar-EG'  # Request Arabic RTL variant
}
profile = requests.get('http://localhost:8000/api/v1/userinfo', headers=headers).json()
print("Disclosed Name:", profile.get('name'))
print("Direction:", profile.get('direction'))
print("Age Assertion:", profile.get('age_is_over_21'))`}
                                    </pre>
                                )}

                                {codeLang === 'curl' && (
                                    <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`# 1. Swap Authorization Code for Access Token
curl -X POST http://localhost:8000/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "client_id": "9cc42f60-d621-4f9e-bd9d-0985fe6a12b6",
    "client_secret": "mock-client-secret-12345",
    "redirect_uri": "http://localhost:3000/callback",
    "code": "AUTH_CODE_HERE"
  }'

# 2. Retrieve OpenID Connect UserInfo Profile
curl -X GET http://localhost:8000/api/v1/userinfo \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Accept-Language: ja-JP"`}
                                    </pre>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: SCOPES & AGE GATES */}
                    {activeTab === 'scopes' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-2">
                                    Granular Scope Taxonomy & Dynamic Age Gates
                                </h1>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    TrustAuth implements selective disclosure per GDPR Article 5(1)(c). Relying parties only receive attributes that match explicitly requested scopes.
                                </p>
                            </div>

                            <div className="overflow-x-auto border border-slate-800 rounded-xl">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                                        <tr>
                                            <th className="p-3">Scope</th>
                                            <th className="p-3">Classification</th>
                                            <th className="p-3">Delivered Claim</th>
                                            <th className="p-3">Privacy Guarantee</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                                        <tr>
                                            <td className="p-3 font-mono text-indigo-400">openid</td>
                                            <td className="p-3">OIDC Core</td>
                                            <td className="p-3 font-mono">sub</td>
                                            <td className="p-3 text-slate-400">Pairwise persona subject ID.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-mono text-indigo-400">profile</td>
                                            <td className="p-3">Profile Details</td>
                                            <td className="p-3 font-mono">name, given_name, family_name, script, direction</td>
                                            <td className="p-3 text-slate-400">Contextual localized names; no legal name leak.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-mono text-indigo-400">email</td>
                                            <td className="p-3">Contact Alias</td>
                                            <td className="p-3 font-mono">email</td>
                                            <td className="p-3 text-slate-400">Persona-isolated email alias.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-mono text-indigo-400">pronouns</td>
                                            <td className="p-3">Linguistics</td>
                                            <td className="p-3 font-mono">pronouns: &#123; subject, object, possessive &#125;</td>
                                            <td className="p-3 text-slate-400">Structured cases for notification generation.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-mono text-indigo-400">age_is_over_&#123;N&#125;</td>
                                            <td className="p-3">Parametric Age Gate</td>
                                            <td className="p-3 font-mono">age_is_over_21: true/false</td>
                                            <td className="p-3 text-emerald-400">Zero DOB disclosure; dynamic threshold.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-mono text-indigo-400">shipping_address</td>
                                            <td className="p-3">Custom E-Commerce</td>
                                            <td className="p-3 font-mono">shipping_address</td>
                                            <td className="p-3 text-amber-300">In-flight claim provisioning supported.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-mono text-indigo-400">legal_name</td>
                                            <td className="p-3">High-Assurance KYC</td>
                                            <td className="p-3 font-mono">legal_name</td>
                                            <td className="p-3 text-slate-400">Restricted to attested IAL2 identities.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2 text-xs text-indigo-300">
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-indigo-300 shrink-0" />
                                    <span className="font-bold text-indigo-200 block text-sm">Dynamic Parametric Age Gates</span>
                                </div>
                                <p>Instead of hardcoding age scopes, you can request any legal threshold: <code className="text-white">age_is_over_13</code> (COPPA), <code className="text-white">age_is_over_16</code> (UK Online Safety Act), <code className="text-white">age_is_over_18</code> (Adult), or <code className="text-white">age_is_over_21</code> (Alcohol/Cannabis). TrustAuth evaluates the assertion against verified user age and transmits a boolean claim without revealing the user's date of birth.</p>
                            </div>

                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2 text-xs text-emerald-300">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="font-bold text-emerald-200 block text-sm">Commercial Identity Verification: Didit Network</span>
                                </div>
                                <p className="text-slate-300">
                                    TrustAuth partners with the <strong>Didit Identity Verification Network</strong> (v3 API) to provide automated NIST SP 800-63-4 IAL2 identity attestation. Two verification tiers are supported:
                                </p>
                                <ul className="list-disc list-inside text-slate-400 space-y-1 mt-1 pl-1">
                                    <li><strong className="text-slate-200">Photo ID Only:</strong> OCR document authenticity and MRZ checksum validation without biometric selfie steps.</li>
                                    <li><strong className="text-slate-200">Photo → Live → ID (Full IAL2):</strong> Full pipeline combining government ID OCR, 3D passive selfie liveness, and 1:1 facial biometric matching against the credential portrait.</li>
                                </ul>
                                <p className="text-slate-400 pt-1">
                                    Raw government document images and biometric frames are validated within Didit's accredited infrastructure and never persisted or leaked to relying partner applications. Relying parties receive only attested boolean claims and pairwise pseudonyms.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: IN-FLIGHT CLAIMS */}
                    {activeTab === 'custom_claims' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-2">
                                    Just-In-Time (JIT) In-Flight Claim Provisioning
                                </h1>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    When an application requests a scope not yet configured on a user's persona (such as <code className="text-indigo-300">shipping_address</code>), TrustAuth prevents authorization failure by offering in-flight provisioning directly on the consent screen.
                                </p>
                            </div>

                            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs leading-relaxed">
                                <h3 className="text-sm font-bold text-slate-200">How It Works For Relying Parties</h3>
                                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                                    <li>Your application simply requests the scope (e.g. <code className="text-indigo-400">scope=profile+shipping_address</code>).</li>
                                    <li>If the user selects a persona lacking this claim, the consent screen disables approval and displays an amber guidance banner.</li>
                                    <li>The user clicks <strong>Configure Claims on the Go</strong>, enters the address, and saves it to the persona.</li>
                                    <li>The consent screen reactively re-enables <strong>Authorize & Connect</strong>.</li>
                                    <li>When you call <code className="text-indigo-400">/api/v1/userinfo</code>, the newly provisioned address is returned in the JSON payload!</li>
                                </ol>
                            </div>

                            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                                <span className="font-bold text-slate-200 uppercase tracking-wider block text-[11px]">Sample Minimized UserInfo Response</span>
                                <pre className="p-3 bg-slate-950 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`{
  "sub": "2",
  "identity_assurance_level": "IAL1",
  "name": "Alex Smith",
  "given_name": "Alex",
  "family_name": "Smith",
  "preferred_username": "alex_smith",
  "shipping_address": "10 High Street, London, EC1A 1AA"
}`}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: MULTI-SCRIPT */}
                    {activeTab === 'multiscript' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-2">
                                    RFC 9110 HTTP Content Negotiation for 10 Alphabets
                                </h1>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    TrustAuth deterministically transliterates and delivers names across 10 major global writing systems. Third parties specify their desired script using standard HTTP <code className="text-indigo-300">Accept-Language</code> headers.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs text-center">
                                {[
                                    { name: 'Latin', code: 'en-US, lt-LT', sample: 'John Smith' },
                                    { name: 'Arabic (RTL)', code: 'ar-EG, ar-SA', sample: 'جُهن سمِته' },
                                    { name: 'Devanagari', code: 'hi-IN, ne-NP', sample: 'जॊह्न् स्मिथ्' },
                                    { name: 'Cyrillic', code: 'ru-RU, bg-BG', sample: 'Йохн Смитх' },
                                    { name: 'Japanese', code: 'ja-JP', sample: 'ジョーン スミテー' },
                                    { name: 'Korean', code: 'ko-KR', sample: '좋느 스밑흐' },
                                    { name: 'Hebrew (RTL)', code: 'he-IL', sample: 'זֳהן סמִטה' },
                                    { name: 'Greek', code: 'el-GR', sample: 'Ἰὁν Σμιθ' },
                                    { name: 'Georgian', code: 'ka-GE', sample: 'Jოჰნ Sმითჰ' },
                                    { name: 'Bengali', code: 'bn-BD', sample: 'জোহ্ন্ স্মিথ্' },
                                ].map((item, i) => (
                                    <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                                        <div className="font-bold text-slate-200">{item.name}</div>
                                        <div className="font-mono text-[10px] text-indigo-400">{item.code}</div>
                                        <div className="text-[11px] text-slate-400 truncate">{item.sample}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                                <span className="font-bold text-slate-200 uppercase tracking-wider block text-[11px]">RTL Typography Layout Integration</span>
                                <p className="text-slate-400">
                                    When requesting Arabic or Hebrew locales, the profile payload includes <code className="text-indigo-300">direction: "rtl"</code>, allowing client applications to automatically apply CSS <code className="text-indigo-300">dir="rtl"</code> without locale hardcoding.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: GDPR WEBHOOKS */}
                    {activeTab === 'webhooks' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-2">
                                    GDPR Article 17 Erasure Webhook Verification
                                </h1>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    When a user revokes an application via the Privacy & Governance Hub, TrustAuth dispatches an asynchronous, cryptographically signed webhook to your registered erasure endpoint.
                                </p>
                            </div>

                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs font-mono">
                                <div className="text-slate-400">Outbound HTTP Headers:</div>
                                <div className="space-y-1 text-slate-200">
                                    <div><span className="text-indigo-400">X-Signature-SHA256:</span> 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</div>
                                    <div><span className="text-indigo-400">X-Timestamp:</span> 1774468800</div>
                                    <div><span className="text-indigo-400">X-Nonce:</span> 3fa85f64-5717-4562-b3fc-2c963f66afa6</div>
                                    <div><span className="text-indigo-400">Content-Type:</span> application/json</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Node.js Signature & Replay Verification Snippet</h3>
                                <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`const crypto = require('crypto');

app.post('/gdpr/erase', (req, res) => {
  const signature = req.headers['x-signature-sha256'];
  const timestamp = parseInt(req.headers['x-timestamp'], 10);
  const now = Math.floor(Date.now() / 1000);

  // 1. Replay attack protection: reject packets older than 300s
  if (Math.abs(now - timestamp) > 300) {
    return res.status(401).json({ error: 'Timestamp expired' });
  }

  // 2. Compute expected HMAC-SHA256
  const hmac = crypto.createHmac('sha256', CLIENT_SECRET);
  const expected = hmac.update(JSON.stringify(req.body)).digest('hex');

  // 3. Constant-time signature comparison (mitigates timing attacks)
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(403).json({ error: 'Invalid HMAC signature' });
  }

  // 4. Execute cascading data deletion for persona user_id
  const personaSubjectId = req.body.user_id;
  db.deleteUserData(personaSubjectId);

  res.status(200).json({ success: true, erased: personaSubjectId });
});`}
                                </pre>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
