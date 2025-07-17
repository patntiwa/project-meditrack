import React from 'react';
import ProtectedRoute from './ProtectedRoute';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
);

export const MedecinRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['medecin']}>{children}</ProtectedRoute>
);

export const InfirmierRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['infirmier']}>{children}</ProtectedRoute>
);
