'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, userApi, api } from '@/lib/api';

interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: 'FARMER' | 'BUYER' | 'ADMIN';
  language: string;
  isVerified: boolean;
  isActive: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  loginWithOTP: (phoneNumber: string, code: string) => Promise<void>;
  register: (data: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    password?: string;
    role?: 'FARMER' | 'BUYER';
    language?: string;
  }) => Promise<void>;
  requestOTP: (phoneNumber: string, purpose: string) => Promise<string>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      refreshUser().catch(() => {
        // If refresh fails, clear token
        api.setToken(null);
        setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const response = await userApi.getMe();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const login = async (phoneNumber: string, password: string) => {
    try {
      const response = await authApi.login(phoneNumber, password);
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        api.setToken(accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        setUser(user);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const loginWithOTP = async (phoneNumber: string, code: string) => {
    try {
      const response = await authApi.verifyOTP(phoneNumber, code, 'LOGIN');
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        api.setToken(accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        setUser(user);
      }
    } catch (error: any) {
      throw new Error(error.message || 'OTP verification failed');
    }
  };

  const register = async (data: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    password?: string;
    role?: 'FARMER' | 'BUYER';
    language?: string;
  }) => {
    try {
      const response = await authApi.register(data);
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        api.setToken(accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        setUser(user);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const requestOTP = async (phoneNumber: string, purpose: string): Promise<string> => {
    try {
      const response = await authApi.requestOTP(phoneNumber, purpose);
      if (response.success && response.data?.otp) {
        return response.data.otp;
      }
      throw new Error('OTP request failed');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to request OTP');
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      api.setToken(null);
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        loginWithOTP,
        register,
        requestOTP,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
