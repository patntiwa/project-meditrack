import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  updateUser: (updatedUser: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock users for demo purposes
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'medecin@hospital.com',
        name: 'Dr. Marie Dubois',
        role: 'medecin',
        specialty: 'Cardiologie',
        phone: '01 23 45 67 89'
      },
      {
        id: '2',
        email: 'infirmier@hospital.com',
        name: 'Jean Martin',
        role: 'infirmier',
        phone: '01 23 45 67 90'
      },
      {
        id: '3',
        email: 'admin@hospital.com',
        name: 'Sophie Lambert',
        role: 'admin',
        phone: '01 23 45 67 91'
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email && password === 'password');
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};