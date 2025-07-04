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

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/project/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setEditorData(data);
      } else {
        toast.error("Failed to fetch project data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the project");
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
      setLogs([]);
    }
  }, [editorData]);

  const handleNewFile = (newFile) => {
    setEditorData(prev => ({
      ...prev,
      files: [...(prev.files || []), newFile]
    }));
    setActiveFile(newFile);
    setLogs([]);
  };

  if (loading) return <Loader />;

  return (
    <div className="editor-layout">
      <Sidebar
        files={editorData?.files || []}
        members={editorData?.members || []}
        onFileSelect={(file) => {
          setActiveFile(file);
          setLogs([]);
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
            setPreviewHTML={setPreviewHTML}
            logs={logs}
            setLogs={setLogs}
            previewMode = {previewMode}
            setPreviewMode = {setPreviewMode}
          />
        )}
        {previewMode !== "editor" && (
          <PreviewPanel
            previewHTML={previewHTML}
            file={activeFile}
            logs={logs}
            previewMode = {previewMode}
            setPreviewMode = {setPreviewMode}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;