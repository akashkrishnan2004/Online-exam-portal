import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import API_URL from "./api";

import "./css/examQuestions.css";

const ExamQuestions = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const studentId = localStorage.getItem("User_ID");
  const studentName = localStorage.getItem("User_Name");

  useEffect(() => {
    const checkAttempt = async () => {
      try {
        const response = await axios.get(`${API_URL}/checkAttempt`, {
          params: { studentId, examId: id },
        });
        if (response.data.hasAttempted) {
          setHasAttempted(true);
        }
      } catch (error) {
        console.error("Error checking attempt:", error);
      }
    };

    checkAttempt();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId, id, studentId]);

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.get(`${API_URL}/exam/${id}`, {
        params: { password: passwordInput },
      });

      setExam(response.data);
      setIsPasswordVerified(true);
      setTimer(response.data.questions.length * 60);
      toast.success("Password verified successfully!");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid password. Please try again.");
      } else {
        console.error("Error verifying password:", error);
        toast.error("Error verifying password.");
      }
    }
  };

  const startExam = () => {
    setIsExamStarted(true);

    const newIntervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(newIntervalId);
          setIsExamFinished(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    setIntervalId(newIntervalId);
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIndex] = selectedOption;
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    clearInterval(intervalId);
    let totalScore = 0;

    exam.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        totalScore += 1;
      }
    });

    setScore(totalScore);
    setIsExamFinished(true);

    if (!studentId || !studentName) {
      toast.error("Student details are missing. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/saveMarks`, {
        studentId,
        studentName,
        examId: id,
        score: totalScore,
      });

      toast.success("Marks saved successfully!");
      setHasAttempted(true);
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error("Failed to save marks.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!isPasswordVerified) {
    return (
      <div className="password-section">
        <h3>Enter Exam Password</h3>
        <input
          type="password"
          className="password-input"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Enter 10-digit password"
        />
        <button
          onClick={handlePasswordSubmit}
          className="password-submit-button"
        >
          Verify Password
        </button>
      </div>
    );
  }

  if (!exam) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="exam-questions-container">
      <h2 className="exam-title-head">{exam.examTitle}</h2>

      {hasAttempted ? (
        <div className="exam-restricted">
          <h3>You have already attempted this exam.</h3>
          <p>You cannot take it again.</p>
        </div>
      ) : (
        <>
          {!isExamStarted && (
            <div className="start-exam-button-container">
              <button onClick={startExam} className="start-exam-button">
                Start Exam
              </button>
            </div>
          )}

          {isExamStarted && (
            <>
              <div className="timer-container">
                <p className="timer">Time Remaining: {formatTime(timer)}</p>
              </div>

              {exam.questions.map((question, index) => (
                <div key={index} className="question-container">
                  <p>
                    <strong>Q{index + 1}:</strong> {question.questionText}
                  </p>
                  <ul className="options-list">
                    {question.options.map((option, optionIndex) => (
                      <li
                        key={optionIndex}
                        className={`option-item ${
                          answers[index] === option ? "selected-option" : ""
                        }`}
                        onClick={() => handleAnswerChange(index, option)}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>

                  {isExamFinished && (
                    <p className="correct-answer">
                      <strong>Correct Answer:</strong> {question.correctAnswer}
                    </p>
                  )}
                </div>
              ))}

              {!isExamFinished && (
                <div className="submit-button-container">
                  <button
                    onClick={handleSubmit}
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Exam"}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {isExamFinished && (
        <div className="exam-results">
          <h3>Exam Finished</h3>
          <p>
            <strong>Your Score:</strong> {score} / {exam.questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExamQuestions;
