import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('campushire_token');
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.error('Session restoration failed:', err);
          localStorage.removeItem('campushire_token');
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('campushire_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (studentData) => {
    const res = await api.register(studentData);
    localStorage.setItem('campushire_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('campushire_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
