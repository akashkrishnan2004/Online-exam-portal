import React, { useState } from "react";
import { Link } from "react-router-dom";
import examImg from "./images/exam-image.png";

import "./css/dashboard.css";

function Dashboard() {
  const dashboardHead1 = "Welcome to \n Online Exam Portal";

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="dashboardNavbar">
        <div className="navbar-brand">
          {/* <img src={logo4} alt="Logo" className="dashboardLogo" /> */}
          <span className="navbar-brand-span">OnlineTestify</span>
        </div>
        {/* Menu Button */}
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
        {/* Links */}
        <ul className={`navbar-links ${menuOpen ? "menu-open" : ""}`}>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/register">Signup</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>

      {/* Body */}
      <div className="dashBoardBody">
        <h1 className="dashboardHead1">{dashboardHead1}</h1>
        <img src={examImg} alt="Exam Image" className="examImg" />
      </div>
    </div>
  );
}

export default Dashboard;
