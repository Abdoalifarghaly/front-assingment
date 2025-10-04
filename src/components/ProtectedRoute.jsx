import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  // لو عندك loading في الـ AuthContext هننتظر لحد ما يحمل
  if (typeof loading !== "undefined" && loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
