import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('realnest_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('realnest_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('realnest_token');
      if (savedToken) {
        try {
          const res = await authApi.getCurrentUser();
          if (res && res.data) {
            setUser(res.data);
            localStorage.setItem('realnest_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res && res.data) {
      const authData = res.data;
      setToken(authData.token);
      const userInfo = {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        role: authData.role,
      };
      setUser(userInfo);
      localStorage.setItem('realnest_token', authData.token);
      localStorage.setItem('realnest_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error('Authentication failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res && res.data) {
      const authData = res.data;
      setToken(authData.token);
      const userInfo = {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        role: authData.role,
      };
      setUser(userInfo);
      localStorage.setItem('realnest_token', authData.token);
      localStorage.setItem('realnest_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('realnest_token');
    localStorage.removeItem('realnest_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
