import React, { useContext, useState } from 'react';
import { Context } from '../../components/context/context';
import { Folder, CheckSquare, UserPlus, Mail, Menu, X, LogOut } from "lucide-react";
import { toast } from 'sonner';
import { apiRequest } from '../../lib/apiClient';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import Projects from './Projects';
import Tasks from './Tasks';
import AddMember from './AddMember';
import Invites from './Invites';


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
      await apiRequest(BASE_URL, "/logout", { method: "POST" });
      await getLoggedInUser();
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "An error occured while logging out!");
    }
  }

  return (
    <div className='flex h-[calc(100dvh-64px)] bg-[var(--background)] text-[var(--text)]'>
      <div className="absolute left-4 top-20 z-[999] flex cursor-pointer rounded-md bg-[var(--surface-soft)] border border-[var(--border)] p-2 lg:hidden" onClick={() =>setActiveSidebar(prev => !prev)}>
        <Menu size={20} className="text-[var(--text)]" title='Open menu'/>
      </div>
      <aside className={`${activeSidebar ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-[64px] z-[1000] flex h-[calc(100dvh-64px)] w-[min(82vw,280px)] flex-col gap-6 border-r border-[var(--border)] bg-[var(--surface)] p-6 transition-transform lg:static lg:w-[280px] lg:translate-x-0`}>
        <div className="relative -right-2 -top-2 flex cursor-pointer justify-end text-[var(--text-muted)] hover:text-[var(--text)] lg:hidden" onClick={() =>setActiveSidebar(prev => !prev)}>
          <X size={24} title='Close menu'/>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-soft)] border border-[var(--border)] text-3xl font-bold text-[var(--text)]">{user.username[0]}</div>
          <span className="font-medium">{user?.username}</span>
        </div>
        <ul className="flex h-full flex-col justify-between mt-4">
          <div className="space-y-1">
            <li
              className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${activeComp === "projects" ? "bg-[var(--surface-soft)] text-[var(--text)] font-medium" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"}`}
              onClick={() => {
                setActiveComp("projects")
                setActiveSidebar(false)
              }}
            >
              <Folder size={18} /> Projects
            </li>
            <li
              className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${activeComp === "tasks" ? "bg-[var(--surface-soft)] text-[var(--text)] font-medium" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"}`}
              onClick={() =>{
                 setActiveComp("tasks")
                 setActiveSidebar(false)
              }}
            >
              <CheckSquare size={18} /> Tasks
            </li>
            <li
              className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${activeComp === "add-member" ? "bg-[var(--surface-soft)] text-[var(--text)] font-medium" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"}`}
              onClick={() => {
                setActiveComp("add-member")
                setActiveSidebar(false)
              }}
            >
              <UserPlus size={18} /> Add Members
            </li>
            <li
              className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${activeComp === "invites" ? "bg-[var(--surface-soft)] text-[var(--text)] font-medium" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"}`}
              onClick={() => {
                setActiveComp("invites")
                setActiveSidebar(false)
              }}
            >
              <Mail size={18} /> Invites
            </li>
          </div>
          <div>
            <Button variant="ghost" className='my-1 w-full justify-start px-3 py-2 text-[var(--text)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10' onClick={() =>{
              handleLogout()
              setActiveSidebar(false)
            }}>
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </ul>
      </aside>

      <main className='flex-1 overflow-y-auto p-6 pt-16 lg:p-8'>
        <div className="mx-auto w-full max-w-[1200px]">
          {renderComp()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
