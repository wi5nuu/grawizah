'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { profileAPI } from '@/lib/api';

export type RoleType = 'guest' | 'free_trader' | 'premium_trader' | 'buyer' | 'admin';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  company_id?: string;
  is_verified?: boolean;
  is_email_verified?: boolean;
  two_factor_enabled?: boolean;
  subscription_plan?: string;
}

interface AuthContextType {
  user: User | null;
  role: RoleType;
  loading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  isLoadingComplete: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'guest',
  loading: true,
  login: () => {},
  logout: () => {},
  isLoadingComplete: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<RoleType>('guest');
  const [loading, setLoading] = useState(true);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // DEMO BYPASS: Auto-login as Admin for Dashboard demonstration
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
          setUser({ id: 'demo123', email: 'admin@grawizah.com', full_name: 'Grawizah Admin', role: 'admin' });
          setRole('admin');
        } else {
          setRole('guest');
        }
        setLoading(false);
        setIsLoadingComplete(true);
        return;
      }

      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(determineRole(parsedUser));
        } else {
          // Fallback fetch profile if only token exists
          const res = await profileAPI.get();
          if (res.data?.success) {
            setUser(res.data.data);
            setRole(determineRole(res.data.data));
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        }
      } catch (err) {
        console.error('Failed to init auth:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setRole('guest');
      } finally {
        setLoading(false);
        setIsLoadingComplete(true);
      }
    };

    initAuth();
  }, []);

  const determineRole = (userData: User): RoleType => {
    if (userData.role === 'admin' || userData.role === 'super_admin') return 'admin';
    if (userData.role === 'buyer') return 'buyer';
    if (userData.role === 'trader' || userData.role === 'supplier' || userData.role === 'seller') {
      const plan = userData.subscription_plan?.toLowerCase();
      if (plan === 'premium' || plan === 'enterprise' || plan === 'pro') {
        return 'premium_trader';
      }
      return 'free_trader';
    }
    return 'guest';
  };

  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setRole(determineRole(userData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setRole('guest');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, isLoadingComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
