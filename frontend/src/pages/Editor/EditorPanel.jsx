import React, { useState, useEffect } from 'react';
import './EditorPanel.css';
import { FaCode } from 'react-icons/fa';

const EditorPanel = ({ file }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
    }
  }, [file]);

  if (!file) {
    return (
      <div className="editor-panel empty">
        <p>Select or create a file to start coding...</p>
      </div>
    );
  }

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <FaCode /> <span>{file.name}</span>
      </div>
      <textarea
        className="code-area"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
};

export default EditorPanel;
