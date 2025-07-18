import React from 'react';
import ProtectedRoute from './ProtectedRoute';

interface Props {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<Props> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const MedecinRoute: React.FC<Props> = ({ children }) => (
  <ProtectedRoute allowedRoles={['medecin']}>
    {children}
  </ProtectedRoute>
);

export const InfirmierRoute: React.FC<Props> = ({ children }) => (
  <ProtectedRoute allowedRoles={['infirmier']}>
    {children}
  </ProtectedRoute>
);
