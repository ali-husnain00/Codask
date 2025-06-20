import React from 'react';
import './PreviewPanel.css';
import { FaEye } from 'react-icons/fa';

const PreviewPanel = ({ file }) => {
  const renderPreview = () => {
    if (!file) return <p>No file selected</p>;

    if (file.language === 'html') {
      return (
        <iframe
          title="Live Preview"
          srcDoc={file.content}
          sandbox="allow-scripts"
          className="preview-iframe"
        />
      );
    }

    return <pre className="not-supported">Preview not available for this file type</pre>;
  };

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <FaEye /> <span>Live Preview</span>
      </div>
      <div className="preview-body">
        {renderPreview()}
      </div>
    </div>
  );
};

export default PreviewPanel;
