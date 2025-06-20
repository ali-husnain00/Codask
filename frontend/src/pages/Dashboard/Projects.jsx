import React, { useContext, useState } from 'react';
import {useNavigate} from "react-router-dom"
import './Projects.css';
import { FaPlus, FaEdit, FaTrashAlt, FaChevronDown } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { Context } from '../../components/context/context';
import {toast} from "sonner"
import Loader from '../../components/Loader/Loader';

const dummyProjects = [
  {
    id: 1,
    title: "Codask V1",
    language: "JavaScript",
    role: "Project Lead",
    status: "in-progress",
    progress: 60,
    description: "A collaborative code editor with real-time editing, chat, and project progress tracking features."
  },
  {
    id: 2,
    title: "Blog CMS",
    language: "Python",
    role: "Frontend Dev",
    status: "completed",
    progress: 100,
    description: "A content management system for blogs allowing users to publish, edit, and manage blog posts with ease."
  },
  {
    id: 3,
    title: "E-Store API",
    language: "Node.js",
    role: "Backend Dev",
    status: "pending",
    progress: 0,
    description: "RESTful API for an e-commerce platform including authentication, product, cart, and order management."
  }
];


const Projects = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSolo, setIsSolo] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("Js");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const languages = ["Js", "Py", "Java", "Cpp"];
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const {BASE_URL} = useContext(Context);

  const total = dummyProjects.length;
  const completed = dummyProjects.filter(p => p.status === "completed").length;
  const pending = dummyProjects.filter(p => p.status === "pending").length;

  const handleCreateProject = async (e) =>{
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/createProject`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({title, description, language, isSolo})
      })
      if(res.ok){
        toast.success("Project created successfully!");
        navigate("/editor/roomId")
      }
      else{
        toast.error("An error occured while creating project");
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  if(loading){
    return <Loader/>
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
            <h3>{total}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="card pending">
          <div>
            <h3>{pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="card completed">
          <div>
            <h3>{completed}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="project-list">
        {dummyProjects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description.length > 70 ? project.description.slice(0,70) + "..." : project.description}</p>
            <div className="progress-bar">
              <div className="fill" style={{ width: `${project.progress}%` }}></div>
            </div>
            <p className='progress-label'>{project.progress}% Complete</p>
            <div className="actions">
              <button className="btn edit">
                <FaEdit /> Edit
              </button>
              <button className="btn delete">
                <FaTrashAlt /> Delete
              </button>
              <button className="btn details" onClick={() => navigate(`/project/${project.id}`)}>
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>New Project</h2>
              <MdClose className="close-icon" onClick={() => setShowModal(false)} />
            </div>
            <form className="modal-form" onSubmit={handleCreateProject}>
              <input type="text" value={title} onChange={(e) =>setTitle(e.target.value)} placeholder="Project Title" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>

              <div className="custom-select">
                <div className="selected" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {language} <FaChevronDown />
                </div>
                {dropdownOpen && (
                  <div className="dropdown">
                    {languages.map((lang, i) => (
                      <div
                        className="option"
                        key={i}
                        onClick={() => {
                          setLanguage(lang);
                          setDropdownOpen(false);
                        }}
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="checkbox">
                <input type="checkbox" value={isSolo} onChange={() =>setIsSolo(!isSolo)} /> Work Solo
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
