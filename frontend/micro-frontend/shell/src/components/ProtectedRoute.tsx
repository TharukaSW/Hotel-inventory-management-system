import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // backward compatibility
  allowedRoles?: string[]; // new multi-role support
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDefaultRouteForRole = (role?: string | null) => {
    switch (role) {
      case 'ADMIN':
      case 'STOCK_MANAGER':
        return '/admin';
      case 'FRONT_DESK':
        return '/frontdesk';
      case 'INSPECTOR':
        return '/inspector';
      default:
        return '/';
    }
  };

  // Determine role mismatch early (pure function, ok before hooks)
  const roleMismatch = (() => {
    if (!user?.role) return false;
    if (allowedRoles) return !allowedRoles.includes(user.role);
    if (requiredRole) return user.role !== requiredRole;
    return false;
  })();

  useEffect(() => {
    if (isAuthenticated && roleMismatch) {
      const target = getDefaultRouteForRole(user?.role);
      if (location.pathname !== target) navigate(target, { replace: true });
    }
  }, [isAuthenticated, roleMismatch, user, navigate, location.pathname]);
  // Render logic AFTER hooks to keep hook order stable
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Login />;
  if (roleMismatch) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">Redirecting...</div>
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
