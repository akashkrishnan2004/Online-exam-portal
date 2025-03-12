import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "./api";

import "./css/showExams.css";

const ShowExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editQuestion, setEditQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [examResults, setExamResults] = useState({});

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const instructorId = localStorage.getItem("User_ID");
        if (!instructorId) {
          toast.error("Instructor ID not found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `${API_URL}/exam?instructorId=${instructorId}`
        );
        setExams(response.data);

        // Fetch exam results
        const resultsResponse = await axios.get(
          `${API_URL}/examResults?instructorId=${instructorId}`
        );
        setExamResults(resultsResponse.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast.error("Failed to fetch exams.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleEditClick = (question, examId) => {
    setEditQuestion({ ...question, examId });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    setEditQuestion((prev) => {
      const updatedOptions = [...prev.options];
      updatedOptions[index] = value;
      return { ...prev, options: updatedOptions };
    });
  };

  const handleCorrectAnswerChange = (e) => {
    setEditQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }));
  };

  const handleSaveChanges = async () => {
    if (!editQuestion) return;
    try {
      const {
        examId,
        _id: questionId,
        questionText,
        options,
        correctAnswer,
      } = editQuestion;

      const response = await axios.put(
        `${API_URL}/exam/${examId}/questions/${questionId}`,
        { questionText, options, correctAnswer }
      );

      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam._id === examId
            ? {
                ...exam,
                questions: exam.questions.map((q) =>
                  q._id === questionId ? response.data : q
                ),
              }
            : exam
        )
      );
      toast.success("Question updated successfully.");
      setShowModal(false);
      setEditQuestion(null);
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update question.");
    }
  };

  const handleDeleteExam = async (examId) => {
    try {
      await axios.delete(`${API_URL}/exam/${examId}`);
      setExams((prevExams) => prevExams.filter((exam) => exam._id !== examId));
      toast.success("Exam deleted successfully.");
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error("Failed to delete exam.");
    }
  };

  if (loading) return <p className="showExamsLoadingPara">Loading exams...</p>;
  if (!exams.length)
    return <p className="showExamsLoadingPara">No exams available!</p>;

  return (
    <div className="showExamsBody">
      <h2 className="showExamsHead">Exams</h2>
      {exams.map((exam) => (
        <div key={exam._id} className="exam-container">
          <h3>{exam.examTitle}</h3>
          {exam.questions.map((question) => (
            <div key={question._id} className="question-container">
              <p>
                <strong>Q:</strong> {question.questionText}
              </p>
              <ul>
                {question.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
              <p>
                <strong>Correct Answer:</strong> {question.correctAnswer}
              </p>
              <button
                onClick={() => handleEditClick(question, exam._id)}
                className="edit-button"
              >
                Edit
              </button>
            </div>
          ))}

          <button
            onClick={() => handleDeleteExam(exam._id)}
            className="delete-button"
          >
            Delete Exam
          </button>

          {/* Student Results Section */}
          <div className="exam-results">
            <h4>Student Results</h4>
            {examResults[exam._id]?.length ? (
              <ul>
                {examResults[exam._id].map((result, index) => (
                  <li key={index}>
                    <strong>{result.studentName}</strong>: {result.score} /{" "}
                    {exam.questions.length}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students have attempted this exam.</p>
            )}
          </div>
        </div>
      ))}

      {showModal && editQuestion && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Question</h3>
            <label>
              Question:
              <input
                type="text"
                name="questionText"
                value={editQuestion.questionText}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Options:
              {editQuestion.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
            </label>
            <label>
              Correct Answer:
              <select
                name="correctAnswer"
                value={editQuestion.correctAnswer}
                onChange={handleCorrectAnswerChange}
              >
                {editQuestion.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <div className="modal-actions">
              <button onClick={handleSaveChanges} className="save-button">
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowExams;
