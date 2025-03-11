import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  image: {
    type: String,
    required: false,
    unique: false,
  },

  //
  // isVerified: { type: Boolean, default: false },
  // verificationToken: { type: String },
  //
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

export default mongoose.model.Users || mongoose.model("User", userSchema);
