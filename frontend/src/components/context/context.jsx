import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Context = createContext(null)

const ContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [editorData, setEditorData] = useState(null)
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const getLoggedInUser = async () => {
        try {
            const res = await fetch(`${BASE_URL}/getLoggedInUser`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            if (res.ok) {
                const data = await res.json();
                setUser(data)
            }
            else {
                setUser(null)
            }
        } catch (error) {
            console.log("An error occured while getting loggedIn user" + error)
            setUser(null)
        }
        finally {
            setLoading(false)
        }
    }

    const getProject = async (id) => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/project/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            if (res.ok) {
                const data = await res.json();
                setEditorData(data);
                navigate(`/editor/${id}`)
            }
        } catch (error) {
            toast.error("An error occured while opening project!")
        }
        finally {
            setLoading(false)
        }
    }

    const getAssignedProjects = async () => {
        try {
            const res = await fetch(`${BASE_URL}/getAssignedProjects`, {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();

                const filteredProjects = data.filter((proj) => {
                    return !user.projects.some((p) => p._id.toString() === proj._id.toString());
                });

                if (filteredProjects.length > 0) {
                    setUser(prev => ({
                        ...prev,
                        projects: [...prev.projects, ...filteredProjects]
                    }));
                }
            }
        } catch (error) {
            console.error("Server error while fetching assigned projects:", error);
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