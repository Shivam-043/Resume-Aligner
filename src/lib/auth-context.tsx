"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from './auth-service';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true, error: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthChange((user) => {
        setCurrentUser(user);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('Error setting up auth state listener:', err);
      setError('Failed to initialize Firebase authentication. Please check your configuration.');
      setLoading(false);
      return () => {};
    }
  }, []);

  const value = {
    currentUser,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};