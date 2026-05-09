import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../components/context/context';
import { toast } from 'sonner';
import Loader from '../../components/Loader/Loader';
import { apiRequest } from '../../lib/apiClient';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Label } from '../../components/ui/label';

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

    const fetchProject = async () => {
        setLoading(true)
        try {
            const payload = await apiRequest(BASE_URL, `/project/${id}`);
            setProject(payload.data || payload);
        } catch (err) {
            toast.error(err.message || "An error occurred while fetching project");
        }
        finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const handleTaskAssign = async (e) => {
        e.preventDefault();
        if(!t.title || !t.description || !t.assignedTo || !t.dueDate || !t.priority){
            toast.warning("All fields are required!");
            return;
        }
        setLoading(true);
        try {
            const data = await apiRequest(BASE_URL, "/assignTask", {
                method: "POST",
                body: JSON.stringify({ ...t, projectId: id }),
            });
            toast.success(data.message || data.msg || "Task assigned");
            setShowModal(false);
            fetchProject();
        } catch (err) {
            toast.error(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!project || loading) return <Loader />

    return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8 text-[var(--text)]">
        <Card>
            <CardContent className="p-6 md:p-8">
                <div className='flex flex-wrap items-center gap-3 sm:gap-6'>
                    <h2 className="break-all">{project.title}</h2>
                    <Badge className="rounded-md px-3 py-1 text-sm font-bold">{project.language.toUpperCase()}</Badge>
                </div>
                <p className="mt-3 text-sm text-[var(--text-muted)]">{project.description}</p>
                <div className="mt-6 w-full max-w-[800px]">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Progress</label>
                        <span className="text-sm text-[var(--text-muted)]">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--surface-soft)] border border-[var(--border)] overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--text)] transition-all" style={{ width: `${project.progress}%` }}></div>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <span><strong>Lead:</strong> {project.lead?.username}</span>
                    <span><strong>Email:</strong> {project.lead?.email}</span>
                    <span><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</span>
                    <span><strong>Team:</strong> {project.members?.length} Members</span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12">
                <h3 className="mb-6">Team Members</h3>
                {
                    project.members.length === 0 ?
                        (
                            <p>No members found</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {project.members.map((member) => (
                                    <Card key={member.userId._id} className="flex flex-col justify-between h-full bg-[var(--surface-soft)]">
                                      <CardContent className="flex flex-col justify-between h-full gap-6 p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-lg font-bold text-[var(--text)]">{member.userId.username[0]}</div>
                                            <div>
                                                <h3>{member.userId.username}</h3>
                                                <p className="text-sm text-[var(--text-muted)]">{member.userId.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]">
                                            <Badge variant={member.role === 'Project lead' ? 'success' : 'outline'}>
                                                {member.role === 'Project lead' ? 'Project Lead' : 'Developer'}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setT({ ...t, assignedTo: member.userId._id });
                                                    setShowModal(true);
                                                }}
                                            >
                                                Assign Task
                                            </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )
                }
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Task</DialogTitle>
                  <DialogDescription>Assign a task to selected team member.</DialogDescription>
                </DialogHeader>
                <form className="grid gap-3" onSubmit={handleTaskAssign}>
                  <Input
                    type="text"
                    placeholder="Task Title"
                    value={t.title}
                    onChange={(e) => setT({ ...t, title: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Description"
                    value={t.description}
                    onChange={(e) => setT({ ...t, description: e.target.value })}
                    required
                  />
                  <Label>
                    Due Date:
                    <Input
                      className="mt-1"
                      type="date"
                      value={t.dueDate}
                      onChange={(e) => setT({ ...t, dueDate: e.target.value })}
                    />
                  </Label>
                  <Label>
                    Priority:
                    <Select
                      className="mt-1"
                      value={t.priority}
                      onChange={(e) => setT({ ...t, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </Label>
                  <Button type="submit">Assign Task</Button>
                </form>
              </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProjectDetails;