import React, { useState, useEffect, useContext } from 'react';
import './Editor.css';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import Sidebar from './Sidebar';
import Loader from '../../components/Loader/Loader';
import { Context } from '../../components/context/context';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Editor = () => {
  const { id } = useParams();
  const { editorData, setEditorData, BASE_URL } = useContext(Context);

  const [activeFile, setActiveFile] = useState(null);
  const [previewMode, setPreviewMode] = useState("split");
  const [loading, setLoading] = useState(true);
  const [previewHTML, setPreviewHTML] = useState("");
  const [logs, setLogs] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [requiresInput, setRequiresInput] = useState(false);
  const [inputPrompts, setInputPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [collectedInputs, setCollectedInputs] = useState([]);
  const [isMultiLineInput, setIsMultiLineInput] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/project/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setEditorData(data);
      } else {
        toast.error("Could not fetch project data");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (editorData?.files?.length > 0) {
      setActiveFile(editorData.files[0]);
      resetInputStates();
    }
  }, [editorData]);

  // Reset input related states
  const resetInputStates = () => {
    setInputValue('');
    setRequiresInput(false);
    setInputPrompts([]);
    setCurrentPromptIndex(0);
    setCollectedInputs([]);
    setIsMultiLineInput(false);
    setLogs([]);
  };

  // Called when user submits input from Console
  const onSubmitInput = (input) => {
    if (isMultiLineInput) {
      // Java/C++ multiline input: send all inputs at once
      setInputValue(input);
      setRequiresInput(false);
      setCollectedInputs([]);
      setCurrentPromptIndex(0);
    } else {
      // Python multi-step input prompts
      const newCollectedInputs = [...collectedInputs, input];
      setCollectedInputs(newCollectedInputs);

      if (currentPromptIndex + 1 < inputPrompts.length) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      } else {
        setInputValue(newCollectedInputs.join('\n'));
        setRequiresInput(false);
        setCollectedInputs([]);
        setCurrentPromptIndex(0);
      }
    }
  };

  // Called when new file is added
  const handleNewFile = (newFile) => {
    setEditorData(prev => ({
      ...prev,
      files: [...(prev.files || []), newFile]
    }));
    setActiveFile(newFile);
    resetInputStates();
  };

  if (loading) return <Loader />;

  return (
    <div className="editor-layout">
      <Sidebar
        files={editorData?.files || []}
        members={editorData?.members || []}
        onFileSelect={(file) => {
          setActiveFile(file);
          resetInputStates();
        }}
        onNewFile={handleNewFile}
        projectId={id}
        fetchProject={fetchProject}
      />
      <div className={`editor-main ${previewMode}`}>
        {previewMode !== "preview" && (
          <EditorPanel
            files={editorData.files}
            file={activeFile}
            inputValue={inputValue}
            setInputValue={setInputValue}
            requiresInput={requiresInput}
            setRequiresInput={setRequiresInput}
            inputPrompts={inputPrompts}
            setInputPrompts={setInputPrompts}
            currentPromptIndex={currentPromptIndex}
            setCurrentPromptIndex={setCurrentPromptIndex}
            collectedInputs={collectedInputs}
            setCollectedInputs={setCollectedInputs}
            isMultiLineInput={isMultiLineInput}
            setIsMultiLineInput={setIsMultiLineInput}
            setLogs={setLogs}
            setPreviewHTML={setPreviewHTML}
          />
        )}
        {previewMode !== "editor" && (
          <PreviewPanel
            logs={logs}
            previewHTML={previewHTML}
            file={activeFile}
            files={editorData.files}
            requiresInput={requiresInput}
            onInputSubmit={onSubmitInput}
            inputPrompts={inputPrompts}
            currentPromptIndex={currentPromptIndex}
            isMultiLineInput={isMultiLineInput}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
