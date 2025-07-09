import React from 'react';
import './PreviewPanel.css';
import { FaEye } from 'react-icons/fa';
import Console from '../../components/Console/Console';
import { FiMaximize } from 'react-icons/fi';
import { FiSidebar } from 'react-icons/fi';

const PreviewPanel = ({ file, previewHTML, logs, previewMode, setPreviewMode }) => {
  const language = file?.language?.toLowerCase();
  const isConsoleLang = ['javascript', 'python', 'cpp', 'java'].includes(language);

  return (
    <div className={`preview-panel 
  ${previewMode === "preview" ? "preview-fullWidth" : ""} 
  ${previewMode === "split" ? "preview-halfWidth" : ""} 
  ${previewMode === "editor" ? "hide-preview" : ""}`}>
      <div className="preview-header">
        <span><FaEye /> Live Preview</span>
        <div className="editor-width-control-btns">
          <FiMaximize size={24} title="Full Editor View" onClick={() => setPreviewMode("preview")} />
          <FiSidebar size={24} title="Split View" onClick={() => setPreviewMode("split")} />
        </div>
      </div>
      <div className="preview-body">
        {!file ? (
          <p>No file selected</p>
        ) : language === 'html' ? (
          <iframe
            title="Live Preview"
            srcDoc={previewHTML}
            sandbox="allow-scripts allow-same-origin"
            className="preview-iframe"
          />
        ) : isConsoleLang ? (
          <Console
            logs={logs}
          />

        ) : (
          <p>Preview not available for this file type</p>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;