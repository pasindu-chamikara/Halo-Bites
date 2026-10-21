"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type AdminRole = 'super_admin' | 'order_manager' | 'inventory_manager' | 'kitchen_staff';

export interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  isAdmin: boolean;
  adminRole: AdminRole | null;
  setAdminRole: (role: AdminRole) => void;
  login: (email: string, role?: AdminRole) => void;
  logout: () => void;
  updateEmail: (newEmail: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function resolveDefaultRole(email: string): AdminRole | null {
  const norm = email.trim().toLowerCase();
  if (norm === 'adminsuper@halobites.com') {
    return 'super_admin';
  }
  if (norm.startsWith('manager@') || norm.startsWith('order@') || norm.startsWith('orders@')) {
    return 'order_manager';
  }
  if (norm.startsWith('inventory@') || norm.startsWith('stock@')) {
    return 'inventory_manager';
  }
  if (norm.startsWith('kitchen@') || norm.startsWith('chef@') || norm.startsWith('dispatch@')) {
    return 'kitchen_staff';
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [adminRole, setAdminRoleState] = useState<AdminRole | null>(null);

  // Load auth and role state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('isLoggedIn');
    const storedEmail = localStorage.getItem('userEmail');
    const storedRole = localStorage.getItem('adminRole') as AdminRole | null;

    if (storedAuth === 'true') {
      setIsLoggedIn(true);
      if (storedEmail) {
        setUserEmail(storedEmail);
        const autoRole = storedRole || resolveDefaultRole(storedEmail);
        if (autoRole) {
          setAdminRoleState(autoRole);
        }
      }
    }
  }, []);

  const setAdminRole = (role: AdminRole) => {
    setAdminRoleState(role);
    localStorage.setItem('adminRole', role);
  };

  const login = (email: string, explicitRole?: AdminRole) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);

    const determinedRole = explicitRole || resolveDefaultRole(email);
    if (determinedRole) {
      setAdminRoleState(determinedRole);
      localStorage.setItem('adminRole', determinedRole);
    } else {
      setAdminRoleState(null);
      localStorage.removeItem('adminRole');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setAdminRoleState(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('adminRole');
  };

  const updateEmail = (newEmail: string) => {
    setUserEmail(newEmail);
    localStorage.setItem('userEmail', newEmail);
  };

  const isAdmin = adminRole !== null || (userEmail ? resolveDefaultRole(userEmail) !== null : false);

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        userEmail, 
        isAdmin, 
        adminRole: adminRole || (userEmail ? resolveDefaultRole(userEmail) : null), 
        setAdminRole, 
        login, 
        logout, 
        updateEmail 
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
