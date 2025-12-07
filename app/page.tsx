"use client";

import React, { useState, useEffect } from "react";
import Homepage from "./Homepage";
import LoginPage from "./Login";
import Dashboard from "./Dashboard";
import AssessmentPage from "./assessment";

// --------------------------------------------------
// Types
// --------------------------------------------------
export interface User {
  id?: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  isAuthenticated?: boolean;
}

// --------------------------------------------------
// Session / Auth Helper
// --------------------------------------------------
class AuthService {
  private static AUTH_KEY = "isAuthenticated";
  private static SESSION_KEY = "userSession";

  static isBrowser() {
    return typeof window !== "undefined";
  }

  static isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return localStorage.getItem(this.AUTH_KEY) === "true";
  }

  static saveSession(user: User) {
    if (!this.isBrowser()) return;
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(this.AUTH_KEY, "true");
  }

  static logout() {
    if (!this.isBrowser()) return;
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.AUTH_KEY);
  }

  static getUser(): User | null {
    if (!this.isBrowser()) return null;
    const raw = sessionStorage.getItem(this.SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}

// --------------------------------------------------
// Root Router Component
// --------------------------------------------------
export default function Page() {
  const [currentView, setCurrentView] = useState<
    "home" | "login" | "dashboard" | "assessment"
  >("home");

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --------------------------------------------------
  // Restore Session On Load
  // --------------------------------------------------
  useEffect(() => {
    const isAuth = AuthService.isAuthenticated();
    const storedUser = AuthService.getUser();

    if (isAuth && storedUser) {
      setUser(storedUser);
      setCurrentView("dashboard");
    } else {
      setCurrentView("home");
    }

    setIsLoading(false);
  }, []);

  // --------------------------------------------------
  // Navigation Handlers
  // --------------------------------------------------
  const handleLogin = (userData: User) => {
    const fullUser = { ...userData, isAuthenticated: true };
    setUser(fullUser);
    AuthService.saveSession(fullUser);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setCurrentView("home");
  };

  const handleNavigateToLogin = () => {
    setCurrentView("login");
  };

  const handleNavigateToAssessment = () => {
    setCurrentView("assessment");
  };

  const handleBackToHome = () => {
    if (AuthService.isAuthenticated()) {
      setCurrentView("dashboard");
    } else {
      setCurrentView("home");
    }
  };

  // --------------------------------------------------
  // Loading Screen
  // --------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --------------------------------------------------
  // View Routing
  // --------------------------------------------------
  if (currentView === "home") {
    return (
      <Homepage
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToAssessment={handleNavigateToAssessment}
      />
    );
  }

  if (currentView === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={handleBackToHome}
      />
    );
  }

  if (currentView === "assessment") {
    return (
      <AssessmentPage
        onNavigateBack={handleBackToHome}
      />
    );
  }

  if (currentView === "dashboard") {
    if (!AuthService.isAuthenticated() || !user) {
      setCurrentView("home");
      return null;
    }

    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}
