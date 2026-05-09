import React, { useState, useEffect, useContext } from 'react';
import { Code2, Sidebar as SidebarIcon, Menu, Maximize2 } from 'lucide-react';
import { apiRequest } from '../../lib/apiClient';
import { Button } from '../../components/ui/button';
import { Context } from '@/components/context/context';
import { Editor } from '@monaco-editor/react';

const EditorPanel = ({ file, files, setActiveFile, setPreviewHTML, setLogs, stdin, previewMode, setPreviewMode, socket, setEditorMenu }) => {
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

  useEffect(() => {
    const hasWebFiles = files?.some(f => ['html', 'css', 'javascript'].includes(f.language?.toLowerCase()));
    if (!hasWebFiles) return;

    const getFileContent = (lang) => {
      const f = files?.find(f => f.language?.toLowerCase() === lang);
      if (!f) return '';
      return (file && file._id === f._id) ? content : f.content;
    };

    const html = getFileContent('html');
    const css = getFileContent('css');
    const js = getFileContent('javascript');

    let finalDoc = html;
    if (css) {
      if (/<\/head>/i.test(finalDoc)) {
        finalDoc = finalDoc.replace(/<\/head>/i, `<style>\n${css}\n</style></head>`);
      } else {
        finalDoc = `<style>\n${css}\n</style>\n` + finalDoc;
      }
    }
    
    if (js) {
      const loopProtectJS = `
        window.onerror = function(e) { console.error(e); };
        ${js}
      `;
      if (/<\/body>/i.test(finalDoc)) {
        finalDoc = finalDoc.replace(/<\/body>/i, `<script>\n${loopProtectJS}\n</script></body>`);
      } else {
        finalDoc = finalDoc + `\n<script>\n${loopProtectJS}\n</script>`;
      }
    }

    const timeout = setTimeout(() => {
      setPreviewHTML(finalDoc);
    }, 800);
    
    return () => clearTimeout(timeout);
  }, [content, file, files, setPreviewHTML]);

  const handleRunCode = async () => {
    const lang = file?.language?.toLowerCase();

    if (lang === 'html' || lang === 'css') {
      setLogs([{ type: 'log', message: 'Live preview is updated automatically. No backend execution required.' }]);
      return;
    }

    if (!['javascript', 'python', 'cpp', 'java'].includes(lang)) {
      setLogs([{ type: 'error', message: `Unsupported language: ${lang}` }]);
      return;
    }

    setLogs([{ type: 'log', message: 'Executing code via Judge0...' }]);

    try {
      const res = await apiRequest(BASE_URL, "/executeCode", {
        method: 'POST',
        body: JSON.stringify({
          language: lang,
          sourceCode: content,
          stdin: stdin || ""
        }),
      });

      const result = res.data || res;
      const newLogs = [];

      if (result.compile_output) {
        newLogs.push({ type: 'error', message: `Compiler Output:\n${result.compile_output}` });
      }

      if (result.stdout) {
        newLogs.push({ type: 'log', message: result.stdout.trim() });
      }

      if (result.stderr) {
        newLogs.push({ type: 'error', message: result.stderr.trim() });
      }

      if (result.status && result.status.id !== 3 && result.status.description) {
        if (result.status.id > 3) {
          newLogs.push({ type: 'error', message: `Status: ${result.status.description}` });
        } else {
          newLogs.push({ type: 'log', message: `Status: ${result.status.description}` });
        }
      }

      if (result.time) {
        newLogs.push({ type: 'log', message: `Time: ${result.time}s | Memory: ${result.memory}KB` });
      }

      if (newLogs.length === 0) {
        newLogs.push({ type: 'log', message: 'Execution finished with no output.' });
      }

      setLogs(newLogs);
    } catch (err) {
      setLogs([{ type: 'error', message: `Error: ${err.message}` }]);
    }
  };

  const handleSaveCode = async () => {
    try {
      await apiRequest(BASE_URL, "/saveCode", {
        method: 'POST',
        body: JSON.stringify({ fileId: file._id, content }),
      });
      setEditorData(prev => ({
        ...prev,
        files: prev.files.map(f => f._id === file._id ? { ...f, content } : f)
      }));
      toast.success('Code saved');
    } catch {
      toast.error('Failed to save code');
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleCodeUpdate = (update) => {
      if (update.fileId === file._id && update.senderId !== user._id) {
        setContent(update.content);
      }
    }

    socket.on("codeUpdate", handleCodeUpdate);

    return () => {
      socket.off("codeUpdate", handleCodeUpdate)
    }
  }, [file, socket, user])

  const onContentChange = (newContent) => {
    setContent(newContent);
    if (socket && file) {
      socket.emit("codeChange", {
        projectId: file.projectId,
        fileId: file._id,
        content: newContent,
        senderId: user._id,
      })
      socket.emit("typing", { projectId: file.projectId, user });
    }
  }

  if (!file) return <div className="flex h-full flex-1 items-center justify-center bg-[var(--surface)]"><p>No file selected</p></div>;

  return (
    <div className={`${previewMode === "preview" ? "hidden" : "flex"} ${previewMode === "editor" ? "h-full w-full" : "h-1/2 w-full lg:h-full lg:w-1/2"} min-h-0 flex-col border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--surface)]`}>
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface-soft)]">
        <div className="flex h-full items-center overflow-x-auto scrollbar-hide">
          <div className="flex h-full items-center px-4 cursor-pointer lg:hidden text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border-r border-[var(--border)]" onClick={() =>setEditorMenu(prev => !prev)}>
            <Menu size={18} title='Open menu'/>
          </div>
          <div className="flex h-full items-center gap-2 border-r border-[var(--border)] px-6 text-sm bg-[var(--surface)] border-t-2 border-t-[var(--primary)] text-[var(--foreground)]">
            <Code2 size={14} className="text-[var(--primary)]" />
            <span className="font-medium tracking-tight">{file.filename}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 flex-shrink-0">
          <Button variant="default" className="h-7 px-3 text-xs" onClick={handleRunCode}>Run</Button>
          <Button variant="secondary" className="h-7 px-3 text-xs" onClick={handleSaveCode}>Save</Button>
          <div className="flex items-center gap-2 ml-2 border-l border-[var(--border)] pl-3 text-[var(--text-muted)]">
            <Maximize2 className={`cursor-pointer hover:text-[var(--text)] transition-colors ${previewMode === 'editor' ? 'text-[var(--text)]' : ''}`} size={16} title="Full Editor" onClick={() => setPreviewMode("editor")} />
            <SidebarIcon className={`cursor-pointer hover:text-[var(--text)] transition-colors ${previewMode === 'split' ? 'text-[var(--text)]' : ''}`} size={16} title="Split View" onClick={() => setPreviewMode("split")} />
          </div>
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
              'editor.background': '#0a0a0a',
              'editor.foreground': '#ededed',
              'editorLineNumber.foreground': '#525252',
              'editorCursor.foreground': '#ededed',
              'editor.selectionBackground': '#262626',
              'editor.inactiveSelectionBackground': '#171717',
              'editor.lineHighlightBackground': '#171717',
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
