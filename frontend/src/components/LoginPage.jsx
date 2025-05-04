import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const history = useHistory();
const navigate = useNavigate();
navigate('/home');


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Store the token and role in localStorage or sessionStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role); // Store the role

        // Redirect based on the role
        if (data.role === "admin") {
          history.push("/admin/dashboard");
        } else {
          history.push("/faculty/dashboard");
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
