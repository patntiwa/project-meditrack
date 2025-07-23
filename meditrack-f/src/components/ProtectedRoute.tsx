import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from './Common/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'medecin' | 'infirmier'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultRoutes: Record<string, string> = {
      medecin: '/medecin/dashboard',
      infirmier: '/infirmier/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={defaultRoutes[user.role] || '/login'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
