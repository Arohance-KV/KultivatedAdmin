import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  const localToken = localStorage.getItem("accessToken");
  
  const isAuthenticated = token || localToken;

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
