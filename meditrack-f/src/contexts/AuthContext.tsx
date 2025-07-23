import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

// EXPORTATION DE AUTHCONTEXT LUI-MÊME POUR POUVOIR L'IMPORTER DANS useAuth.ts
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// useAuth EST DÉSORMAIS DANS UN AUTRE FICHIER, PLUS BESOIN ICI

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchUser();
    } else {
        setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const loginResponse = await api.post('/api/login', { email, password });

      console.log('Réponse complète du login:', loginResponse.data);

      if (!loginResponse.data) {
        throw new Error('Pas de données reçues du serveur');
      }

      const { user: userData, accessToken } = loginResponse.data;

      if (!userData) {
        throw new Error('Pas de données utilisateur dans la réponse');
      }

      if (accessToken) {
        localStorage.setItem('token', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } else {
          console.warn('Le token n\'a pas été reçu dans la réponse du login.');
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
    } finally {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};