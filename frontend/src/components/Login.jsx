
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './Login.css'; // (Optional) If you want to style it

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      // Save token in localStorage (optional, for protected routes)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("empId", response.data.empId); // Update backend to send empId too

      if (response.data.role === "admin") {
        navigate("/admin");
      } else if (response.data.role === "faculty") {
        navigate("/faculty");
      } else {
        setError("Invalid role assigned. Contact Admin.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Faculty/Admin Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="mb-3">
          <label>Email address:</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter College Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="text-danger mb-3">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", formData);
//       const { token, role } = response.data;

//       // Save token in localStorage
//       localStorage.setItem("token", token);

//       // Redirect based on role
//       if (role === "admin") {
//         navigate("/admin");
//       } else if (role === "faculty") {
//         navigate("/faculty");
//       } else {
//         setError("Invalid role assigned. Contact administrator.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Login failed. Try again.");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Login</h2>
//       {error && <p className="text-danger">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <input
//             type="email"
//             name="email"
//             className="form-control"
//             placeholder="Enter College Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <input
//             type="password"
//             name="password"
//             className="form-control"
//             placeholder="Enter Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">Login</button>
//       </form>
//       <p className="mt-3">
//         Don't have an account? <a href="/signup">Signup</a>
//       </p>
//     </div>
//   );
// }

// export default Login;
