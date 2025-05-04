import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "faculty" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.endsWith("@vnrvjiet.in")) {
      setError("Only college email addresses are allowed (ending with @vnrvjiet.in).");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Signup successful! Please login now.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="College Email ID"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Signup</button>
      </form>
      <p className="mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Signup;
