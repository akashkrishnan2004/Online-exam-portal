// examTitles
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import API_URL from "./api";

import "./css/examTitles.css"

const ExamTitles = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamTitles = async () => {
      try {
        const response = await axios.get(`${API_URL}/exam/titles`);
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exam titles:", error);
      }
    };

    fetchExamTitles();
  }, []);

  const handleExamClick = (examId) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="examTitlesBody">
      <h2 className="examTitlesBodyHead2">Exam Titles</h2>
      { exams.length === 0 ? (
        <p>No exams available</p>
      ) : (
        exams.map((exam) => (
          <div
            key={exam._id}
            className="exam-title"
            onClick={() => handleExamClick(exam._id)}
          >
            {exam.examTitle}
          </div>
        ))
      )}
    </div>
  );
};

export default ExamTitles;
