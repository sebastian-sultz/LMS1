import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  isProfileSetup: boolean;
  isKycDone: boolean;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, otp: string) => Promise<void>;
  signup: (phoneNumber: string, referralCode?: string) => Promise<void>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<{ redirectTo: string }>;
  logout: () => void;
  isLoading: boolean;
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await apiService.getProfile();
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (phoneNumber: string, referralCode?: string) => {
    const response = await apiService.signup(phoneNumber, referralCode);
    
    // If user already exists and we get a token back
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
    }
    
    return response;
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    const response = await apiService.verifyOtp(phoneNumber, otp);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
    }
    
    return response.data;
  };

  const login = async (email: string, otp: string) => {
    const response = await apiService.login(email, otp);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    signup,
    verifyOtp,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};