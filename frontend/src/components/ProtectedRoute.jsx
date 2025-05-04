import React from "react";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const role = localStorage.getItem("role");

  return role === "admin" || role === "faculty" ? (
    Component
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
