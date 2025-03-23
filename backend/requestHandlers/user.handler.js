import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

// JWT and Email Config
const { sign, verify } = jwt;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Register
export async function register(req, res) {
  try {
    const { username, email, password, role, image } = req.body;

    // Validate inputs
    if (
      !username ||
      username.length < 2 ||
      !email ||
      email.length < 4 ||
      !password ||
      password.length < 4 ||
      !role
    ) {
      return res.status(400).json({ msg: "Invalid inputs" });
    }

    // Check for existing user
    const userExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (userExist) {
      return res.status(400).json({ msg: "Username or email already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      username,
      email,
      password: hashedPassword,
      role,
      image,
    });
    return res.status(201).json({ msg: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to register" });
  }
}

// Login using email
export async function login(req, res) {
  try {
    const { email, password, username } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ msg: "Invalid inputs" });
    }

    // Find user and validate password
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate JWT
    const token = sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to login" });
  }
}

// Login using username
// export async function login(req, res) {
//   try {
//     const { username, password } = req.body;

//     // Validate inputs
//     if (!username || username.length < 2 || !password || password.length < 4) {
//       return res.status(400).json({ msg: "Invalid inputs" });
//     }

//     // Find user and validate password
//     const user = await userModel.findOne({ username });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ msg: "Invalid credentials" });
//     }

//     // Generate JWT
//     const token = sign(
//       { userId: user._id, username: user.username, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" }
//     );
//     return res.status(200).json({ token });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: "Failed to login" });
//   }
// }

// Request Password Reset
// export async function requestPasswordReset(req, res) {
//   try {
//     const { email } = req.body;
//     const user = await userModel.findOne({ email });
//     if (user) {
//       const resetToken = crypto.randomBytes(20).toString("hex");
//       user.resetPasswordToken = resetToken;
//       user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//       await user.save();

//       const resetUrl = `http://localhost:${process.env.VITE_PORT}/reset-password/${resetToken}`;
//       const mailOptions = {
//         to: email,
//         from: "akashkrishnan806@gmail.com",
//         subject: "Password Reset",
//         text: `Click the link to reset your password: ${resetUrl}`,
//       };

//       transporter.sendMail(mailOptions, (err) => {
//         if (err) console.error("Email failed:", err);
//       });
//     }

//     // Always send the same response for security
//     return res
//       .status(200)
//       .json({ msg: "If this email exists, a reset link has been sent" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: "Failed to request password reset" });
//   }
// }

// Change Password
// export async function changePassword(req, res) {
//   try {
//     const { resetToken, newPassword } = req.body;
//     const user = await userModel.findOne({
//       resetPasswordToken: resetToken,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ msg: "Invalid or expired token" });
//     }

//     // Update password and clear reset token
//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     return res.status(200).json({ msg: "Password changed successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: "Failed to change password" });
//   }
// }

// profile
export async function profile(req, res) {
  try {
    let result = await userModel.findOne(
      { _id: req.user.userId },
      { password: 0 }
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to fetch" });
  }
}

export async function allUsers(req, res) {
  try {
    let data = await userModel.find();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to fetch" });
  }
}
