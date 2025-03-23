import { useNavigate, Link } from "react-router-dom";

import "./css/studentDashboard.css";

import student_dashboard from "./images/student_dashboard.png";
import { useEffect, useState } from "react";
import axios from "axios";

// import API_URL from "./api";

export default function StudentDashboard() {

  const navigate = useNavigate();

  const goToAccountDetails = () => {
    navigate("/profile");
  };

  return (
    <div className="studentDashboardBody">
      <div className="studentDashboardNav">
        <span className="studentDashboardSpan">Student Dashboard</span>
        <ul className="studentDashboardUl">
          <li>
            <Link to="/student-profile">Profile</Link>
          </li>
        </ul>
      </div>

      <div className="studentDashboardButtonBody">
        <h1 className="studentDashboardHead1">Attend exams here....</h1>
        <Link to="/exams">
          <button className="studentDashboardButton">Go to exam</button>
        </Link>
        <div className="studentDashboardImgDiv">
          <img src={student_dashboard} alt="studentDashboardImg" />
        </div>
      </div>
    </div>
  );
}
