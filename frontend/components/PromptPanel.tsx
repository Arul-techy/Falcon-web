'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, History, ChevronRight, X } from 'lucide-react';

interface PromptHistoryItem {
  id: string;
  prompt: string;
  timestamp: number;
  model: string;
}

interface PromptPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  tokensUsed?: number;
  model: string;
}

export default function PromptPanel({ onGenerate, isLoading, tokensUsed, model }: PromptPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('falcon-prompt-history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim() || isLoading) return;

    // Save to history
    const newItem: PromptHistoryItem = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      timestamp: Date.now(),
      model,
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('falcon-prompt-history', JSON.stringify(updated));

    onGenerate(prompt.trim());
  };

  const handleHistorySelect = (p: string) => {
    setPrompt(p);
    setShowHistory(false);
  };

  const removeHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('falcon-prompt-history', JSON.stringify(updated));
  };

  const charCount = prompt.length;
  const charLimit = 4000;

  return (
    <div className="prompt-panel">
      <div className="prompt-header">
        <h2 className="panel-title">
          <Sparkles size={16} className="panel-title-icon" />
          Describe Your Website
        </h2>
        {history.length > 0 && (
          <button
            className="btn-ghost btn-sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History size={14} />
            History ({history.length})
          </button>
        )}
      </div>

      {showHistory && (
        <div className="history-dropdown">
          <div className="history-list">
            {history.map((item) => (
              <div
                key={item.id}
                className="history-item"
                onClick={() => handleHistorySelect(item.prompt)}
              >
                <div className="history-content">
                  <span className="history-model">{item.model}</span>
                  <p className="history-text">{item.prompt}</p>
                </div>
                <ChevronRight size={14} className="history-arrow" />
                <button
                  className="history-remove"
                  onClick={(e) => removeHistory(item.id, e)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="prompt-textarea-wrapper">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the website you want to build... e.g. 'A modern landing page for a coffee shop with online ordering, dark theme, animated hero section, and customer reviews carousel'"
          className="prompt-textarea"
          maxLength={charLimit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate();
          }}
          disabled={isLoading}
        />
        <div className="textarea-footer">
          <span className={`char-count ${charCount > charLimit * 0.9 ? 'near-limit' : ''}`}>
            {charCount.toLocaleString()} / {charLimit.toLocaleString()}
          </span>
          <span className="shortcut-hint">Ctrl+Enter to generate</span>
        </div>
      </div>

      <div className="prompt-actions">
        <div className="token-info">
          {tokensUsed !== undefined && tokensUsed > 0 && (
            <span className="token-badge">
              <span className="token-dot" />
              {tokensUsed.toLocaleString()} tokens used
            </span>
          )}
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="btn-primary btn-generate"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Website
            </>
          )}
        </button>
      </div>
    </div>
  );
}
