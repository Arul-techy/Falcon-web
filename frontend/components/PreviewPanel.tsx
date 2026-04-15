'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Monitor, RefreshCw } from 'lucide-react';

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

export default function PreviewPanel({ html, css, js }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isEmpty = !html && !css && !js;

  const srcDoc = useMemo(() => {
    if (isEmpty) return '';

    // Inject CSS and JS inline if HTML references external files
    let content = html;

    // If HTML already has its own <style> or references styles.css, inject css
    if (!content.includes('<style') && css) {
      content = content.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
    }

    // Inject JS if not already present in page
    if (!content.includes('<script') && js) {
      content = content.replace('</body>', `<script>\n${js}\n</script>\n</body>`);
    }

    // If HTML doesn't have head/body tags at all
    if (!content.includes('<html')) {
      content = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preview</title>
<style>${css}</style>
</head>
<body>
${content}
<script>${js}</script>
</body>
</html>`;
    }

    return content;
  }, [html, css, js, isEmpty]);

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc;
    }
  };

  if (isEmpty) {
    return (
      <div className="preview-panel">
        <div className="preview-header">
          <div className="preview-title">
            <Monitor size={14} />
            <span>Live Preview</span>
          </div>
        </div>
        <div className="preview-empty">
          <Monitor size={48} className="empty-preview-icon" />
          <p>Preview appears here after generation</p>
          <span>Your website will render in a sandboxed iframe</span>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <div className="preview-title">
          <div className="preview-dot green" />
          <div className="preview-dot yellow" />
          <div className="preview-dot red" />
          <span className="preview-label">
            <Monitor size={13} />
            Live Preview
          </span>
        </div>
        <button className="btn-ghost btn-sm" onClick={refresh} title="Refresh preview">
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      <div className="preview-frame-wrapper">
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          className="preview-frame"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="Website Preview"
        />
      </div>
    </div>
  );
}
