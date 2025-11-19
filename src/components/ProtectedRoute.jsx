import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const admin = localStorage.getItem("adminProfile");

  return admin ? children : <Navigate to="/" replace />;
}
