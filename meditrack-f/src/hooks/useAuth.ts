import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Assurez-vous que le chemin est correct

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};