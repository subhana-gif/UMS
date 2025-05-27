import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = useSelector((state) => 
    role === "user" ? state.auth.isAuthenticated : state.auth.adminIsAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to={`/${role}/login`} />;
  }

  return children;
};

export default ProtectedRoute;
