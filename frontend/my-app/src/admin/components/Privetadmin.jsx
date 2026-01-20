import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  // ✅ Get admin user from localStorage
  const adminUser = JSON.parse(localStorage.getItem("adminUser"));

  // If no admin is logged in, redirect to admin login
  if (!adminUser) {
    return <Navigate to="/login" replace />;
  }

  // Admin is logged in, allow access
  return children;
};

export default AdminRoute;
