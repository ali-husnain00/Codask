import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Context } from '../../components/context/context';
import { toast } from "sonner"
import Loader from '../../components/Loader/Loader';
import { apiRequest } from '../../lib/apiClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Card, CardContent } from '../../components/ui/card';
import { PageHeader } from '../../components/ui/page-header';

const Projects = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSolo, setIsSolo] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("javascript");
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
    if(!title || !description || !language ){
      toast.warning("All fields are required!");
      return;
    }
    setLoading(true)
    try {
      const data = await apiRequest(BASE_URL, "/createProject", {
        method: "POST",
        body: JSON.stringify({ title, description, language, isSolo })
      });
      toast.success("Project created successfully!");
      getLoggedInUser();
      navigate(`/editor/${data.data?.projectId || data.projectId}`)
    } catch (error) {
      toast.error(error.message || "An error occured while creating project");
    }
    finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id) => {
    setLoading(true);
    try {
      await apiRequest(BASE_URL, `/deleteProject/${id}`, {
        method: "DELETE",
      });
      getLoggedInUser();
      toast.success("Project deleted Successfully!");
    } catch (error) {
      toast.error(error.message || "Server error");
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
    <div className="flex flex-col gap-8">
      <PageHeader title="My Projects" className="mb-0">
        <Button className="inline-flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={16} /> New Project</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-[var(--surface-soft)] border-[var(--border)]">
          <CardContent className="p-6 text-center">
            <h1 className="tracking-tight mb-1">{user.projects.length}</h1>
            <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">Total Projects</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--surface-soft)] border-[var(--border)]">
          <CardContent className="p-6 text-center">
            <h1 className="tracking-tight mb-1">{inProgressProjects}</h1>
            <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--surface-soft)] border-[var(--border)]">
          <CardContent className="p-6 text-center">
            <h1 className="tracking-tight mb-1">{completedProjects}</h1>
            <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">Completed</p>
          </CardContent>
        </Card>
      </div>

      {user?.projects?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.projects.map(project => (
            <Card key={project._id} className="flex flex-col justify-between h-full bg-[var(--surface-soft)] overflow-hidden">
              <CardContent className="flex flex-col h-full gap-4 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="truncate pr-2">
                    {project.title}
                  </h3>
                  <Copy size={18}
                    className="cursor-pointer text-[var(--text-muted)] transition hover:text-[var(--text)] flex-shrink-0"
                    title="Copy Project ID"
                    onClick={() => {
                      navigator.clipboard.writeText(project._id);
                      toast.success("Project ID copied!");
                    }}
                  />
                </div>
                <p className="text-[var(--text-muted)] flex-1">{project.description.length > 80 ? project.description.slice(0, 80) + "..." : project.description}</p>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Progress</span>
                    <span className="text-xs font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface)] border border-[var(--border)]">
                    <div className="h-full bg-[var(--text)] transition-all" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
                <Button variant="outline" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm" onClick={() => getProject(project._id)}>
                  <ExternalLink size={14} /> Open Project
                </Button>
                <Button variant="danger" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm" onClick={() => handleDeleteProject(project._id)}>
                  <Trash2 size={14} /> Delete
                </Button>
                <Button variant="outline" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm" onClick={() => navigate(`/projectDetail/${project._id}`)}>
                  Details
                </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className='text-[var(--text-muted)]'>No Projects found.</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowModal(true)}>Create Your First Project</Button>
              </div>
            )
        }
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>Create a new project workspace.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleCreateProject}>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Title" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </Select>
            <Label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Checkbox checked={isSolo} onChange={() => setIsSolo(!isSolo)} /> Work Solo
            </Label>
            <Button type="submit" className="w-full">Create Project</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
