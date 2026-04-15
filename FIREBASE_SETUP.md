# 🔥 Firebase Setup Guide — Falcon Web-Builder

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `falcon-web-builder` (or any name)
4. Disable Google Analytics (optional) → Click **Create Project**
5. Wait for project to be created → Click **Continue**

---

## Step 2: Enable Google Authentication

1. In Firebase Console → Select your project
2. Left sidebar → **Build** → **Authentication**
3. Click **Get Started**
4. Go to **Sign-in method** tab
5. Click **Google** → Toggle **Enable** → Set a project support email
6. Click **Save**

---

## Step 3: Add Authorized Domains

1. Still in **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Ensure these are listed (add if missing):
   - `localhost`
   - `127.0.0.1`
   - Your production domain (if deploying)

---

## Step 4: Register a Web App

1. Go to **Project Overview** (gear icon → Project settings)
2. Scroll down to **"Your apps"** section
3. Click the **Web** icon (`</>`)
4. Enter app nickname: `falcon-web-builder`
5. *(Optional)* Check **"Also set up Firebase Hosting"**
6. Click **Register app**
7. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "falcon-web-builder.firebaseapp.com",
  projectId: "falcon-web-builder",
  storageBucket: "falcon-web-builder.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

8. **Copy these values** — you'll need them in the next step.

---

## Step 5: Configure the Frontend

1. Open `frontend/.env.local`
2. Replace the placeholder values with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=falcon-web-builder.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=falcon-web-builder
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=falcon-web-builder.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
NEXT_PUBLIC_BACKEND_URL=http://localhost:4001
```

3. **Restart the frontend dev server** after saving:
```bash
cd frontend && npm run dev -- --port 4000
```

---

## Step 6: Test Google Sign-In

1. Open `http://localhost:4000` in your browser
2. You should see the Falcon Web-Builder auth screen
3. Click **"Continue with Google"**
4. Select your Google account in the popup
5. After sign-in, you'll see the main builder UI with your profile avatar

---

## API Key Configuration (Per-Provider)

API keys are entered in the **sidebar** at runtime. They are stored in browser memory only and cleared when you close the tab.

| Provider | Where to Get Key | Format |
|---|---|---|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | `sk-...` |
| **Google Gemini** | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | `AIza...` |
| **Anthropic Claude** | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) | `sk-ant-...` |
| **Groq** | [console.groq.com/keys](https://console.groq.com/keys) | `gsk_...` |
| **OpenRouter** | [openrouter.ai/keys](https://openrouter.ai/keys) | `sk-or-...` |

> **🔒 Security**: API keys are **never** stored in any database, localStorage, or server logs. They exist only in React state (memory) for the duration of your session.

---

## Optional: Deploy to Firebase Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize (from project root)
firebase init hosting
# → Select your project
# → Public directory: frontend/out
# → Single-page app: Yes

# 4. Build the frontend
cd frontend && npm run build

# 5. Deploy
cd .. && firebase deploy --only hosting
```

---

## Optional: Firebase Hosting Config

Create `firebase.json` in the project root:

```json
{
  "hosting": {
    "public": "frontend/out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Google Sign-In popup blocked | Allow popups for `localhost` in browser settings |
| `auth/unauthorized-domain` error | Add `localhost` to Authorized Domains in Firebase Console |
| `auth/configuration-not-found` | Double-check your `.env.local` values match Firebase config exactly |
| Sign-in popup closes immediately | Ensure Google provider is **enabled** in Authentication → Sign-in method |
| `.env.local` changes not applied | Restart the dev server (`Ctrl+C` then `npm run dev`) |
