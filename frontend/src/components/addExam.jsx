import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./css/addExam.css";
import * as reactRouterDom from "react-router-dom";

import API_URL from "./api";

const AddExam = () => {
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);
  const [examTitle, setExamTitle] = useState("");
  const [examPassword, setExamPassword] = useState("");
  const [instructorDetails, setInstructorDetails] = useState(null);
  const navigate = reactRouterDom.useNavigate();

  useEffect(() => {
    const storedInstructor = localStorage.getItem("User");
    if (storedInstructor) {
      setInstructorDetails(JSON.parse(storedInstructor));
    } else {
      toast.error("Instructor details not found. Please log in again.");
      navigate("/instructor-dashboard");
    }
  }, [navigate]);

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index][field] = value;
      return updatedQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examTitle.trim()) {
      return toast.error("Please provide an exam title.");
    }

    const passwordRegex = /^\d{10}$/;
    if (!passwordRegex.test(examPassword)) {
      return toast.error(
        "Exam password must be exactly 10 numeric digits (no letters or symbols)."
      );
    }

    try {
      const response = await axios.post(`${API_URL}/exam`, {
        examTitle,
        examPassword,
        questions,
        instructorId: instructorDetails?.id,
        instructorName: instructorDetails?.name,
      });

      toast.success("Exam created successfully!");
      navigate("/instructor-dashboard");
      console.log("Response from server:", response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create exam."
      );
      console.error("Error creating exam:", error);
    }
  };

  return (
    <div className="addExamContainer">
      <h2>Create Exam</h2>
      <form onSubmit={handleSubmit} className="addExamForm">
        <div className="addExamFormDiv">
          <label className="addExamFormLabel">Exam Title</label>
          <input
            type="text"
            placeholder="Enter exam title"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="addExamFormInput"
          />
        </div>
        <div className="addExamFormDiv">
          <label className="addExamFormLabel">Exam Password</label>
          <input
            type="text"
            placeholder="Enter 10-digit numeric password"
            value={examPassword}
            onChange={(e) => setExamPassword(e.target.value)}
            className="addExamFormInput"
          />
        </div>

        {questions.map((q, index) => (
          <div key={index} className="questionContainer">
            <div>
              <label>Question Text</label>
              <input
                type="text"
                placeholder="Enter question text"
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
              />
            </div>
            <div className="answerContainer">
              <label>Options</label>
              {q.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...q.options];
                    newOptions[optIndex] = e.target.value;
                    handleQuestionChange(index, "options", newOptions);
                  }}
                />
              ))}
            </div>
            <div>
              <label>Correct Answer</label>
              <select
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(index, "correctAnswer", e.target.value)
                }
              >
                <option value="">Select Correct Answer</option>
                {q.options.map((opt, optIndex) => (
                  <option key={optIndex} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div className="addExamButtons">
          <button
            type="button"
            onClick={addQuestion}
            className="addExamButtonsAdd"
          >
            Add Question
          </button>
          <button type="submit" className="addExamButtonsSubmit">
            Submit Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExam;
