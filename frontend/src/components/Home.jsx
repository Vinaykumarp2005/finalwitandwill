import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import the custom CSS
import img from '../api/image.png'


function Home() {
  const navigate = useNavigate();

  return (
    <div className="container text-center">
      <img src={img} alt=""  width="125px"/>
      <h1 className="mt-5 title-text mb-0">Department of Computer Science and Engineering</h1>
      <h1 className="mt-5 title-text mb-0">Welcome to WIT and WILL</h1>
      <div className="card-container mt-2">
        <div className="home-card" onClick={() => navigate("/admin")}>
          <div className="card-body">
            <h3 className="card-title">Admin</h3>
          </div>
        </div>
        <div className="home-card" onClick={() => navigate("/faculty")}>
          <div className="card-body">
            <h3 className="card-title">Faculty</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;