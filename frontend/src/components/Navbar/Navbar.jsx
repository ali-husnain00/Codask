import React from 'react'
import "./Navbar.css"
import { Link, useLocation } from 'react-router-dom'


const Navbar = () => {
  const location = useLocation();
  const HideNav = location.pathname === "/dashboard";
  return (
    <div className={`navbar ${HideNav ? "hide" : ""}`}>
      <div className="logo">
        <img src="/Codask_logo.png" loading='lazy'/>
      </div>
      <ul className="navlinks">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </div>
  )
}

export default Navbar