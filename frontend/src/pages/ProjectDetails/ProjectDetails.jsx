import React, { useState, useEffect, useContext } from 'react';
import './ProjectDetails.css';
import { useParams } from 'react-router-dom';
import { Context } from '../../components/context/context';
import { toast } from 'sonner';
import { MdClose } from 'react-icons/md';
import Loader from '../../components/Loader/Loader';

const ProjectDetails = () => {
    const { id } = useParams();
    const { BASE_URL } = useContext(Context);
    const [project, setProject] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [t, setT] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium'
    });

    const pendingTasksCount = {};

    const fetchProject = async () => {
        try {
            const res = await fetch(`${BASE_URL}/project/${id}`, {
                method: "GET",
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setProject(data);
            } else {
                toast.error("Failed to load project details");
            }
        } catch (err) {
            toast.error("An error occurred while fetching project");
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const handleTaskAssign = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/assignTask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ...t, projectId: id }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.msg);
                setShowModal(false);
                fetchProject();
            } else if (res.status === 403 || res.status === 400) {
                toast.warning(data.msg);
            } else {
                toast.error(data.msg || "Failed to assign task");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!project) return <Loader />

    return (
        <div className="project-details-page">
            <div className="project-header">
                <div className='proj-title'>
                    <h2>{project.title}</h2>
                    <span className="language-tag">{project.language.toUpperCase()}</span>
                </div>
                <p className="description">{project.description}</p>
                <div className="progress-wrapper">
                    <label>Progress</label>
                    <div className="progress-bar">
                        <div className="fill" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <span>{project.progress}%</span>
                </div>
                <div className="project-meta">
                    <span><strong>Lead:</strong> {project.lead?.username}</span>
                    <span><strong>Email:</strong> {project.lead?.email}</span>
                    <span><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</span>
                    <span><strong>Team:</strong> {project.members?.length} Members</span>
                </div>
            </div>

            <div className="team-section">
                <h3>Team Members</h3>
                {
                    project.members.length === 0 ?
                        (
                            <p>No members found</p>
                        ) : (
                            <div className="member-grid">
                                {project.members.map((member) => (
                                    <div key={member.userId._id} className="member-card">
                                        <div className="card-header">
                                            <div className="avatar">{member.userId.username[0]}</div>
                                            <div className="user-info">
                                                <h3 className="username">{member.userId.username}</h3>
                                                <p className="email">{member.userId.email}</p>
                                                <span className="pending-count">
                                                    Pending Tasks: {pendingTasksCount[member.userId._id] || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <span className={`role-badge ${member.role === 'Project lead' ? 'lead' : 'developer'}`}>
                                                {member.role === 'Project lead' ? 'Project Lead' : 'Developer'}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setT({ ...t, assignedTo: member.userId._id });
                                                    setShowModal(true);
                                                }}
                                                className="assign-btn"
                                            >
                                                Assign Task
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                }
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Assign Task</h3>
                            <MdClose className="close-icon" onClick={() => setShowModal(false)} />
                        </div>
                        <form className="modal-form" onSubmit={handleTaskAssign}>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={t.title}
                                onChange={(e) => setT({ ...t, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={t.description}
                                onChange={(e) => setT({ ...t, description: e.target.value })}
                                required
                            />
                            <label>
                                Due Date:
                                <input
                                    type="date"
                                    value={t.dueDate}
                                    onChange={(e) => setT({ ...t, dueDate: e.target.value })}
                                />
                            </label>
                            <label>
                                Priority:
                                <select
                                    value={t.priority}
                                    onChange={(e) => setT({ ...t, priority: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </label>
                            <button type="submit">Assign Task</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;