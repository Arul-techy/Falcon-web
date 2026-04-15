'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Download, Eye, Code2, AlertTriangle, ArrowLeftRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PromptPanel from '../components/PromptPanel';
import CodeTabs from '../components/CodeTabs';
import PreviewPanel from '../components/PreviewPanel';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { generateWebsite } from '../services/generateService';
import { downloadZip } from '../utils/zipDownload';

type View = 'split' | 'code' | 'preview';

export default function HomePage() {
  const { user, loading, signIn } = useAuth();

  // Model config state
  const [model, setModel] = useState('openai');
  const [modelName, setModelName] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);

  // Generated code state
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [tokensUsed, setTokensUsed] = useState<number>(0);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<View>('split');

  const handleGenerate = async (prompt: string) => {
    if (!apiKey.trim()) {
      toast.error('Please enter your API key first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await generateWebsite({
        model,
        apiKey,
        prompt,
        config: { temperature, maxTokens },
        modelName,
      });

      setHtml(result.html);
      setCss(result.css);
      setJs(result.js);
      setTokensUsed(result.tokensUsed);
      toast.success('Website generated! 🎉');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!html) {
      toast.error('Nothing to download yet');
      return;
    }
    await downloadZip(html, css, js, 'falcon-site');
    toast.success('Downloaded as ZIP!');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading Falcon Web-Builder...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-logo">⚡</div>
          <h1 className="auth-title">
            Falcon <span className="gradient-text">Web-Builder</span>
          </h1>
          <p className="auth-subtitle">
            Generate complete websites from prompts using state-of-the-art AI models
          </p>
          <div className="auth-features">
            <div className="feature-pill">🤖 GPT-4o</div>
            <div className="feature-pill">✨ Gemini</div>
            <div className="feature-pill">🧠 Claude</div>
            <div className="feature-pill">⚡ Groq</div>
          </div>
          <button onClick={signIn} className="btn-primary btn-signin">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <Navbar />
      <div className="app-body">
        <div className="sidebar-wrapper">
          <Sidebar
            model={model}
            modelName={modelName}
            apiKey={apiKey}
            temperature={temperature}
            maxTokens={maxTokens}
            onModelChange={setModel}
            onModelNameChange={setModelName}
            onApiKeyChange={setApiKey}
            onTemperatureChange={setTemperature}
            onMaxTokensChange={setMaxTokens}
          />
        </div>

        <main className="main-panel">
          <PromptPanel
            onGenerate={handleGenerate}
            isLoading={isLoading}
            tokensUsed={tokensUsed}
            model={model}
          />

          {error && (
            <div className="error-banner">
              <AlertTriangle size={16} />
              <span>{error}</span>
              <button onClick={() => setError('')} className="error-close">×</button>
            </div>
          )}

          <div className="output-bar">
            <div className="view-toggle">
              <button className={`view-btn ${view === 'split' ? 'active' : ''}`} onClick={() => setView('split')}>
                <ArrowLeftRight size={13} /> Split
              </button>
              <button className={`view-btn ${view === 'code' ? 'active' : ''}`} onClick={() => setView('code')}>
                <Code2 size={13} /> Code
              </button>
              <button className={`view-btn ${view === 'preview' ? 'active' : ''}`} onClick={() => setView('preview')}>
                <Eye size={13} /> Preview
              </button>
            </div>
            <button onClick={handleDownload} disabled={!html} className="btn-secondary btn-sm">
              <Download size={13} />
              Download ZIP
            </button>
          </div>

          <div className={`output-grid view-${view}`}>
            {(view === 'split' || view === 'code') && (
              <CodeTabs html={html} css={css} js={js} onHtmlChange={setHtml} onCssChange={setCss} onJsChange={setJs} />
            )}
            {(view === 'split' || view === 'preview') && (
              <PreviewPanel html={html} css={css} js={js} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
