import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/login", // This is the server IP to connect to, and send the data to the server for login

        formData
      );
      alert(response.data.message);

      // get the name of the user
      const user = response.data.user;

      // Store user info in localStorage or state management
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Call onLogin to update App state, and give authentication
      onLogin(user);

      navigate("/main-page"); // Redirect to home page
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign In</h3>
      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Remember me
          </label>
        </div>
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
      <p className="forgot-password text-right">
        Forgot{" "}
        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // fun link, add a page with forgot password handling
          target="_blank"
          rel="noopener noreferrer"
        >
          password?
        </a>
      </p>
    </form>
  );
}
