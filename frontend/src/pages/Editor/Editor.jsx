import React, { useState, useEffect } from 'react';
import './Editor.css';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import Sidebar from './Sidebar';

const Editor = () => {
  const [activeFile, setActiveFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [members, setMembers] = useState([]);
  const [previewMode, setPreviewMode] = useState("split"); // split | editor | preview


  return (
    <div className="editor-layout">
      <Sidebar
        files={files} 
        onFileSelect={setActiveFile} 
        members={members}
        onNewFile={(file) => setFiles(prev => [...prev, file])}
      />

      <div className={`editor-main ${previewMode}`}>
        {(previewMode !== "preview") && (
          <EditorPanel file={activeFile} />
        )}
        {(previewMode !== "editor") && (
          <PreviewPanel file={activeFile} />
        )}
      </div>
    </div>
  );
};

export default Editor;
