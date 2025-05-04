// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./components/LoginPage";
// import AdminDashboard from "./components/AdminDashboard";
// import FacultyDashboard from "./components/FacultyDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { Navigate } from "react-router-dom";
// const App = () => {
//   return (
//     <Router>
      
// <Routes>
//         <Route exact path="/login" component={LoginPage} />
        
//         {/* Protected routes */}
//         <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
//         <ProtectedRoute path="/faculty/dashboard" component={FacultyDashboard} />
        
//         {/* Fallback route */}
//         {/* <Redirect from="/" to="/login" /> */}
//         <Navigate to="/login" />

//         </Routes>
//     </Router>
//   );
// };

// export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './components/Home.jsx';
// import Login from './components/Login.jsx';
// import Signup from './components/Signup.jsx';
// import AdminDashboard from './components/AdminDashboard.jsx';
// import FacultyDashboard from './components/FacultyDashboard.jsx';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/faculty" element={<FacultyDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import FacultyDashboard from './components/FacultyDashboard.jsx';
import Login from './components/Login.jsx'; // Import Login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;



