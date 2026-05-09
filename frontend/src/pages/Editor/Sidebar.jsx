import React, { useContext, useState } from 'react';
import { FileText, User, Plus, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { apiRequest } from '../../lib/apiClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Context } from '@/components/context/context';
import { toast } from 'sonner';

const Sidebar = ({ files, members, onFileSelect, onNewFile, projectId, fetchProject, activeUsers, typingUser, editorMenu, setEditorMenu }) => {
  const [showModal, setShowModal] = useState(false);
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { BASE_URL } = useContext(Context);

  const handleCreateFile = async (e) => {
    e.preventDefault();
    if (!filename.trim() || !language) {
      toast.warning("All fields are required!");
      return;
    }

    try {
      const data = await apiRequest(BASE_URL, `/createNewFile/${projectId}`, {
        method: "POST",
        body: JSON.stringify({ filename, language })
      });
      onNewFile(data.data || data);
      fetchProject();
      toast.success("File created successfully!");
    } catch (error) {
      toast.error(error.message || "An error occured while creating new file!");
    }

    setFilename('');
    setLanguage("javascript");
    setShowModal(false);
  };

  return (
    <div className={`${editorMenu ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-[64px] z-[150] flex flex-col h-[calc(100dvh-64px)] w-[280px] overflow-x-hidden border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 ease-in-out lg:static lg:h-full lg:translate-x-0 ${isCollapsed ? "lg:w-[70px]" : "lg:w-[280px]"}`}>
      
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
        {!isCollapsed && <span className="text-sm font-semibold tracking-wide text-[var(--text-muted)] uppercase">Explorer</span>}
        <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-8 w-8 p-0 lg:hidden text-[var(--text-muted)] hover:text-[var(--text)]" onClick={() => setEditorMenu(false)}>
              <X size={18} />
            </Button>
            <Button variant="ghost" className="hidden lg:flex h-8 w-8 p-0 text-[var(--text-muted)] hover:text-[var(--text)]" onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <div>
          {!isCollapsed && <h4 className="text-xs font-semibold tracking-wide text-[var(--text-muted)] uppercase mb-2 px-2">Team</h4>}
          <ul className="space-y-1">
            {members?.map((member) => {
              const isActive = activeUsers?.some(u => u.id === member.userId._id);
              const isTyping = typingUser && typingUser._id === member.userId._id;

              return (
                <li key={member.userId._id} className={`flex items-center rounded-md text-sm text-[var(--text)] transition-colors ${isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"}`} title={member.userId.username}>
                  <div className="relative flex items-center justify-center">
                    <User size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                    {isActive && <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-[var(--success)] border border-[var(--surface)]"></div>}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="truncate">{member.userId.username}</span>
                      {isTyping && <span className="text-xs text-[var(--text-muted)] ml-auto">typing...</span>}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className={`flex items-center mb-2 px-2 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && <h4 className="text-xs font-semibold tracking-wide text-[var(--text-muted)] uppercase">Files</h4>}
            <Button variant="ghost" className="h-6 w-6 p-0 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]" onClick={() => setShowModal(true)} title="New File">
              <Plus size={16} />
            </Button>
          </div>
          <ul className="space-y-1">
            {files?.map((file, idx) => (
              <li className={`flex cursor-pointer items-center rounded-md text-sm text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)] ${isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"}`} key={idx} onClick={() => onFileSelect(file)} title={file.name || file.filename}>
                <FileText size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{file.name || file.filename}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create File</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleCreateFile}>
            <Input
              type="text"
              placeholder="Filename (e.g. main.js)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </Select>
            <Button className="w-full" type="submit">Create</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
