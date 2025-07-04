import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import "./Tasks.css"
import { useEffect } from 'react'
import { useContext } from 'react'
import { Context } from '../../components/context/context'
import { toast } from 'sonner'

const Tasks = () => {
  const [tasks, setTasks] = useState(null)
  const [filter, setFilter] = useState('Pending');
  const navigate = useNavigate();
  const {BASE_URL} = useContext(Context);

  const filters = ['Pending', 'In Progress', 'Completed'];

  const filteredTasks = tasks ? tasks.filter(task => task.status === filter) : [];

const handleStatusChange = async (id, newStatus) => {
  try {
    const res = await fetch(`${BASE_URL}/updateTaskStatus/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ status: newStatus })
    });

    const data = await res.json();

    if (res.ok) {
      fetchTasks();
      toast.success(data.msg)
    } 
  } catch (err) {
    toast.error(data.msg)
    console.error("Error updating status:", err);
  }
};

 const fetchTasks = async () => {
    const res = await fetch(`${BASE_URL}/getUserTasks`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setTasks(data); 
    }
  };

  useEffect(() => {
  fetchTasks();
}, []);

  return (
    <div className="user-tasks-container">
      <h2 className="section-title">Assigned Tasks</h2>

      <div className="filter-bar">
        {filters.map(f => (
          <div
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </div>
        ))}
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No {filter.toLowerCase()} tasks</p>
        ) : (
          filteredTasks.map(task => (
            <div className="task-card" key={task._id}>
              <div className="task-main">
                <div className="task-left">
                  <h3 className="task-title">{task.title}</h3>
                  <p className="project-line">
                    <span>Project:</span> {task.projectId.title}
                  </p>
                  <p className="project-line">
                    <span>Assigned by:</span> {task.projectId.lead.username}
                  </p>
                  <p className="task-desc">{task.description}</p>
                  <div className="task-meta">
                    <span><strong>Priority:</strong> {task.priority}</span>
                    <div className="task-actions">
                      {task.status !== 'In Progress' && (
                        <button className="btn-accent" onClick={() => handleStatusChange(task._id, 'In Progress')}>
                          In Progress
                        </button>
                      )}
                      {task.status !== 'Completed' && (
                        <button className="btn-success" onClick={() => handleStatusChange(task._id, 'Completed')}>
                          Completed
                        </button>
                      )}
                      <button className="btn-muted" onClick={() => navigate(`/editor/${task.projectId._id}`)}>
                        Open Project
                      </button>
                    </div>
                  </div>
                </div>

                <div className="task-right">
                  <span className={`status-badge ${task.status.replace(/\s/g, '').toLowerCase()}`}>
                    {task.status}
                  </span>
                  <span><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

          ))
        )}
      </div>
    </div>
  );
}

export default Tasks