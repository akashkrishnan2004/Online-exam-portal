import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    examTitle: { type: String, required: true },
    password: { type: String, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
    instructorName: { type: String, required: true },
  },
  { timestamps: true }
);

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
