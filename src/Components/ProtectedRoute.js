import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = localStorage.getItem("user");

  try {
    const parsedUser = user ? JSON.parse(user) : null; // Handling undefined properly
    return parsedUser ? <Outlet /> : <Navigate to="/login" replace />;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
