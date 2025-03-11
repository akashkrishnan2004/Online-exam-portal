import React from "react";
import "./css/instructorDashboard.css";
import { Link, useNavigate } from "react-router-dom";

import exam from "./images/exam.png";
import instructor_dashboard from "./images/instructor_dashboard.png";

export default function InstructorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="instructorDashboard">
      <nav className="instructorDashboardNavbar">
        <div className="instructorDashboardNavbar-brand">
          {/* <span className="instructorDashboardSpan">Exam Portal</span> */}
          <span className="instructorDashboardSpan">Instructor Dashboard</span>
        </div>
        <ul className="instructorDashboardNav">
          <li>
            <Link to="/instructor-profile">Profile</Link>
          </li>
        </ul>
      </nav>

      <div className="instructorDashboardBody">
        <h1 className="instructorDashboardHead1">Create exams here....</h1>
        <div className="instructorDashboardBodyButtons">
          <Link to="/show-exams">
            <button className="instructorDashboardButton2">Show created exams</button>
          </Link>
          <Link to="/add-exam">
            <button className="instructorDashboardButton2">Create exam</button>
          </Link>
        </div>
        <div className="instructorDashboardImgDiv">
          <img src={instructor_dashboard} alt="instructorDashboardImg" />
        </div>
      </div>
      {/* <p>Here is an overview of your activities.</p> */}
    </div>
  );
}
