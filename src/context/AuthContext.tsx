import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await ChatService.getUserData();
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      checkAuth();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await ChatService.login(email, password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userEmail', email);
      setIsAuthenticated(true);
      setUser({ email });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};