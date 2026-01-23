'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, userApi, api } from '@/lib/api';
import Cookies from 'js-cookie';

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
  passwordHash?: string | null;
  farmerProfile?: {
    farmName?: string;
    farmLocation?: string;
  };
  buyerProfile?: {
    businessName?: string;
    businessType?: string;
    address?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  loginWithOTP: (phoneNumber: string, code: string, purpose?: string) => Promise<void>;
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
  const [mounted, setMounted] = useState(false);

  const refreshUser = async () => {
    try {
      const response = await userApi.getMe();
      if (response.success && response.data) {
        setUser(response.data);
        // Update user cookie
        Cookies.set('user', JSON.stringify(response.data), { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' 
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Only run client-side code after mount
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    // Check if user is logged in on mount (check both cookie and localStorage)
    const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
    
    // Try to load user from cookie first for faster initial render
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);
      } catch (e) {
        // Invalid cookie, ignore
      }
    }
    
    if (token) {
      refreshUser().catch(() => {
        // If refresh fails, clear token
        api.setToken(null);
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('user', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phoneNumber: string, password: string) => {
    try {
      const response = await authApi.login(phoneNumber, password);
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        api.setToken(accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
          Cookies.set('refreshToken', refreshToken, { 
            expires: 30, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' 
          });
        }
        // Store user data in cookie for quick access
        Cookies.set('user', JSON.stringify(user), { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' 
        });
        setUser(user);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const loginWithOTP = async (phoneNumber: string, code: string, purpose: string = 'LOGIN') => {
    try {
      const response = await authApi.verifyOTP(phoneNumber, code, purpose);
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        api.setToken(accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
          Cookies.set('refreshToken', refreshToken, { 
            expires: 30, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' 
          });
        }
        // Store user data in cookie
        Cookies.set('user', JSON.stringify(user), { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' 
        });
        setUser(user);
      } else {
        throw new Error('OTP verification failed');
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
          Cookies.set('refreshToken', refreshToken, { 
            expires: 30, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' 
          });
        }
        // Store user data in cookie
        Cookies.set('user', JSON.stringify(user), { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' 
        });
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
      const refreshToken = localStorage.getItem('refreshToken') || Cookies.get('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      api.setToken(null);
      localStorage.removeItem('refreshToken');
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('user', { path: '/' });
      setUser(null);
    }
  };

  // Always provide the context, even during SSR
  // The context value will be updated once mounted
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
