import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { FaFileAlt, FaUser, FaPlus, FaTimes } from 'react-icons/fa';
import { Context } from '../../components/context/context';
import { toast } from 'sonner';

const Sidebar = ({ files, members, onFileSelect, onNewFile, projectId, fetchProject }) => {
  const [showModal, setShowModal] = useState(false);
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('javascript');

  const {BASE_URL} = useContext(Context);

  const handleCreateFile = async (e) => {
    e.preventDefault();
    if (!filename.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/createNewFile/${projectId}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({filename, language})
      })
      if(res.ok){
        const newFile = await res.json();
        onNewFile(newFile);
        fetchProject();
        toast.success("File created successfully!");
      }
    } catch (error) {
      toast.error("An error occured while creating new file!");
      console.log(error)
    }

    setFilename('');
    setLanguage("javascript");
    setShowModal(false);
  };

  return (
    <div className="editor-sidebar">
      <div className="section">
        <h4>Team Members</h4>
        <ul>
          {members?.map((member, idx) => (
            <li key={idx}><FaUser /> {member.userId?.username || member.name}</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <div className="file-header">
          <h4>Files</h4>
          <button onClick={() => setShowModal(true)}><FaPlus /></button>
        </div>
        <ul>
          {files?.map((file, idx) => (
            <li key={idx} onClick={() => onFileSelect(file)}>
              <FaFileAlt /> {file.name || file.filename}
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="file-modal">
          <form onSubmit={handleCreateFile}>
            <div className="modal-header">
              <h4>Create File</h4>
              <FaTimes onClick={() => setShowModal(false)} className="close-btn" />
            </div>
            <input
              type="text"
              placeholder="Filename (e.g. main.js)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="cpp">Cpp</option>
              <option value="java">Java</option>
            </select>
            <button type="submit">Create</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
