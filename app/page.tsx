"use client";

import React, { useState, useEffect } from "react";
import Homepage from "./Homepage";
import LoginPage from "./Login";
import Dashboard from "./Dashboard";
import Invoices from "./Invoices";

// Define types
export interface User {
  id?: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  isAuthenticated?: boolean; // Added authentication flag
}

// Authentication service mock (replace with actual API calls)
class AuthService {
  private static readonly AUTH_KEY = 'invoiceflow_auth';
  private static readonly SESSION_KEY = 'invoiceflow_session';
  
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const session = sessionStorage.getItem(this.SESSION_KEY);
    const auth = localStorage.getItem(this.AUTH_KEY);
    
    // Check if we have valid session data
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        // Check session expiry (e.g., 24 hours)
        const sessionAge = Date.now() - sessionData.timestamp;
        if (sessionAge < 24 * 60 * 60 * 1000) {
          return true;
        }
      } catch (e) {
        console.error('Invalid session data');
      }
    }
    
    return false;
  }
  
  static saveSession(user: User): void {
    if (typeof window === 'undefined') return;
    
    const sessionData = {
      user,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(this.AUTH_KEY, 'true');
  }
  
  static clearSession(): void {
    if (typeof window === 'undefined') return;
    
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.AUTH_KEY);
  }
  
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const session = sessionStorage.getItem(this.SESSION_KEY);
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        return sessionData.user;
      } catch (e) {
        console.error('Failed to parse user session');
      }
    }
    return null;
  }
}

export default function Page() {
  // Initialize state based on authentication status
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'dashboard'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<string>('dashboard');

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      if (AuthService.isAuthenticated()) {
        const savedUser = AuthService.getUser();
        if (savedUser) {
          setUser(savedUser);
          setCurrentView('dashboard');
        } else {
          // Session corrupted, clear and redirect to home
          AuthService.clearSession();
          setCurrentView('home');
        }
      } else {
        setCurrentView('home');
      }
      setIsLoading(false);
    };

    // Add slight delay to prevent flash of wrong content
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle successful login
  const handleLogin = (userData: User) => {
    const authenticatedUser = {
      ...userData,
      isAuthenticated: true
    };
    
    // Save session
    AuthService.saveSession(authenticatedUser);
    
    setUser(authenticatedUser);
    setCurrentView('dashboard');
    setActivePage('dashboard');
  };

  // Handle logout with session cleanup
  const handleLogout = () => {
    // Clear all session data
    AuthService.clearSession();
    
    // Reset state
    setUser(null);
    setCurrentView('home');
    setActivePage('dashboard');
  };

  // Navigation handlers
  const handleNavigateToLogin = () => {
    // Don't allow navigation to login if already authenticated
    if (!AuthService.isAuthenticated()) {
      setCurrentView('login');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleBackToHome = () => {
    // If authenticated, redirect to dashboard instead of home
    if (AuthService.isAuthenticated()) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('home');
    }
  };

  const handlePageChange = (pageId: string) => {
    // Only allow page changes if authenticated
    if (AuthService.isAuthenticated()) {
      setActivePage(pageId);
    }
  };

  // Protected route component wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!AuthService.isAuthenticated() || !user) {
      // Redirect to login if not authenticated
      setCurrentView('login');
      return null;
    }
    return <>{children}</>;
  };

  // Show loading state
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

  // Render Login Page
  if (currentView === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={handleBackToHome} />;
  }

  // Render Homepage (only if not authenticated)
  if (currentView === 'home' && !AuthService.isAuthenticated()) {
    return <Homepage onNavigateToLogin={handleNavigateToLogin} />;
  }

  // Render Dashboard (protected)
  if (currentView === 'dashboard' && user) {
    return (
      <ProtectedRoute>
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          activePage={activePage}
          onPageChange={handlePageChange}
        >
          {activePage === 'invoices' && <Invoices />}
        </Dashboard>
      </ProtectedRoute>
    );
  }

  // Default fallback - show homepage if not authenticated
  if (!AuthService.isAuthenticated()) {
    return <Homepage onNavigateToLogin={handleNavigateToLogin} />;
  }

  // If authenticated but somehow no view is selected, redirect to dashboard
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-600">Redirecting...</p>
    </div>
  );
}