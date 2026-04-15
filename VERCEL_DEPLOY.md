# 🚀 Vercel Deployment Guide — Falcon Web-Builder

Deploy the **entire app** (frontend + backend API) to **Vercel** as a single project — 100% free.

---

## How It Works

The backend API is built into the Next.js app using **API routes**:
- `POST /api/generate` → AI website generation (calls OpenAI, Gemini, Claude, Groq, or OpenRouter)
- `GET /api/health` → Health check endpoint

No separate backend deployment needed!

---

## Prerequisites

- A **GitHub account** with this repo pushed
- A **Vercel account** → [Sign up free at vercel.com](https://vercel.com/signup) (use your GitHub login)

---

## Step 1: Push to GitHub

If not already on GitHub:

```bash
cd /path/to/web-builder
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/web-builder.git
git push -u origin main
```

---

## Step 2: Import to Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Git Repository"**
3. Select your `web-builder` repo
4. **⚠️ Set Root Directory to `frontend`** (click "Edit" next to Root Directory)
5. Vercel auto-detects Next.js — no config changes needed

---

## Step 3: Set Environment Variables

In the Vercel deploy page, click **"Environment Variables"** and add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDUhlXkKH4Hu7Em5tzFXoZGHUSgWmbmLzU` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `falcon-builders.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `falcon-builders` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `falcon-builders.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `9082609742` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:9082609742:web:7ef29a4691ddb4301e231f` |
| `NEXT_PUBLIC_BACKEND_URL` | *(leave empty)* |

---

## Step 4: Deploy

Click **"Deploy"** and wait ~2 minutes.

Your app will be live at:
```
https://your-project.vercel.app
```

---

## Step 5: Add Vercel Domain to Firebase Auth

1. Go to [Firebase Console](https://console.firebase.google.com/project/falcon-builders/authentication/settings)
2. Click **Authentication** → **Settings** → **Authorized domains**
3. Click **Add domain**
4. Add your Vercel domain: `your-project.vercel.app`
5. Click **Add**

> **Without this step, Google Sign-In will fail on your Vercel domain!**

---

## Verify Deployment

Test the health endpoint:
```bash
curl https://your-project.vercel.app/api/health
```

Expected:
```json
{"status":"ok","message":"Falcon Web-Builder API is running on Vercel"}
```

---

## Using the App

1. Open your Vercel URL
2. Click **"Continue with Google"** to sign in
3. In the sidebar, select a provider (e.g., **Groq**) and enter your API key
4. Type a prompt and click **Generate**
5. View the result in the preview panel
6. Click **"Download ZIP"** to download the generated site

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Google Sign-In says "unauthorized domain" | Add your Vercel domain to Firebase Auth → Authorized domains |
| AI generation times out | Use **Groq** (fastest). Vercel free tier = 10s timeout |
| Build fails | Ensure Root Directory is set to `frontend` |
| `/api/generate` returns 404 | Check that `app/api/generate/route.ts` exists |

---

## Project Structure

```
web-builder/
├── frontend/          ← This is deployed to Vercel (Root Directory)
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/route.ts   ← AI generation endpoint
│   │   │   └── health/route.ts     ← Health check
│   │   ├── page.tsx                ← Main UI
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── handlers/               ← AI provider handlers
│   │   │   ├── openai.ts
│   │   │   ├── gemini.ts
│   │   │   ├── claude.ts
│   │   │   ├── groq.ts
│   │   │   └── openrouter.ts
│   │   └── utils/
│   │       ├── promptBuilder.ts
│   │       └── validate.ts
│   ├── components/
│   ├── services/
│   └── package.json
├── backend/           ← Still works for local dev (node server.js)
└── VERCEL_DEPLOY.md   ← This file
```
