import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
        // This is the server IP to connect to, and send the data to the server for registering
        "http://localhost:8000/signup",
        formData
      );
      alert(response.data.message);
      navigate("/sign-in");
    } catch (error) {
      alert(error.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <div className="mb-3">
        <label>First name</label>
        <input
          type="text"
          name="firstName"
          className="form-control"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label>Last name</label>
        <input
          type="text"
          name="lastName"
          className="form-control"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
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
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered <a href="/sign-in">sign in?</a>
      </p>
    </form>
  );
}
