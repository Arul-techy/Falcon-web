# 🦅 Falcon Web-Builder

**AI-powered website generator** — describe a website in plain English and get complete HTML, CSS, and JavaScript in seconds.

Supports: **OpenAI GPT-4o** · **Google Gemini** · **Anthropic Claude** · **Groq** · **OpenRouter**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (20+ recommended)
- A Firebase project with Google Auth enabled
- At least one AI API key

---

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → Create a project
2. Enable **Authentication** → **Sign-in methods** → Enable **Google**
3. Add a **Web App** → Copy the config values
4. Add your domain (`localhost`) to **Authorized domains**

### 2. Configure Frontend

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` and fill in your Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 3. Start the Backend

```bash
cd backend
npm install
npm start
```

Backend runs on **http://localhost:3001**

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

---

## 🔑 API Keys

Each provider requires its own key, entered in the sidebar:

| Provider | Get Key |
|---|---|
| OpenAI | https://platform.openai.com/api-keys |
| Google Gemini | https://aistudio.google.com/app/apikey |
| Anthropic Claude | https://console.anthropic.com/settings/keys |
| Groq | https://console.groq.com/keys |
| OpenRouter | https://openrouter.ai/keys |

> **Security**: API keys are stored in React state only (session memory). They are never saved to any database or logged.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS |
| Editor | Monaco Editor |
| Auth | Firebase (Google Sign-In) |
| Backend | Node.js + Express |
| AI Clients | openai, @google/generative-ai, @anthropic-ai/sdk, groq-sdk |
| Preview | Sandboxed `<iframe srcdoc>` |
| ZIP | JSZip + file-saver |

---

## 📁 Project Structure

```
web-builder/
├── frontend/           # Next.js app
│   ├── app/            # App router (layout, page, globals.css)
│   ├── components/     # Navbar, Sidebar, PromptPanel, CodeTabs, PreviewPanel
│   ├── contexts/       # AuthContext (Firebase)
│   ├── services/       # generateService, firebaseAuth
│   └── utils/          # zipDownload
│
└── backend/            # Express API server
    ├── server.js
    ├── routes/         # POST /api/generate
    ├── handlers/       # openai, gemini, claude, groq, openrouter
    └── utils/          # promptBuilder, validate
```

---

## ✨ Features

- **Multi-model**: Switch between 5 AI providers with a single click
- **Live Preview**: Sandboxed iframe that auto-renders generated code
- **Monaco Editor**: Edit generated code with syntax highlighting
- **Download ZIP**: Get `index.html`, `styles.css`, `script.js` bundled
- **Prompt History**: Last 10 prompts saved to localStorage
- **Token Usage**: See how many tokens each generation used
- **View Modes**: Split (code + preview), Code-only, Preview-only

---

## 🔥 Firebase Hosting Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools
firebase login

# Build frontend
cd frontend && npm run build

# Deploy
firebase deploy
```
