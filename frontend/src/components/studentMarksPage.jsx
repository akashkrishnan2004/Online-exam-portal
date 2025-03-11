import { useEffect, useState } from "react";
import { profile } from "./utils/helpers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaBook, FaPen, FaRegCheckCircle } from "react-icons/fa";
import "./css/studentMarksPage.css";

export default function StudentMarksPage() {
  const [user, setUser] = useState(null);
  const [examData, setExamData] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
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

        fetch(`/api/exams/${userData.studentId}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("Fetched Exam Data:", data);

            if (data.exams) {
              setExamData(data.exams);
              setTotalMarks(data.totalMarks);
            } else {
              toast.error("No exams data found.");
            }
            setLoading(false);
          })
          .catch((err) => {
            toast.error("Failed to fetch exam data.");
            // console.error("Error:", err);
            setLoading(false);
          });
      })
      .catch((err) => {
        toast.error("Failed to fetch user profile.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>No user data available.</p>;

  return (
    <div className="studentMarksPage">
      <div className="studentMarksPageNav">
        <span className="studentMarksPageTitle">Your Exam Marks</span>
        <div className="studentMarksPageNavLeft">
          {/* <button onClick={logout} className="studentMarksPageButton">
            Logout
          </button> */}
        </div>
      </div>

      <div className="examDetails">
        <h3>Exams and Marks</h3>
        <table className="examTable">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {examData.length > 0 ? (
              examData.map((exam, index) => (
                <tr key={index}>
                  <td>
                    <FaBook className="examIcon" /> {exam.examName}
                  </td>
                  <td>
                    <FaPen className="marksIcon" /> {exam.marks}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No exams found</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalMarks !== undefined && (
          <div className="totalMarks">
            <FaRegCheckCircle className="totalMarksIcon" />
            <strong>Total Marks: </strong> {totalMarks}
          </div>
        )}
      </div>
    </div>
  );
}
