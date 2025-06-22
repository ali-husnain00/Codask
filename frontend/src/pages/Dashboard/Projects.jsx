import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom"
import './Projects.css';
import { FaPlus, FaEdit, FaTrashAlt, FaChevronDown } from 'react-icons/fa';
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

  const handleCreateProject = async (e, id) => {
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
        toast.success("Project created successfully!");
        getLoggedInUser();
        navigate(`/editor/${id}`)
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

  if (loading) {
    return <Loader />
  }

  return (
    <div className="projects">
      <div className="projects-header">
        <h2>My Projects</h2>
        <button className="create-btn" onClick={() => setShowModal(true)}><FaPlus /> Create New Project</button>
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
            <h3>0</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="card completed">
          <div>
            <h3>0</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="project-list">
        {
          user?.projects?.length > 0 ?
            (
              user.projects.map(project => (
                <div key={project._id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description.length > 70 ? project.description.slice(0, 70) + "..." : project.description}</p>
                  <div className="progress-bar">
                    <div className="fill" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <p className='progress-label'>{project.progress}% Complete</p>
                  <div className="actions">
                    <button className="btn edit" onClick={() => getProject(project._id)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="btn delete">
                      <FaTrashAlt /> Delete
                    </button>
                    <button className="btn details" onClick={() => getProject(project._id)}>
                      Details
                    </button>
                  </div>
                </div>
              ))
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

              <div className="custom-select">
                <div className="selected" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {languages.find(l => l.value === language)?.label || "Select Language"
                  } <FaChevronDown />
                </div>
                {dropdownOpen && (
                  <div className="dropdown">
                    <div className="dropdown">
                      {languages.map((lang, i) => (
                        <div
                          className="option"
                          key={i}
                          onClick={() => {
                            setLanguage(lang.value);
                            setDropdownOpen(false);
                          }}
                        >
                          {lang.label}
                        </div>
                      ))}
                    </div>

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
