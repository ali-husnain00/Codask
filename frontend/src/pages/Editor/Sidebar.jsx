import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { FaFileAlt, FaUser, FaPlus, FaTimes } from 'react-icons/fa';
import { Context } from '../../components/context/context';
import { toast } from 'sonner';
import { useEffect } from 'react';
import {FiX} from 'react-icons/fi';

const Sidebar = ({ files, members, onFileSelect, onNewFile, projectId, fetchProject, activeUsers, typingUser, editorMenu, setEditorMenu }) => {
  const [showModal, setShowModal] = useState(false);
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('javascript');

  const { BASE_URL } = useContext(Context);

  const handleCreateFile = async (e) => {
    e.preventDefault();
    if (!filename.trim() || !language) {
      toast.warning("All fields are required!");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/createNewFile/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ filename, language })
      })
      if (res.ok) {
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
    <div className={`editor-sidebar ${editorMenu ? "activeEM":""}`}>
      <div className="editor-close-menu-btn" onClick={() =>setEditorMenu(prev => !prev)}>
          <FiX fontSize={25} fontWeight={600} title='Close menu'/>
        </div>
      <div className="section">
        <h4>Team Members</h4>
        <ul>
          {
            members?.map((member) => {
              const isActive = activeUsers?.some(u => u.id === member.userId._id);
              const isTyping = typingUser && typingUser._id === member.userId._id;

              return (
                <div className="member" key={member.userId._id}>
                  <li>
                    <FaUser />
                    {member.userId.username}
                    <span title={isActive ? "Online" : "Offline"} className={isActive ? "active" : "s"}>
                      ●
                    </span>
                    {isTyping && (
                      <span className="typing-indicator"> ✍️ typing...</span>
                    )}
                  </li>
                </div>
              );
            })
          }

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
