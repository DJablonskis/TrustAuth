# TrustAuth & Mock Third-Party Partner System

A modular authentication ecosystem featuring **TrustAuth** (an OAuth 2.0 / OpenID Connect Identity Provider with privacy-preserving personas, age verification gates, and cryptographic GDPR right-to-erasure webhooks) and **Third party** (a zero-dependency Node.js reference client and webhook consumer).

---

## 📂 Repository Structure

```text
.
├── TrustAuth/        # Core OAuth 2.0 / OIDC Identity Provider (Laravel 13, Inertia.js, React)
└── Third party/      # Mock Partner Client Application & HMAC-SHA256 Webhook Simulator (Node.js)
```

---

## 🚀 Component Overview

### 1. `TrustAuth` (Identity Provider)
An OAuth 2.0 / OIDC Authorization Server built with Laravel 13 and Inertia/React:
- **Zero-Knowledge Persona Cards**: Allows users to dynamically share separate contextual personas (e.g., Student, Professional, Anonymous Gamer) rather than disclosing their raw identity.
- **UK Online Safety Act Age Verification Gate**: Boolean attribute release (`is_over_16`, `is_over_18`) with selective disclosure without exposing exact birth dates.
- **Multi-Script Content Negotiation**: RFC 5646 language tag handling (`Accept-Language: en-US`, `ja-Jpan`, `zh-Hant`) for names and profiles.
- **GDPR Article 17 "Right to Erasure" Distribution**: Dispatches cryptographically signed (`HMAC-SHA256`) webhook revocation events to connected third-party clients with replay attack protection (timestamp window + nonce verification).

### 2. `Third party` (Mock Partner Consumer)
A lightweight, zero-dependency Node.js client (`server.js`) simulating a Relying Party (RP):
- **OIDC Authorization Code Flow**: Exchanges authorization codes for JWT tokens via `/oauth/token`.
- **Live UserInfo Proxy**: Tests multi-language content negotiation against `/api/v1/userinfo`.
- **Cryptographic Webhook Ingestion**: Listens on `/gdpr/erase` to verify incoming `X-Signature-SHA256`, `X-Timestamp`, and `X-Nonce` headers using constant-time verification.

---

## 🛠️ Prerequisites

- **PHP**: `^8.3` with OpenSSL, SQLite, and PDO extensions
- **Composer**: `^2.x`
- **Node.js**: `^18.x` or `^20.x`
- **NPM** or **PNPM**

---

## ⚙️ Setup & Installation

### Step 1: Set up TrustAuth (Port 8000)

1. Open your terminal in the `TrustAuth` directory:
   ```bash
   cd TrustAuth
   ```

2. Install PHP and JavaScript dependencies:
   ```bash
   composer install
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Run database migrations:
   ```bash
   php artisan migrate
   ```

5. Generate OAuth encryption keys (Laravel Passport):
   ```bash
   php artisan passport:keys
   ```

6. Build frontend assets and start servers:
   ```bash
   # Terminal A: Build frontend
   npm run build
   # Or for development: npm run dev

   # Terminal B: Start API / Web server
   php artisan serve --port=8000
   ```
   TrustAuth will now be running at `http://localhost:8000`.

---

### Step 2: Set up Third Party Partner (Port 3000)

1. Open a new terminal in the `Third party` directory:
   ```bash
   cd "Third party"
   ```

2. Start the zero-dependency Node.js server:
   ```bash
   node server.js
   ```
   The mock partner application will now be running at `http://localhost:3000`.

---

## 🧪 Testing the Integration

1. Navigate to **`http://localhost:3000`** in your browser.
2. Click one of the authentication flows (e.g., **Standard OIDC** or **Login with Age Gate**).
3. Log in to TrustAuth at `http://localhost:8000` and select an identity persona card to grant minimal permissions.
4. After authorization, you will be redirected back to `http://localhost:3000/callback` displaying your decoded JWT token and persona claims.
5. In TrustAuth, navigate to your active sessions/authorizations and revoke access. Check `http://localhost:3000` to inspect the verified HMAC-SHA256 GDPR erasure event logged in real time.

