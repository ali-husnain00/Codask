import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import { useContext } from 'react'
import { Context } from '../../components/context/context'
import { toast } from 'sonner'
import Loader from '../../components/Loader/Loader'
import { apiRequest } from '../../lib/apiClient'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import { PageHeader } from '../../components/ui/page-header'

const Tasks = () => {
  const [tasks, setTasks] = useState(null)
  const [filter, setFilter] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { BASE_URL, getLoggedInUser } = useContext(Context);

  const filters = ['Pending', 'In Progress', 'Completed'];

  const filteredTasks = tasks ? tasks.filter(task => task.status === filter) : [];

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true)
    try {
      const data = await apiRequest(BASE_URL, `/updateTaskStatus/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
      fetchTasks();
      getLoggedInUser();
      toast.success(data.message || data.msg || "Task status updated");
    } catch (err) {
      toast.error(err.message || "Failed to update status");
      console.error("Error updating status:", err);
    }
    finally {
      setLoading(false)
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await apiRequest(BASE_URL, "/getUserTasks");
      setTasks(data.data || data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if(loading) return <Loader/>

  return (
    <div className="space-y-6">
      <PageHeader title="Assigned Tasks" className="mb-4" />

      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <Button
            key={f}
            variant={filter === f ? "default" : "ghost"}
            className="px-3 py-2 text-sm"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 mt-6">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[var(--border)] rounded-lg bg-[var(--surface-soft)]">
            <p className="text-[var(--text-muted)]">No {filter.toLowerCase()} tasks</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <Card key={task._id} className="bg-[var(--surface-soft)] hover:border-[var(--text-muted)] transition-colors">
              <CardContent className="p-6">
              <div className="flex flex-col justify-between gap-6 lg:flex-row">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <h3 className="tracking-tight">{task.title}</h3>
                    <Badge variant={task.status === "Completed" ? "success" : "secondary"}>
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{task.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] pt-2">
                    <span className="flex items-center gap-1.5"><strong className="text-[var(--text)] font-medium">Project:</strong> {task.projectId.title}</span>
                    <span className="flex items-center gap-1.5"><strong className="text-[var(--text)] font-medium">Assigned by:</strong> {task.projectId.lead.username}</span>
                    <span className="flex items-center gap-1.5"><strong className="text-[var(--text)] font-medium">Priority:</strong> <span className="capitalize">{task.priority}</span></span>
                    <span className="flex items-center gap-1.5"><strong className="text-[var(--text)] font-medium">Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[140px] pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--border)]">
                  <Button variant="outline" className="w-full text-xs h-9" onClick={() => navigate(`/editor/${task.projectId._id}`)}>
                    Open Project
                  </Button>
                  {task.status !== 'In Progress' && (
                    <Button variant="outline" className="w-full text-xs h-9 border-[var(--border)]" onClick={() => handleStatusChange(task._id, 'In Progress')}>
                      In Progress
                    </Button>
                  )}
                  {task.status !== 'Completed' && (
                    <Button variant="outline" className="w-full text-xs h-9 border-[var(--border)] text-[var(--success)] hover:text-[var(--success)]" onClick={() => handleStatusChange(task._id, 'Completed')}>
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
              </CardContent>
            </Card>

          ))
        )}
      </div>
    </div>
  );
}

export default Tasks