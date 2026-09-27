/**
 * Mock Partner App - Zero-Dependency OAuth 2.0 Client & Webhook Simulator
 *
 * Runs a local server on http://localhost:3000 to demonstrate authentication
 * flows, persona switches, age verification gates, and GDPR right-to-erasure notifications.
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');

// View templates
const renderPage = require('./views/layout');
const renderHome = require('./views/home');
const renderError = require('./views/error');
const renderSuccess = require('./views/success');

const PORT = 3000;
const CLIENT_ID = '9cc42f60-d621-4f9e-bd9d-0985fe6a12b6';
const CLIENT_SECRET = 'mock-client-secret-12345';
const REDIRECT_URI = 'http://localhost:3000/callback';
const TRUSTAUTH_BASE = 'http://localhost:8000';
const config = { TRUSTAUTH_BASE, CLIENT_ID, REDIRECT_URI };

// Store logs in-memory to show in the UI
let webhookLogs = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // 1. GDPR Right to Erasure Webhook Endpoint with Cryptographic HMAC-SHA256 Verification
    if (req.method === 'POST' && parsedUrl.pathname === '/gdpr/erase') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const signatureHeader = req.headers['x-signature-sha256'];
                const timestampHeader = req.headers['x-timestamp'];
                const nonceHeader = req.headers['x-nonce'];

                // Security Check 1: Mandatory cryptographic headers
                if (!signatureHeader || !timestampHeader) {
                    console.error('❌ Webhook Rejected: Missing X-Signature-SHA256 or X-Timestamp headers');
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Unauthorized: Missing HMAC signature or timestamp.' }));
                    return;
                }

                // Security Check 2: 300-second replay attack protection tolerance window
                const nowSec = Math.floor(Date.now() / 1000);
                const reqSec = parseInt(timestampHeader, 10);
                if (isNaN(reqSec) || Math.abs(nowSec - reqSec) > 300) {
                    console.error(`❌ Webhook Rejected: Replay window violation (drift: ${Math.abs(nowSec - reqSec)}s)`);
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Unauthorized: Request timestamp outside 300s replay tolerance window.' }));
                    return;
                }

                // Security Check 3: HMAC-SHA256 constant-time verification
                const expectedSignature = crypto.createHmac('sha256', CLIENT_SECRET).update(body).digest('hex');
                const sigBuf = Buffer.from(signatureHeader, 'utf8');
                const expBuf = Buffer.from(expectedSignature, 'utf8');

                if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
                    console.error('❌ Webhook Rejected: Cryptographic HMAC-SHA256 signature mismatch');
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Forbidden: Invalid HMAC signature.' }));
                    return;
                }

                const payload = JSON.parse(body);
                const logEntry = {
                    timestamp: new Date().toISOString(),
                    verified: true,
                    algorithm: 'HMAC-SHA256',
                    nonce: nonceHeader,
                    signature: signatureHeader.substring(0, 16) + '...',
                    headers: req.headers,
                    payload: payload
                };
                webhookLogs.push(logEntry);
                console.log('\n=======================================');
                console.log('🚨 VERIFIED GDPR ERASURE WEBHOOK (HMAC-SHA256 VALID)');
                console.log('=======================================');
                console.log(`Timestamp: ${new Date().toISOString()}`);
                console.log(`Erasure ID: ${payload.erasure_id || 'N/A'}`);
                console.log(`Client ID:  ${payload.client_id}`);
                console.log(`Nonce:      ${nonceHeader}`);
                console.log('Signature:  ' + signatureHeader);
                console.log(JSON.stringify(payload, null, 2));
                console.log('=======================================\n');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Data erasure initiated. Cryptographic HMAC signature verified.' }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload.' }));
            }
        });
        return;
    }

    // 1b. Helper Endpoint: Live UserInfo Proxy for interactive multi-script content negotiation testing
    if (req.method === 'GET' && parsedUrl.pathname === '/fetch-userinfo') {
        const token = parsedUrl.query.token;
        const lang = parsedUrl.query.lang || 'en-US';

        if (!token) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing token parameter' }));
            return;
        }

        const targetUrl = url.parse(`${TRUSTAUTH_BASE}/api/v1/userinfo`);
        const userReq = http.request({
            hostname: targetUrl.hostname,
            port: targetUrl.port,
            path: targetUrl.path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': lang,
                'Accept': 'application/json',
            }
        }, (userRes) => {
            let userBody = '';
            userRes.on('data', chunk => { userBody += chunk; });
            userRes.on('end', () => {
                res.writeHead(userRes.statusCode, { 'Content-Type': 'application/json' });
                res.end(userBody);
            });
        });

        userReq.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to contact TrustAuth API', details: err.message }));
        });

        userReq.end();
        return;
    }

    // Helper: Render simple page wrapper
    const renderPage = (title, content) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title} - Mock Client</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
            </style>
        </head>
        <body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between">
            <header class="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-6 py-4">
                <div class="max-w-5xl mx-auto flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">M</div>
                        <span class="font-bold text-lg tracking-tight">Mock Partner App</span>
                    </div>
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">Environment: Port ${PORT}</span>
                </div>
            </header>
            <main class="max-w-5xl w-full mx-auto p-6 lg:py-12 flex-grow">
                ${content}
            </main>
            <footer class="border-t border-slate-800 bg-slate-950/20 py-6 text-center text-xs text-slate-500">
                &copy; 2026 TrustAuth Mock Integration Client. All rights reserved.
            </footer>
        </body>
        </html>
    `;

    // 2. Landing / Dashboard UI
    if (parsedUrl.pathname === '/') {
        const content = renderHome(webhookLogs, config);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderPage('Home', content, PORT));
        return;
    }

    // 3. OAuth Callback Handler
    if (parsedUrl.pathname === '/callback') {
        const code = parsedUrl.query.code;
        const error = parsedUrl.query.error;

        if (error) {
            const content = renderError('OAuth Error Returned', `${error}. This typically occurs if access was denied or the identity is not verified.`);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderPage('OAuth Error', content, PORT));
            return;
        }

        if (!code) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing code parameter.');
            return;
        }

        // Post request data to swap Authorization Code for Access Token
        const postData = JSON.stringify({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: code
        });

        const tokenUrl = url.parse(`${TRUSTAUTH_BASE}/oauth/token`);
        const tokenReq = http.request({
            hostname: tokenUrl.hostname,
            port: tokenUrl.port,
            path: tokenUrl.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (tokenRes) => {
            let data = '';
            tokenRes.on('data', chunk => { data += chunk; });
            tokenRes.on('end', () => {
                const responseJson = JSON.parse(data);

                if (tokenRes.statusCode !== 200) {
                    const content = renderError('Token Exchange Failed', responseJson.error_description || responseJson.hint || responseJson.error || responseJson.message || ('The server returned a status of ' + tokenRes.statusCode));
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(renderPage('Exchange Failed', content, PORT));
                    return;
                }

                // Decode access token JWT
                const accessToken = responseJson.access_token;
                const tokenSegments = accessToken.split('.');
                let decodedPayload = {};
                if (tokenSegments.length >= 2) {
                    const payloadBase64 = tokenSegments[1].replace(/-/g, '+').replace(/_/g, '/');
                    decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
                }

                const content = renderSuccess(decodedPayload, accessToken);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(renderPage('Authentication Success', content, PORT));
            });
        });

        tokenReq.on('error', (err) => {
            const content = renderError('Connection Failed', `Could not establish contact with the TrustAuth server at ${TRUSTAUTH_BASE}. Make sure \`php artisan serve\` is active.`);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderPage('Connection Failed', content, PORT));
        });

        tokenReq.write(postData);
        tokenReq.end();
        return;
    }

    // 4. 404 Handler
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`\n=======================================`);
    console.log(`🚀 MOCK CLIENT RUNNING ON http://localhost:${PORT}`);
    console.log(`=======================================`);
    console.log(`GDPR Webhook Endpoint: http://localhost:${PORT}/gdpr/erase`);
    console.log(`Press Ctrl+C to terminate\n`);
});
