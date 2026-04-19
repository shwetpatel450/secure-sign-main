# 🔐 Secure Sign

A modern web application for generating and verifying digital signatures securely. Built with React, TypeScript, and Vite, featuring a clean UI with Tailwind CSS and shadcn/ui components.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple)](https://vitejs.dev)

## ✨ Features

- **🔑 Key Generation** - Generate RSA and other cryptographic key pairs
- **✍️ Digital Signing** - Sign documents and data with private keys
- **✅ Signature Verification** - Verify the authenticity of signed documents
- **📁 File Drop Support** - Drag and drop files for easy processing
- **🎨 Modern UI** - Clean, responsive interface built with Tailwind CSS
- **⚡ Fast & Secure** - Built with TypeScript for type safety and security
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ or Bun
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/shwetpatel450/secure-sign-main.git
cd secure-sign-main
```

2. **Install dependencies**
```bash
# Using npm
npm install

# Or using bun
bun install
```

3. **Start the development server**
```bash
npm run dev
# Or
bun run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests with Vitest |

## 📁 Project Structure

```
secure-sign-main/
├── src/
│   ├── components/
│   │   ├── digisign/
│   │   │   ├── FileDrop.tsx          # File upload component
│   │   │   ├── GeneratePanel.tsx     # Key generation panel
│   │   │   ├── SignPanel.tsx         # Document signing panel
│   │   │   └── VerifyPanel.tsx       # Signature verification panel
│   │   ├── ui/                       # shadcn/ui components
│   │   └── NavLink.tsx               # Navigation component
│   ├── hooks/
│   │   ├── use-mobile.tsx            # Mobile detection hook
│   │   └── use-toast.ts              # Toast notifications hook
│   ├── lib/
│   │   ├── crypto.ts                 # Cryptographic utilities
│   │   └── utils.ts                  # General utilities
│   ├── pages/
│   │   ├── Index.tsx                 # Home page
│   │   └── NotFound.tsx              # 404 page
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## 🔐 How It Works

### 1. **Generate Keys**
- Navigate to the Generate Panel
- Create RSA key pairs (public and private)
- Download keys for safekeeping

### 2. **Sign Documents**
- Upload or drop a document
- Select your private key
- Generate a digital signature
- Download the signature file

### 3. **Verify Signatures**
- Upload a document and its signature
- Provide the public key
- Verify the signature's authenticity
- Confirm document integrity

## 🛡️ Security Features

- ✅ Runs entirely in the browser (client-side encryption)
- ✅ No data sent to external servers
- ✅ TypeScript for type safety
- ✅ Industry-standard cryptographic algorithms
- ✅ Secure key management practices

## 🎨 Tech Stack

- **Frontend Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Testing**: Vitest
- **Linting**: ESLint

## 📚 Dependencies

### Core
- `react`: UI library
- `typescript`: Type safety
- `vite`: Build tool

### Styling
- `tailwindcss`: Utility-first CSS
- `postcss`: CSS processing

### UI Components
- `@radix-ui/*`: Accessible UI primitives
- `sonner`: Toast notifications

### Cryptography
- Web Crypto API (built-in)

## 🧪 Testing

Run tests with:
```bash
npm test
# Or
bun test
```

## 📖 Usage Examples

### Generate Keys
```typescript
// Example key generation flow
const generateKeys = async () => {
  // Use Web Crypto API to generate RSA key pair
  // Export keys in JWKS or PEM format
};
```

### Sign Document
```typescript
// Example signing flow
const signDocument = async (document: ArrayBuffer, privateKey: CryptoKey) => {
  // Use private key to create signature
  // Return signature
};
```

### Verify Signature
```typescript
// Example verification flow
const verifySignature = async (document: ArrayBuffer, signature: ArrayBuffer, publicKey: CryptoKey) => {
  // Verify signature against document
  // Return verification result
};
```

## 🌐 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

### Deploy to GitHub Pages
```bash
npm run build
# Push dist folder to gh-pages branch
```

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear vite cache
rm -rf .vite
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue on the GitHub repository.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Radix UI](https://www.radix-ui.com) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Vite](https://vitejs.dev) - Next generation build tool

---

**Made with ❤️ by Shwet Patel**
