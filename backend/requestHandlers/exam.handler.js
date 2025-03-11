import Exam from "../models/exam.model.js";
import Question from "../models/question.model.js";
import StudentMarks from "../models/students.mark.model.js";

export const createExam = async (req, res) => {
  try {
    const { examTitle, examPassword, questions, instructorId, instructorName } =
      req.body;

    console.log("Request Body:", req.body);

    if (
      !examTitle ||
      !examPassword ||
      !questions ||
      !instructorId ||
      !instructorName ||
      !Array.isArray(questions)
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const newQuestion = new Question(q);
        await newQuestion.save();
        return newQuestion._id;
      })
    );

    const passwordRegex = /^\d{10}$/;
    if (!passwordRegex.test(examPassword)) {
      return res
        .status(400)
        .json({ message: "Exam password must be exactly 10 numeric digits." });
    }

    const newExam = new Exam({
      examTitle,
      password: examPassword,
      questions: questionDocs,
      instructorId,
      instructorName,
    });
    await newExam.save();

    res.status(201).json({ message: "Exam created successfully" });
  } catch (error) {
    console.error("Error creating exam:", error);
    res
      .status(500)
      .json({ message: "Error creating exam", error: error.message });
  }
};

export const getExams = async (req, res) => {
  const { instructorId } = req.query;

  try {
    const exams = await Exam.find({ instructorId }).populate("questions");

    if (!Array.isArray(exams)) {
      return res.status(200).json([]);
    }

    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ message: "Error fetching exams" });
  }
};

export const getExamTitles = async (req, res) => {
  try {
    const exams = await Exam.find().select("examTitle");
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exam titles:", error);
    res.status(500).json({ message: "Error fetching exam titles" });
  }
};

export const getExamQuestions = async (req, res) => {
  const { id } = req.params;
  const { password } = req.query;

  try {
    const exam = await Exam.findById(id).populate("questions");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Check if the provided password matches the exam's password
    if (exam.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    res.status(500).json({ message: "Error fetching exam questions" });
  }
};

export const saveMarks = async (req, res) => {
  try {
    const { studentId, studentName, examId, score } = req.body;

    if (!studentId || !studentName || !examId || score === undefined) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    // Check if student has already taken the exam
    //  const existingMarks = await StudentMarks.findOne({ studentId, examId });
    //  if (existingMarks) {
    //    return res.status(403).json({ message: "You have already attempted this exam." });
    //  }

    const newMarks = new StudentMarks({
      studentId,
      studentName,
      examId,
      examName: exam.examTitle,
      score,
    });

    await newMarks.save();
    res.status(200).json({ message: "Marks saved successfully!" });
  } catch (error) {
    console.error("Error saving marks:", error);
    res
      .status(500)
      .json({ message: "Error saving marks", error: error.message });
  }
};

export const getStudentExams = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("Fetching exams for student ID:", studentId);

    const student = await Student.findById(studentId);

    if (!student) {
      console.log("Student not found");
      return res.status(404).json({ msg: "Student not found" });
    }

    console.log("Student found:", student);

    const exams = student.marks.map((exam) => ({
      examName: exam.name,
      marks: [
        { subjectName: "Subject 1", mark: exam.subject1 },
        { subjectName: "Subject 2", mark: exam.subject2 },
        { subjectName: "Subject 3", mark: exam.subject3 },
      ],
    }));

    console.log("Exams to return:", exams);
    res.json(exams);
  } catch (err) {
    console.error("Error in getStudentExams:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { questionText, options, correctAnswer } = req.body;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { questionText, options, correctAnswer },
      { new: true } // Return the updated document
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Error updating question" });
  }
};

// Delete exam and its associated questions
export const deleteExam = async (req, res) => {
  const { examId } = req.params;

  try {
    // Find and delete all questions associated with the exam
    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Delete questions from the Question model
    await Question.deleteMany({ _id: { $in: exam.questions } });

    // Delete the exam
    await Exam.findByIdAndDelete(examId);

    return res
      .status(200)
      .json({ message: "Exam and its questions deleted successfully" });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentMarks = async (req, res) => {
  try {
    const studentMarks = await StudentMarks.find({
      studentId: req.params.studentId,
    }).populate("examId");

    console.log("Fetched Student Marks:", studentMarks);

    let totalMarks = studentMarks.reduce((acc, mark) => acc + mark.score, 0);

    res.status(200).json({
      exams: studentMarks.map((mark) => ({
        examName: mark.examName,
        marks: mark.score,
      })),
      totalMarks: totalMarks,
    });
  } catch (err) {
    console.error("Error fetching marks:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


