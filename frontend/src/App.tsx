// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SignUp } from "./components/SignUp";
import { Login } from "./components/Login";
import SetupProfile from "./components/SetupProfile";
import KycSetup from "./components/KycSetup";
// import KycSetup from "./components/KycSetup/KycSetup";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { OTPVerification } from "@/components/OTPVerification";
import ApplyLoan from "./components/Dashboard/ApplyLoan";

import { Toaster } from 'sonner';

// ✅ Protected route for logged-in users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// ✅ Admin protected route
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return user && user.isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

// ✅ Public routes (redirect if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (user) {
    if (user.isAdmin) return <Navigate to="/admin/dashboard" />;
    if (!user.isProfileSetup) return <Navigate to="/profile-setup" />;
    if (!user.isKycDone) return <Navigate to="/kyc" />;
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

// ✅ Signup flow route (does not need auth)
const SignupFlowRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      {/* ✅ Unified OTP screen for signup */}
      <Route
        path="/verify-otp"
        element={
          <PublicRoute>
            <OTPVerification flow="signup" />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* ✅ Unified OTP screen for login */}
      <Route
        path="/verify-login-otp"
        element={
          <PublicRoute>
            <OTPVerification flow="login" />
          </PublicRoute>
        }
      />

      {/* Signup Flow Routes */}
      <Route
        path="/profile-setup"
        element={
          <SignupFlowRoute>
            <SetupProfile />
          </SignupFlowRoute>
        }
      />
      <Route
        path="/kyc"
        element={
          <SignupFlowRoute>
            <KycSetup />
          </SignupFlowRoute>
        }
      />

      {/* Protected User Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
       <Route
        path="/dashboard/apply-loan"
        element={
          <ProtectedRoute>
            <ApplyLoan />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route
        path="*"
        element={
          <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
