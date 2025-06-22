import React, { useContext } from 'react'
import "./Navbar.css"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Context } from '../context/context'
import {toast} from "sonner"

const Navbar = () => {

  const {user, BASE_URL, getLoggedInUser} = useContext(Context);
  const navigate = useNavigate()

  const handleLogout = async() =>{
    try {
      const res = await fetch(`${BASE_URL}/logout`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include"
      })
      if(res.ok){
        toast.success("Logout successful!");
        getLoggedInUser();
        navigate("/login");
      }
    } catch (error) {
      toast.error("An error occured while logging out!")
    }
  }

  const location = useLocation();
  const HideNav = location.pathname === "/dashboard";
  return (
    <div className={`navbar ${HideNav ? "hide" : ""}`}>
      <div className="logo">
        <img src="/Codask_logo.png" loading='lazy'/>
      </div>
      <ul className="navlinks">
        <li><Link to="/dashboard">Dashboard</Link></li>
        {
          user ? (
            <li onClick={handleLogout} style={{cursor:"pointer"}}>Logout</li>
          ):(
            <li><Link to="/login">Login</Link></li>
          )
        }
      </ul>
    </div>
  )
}

export default Navbar