'use client';

import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, Settings2, Key, Cpu } from 'lucide-react';

const MODELS = [
  {
    id: 'openai',
    label: 'OpenAI',
    icon: '🤖',
    variants: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { value: 'o1-mini', label: 'o1-mini' },
    ],
    apiKeyPlaceholder: 'sk-...',
    apiKeyLink: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    icon: '✨',
    variants: [
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    ],
    apiKeyPlaceholder: 'AIza...',
    apiKeyLink: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'claude',
    label: 'Anthropic Claude',
    icon: '🧠',
    variants: [
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
      { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    ],
    apiKeyPlaceholder: 'sk-ant-...',
    apiKeyLink: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'groq',
    label: 'Groq',
    icon: '⚡',
    variants: [
      { value: 'llama-3.3-70b-versatile', label: 'LLaMA 3.3 70B' },
      { value: 'llama-3.1-8b-instant', label: 'LLaMA 3.1 8B (Fast)' },
      { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
    ],
    apiKeyPlaceholder: 'gsk_...',
    apiKeyLink: 'https://console.groq.com/keys',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    icon: '🔀',
    variants: [
      { value: 'openai/gpt-4o', label: 'GPT-4o (via OR)' },
      { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 (via OR)' },
      { value: 'meta-llama/llama-3.3-70b-instruct', label: 'LLaMA 3.3 70B (via OR)' },
      { value: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash (via OR)' },
    ],
    apiKeyPlaceholder: 'sk-or-...',
    apiKeyLink: 'https://openrouter.ai/keys',
  },
];

interface SidebarProps {
  model: string;
  modelName: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  onModelChange: (model: string) => void;
  onModelNameChange: (name: string) => void;
  onApiKeyChange: (key: string) => void;
  onTemperatureChange: (t: number) => void;
  onMaxTokensChange: (t: number) => void;
}

export default function Sidebar({
  model,
  modelName,
  apiKey,
  temperature,
  maxTokens,
  onModelChange,
  onModelNameChange,
  onApiKeyChange,
  onTemperatureChange,
  onMaxTokensChange,
}: SidebarProps) {
  const [showKey, setShowKey] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);

  const selectedModel = MODELS.find((m) => m.id === model) || MODELS[0];

  const handleModelChange = (newModel: string) => {
    onModelChange(newModel);
    const m = MODELS.find((x) => x.id === newModel);
    if (m) onModelNameChange(m.variants[0].value);
    onApiKeyChange(''); // Clear key on model switch
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="section-header">
          <Cpu size={14} />
          <span>AI Model</span>
        </div>

        <div className="model-grid">
          {MODELS.map((m) => (
            <button
              key={m.id}
              className={`model-pill ${model === m.id ? 'active' : ''}`}
              onClick={() => handleModelChange(m.id)}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Model variant selector */}
        <div className="field-group">
          <label className="field-label">Model Version</label>
          <div className="select-wrapper">
            <select
              value={modelName}
              onChange={(e) => onModelNameChange(e.target.value)}
              className="field-select"
            >
              {selectedModel.variants.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="select-arrow" />
          </div>
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div className="section-header">
          <Key size={14} />
          <span>API Key</span>
        </div>

        <div className="field-group">
          <div className="api-key-wrapper">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder={selectedModel.apiKeyPlaceholder}
              className="field-input api-key-input"
              autoComplete="off"
            />
            <button
              className="btn-icon key-toggle"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <a
            href={selectedModel.apiKeyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="key-link"
          >
            Get {selectedModel.label} API key →
          </a>
          <p className="key-note">🔒 Stored in memory only, never saved</p>
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <button
          className="section-header collapsible"
          onClick={() => setConfigOpen(!configOpen)}
        >
          <Settings2 size={14} />
          <span>Model Config</span>
          <ChevronDown size={12} className={`collapse-icon ${configOpen ? 'open' : ''}`} />
        </button>

        {configOpen && (
          <div className="config-fields">
            <div className="field-group">
              <div className="slider-header">
                <label className="field-label">Temperature</label>
                <span className="slider-value">{temperature.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Max Tokens</label>
              <div className="select-wrapper">
                <select
                  value={maxTokens}
                  onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
                  className="field-select"
                >
                  <option value={1024}>1,024</option>
                  <option value={2048}>2,048</option>
                  <option value={4096}>4,096</option>
                  <option value={8192}>8,192</option>
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
