// App.tsx - FIXED VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SignUp } from './components/SignUp';
import { SOTP } from './components/SOTP';
import { LoginOTP } from './components/LoginOTP';
import { Login } from './components/Login';
import SetupProfile from './components/SetupProfile';
import KycSetup from './components/KycSetup';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/AdminDashboard';

// Protected route component for regular users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Admin protected route component
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Check if user exists and is admin
  return user && user.isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

// Public route component (redirect if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If user is authenticated, redirect based on their type and progress
  if (user) {
    if (user.isAdmin) {
      return <Navigate to="/admin/dashboard" />;
    }
    
    if (!user.isProfileSetup) {
      return <Navigate to="/profile-setup" />;
    } else if (!user.isKycDone) {
      return <Navigate to="/kyc" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return <>{children}</>;
};

// 🔥 CRITICAL FIX: Add SignupFlowRoute for profile-setup and kyc
// These routes should be accessible during signup process without requiring auth token
const SignupFlowRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Allow access during signup flow even without user context
  // The backend will handle the authentication for these routes
  return <>{children}</>;
};

// Update the routes to include login and admin dashboard
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />
      
      <Route path="/verify-otp" element={
        <PublicRoute>
          <SOTP />
        </PublicRoute>
      } />
      
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      {/* Add Login OTP Route */}
      <Route path="/verify-login-otp" element={
        <PublicRoute>
          <LoginOTP />
        </PublicRoute>
      } />
      
      {/* 🔥 CRITICAL FIX: Signup Flow Routes - NO ProtectedRoute wrapper */}
      {/* These routes handle their own authentication during signup process */}
      <Route path="/profile-setup" element={<SetupProfile />} />
      <Route path="/kyc" element={<KycSetup />} />
      
      {/* Protected Routes for Logged-in Users */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
      
      {/* Fallback routes */}
      <Route path="/" element={<Navigate to="/signup" />} />
      
      {/* 404 page */}
      <Route path="*" element={
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;