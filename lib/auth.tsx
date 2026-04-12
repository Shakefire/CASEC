"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "admin" | "employer" | "student" | null;

interface AuthContextValue {
  role: Role;
  isLoggedIn: boolean;
  setRole: (role: Role) => void;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedIn = window.localStorage.getItem("casec_logged_in") === "true";
    const storedRole = window.localStorage.getItem("casec_role") as Role | null;

    if (storedLoggedIn) {
      setIsLoggedIn(true);
      if (storedRole) {
        setRole(storedRole);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      window.localStorage.setItem("casec_logged_in", "true");
      if (role) {
        window.localStorage.setItem("casec_role", role);
      }
    } else {
      window.localStorage.removeItem("casec_logged_in");
      window.localStorage.removeItem("casec_role");
    }
  }, [isLoggedIn, role]);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
  };

  const value = useMemo(() => ({ role, isLoggedIn, setRole, login, logout }), [role, isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useMockAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return context;
}
