import mongoose from "mongoose";

const studentMarksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    studentName: { type: String, required: true },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    examName: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

const StudentMarks = mongoose.model("StudentMarks", studentMarksSchema);

export default StudentMarks;
