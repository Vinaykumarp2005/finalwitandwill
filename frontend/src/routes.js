import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/faculty" element={<FacultyDashboard />} />
  </Routes>
);

export default AppRoutes;
