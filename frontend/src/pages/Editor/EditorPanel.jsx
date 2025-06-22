import React, { useState, useEffect, useContext } from 'react';
import './EditorPanel.css';
import { FaCode } from 'react-icons/fa';
import { Editor } from "@monaco-editor/react";
import { Context } from '../../components/context/context';
import { toast } from 'sonner';

const EditorPanel = ({
  files,
  file,
  inputValue,
  setInputValue,
  requiresInput,
  setRequiresInput,
  inputPrompts,
  setInputPrompts,
  currentPromptIndex,
  setCurrentPromptIndex,
  collectedInputs,
  setCollectedInputs,
  isMultiLineInput,
  setIsMultiLineInput,
  setLogs,
  setPreviewHTML,
}) => {
  const [content, setContent] = useState('');
  const { BASE_URL, setEditorData } = useContext(Context);
  const JUDGE0_API_KEY = import.meta.env.VITE_JUDGE0_API;

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setInputValue('');
      setRequiresInput(false);
      setLogs([]);
      setInputPrompts([]);
      setCurrentPromptIndex(0);
      setCollectedInputs([]);
      setIsMultiLineInput(false);
    }
  }, [file]);

  const parsePythonInputPrompts = (code) => {
    const regex = /input\s*\(\s*["']([^"']*)["']\s*\)/g;
    const prompts = [];
    let match;
    while ((match = regex.exec(code)) !== null) {
      prompts.push(match[1]);
    }
    return prompts;
  };

  const parseJavaCppPrompts = (code) => {
    const regex = /\[PROMPT\](.*?)(?=\\n|")/g;
    const prompts = [];
    let match;
    while ((match = regex.exec(code)) !== null) {
      prompts.push(match[1].trim());
    }
    return prompts;
  };

  const codeNeedsInput = (code) => {
    return /cin\s*>>|Scanner|System\.in|scanf/.test(code);
  };

  const runWithJudge0 = async (language, code, input = "") => {
    const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';
    const languageMap = { cpp: 54, python: 71, java: 62 };
    const langId = languageMap[language.toLowerCase()];
    if (!langId) return { error: "Unsupported language selected." };

    try {
      const response = await fetch(JUDGE0_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          language_id: langId,
          source_code: code,
          stdin: input,
        }),
      });
      const result = await response.json();
      return result;
    } catch (err) {
      return { error: err.message };
    }
  };

  const handleRunCode = async () => {
    if (!file) return;
    const lang = file.language.toLowerCase();
    const output = [];

    if (lang === 'javascript') {
      try {
        const log = (...args) => output.push({ type: 'log', message: args.join(' ') });
        const warn = (...args) => output.push({ type: 'warn', message: args.join(' ') });
        const error = (...args) => output.push({ type: 'error', message: args.join(' ') });

        const customConsole = { log, warn, error };
        const run = new Function('console', file.content);
        run(customConsole);
        output.push({ type: 'success', message: '✅ Code executed successfully!' });
      } catch (err) {
        output.push({ type: 'error', message: err.message });
      }
      setLogs(output);
    } else if (['cpp', 'java', 'python'].includes(lang)) {
      if (lang === 'python') {
        const prompts = parsePythonInputPrompts(file.content);
        if (prompts.length > 0) {
          setRequiresInput(true);
          setInputPrompts(prompts);
          setCurrentPromptIndex(0);
          setCollectedInputs([]);
          setIsMultiLineInput(false);
          setLogs([{ type: 'log', message: '⚠️ Please enter inputs for the prompts one by one.' }]);
          return;
        }
      }

      if (lang === 'cpp' || lang === 'java') {
        const prompts = parseJavaCppPrompts(file.content);
        if (prompts.length > 0) {
          setRequiresInput(true);
          setInputPrompts(prompts);
          setCurrentPromptIndex(0);
          setCollectedInputs([]);
          setIsMultiLineInput(false);
          setLogs([{ type: 'log', message: '⚠️ Please enter inputs for the prompts one by one.' }]);
          return;
        } else if (codeNeedsInput(file.content)) {
          setRequiresInput(true);
          setIsMultiLineInput(true);
          setLogs([{ type: 'log', message: '⚠️ Please enter all inputs line by line.' }]);
          return;
        }
      }

      setLogs([{ type: 'log', message: '⏳ Running code...' }]);
      const result = await runWithJudge0(lang, file.content, inputValue);

      if (result.error) {
        output.push({ type: 'error', message: `❌ ${result.error}` });
      } else if (result.compile_output) {
        output.push({ type: 'error', message: result.compile_output });
      } else if (result.stderr) {
        output.push({ type: 'error', message: result.stderr });
      } else {
        output.push({ type: 'log', message: result.stdout || '✅ No output' });
        output.push({ type: 'success', message: '✅ Code executed successfully!' });
      }

      setLogs(output);
    } else {
      const htmlFile = files.find(f => f.language === 'html');
      const cssFile = files.find(f => f.language === 'css');
      const jsFile = files.find(f => f.language === 'javascript');

      const html = htmlFile?.content || '';
      const css = cssFile?.content || '';
      const js = jsFile?.content || '';

      const withCSS = html.replace(/<\/head>/i, `<style>${css}</style></head>`);
      const finalDoc = withCSS.replace(/<\/body>/i, `<script>${js}</script></body>`);

      setPreviewHTML(finalDoc);
    }
  };

  const handleSaveCode = async () => {
    try {
      const res = await fetch(`${BASE_URL}/saveCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fileId: file._id, content })
      });
      if (res.ok) {
        setEditorData((prev) => {
          const updatedFiles = prev.files.map(f => f._id === file._id ? { ...f, content } : f);
          return { ...prev, files: updatedFiles };
        });
        toast.success("Code saved successfully!");
      }
    } catch (error) {
      toast.error("An error occurred while saving the code!");
    }
  };

  useEffect(() => {
    if (!file) return;
    const lang = file.language.toLowerCase();

    if (!requiresInput && inputValue.trim() !== '') {
      const runCodeWithInput = async () => {
        setLogs([{ type: 'log', message: '⏳ Running code with input...' }]);
        const result = await runWithJudge0(lang, file.content, inputValue);
        const output = [];

        if (result.error) {
          output.push({ type: 'error', message: `❌ ${result.error}` });
        } else if (result.compile_output) {
          output.push({ type: 'error', message: result.compile_output });
        } else if (result.stderr) {
          output.push({ type: 'error', message: result.stderr });
        } else {
          let filteredOutput = result.stdout || '';
          inputPrompts.forEach(prompt => {
            const escapedPrompt = prompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const promptRegex = new RegExp(escapedPrompt, 'g');
            filteredOutput = filteredOutput.replace(promptRegex, '');
          });
          output.push({ type: 'log', message: filteredOutput.trim() || '✅ No output' });
          output.push({ type: 'success', message: '✅ Code executed successfully!' });
        }

        setLogs(output);
        setInputValue('');
      };

      if (['cpp', 'java', 'python'].includes(lang)) {
        runCodeWithInput();
      }
    }
  }, [inputValue, requiresInput, file?.content]);

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
        <span><FaCode /> {file.filename}</span>
        <div className="action-btns">
          <button className="run-btn" onClick={handleRunCode}>▶ Run</button>
          <div className="save-code-btn" onClick={handleSaveCode}>Save</div>
        </div>
      </div>
      <Editor
        height="100%"
        language={file.language.toLowerCase()}
        value={content}
        onChange={(value) => setContent(value)}
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
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          fontFamily: 'Fira Code',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default EditorPanel;
