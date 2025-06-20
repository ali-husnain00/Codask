import React, { useContext, useState } from 'react';
import { Context } from '../../components/context/context';
import { FaFolderOpen, FaTasks, FaEnvelopeOpenText } from "react-icons/fa";
import "./Dashboard.css"; // for styling
import Projects from './Projects';
import Tasks from './Tasks';
import Invites from './Invites';


const Dashboard = () => {
  const { user } = useContext(Context);
  const [activeComp, setActiveComp] = useState("projects");

  const renderComp = () => {
    switch (activeComp) {
      case "projects":
        return <Projects />;
      case "tasks":
        return <Tasks />;
      case "invites":
        return <Invites />;
      default:
        return null;
    }
  };

  return (
    <div className='dashboard'>
      <aside className="sidebar">
        <h2 className="sidebar-title">Codask</h2>
        <div className="user-section">
          <span className="username">{user?.username}</span>
        </div>
        <ul className="sidebar-links">
          <li
            className={activeComp === "projects" ? "active" : ""}
            onClick={() => setActiveComp("projects")}
          >
            <FaFolderOpen className="icon" /> Projects
          </li>
          <li
            className={activeComp === "tasks" ? "active" : ""}
            onClick={() => setActiveComp("tasks")}
          >
            <FaTasks className="icon" /> Tasks
          </li>
          <li
            className={activeComp === "invites" ? "active" : ""}
            onClick={() => setActiveComp("invites")}
          >
            <FaEnvelopeOpenText className="icon" /> Invites
          </li>
        </ul>
      </aside>

      <main className='main-container'>
        {renderComp()}
      </main>
    </div>
  );
};

export default Dashboard;
