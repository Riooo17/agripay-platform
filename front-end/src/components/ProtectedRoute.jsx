import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  console.log('🛡️ Protected Route Check:', { 
    hasToken: !!token, 
    hasUser: !!user,
    requiredRole 
  });

  // No token - redirect to login
  if (!token || !user) {
    console.log('❌ No auth, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  try {
    const userData = JSON.parse(user);
    
    // Check role if required
    if (requiredRole && userData.role !== requiredRole) {
      console.log(`❌ Role mismatch: ${userData.role} != ${requiredRole}`);
      return <Navigate to="/" replace />;
    }

    console.log('✅ Access granted for role:', userData.role);
    return children;
    
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;