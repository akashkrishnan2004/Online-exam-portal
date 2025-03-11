import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { profile } from "./utils/helpers";
import exam2 from "./images/exam2.png";
import API_URL from "./api";

import "./css/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 2 || password.length < 4) {
      toast.error("Invalid inputs. Please check your details.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });

      localStorage.setItem("token", response.data.token);
      toast.success("Login successful");

      const userData = await profile();
      if (!userData) {
        toast.error("Failed to retrieve user data");
        return;
      }

      const { _id, username: name, role } = userData;

      localStorage.setItem("Role", role);
      localStorage.setItem("User_ID", _id);
      localStorage.setItem("User_Name", name);
      localStorage.setItem(
        "User",
        JSON.stringify({ id: _id, name })
      );

      if (role === "student") {
        navigate("/student-dashboard");
      } else if (role === "instructor") {
        navigate("/instructor-dashboard");
      } else {
        toast.error("Invalid user role");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
      console.error(error);
    }
  };

  return (
    <div className="loginMain">
      <div className="loginContainer">
        <div className="loginDiv">
          <form onSubmit={handleSubmit} className="loginForm">
            <h2 className="loginHead2">Login</h2>
            <input
              type="text"
              placeholder="Username"
              className="loginUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span>Don't have an account? <Link to="/register" className="link">Register</Link></span>
            <button type="submit" className="loginSubmit">
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="loginImgContainer">
        <img src={exam2} alt="Login Illustration" />
      </div>
    </div>
  );
}
