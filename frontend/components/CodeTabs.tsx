'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Copy, Check, Code2, Palette, Zap } from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeTabsProps {
  html: string;
  css: string;
  js: string;
  onHtmlChange: (v: string) => void;
  onCssChange: (v: string) => void;
  onJsChange: (v: string) => void;
}

type Tab = 'html' | 'css' | 'js';

const TABS = [
  { id: 'html' as Tab, label: 'HTML', icon: Code2, language: 'html', color: '#e34c26' },
  { id: 'css' as Tab, label: 'CSS', icon: Palette, language: 'css', color: '#264de4' },
  { id: 'js' as Tab, label: 'JavaScript', icon: Zap, language: 'javascript', color: '#f7df1e' },
];

export default function CodeTabs({ html, css, js, onHtmlChange, onCssChange, onJsChange }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('html');
  const [copied, setCopied] = useState<Tab | null>(null);

  const getContent = (tab: Tab) => ({ html, css, js }[tab]);
  const getHandler = (tab: Tab) => ({ html: onHtmlChange, css: onCssChange, js: onJsChange }[tab]);

  const handleCopy = useCallback(async (tab: Tab) => {
    const content = getContent(tab);
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(tab);
    setTimeout(() => setCopied(null), 2000);
  }, [html, css, js]);

  const activeTabInfo = TABS.find((t) => t.id === activeTab)!;
  const content = getContent(activeTab);
  const isEmpty = !html && !css && !js;

  return (
    <div className="code-tabs-panel">
      <div className="tabs-header">
        <div className="tabs-list">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ '--tab-color': tab.color } as React.CSSProperties}
              >
                <Icon size={13} />
                {tab.label}
                {getContent(tab.id) && (
                  <span className="tab-dot" style={{ background: tab.color }} />
                )}
              </button>
            );
          })}
        </div>

        <button
          className={`btn-ghost btn-sm copy-btn ${copied === activeTab ? 'copied' : ''}`}
          onClick={() => handleCopy(activeTab)}
          disabled={!content}
        >
          {copied === activeTab ? (
            <><Check size={13} /> Copied!</>
          ) : (
            <><Copy size={13} /> Copy {activeTabInfo.label}</>
          )}
        </button>
      </div>

      <div className="editor-container">
        {isEmpty ? (
          <div className="editor-empty">
            <Code2 size={40} className="empty-icon" />
            <p>Your generated code will appear here</p>
            <span>HTML, CSS, and JavaScript tabs</span>
          </div>
        ) : (
          <MonacoEditor
            key={activeTab}
            height="100%"
            language={activeTabInfo.language}
            value={content || `/* No ${activeTabInfo.label} generated */`}
            onChange={(v) => getHandler(activeTab)(v || '')}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'gutter',
              padding: { top: 16, bottom: 16 },
              automaticLayout: true,
              tabSize: 2,
              formatOnPaste: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
