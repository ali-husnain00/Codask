import React from 'react';
import { Eye, Maximize2, Sidebar as SidebarIcon } from 'lucide-react';
import Console from '@/components/Console/Console';

const PreviewPanel = ({ file, previewHTML, logs, stdin, setStdin, previewMode, setPreviewMode }) => {
  const language = file?.language?.toLowerCase();
  const isConsoleLang = ['javascript', 'python', 'cpp', 'java'].includes(language);

  return (
    <div className={`${previewMode === "editor" ? "hidden" : "flex"} ${previewMode === "preview" ? "h-full w-full" : "h-1/2 w-full lg:h-full lg:w-1/2"} min-h-0 flex-col bg-[var(--surface)]`}>
      <div className="flex h-12 items-center justify-between border-b border-[var(--border)] px-4">
        <span className="inline-flex items-center gap-2 text-sm font-medium"><Eye size={16} className="text-[var(--text-muted)]" /> Live Preview</span>
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <Maximize2 className={`cursor-pointer hover:text-[var(--text)] transition-colors ${previewMode === 'preview' ? 'text-[var(--text)]' : ''}`} size={16} title="Full Preview" onClick={() => setPreviewMode("preview")} />
          <SidebarIcon className={`cursor-pointer hover:text-[var(--text)] transition-colors ${previewMode === 'split' ? 'text-[var(--text)]' : ''}`} size={16} title="Split View" onClick={() => setPreviewMode("split")} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {!file ? (
          <div className="flex h-full items-center justify-center text-[var(--text-muted)]">No file selected</div>
        ) : language === 'html' ? (
          <iframe
            title="Live Preview"
            srcDoc={previewHTML}
            sandbox="allow-scripts allow-same-origin"
            className="h-full w-full border-none bg-white"
          />
        ) : isConsoleLang ? (
          <Console
            logs={logs}
            stdin={stdin}
            setStdin={setStdin}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--text-muted)]">Preview not available for this file type</div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;