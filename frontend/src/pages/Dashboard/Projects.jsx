import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom"
import './Projects.css';
import { FaPlus, FaEdit, FaTrashAlt, FaChevronDown } from 'react-icons/fa';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { Context } from '../../components/context/context';
import { toast } from "sonner"
import Loader from '../../components/Loader/Loader';

const Projects = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSolo, setIsSolo] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("Js");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" }
  ];

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { BASE_URL, user, getLoggedInUser, getProject } = useContext(Context);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/createProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", 
        body: JSON.stringify({ title, description, language, isSolo })
      })
      if (res.ok) {
        const data = await res.json();
        toast.success("Project created successfully!");
        getLoggedInUser();
        navigate(`/editor/${data.projectId}`)
      }
      else {
        toast.error("An error occured while creating project");
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/deleteProject/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': "application/json"
        },
        credentials: "include"
      })
      if (res.ok) {
        getLoggedInUser();
        toast.success("Project deleted Successfully!");
      }
    } catch (error) {
      toast.error("Server error");
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  const completedProjects = user.projects.filter(proj => proj.progress === 100).length || 0;
  const inProgressProjects = user.projects.filter(proj => proj.progress > 0 && proj.progress < 100 ).length || 0;

  if (loading) {
    return <Loader />
  }

  return (
    <div className="projects">
      <div className="projects-header">
        <h2>My Projects</h2>
        <button className="create-btn" onClick={() => setShowModal(true)}><FaPlus /> New Project</button>
      </div>

      <div className="summary-cards">
        <div className="card total">
          <div>
            <h3>{user.projects.length}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="card pending">
          <div>
            <h3>{inProgressProjects}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="card completed">
          <div>
            <h3>{completedProjects}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="project-list">
        {
          user?.projects?.length > 0 ?
            (
              user.projects.map(project => {
                return (
                  <div key={project._id} className="project-card">
                    <h3>
                      {project.title}
                      <FiCopy fontSize={24}
                        className="copy-icon"
                        title="Copy Project ID"
                        onClick={() => {
                          navigator.clipboard.writeText(project._id);
                          toast.success("Project ID copied!");
                        }}
                      />
                    </h3>
                    <p>{project.description.length > 70 ? project.description.slice(0, 70) + "..." : project.description}</p>
                    <div className="progress-bar">
                      <div className="fill" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <p className='progress-label'>{project.progress}% Complete</p>
                    <div className="actions">
                      <button className="btn edit" onClick={() => getProject(project._id)}>
                        <FiExternalLink /> Open Project
                      </button>
                      <button className="btn delete" onClick={() => handleDeleteProject(project._id)}>
                        <FaTrashAlt /> Delete
                      </button>
                      <button className="btn details" onClick={() => navigate(`/projectDetail/${project._id}`)}>
                        Details
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className='no-proj-found'>No Projects found.</p>
            )
        }
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>New Project</h2>
              <MdClose className="close-icon" onClick={() => setShowModal(false)} />
            </div>
            <form className="modal-form" onSubmit={handleCreateProject}>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Title" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>

              <div className="custom-select" style={{ position: "relative" }}>
                <div
                  className="selected"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {languages.find(l => l.value === language)?.label || "Select Language"} <FaChevronDown />
                </div>

                {dropdownOpen && (
                  <div className="dropdown">
                    {languages.map((lang, i) => (
                      <div
                        key={i}
                        className="option"
                        onClick={() => {
                          setLanguage(lang.value);
                          setDropdownOpen(false);
                        }}
                        style={{ padding: "8px 12px", cursor: "pointer" }}
                      >
                        {lang.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <label className="checkbox">
                <input type="checkbox" value={isSolo} onChange={() => setIsSolo(!isSolo)} /> Work Solo
              </label>

              <button type="submit" className="submit-btn">Create Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
