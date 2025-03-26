import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import FacultyDashboard from './components/FacultyDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
