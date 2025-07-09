import React, { useContext } from 'react'
import "./Navbar.css"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Context } from '../context/context'
import { toast } from "sonner"
import useDeviceType from '../../hooks/useDeviceType.js'

const Navbar = () => {

  const { user, BASE_URL, getLoggedInUser } = useContext(Context);
  const { isMobile } = useDeviceType();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (res.ok) {
        toast.success("Logout successful!");
        getLoggedInUser();
        navigate("/login");
      }
    } catch (error) {
      toast.error("An error occured while logging out!")
    }
  }

  const handleChange = (e) => {
    const value = e.target.value;

    if (value === "logout") {
      handleLogout();
    } else {
      navigate(value);
    }
  };

  const location = useLocation();
  const HideNav = location.pathname === "/dashboard";
  return (
    <div className={`navbar ${HideNav ? "hide" : ""}`}>
      <div className="logo">
        <img src="/Codask_logo.png" loading='lazy' />
      </div>
      <ul className="navlinks">
        {isMobile ? (
          <li>
            <select className="nav-select" onChange={handleChange} defaultValue="" value={location.pathname === "/dashboard" ? "/dashboard" : ""}>
              <option value="" disabled>{`👋 ${user?.username || "Guest"}`}</option>
              <option value="/dashboard">Dashboard</option>
              {user ? (
                <option value="logout">Logout</option>
              ) : (
                <option value="/login">Login</option>
              )}
            </select>
          </li>
        ) : (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            {user ? (
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</li>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </>
        )}
      </ul>

    </div>
  )
}

export default Navbar