import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement initial : vérifier session existante
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/user');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      await api.get('/sanctum/csrf-cookie'); // Obligatoire pour Sanctum
      const loginResponse = await api.post('/api/login', { email, password });
      
      console.log('Réponse complète du login:', loginResponse.data);
      
      if (!loginResponse.data) {
        throw new Error('Pas de données reçues du serveur');
      }

      // La réponse contient directement l'utilisateur
      const userData = loginResponse.data.user;
      
      if (!userData) {
        throw new Error('Pas de données utilisateur dans la réponse');
      }

      // Stockage du token
      const token = loginResponse.data.token;
      if (token) {
        // Si vous avez besoin de stocker le token quelque part
        localStorage.setItem('token', token);
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
