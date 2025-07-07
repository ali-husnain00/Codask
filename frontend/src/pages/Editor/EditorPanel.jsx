import React, { useState, useEffect, useContext } from 'react';
import './EditorPanel.css';
import { FaCode } from 'react-icons/fa';
import { Editor } from "@monaco-editor/react";
import { Context } from '../../components/context/context';
import { toast } from 'sonner';
import { FiMaximize } from 'react-icons/fi';
import { FiSidebar } from 'react-icons/fi';

const EditorPanel = ({ file, files, setPreviewHTML, setLogs, previewMode, setPreviewMode, socket }) => {
  const [content, setContent] = useState('');
  const { BASE_URL, setEditorData, user } = useContext(Context);

  useEffect(() => {
    if (file) setContent(file.content || '');
  }, [file]);

  const getExtension = (lang) => {
    switch (lang) {
      case 'javascript': return 'js';
      case 'python': return 'py';
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      default: return 'txt';
    }
  };

  const getVersion = (lang) => {
    switch (lang) {
      case 'javascript': return '1.32.3';
      case 'cpp': return '10.2.0';
      case 'java': return '15.0.2';
      case 'python': return '3.10.0';
      default: return '';
    }
  };

  const handleRunCode = async () => {
    const lang = file?.language?.toLowerCase();

    if (lang === 'html') {
      const html = files.find(f => f.language === 'html')?.content || '';
      const css = files.find(f => f.language === 'css')?.content || '';
      const js = files.find(f => f.language === 'javascript')?.content || '';

      const withCSS = html.replace(/<\/head>/i, `<style>${css}</style></head>`);
      const finalDoc = withCSS.replace(/<\/body>/i, `<script>${js}</script></body>`);
      setPreviewHTML(finalDoc);
      return;
    }

    if (!['javascript', 'python', 'cpp', 'java'].includes(lang)) {
      setLogs([{ type: 'error', message: `❌ Unsupported language: ${lang}` }]);
      return;
    }

    setLogs([{ type: 'log', message: '⏳ Running your code...' }]);

    try {
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          version: getVersion(lang),
          files: [{ name: `file.${getExtension(lang)}`, content }],
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();
      const logs = [];

      if (result.run.stdout) {
        logs.push({ type: 'log', message: result.run.stdout.trim() });
      }

      if (result.run.stderr) {
        logs.push({ type: 'error', message: result.run.stderr.trim() });
      }

      if (result.run.stdout && !result.run.stderr) {
        logs.push({ type: 'log', message: '✅ Code executed successfully!' });
      }

      if (logs.length === 0) {
        logs.push({ type: 'log', message: '✅ No output' });
      }

      setLogs(logs);
    } catch (err) {
      setLogs([{ type: 'error', message: `❌ Error: ${err.message}` }]);
    }
  };


  const handleSaveCode = async () => {
    try {
      const res = await fetch(`${BASE_URL}/saveCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fileId: file._id, content }),
      });

      if (res.ok) {
        setEditorData(prev => ({
          ...prev,
          files: prev.files.map(f => f._id === file._id ? { ...f, content } : f)
        }));
        toast.success('Code saved');
      }
    } catch {
      toast.error('❌ Failed to save code');
    }
  };

  useEffect(() =>{
    if(!socket) return;

    const handleCodeUpdate = (update) =>{
      if(update.fileId === file._id && update.senderId !== user._id){
        setContent(update.content);
      }
    }

    socket.on("codeUpdate", handleCodeUpdate);

    return () =>{
      socket.off("codeUpdate", handleCodeUpdate)
    }
  },[file, socket, user])

  const onContentChange = (newContent) =>{
    setContent(newContent);
    if(socket && file){
      socket.emit("codeChange", {
      projectId:file.projectId,
      fileId:file._id,
      content:newContent,
      senderId:user._id,
    })
     socket.emit("typing", {projectId: file.projectId, user});
    }
}

  if (!file) return <div className="editor-panel empty"><p>No file selected</p></div>;

  return (
    <div className={`editor-panel ${previewMode === "editor" ? "editor-fullWidth" : "" || previewMode === "split" ? "editor-halfWidth" : "" || previewMode === "preview" ? "hide-editor" : ""}`}>
      <div className="editor-header">
        <span><FaCode /> {file.filename}</span>
        <div className="action-btns">
          <button className="run-btn" onClick={handleRunCode}>▶ Run</button>
          <div className="save-code-btn" onClick={handleSaveCode}>Save</div>
          <FiMaximize size={24} title="Full Editor View" onClick={() =>setPreviewMode("editor")} />
          <FiSidebar size={24} title="Split View" onClick={() =>setPreviewMode("split")} />
        </div>
      </div>
      <Editor
        height="100%"
        language={file.language.toLowerCase()}
        value={content}
        onChange={onContentChange}
        onMount={(editor, monaco) => {
          monaco.editor.defineTheme('codask-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6A9955' },
              { token: 'keyword', foreground: 'C586C0' },
              { token: 'number', foreground: 'B5CEA8' },
              { token: 'string', foreground: 'CE9178' },
              { token: 'variable', foreground: '9CDCFE' },
              { token: 'identifier', foreground: '9CDCFE' },
              { token: 'delimiter', foreground: 'D4D4D4' },
              { token: 'type', foreground: '4EC9B0' }
            ],
            colors: {
              'editor.background': '#1E1E2F',
              'editor.foreground': '#E0E0E0',
              'editorLineNumber.foreground': '#858585',
              'editorCursor.foreground': '#AEAFAD',
              'editor.selectionBackground': '#264F78',
              'editor.inactiveSelectionBackground': '#3A3D41',
            }
          });

          monaco.editor.setTheme('codask-dark');
        }}
        theme="codask-dark"
        options={{ fontSize: 14, minimap: { enabled: false }, fontFamily: 'Fira Code', automaticLayout: true }}
      />
    </div>
  );
};

export default EditorPanel;
