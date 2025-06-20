import React from 'react';
import './Sidebar.css';
import { FaFileAlt, FaUser, FaPlus } from 'react-icons/fa';

const dummyMembers = [
  { id: 1, name: 'Ali Husnain' },
  { id: 2, name: 'Sarah Malik' },
  { id: 3, name: 'John Doe' },
];

const dummyFiles = [
  { id: 1, name: 'main.js' },
  { id: 2, name: 'index.html' },
  { id: 3, name: 'style.css' },
];

const EditorSidebar = ({ onFileSelect, onCreateFile }) => {
  return (
    <div className="editor-sidebar">
      <div className="section">
        <h4>Team Members</h4>
        <ul>
          {dummyMembers.map((member) => (
            <li key={member.id}>
              <FaUser /> {member.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <div className="file-header">
          <h4>Files</h4>
          <button onClick={onCreateFile}><FaPlus /></button>
        </div>
        <ul>
          {dummyFiles.map((file) => (
            <li key={file.id} onClick={() => onFileSelect(file)}>
              <FaFileAlt /> {file.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditorSidebar;
