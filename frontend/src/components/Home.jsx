// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Home.css";
// import img from '../api/image.png'; // your image

// function Home() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     if (token && role) {
//       if (role === "admin") {
//         navigate("/admin");
//       } else if (role === "faculty") {
//         navigate("/faculty");
//       }
//     }
//     // Else stay on Home page
//   }, [navigate]);

//   return (
//     <div className="container text-center">
//       <img src={img} alt="Logo" width="125px" />
//       <h1 className="mt-5 title-text mb-0">Department of Computer Science and Engineering</h1>
//       <h1 className="mt-5 title-text mb-0">Welcome to WIT and WILL</h1>
      
//       <div className="card-container mt-4">
//         <div className="home-card" onClick={() => navigate("/login")}>
//           <div className="card-body">
//             <h3 className="card-title">Login</h3>
//           </div>
//         </div>

//         <div className="home-card" onClick={() => navigate("/signup")}>
//           <div className="card-body">
//             <h3 className="card-title">Signup</h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import img from '../api/image.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container text-center">
      <img src={img} alt="Logo" width="125px" />
      <h1 className="mt-5 title-text mb-0">Department of Computer Science and Engineering</h1>
      <h1 className="mt-3 title-text mb-0">Welcome to WIT and WILL</h1>
      <div className="card-container mt-4">
        <div className="home-card" onClick={() => navigate("/login")}>
          <div className="card-body">
            <h3 className="card-title">Login</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

