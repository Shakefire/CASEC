"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export type Role = "admin" | "employer" | "student" | null;

interface AuthContextValue {
  user: User | null;
  role: Role;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id, session.user.user_metadata, session.user.email);
      }
      setIsLoading(false);
    };

    initAuth();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // Clear state and cookies immediately
        setUser(null);
        setRole(null);
        document.cookie = "casec_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "casec_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        
        // If we are on a protected route, force redirect to login
        const protectedPaths = ['/admin', '/employer', '/student'];
        if (protectedPaths.some(path => window.location.pathname.startsWith(path))) {
          window.location.href = "/login";
        }
      } else if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id, session.user.user_metadata, session.user.email);
        
        // Sync role to cookie for Middleware
        const roleFromMetadata = session.user.user_metadata?.role;
        if (roleFromMetadata) {
          document.cookie = `casec_role=${roleFromMetadata}; path=/; max-age=3600`;
          document.cookie = `casec_logged_in=true; path=/; max-age=3600`;
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string, metadata?: any, email?: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setRole(data.role as Role);
      } else if (error && error.code === 'PGRST116' && metadata) {
        // Profile doesn't exist yet! Let's create it securely since they are now authenticated.
        const { error: insertError } = await supabase
          .from("profiles")
          .upsert({
            id: userId,
            email: email || '',
            role: metadata.role || 'student',
            first_name: metadata.first_name,
            last_name: metadata.last_name,
            company_name: metadata.company_name,
          });
          
        if (!insertError) {
          setRole(metadata.role as Role);
        } else {
          console.error("Error auto-creating profile on first login:", insertError);
        }
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
    }
  };

  const signOut = async () => {
    // This will trigger the SIGNED_OUT event in the listener above
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
