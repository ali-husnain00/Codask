import { createContext, useEffect, useState } from "react";

export const Context = createContext(null)

const ContextProvider = ({children}) =>{

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_API_URL;

    const getLoggedInUser = async () =>{
        try {
            const res = await fetch(`${BASE_URL}/getLoggedInUser`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include"
            })
            if(res.ok){
                const data = await res.json();
                setUser(data)
            }
            else{
                setUser(null)
            }
        } catch (error) {
            console.log("An error occured while getting loggedIn user" + error)
            setUser(null)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() =>{
        getLoggedInUser()
    },[])

    const value = {
        BASE_URL,
        user,
        getLoggedInUser,
        loading,
    }

    return(
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider