import { useEffect, useState } from "react";
import { profile } from "./utils/helpers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaUserTie } from "react-icons/fa";
import axios from "axios";

import API_URL from "./api";

import "./css/studentProfile.css";

export default function StudentProfile() {
  const [marks, setMarks] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  useEffect(() => {
    profile()
      .then((userData) => {
        setUser(userData);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.msg || "Failed to fetch user profile.");
        setLoading(false);
      });

    const fetchMarks = async () => {
      try {
        const studentId = localStorage.getItem("User_ID");
        if (!studentId) {
          toast.error("Student ID not found. Please log in again.");
          return;
        }

        const response = await axios.get(`${API_URL}/exams/${studentId}`);
        setMarks(response.data);
      } catch (error) {
        console.error("Error fetching marks:", error);
      }
    };

    fetchMarks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <div className="studentProfileMain">
      <div className="studentProfileMainNav">
        <span className="studentProfileSpan">My Profile</span>
        <div className="studentProfileMainNavLeft">
          <button onClick={logout} className="studentProfileMainButton">
            Logout
          </button>
          <img
            src={user.image || "default-avatar.png"}
            alt="Profile"
            className="studentProfileImg"
          />
        </div>
      </div>

      <div className="profileItem">
        <FaUser className="icon" />
        <span className="profileLabel">Username:</span>
        <span className="profileData">{user.username}</span>
      </div>

      <div className="profileItem">
        <FaEnvelope className="icon" />
        <span className="profileLabel">Email:</span>
        <span className="profileData">{user.email}</span>
      </div>

      <div className="profileItem">
        <FaUserTie className="icon" />
        <span className="profileLabel">Role:</span>
        <span className="profileData">{user.role}</span>
      </div>

      {/* <div className="profileItem">
        <FaUserTie className="icon" />
        <span className="profileLabel">ID:</span>
        <span className="profileData">{user._id}</span>
      </div> */}

      <div className="examResults">
        <h3>Exam Results</h3>
        {marks && marks.exams && marks.exams.length > 0 ? (
          <>
            <table className="examTable">
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Marks Obtained</th>
                </tr>
              </thead>
              <tbody>
                {marks.exams.map((exam, index) => (
                  <tr key={index}>
                    <td>{exam.examName}</td>
                    <td>{exam.marks} mark</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="totalMarks">Total Mark: {marks.totalMarks}</p>
          </>
        ) : (
          <p>No exams attended yet.</p>
        )}
      </div>
    </div>
  );
}
