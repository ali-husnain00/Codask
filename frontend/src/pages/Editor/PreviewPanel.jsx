import React from 'react';
import './PreviewPanel.css';
import { FaEye } from 'react-icons/fa';
import Console from '../../components/Console/Console';

const PreviewPanel = ({ file, previewHTML, logs, onInputSubmit, requiresInput, inputPrompts, currentPromptIndex, isMultiLineInput }) => {
  const isCodeLanguage = (lang) => ['javascript', 'python', 'java', 'cpp'].includes(lang);

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <FaEye /> <span>Live Preview</span>
      </div>
      <div className="preview-body">
        {!file ? (
          <p>No file selected</p>
        ) : file.language === 'html' ? (
          <iframe
            title="Live Preview"
            srcDoc={previewHTML}
            sandbox="allow-scripts"
            className="preview-iframe"
          />
        ) : isCodeLanguage(file.language.toLowerCase()) ? (
          <Console
            logs={logs}
            requiresInput={requiresInput}
            inputPrompts={inputPrompts}
            currentPromptIndex={currentPromptIndex}
            onSubmitInput={onInputSubmit}
            isMultiLineInput={isMultiLineInput}
          />
        ) : (
          <p>Preview not available for this file type</p>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
