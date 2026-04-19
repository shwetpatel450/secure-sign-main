# DigiSign

DigiSign is a React + Vite web app for client-side digital signing and verification.

## Features
- Generate RSA-PSS or ECDSA keypairs in the browser
- Sign any file with your private key
- Verify signatures using the public key in the signature envelope
- No file upload required; cryptographic operations run in your browser

## Run Locally
1. Install dependencies:
   npm install
2. Start development server:
   npm run dev
3. Open:
   http://localhost:8080

## Build
- Production build:
  npm run build
- Preview production build:
  npm run preview

## How It Works
1. Generate: Creates a keypair using Web Crypto API and lets you download private/public keys as JSON.
2. Sign: Computes SHA-256 of the selected file, signs it with your private key, and downloads a `.digisig.json` envelope.
3. Verify: Re-computes file hash, compares with the signed hash, then verifies the signature using the included public key.