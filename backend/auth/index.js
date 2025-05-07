import React from "react";
import { Navigate } from "react-router-dom";

// Korumalı rotalar için bileşen
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

// Yalnızca giriş yapmamış kullanıcılar için rotalar
export const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  
  if (isAuthenticated) {
    return <Navigate to="/maindashboard" replace />;
  }
  
  return children;
};