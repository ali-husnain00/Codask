import React, { useContext, useState } from 'react';
import { Context } from '../../components/context/context';
import { FaFolderOpen, FaTasks, FaEnvelopeOpenText, FaUserPlus } from "react-icons/fa";
import "./Dashboard.css";
import Projects from './Projects';
import Tasks from './Tasks';
import Invites from './Invites';
import AddMember from './AddMember';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {FiMenu, FiX, FiLogOut } from 'react-icons/fi';


const Dashboard = () => {
  const { user, BASE_URL, getLoggedInUser } = useContext(Context);
  const [activeComp, setActiveComp] = useState("projects");
  const [activeSidebar, setActiveSidebar] = useState(false)
  const navigate = useNavigate()

  const renderComp = () => {
    switch (activeComp) {
      case "projects":
        return <Projects />;
      case "tasks":
        return <Tasks />;
      case "add-member":
        return <AddMember />;
      case "invites":
        return <Invites />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (res.ok) {
        toast.success("Logout successful!");
        getLoggedInUser();
        navigate("/login");
      }
    } catch (error) {
      console.log("An error occured while logging out!")
    }
  }

  return (
    <div className='dashboard'>
      <div className="menu-btn" onClick={() =>setActiveSidebar(prev => !prev)}>
        <FiMenu fontSize={24} fontWeight={600} title='Open menu'/>
      </div>
      <aside className={`sidebar ${activeSidebar ? "activeSB" : ""}`}>
        <div className="close-menu-btn" onClick={() =>setActiveSidebar(prev => !prev)}>
          <FiX fontSize={25} fontWeight={600} title='Close menu'/>
        </div>
        <div className="user-section">
          <div className="avat">{user.username[0]}</div>
          <span className="username">{user?.username}</span>
        </div>
        <ul className="sidebar-links">
          <div className="top-links">
            <li
              className={activeComp === "projects" ? "active" : ""}
              onClick={() => {
                setActiveComp("projects")
                setActiveSidebar(false)
              }}
            >
              <FaFolderOpen className="icon" /> Projects
            </li>
            <li
              className={activeComp === "tasks" ? "active" : ""}
              onClick={() =>{
                 setActiveComp("tasks")
                 setActiveSidebar(false)
              }}
            >
              <FaTasks className="icon" /> Tasks
            </li>
            <li
              className={activeComp === "add-member" ? "active" : ""}
              onClick={() => {
                setActiveComp("add-member")
                setActiveSidebar(false)
              }}
            >
              <FaUserPlus className="icon" /> Add Members
            </li>
            <li
              className={activeComp === "invites" ? "active" : ""}
              onClick={() => {
                setActiveComp("invites")
                setActiveSidebar(false)
              }}
            >
              <FaEnvelopeOpenText className="icon" /> Invites
            </li>
          </div>
          <div className="bottom-links">
            <div className='logout-btn' onClick={() =>{
              handleLogout()
              setActiveSidebar(false)
            }}>
              <FiLogOut />
              Logout
            </div>
          </div>
        </ul>
      </aside>

      <main className='main-container'>
        {renderComp()}
      </main>
    </div>
  );
};

export default Dashboard;
