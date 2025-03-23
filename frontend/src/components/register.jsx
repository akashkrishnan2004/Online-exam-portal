import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import toBase64 from "./utils/converters.js";
import avatar from "./images/Avatar.png";
import exam from "./images/exam.png";

import API_URL from "./api.jsx";

import "./css/register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // const API_URL = import.meta.env.VITE_BACKEND_URL;

  const imageChanger = async (e) => {
    let file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    let base64Image = await toBase64(file);
    setImage(base64Image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 2 || email.length < 4 || password.length < 4) {
      toast.error("Invalid inputs. Please check your details.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
        role,
        image,
      });

      toast.success(response.data.msg);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Registration failed");
      console.error(error);
    }
  };

  return (
    <div className="registerMain">
      <div className="registerImgContainer">
        <img src={exam} alt="Exam Illustration" />
      </div>

      <div className="registerContainer">
        <div className="registerDiv">
          <form onSubmit={handleSubmit} className="registerForm">
            {/* Profile Image Upload */}
            <label htmlFor="image" style={{ cursor: "pointer" }}>
              <img src={image ?? avatar} alt="Profile Avatar" />
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={imageChanger}
              className="registerImage"
            />

            {/* Username */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="registerUsername"
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="registerEmail"
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="registerPassword"
              required
            />

            {/* Role Selection */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="registerSelectBox"
              required
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>

            <span>Already have an account? <Link className="link" to="/login">Login</Link> </span>

            {/* Submit Button */}
            <button type="submit" className="registerSubmit">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
