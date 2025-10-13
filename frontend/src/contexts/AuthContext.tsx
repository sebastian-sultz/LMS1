// contexts/AuthContext.tsx -
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  isProfileSetup: boolean;
  isKycDone: boolean;
  isAdmin?: boolean;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void; 
  requestLoginOtp: (emailOrPhone: string) => Promise<{ isAdmin: boolean }>;
  verifyLoginOtp: (emailOrPhone: string, otp: string) => Promise<{ redirectTo: string }>;
  signup: (phoneNumber: string, referralCode?: string) => Promise<{requiresOtp: boolean}>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<{ redirectTo: string }>;
  logout: () => void;
  isLoading: boolean;
  tempPhoneNumber: string | null;
  setTempPhoneNumber: (phone: string | null) => void;
  clearTempPhoneNumber: () => void;
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
  const [tempPhoneNumber, setTempPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await apiService.getProfile();
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const requestLoginOtp = async (emailOrPhone: string) => {
    try {
      console.log("Requesting login OTP for:", emailOrPhone);
      const response = await apiService.requestLoginOtp(emailOrPhone);
      console.log("OTP requested successfully:", response.data);
      return { isAdmin: response.data.isAdmin || false };
    } catch (error: any) {
      console.error(' Request login OTP failed:', error);
      throw error;
    }
  };

  const verifyLoginOtp = async (emailOrPhone: string, otp: string) => {
    try {
      console.log(" Verifying login OTP for:", emailOrPhone);
      const response = await apiService.verifyLoginOtp(emailOrPhone, otp);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
      }
      
      return response.data;
    } catch (error: any) {
      console.error(' Verify login OTP failed:', error);
      throw error;
    }
  };

  const signup = async (phoneNumber: string, referralCode?: string) => {
    try {
      console.log(" Signing up user with phone:", phoneNumber);
      const response = await apiService.signup(phoneNumber, referralCode);
      
      console.log(" Signup response:", response);
      
      // Check if requires OTP (new or incomplete)
      if (response.data.otp) {
        console.log(" Requires OTP");
        setTempPhoneNumber(phoneNumber);
        return {
          requiresOtp: true
        };
      } else {
        // Complete existing - redirect to login
        console.log(" Complete existing - redirecting to login");
        return {
          requiresOtp: false
        };
      }
    } catch (error: any) {
      console.error(' Signup error:', error);
      throw error;
    }
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    try {
      console.log("Verifying OTP for signup:", phoneNumber);
      const response = await apiService.verifyOtp(phoneNumber, otp);
      
      // Set token and user
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
      }
      
      clearTempPhoneNumber();
      
      console.log("OTP verified, redirecting to:", response.data.redirectTo);
      return response.data;
    } catch (error: any) {
      console.error(' OTP verification failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    clearTempPhoneNumber();
  };

  const clearTempPhoneNumber = () => {
    setTempPhoneNumber(null);
  };

  const value = {
    user,
    token,
    setUser, 
    setToken, 
    signup,
    verifyOtp,
    requestLoginOtp,
    verifyLoginOtp,
    logout,
    isLoading,
    tempPhoneNumber,
    setTempPhoneNumber,
    clearTempPhoneNumber,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};