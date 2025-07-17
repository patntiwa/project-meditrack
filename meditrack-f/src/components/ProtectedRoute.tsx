import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Common/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading} = useAuth();

  // En attente de chargement
  if (isAuthenticated === false && user === undefined) {
    return <Loader />;
  }
  // En attente du chargement de l'utilisateur
  if (isLoading) return <Loader />;

  // Pas connecté
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Rôle non autorisé
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback =
      user.role === 'medecin' ? '/medecin/dashboard' :
      user.role === 'infirmier' ? '/infirmier/dashboard' :
      '/admin/dashboard';

    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
