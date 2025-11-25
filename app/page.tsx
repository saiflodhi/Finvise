"use client";

import React, { useState, useEffect } from "react";
import Homepage from "./Homepage";
import LoginPage from "./Login";
import Dashboard from "./Dashboard";

// Define types
export interface User {
  id?: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  isAuthenticated?: boolean;
}

// Authentication service mock (replace with actual API calls)
class AuthService {
  private static readonly AUTH_KEY = "invoiceflow_auth";
  private static readonly SESSION_KEY = "invoiceflow_session";

  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const session = sessionStorage.getItem(this.SESSION_KEY);

    if (session) {
      try {
        const sessionData = JSON.parse(session);
        // Check session expiry (e.g., 24 hours)
        const sessionAge = Date.now() - sessionData.timestamp;
        if (sessionAge < 24 * 60 * 60 * 1000) {
          return true;
        }
      } catch (e) {
        console.error("Invalid session data");
      }
    }

    return false;
  }

  static saveSession(user: User): void {
    if (typeof window === "undefined") return;

    const sessionData = {
      user,
      timestamp: Date.now(),
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(this.AUTH_KEY, "true");
  }

  static clearSession(): void {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.AUTH_KEY);
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null;

    const session = sessionStorage.getItem(this.SESSION_KEY);
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        return sessionData.user;
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
    return null;
  }
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "login" | "dashboard">(
    "home"
  );
  const [user, setUser] = useState<User | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      if (AuthService.isAuthenticated()) {
        const savedUser = AuthService.getUser();
        if (savedUser) {
          setUser(savedUser);
          setCurrentView("dashboard");
        } else {
          // Session corrupted, clear and redirect to home
          AuthService.clearSession();
          setCurrentView("home");
        }
      } else {
        setCurrentView("home");
      }
      setIsLoading(false);
    };

    // Slight delay to avoid flashing wrong content
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle successful login
  const handleLogin = (userData: User) => {
    const authenticatedUser: User = {
      ...userData,
      isAuthenticated: true,
    };

    AuthService.saveSession(authenticatedUser);
    setUser(authenticatedUser);
    setCurrentView("dashboard");
  };

  // Handle logout with session cleanup
  const handleLogout = () => {
    AuthService.clearSession();
    setUser(null);
    setCurrentView("home");
  };

  // Navigation handlers
  const handleNavigateToLogin = () => {
    if (!AuthService.isAuthenticated()) {
      setCurrentView("login");
    } else {
      setCurrentView("dashboard");
    }
  };

  const handleBackToHome = () => {
    if (AuthService.isAuthenticated()) {
      setCurrentView("dashboard");
    } else {
      setCurrentView("home");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Loading InvoiceFlow...</p>
        </div>
      </div>
    );
  }

  // Login page
  if (currentView === "login") {
    return <LoginPage onLogin={handleLogin} onBack={handleBackToHome} />;
  }

  // Homepage (only if not authenticated)
  if (currentView === "home" && !AuthService.isAuthenticated()) {
    return <Homepage onNavigateToLogin={handleNavigateToLogin} />;
  }

  // Dashboard (requires user + auth)
  if (currentView === "dashboard" && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Default fallback: show homepage if not authenticated
  if (!AuthService.isAuthenticated()) {
    return <Homepage onNavigateToLogin={handleNavigateToLogin} />;
  }

  // If authenticated but no view selected, show a simple fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-600">Redirecting...</p>
    </div>
  );
}
