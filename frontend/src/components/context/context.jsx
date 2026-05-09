import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiRequest } from "../../lib/apiClient";

export const Context = createContext(null)

const ContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [editorData, setEditorData] = useState(null)
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const getLoggedInUser = async () => {
        try {
            const data = await apiRequest(BASE_URL, "/getLoggedInUser");
            setUser(data.data || data);
        } catch {
            setUser(null)
        }
        finally {
            setLoading(false)
        }
    }

    const getProject = async (id) => {
        setLoading(true)
        try {
            const data = await apiRequest(BASE_URL, `/project/${id}`);
            setEditorData(data.data || data);
            navigate(`/editor/${id}`)
        } catch (error) {
            toast.error(error.message || "An error occured while opening project!")
        }
        finally {
            setLoading(false)
        }
    }

    const getAssignedProjects = async () => {
        try {
            const payload = await apiRequest(BASE_URL, "/getAssignedProjects");
            const data = payload.data || payload;

            const filteredProjects = data.filter((proj) => {
                return !user.projects.some((p) => p._id.toString() === proj._id.toString());
            });

            if (filteredProjects.length > 0) {
                setUser(prev => ({
                    ...prev,
                    projects: [...prev.projects, ...filteredProjects]
                }));
            }
        } catch (error) {
            console.error("Server error while fetching assigned projects:", error.message);
        }
    };

    useEffect(() => {
        getLoggedInUser();
    }, []);

    useEffect(() => {
        if (user) {
            getAssignedProjects();
        }
    }, [user]);

    const value = {
        BASE_URL,
        user,
        getLoggedInUser,
        loading,
        editorData,
        setEditorData,
        getProject,
        getAssignedProjects,
    }

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider