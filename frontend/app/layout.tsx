import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Falcon Web-Builder | AI Website Generator',
  description: 'Generate complete, beautiful websites from prompts using GPT-4o, Gemini, Claude, and more.',
  keywords: 'AI website builder, GPT-4, Gemini, Claude, website generator, no-code',
  openGraph: {
    title: 'Falcon Web-Builder',
    description: 'AI-powered website generator',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e1e2e',
                color: '#cdd6f4',
                border: '1px solid #313244',
                borderRadius: '10px',
              },
              success: {
                iconTheme: { primary: '#a6e3a1', secondary: '#1e1e2e' },
              },
              error: {
                iconTheme: { primary: '#f38ba8', secondary: '#1e1e2e' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
