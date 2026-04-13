"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { globalLogout } from "./logout";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      // If we see a SIGNED_OUT event or have no session
      if (event === 'SIGNED_OUT' || !session) {
        // Clear local state immediately
        setUser(null);
        setRole(null);
        
        // If we were previously logged in or are on a protected route, trigger global cleanup
        const protectedPaths = ['/admin', '/employer', '/student'];
        const isProtectedPath = protectedPaths.some(path => window.location.pathname.startsWith(path));
        
        if (isProtectedPath) {
          // If we are on a protected route and lost session, force a full logout/redirect
          // Use router.replace first for faster SPA navigation, then globalLogout for full purge
          router.replace("/login");
          globalLogout().catch(console.error);
        }
      } else if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id, session.user.user_metadata, session.user.email);
        
        // Sync role to cookie for Middleware
        const roleFromMetadata = session.user.user_metadata?.role;
        if (roleFromMetadata) {
          document.cookie = `casec_role=${roleFromMetadata}; path=/; max-age=3600; SameSite=Lax;`;
          document.cookie = `casec_logged_in=true; path=/; max-age=3600; SameSite=Lax;`;
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
        // Sync to cookie for Middleware
        document.cookie = `casec_role=${data.role}; path=/; max-age=3600; SameSite=Lax;`;
        document.cookie = `casec_logged_in=true; path=/; max-age=3600; SameSite=Lax;`;
      } else if (error && error.code === 'PGRST116' && metadata) {
        // Profile doesn't exist yet! Let's create it securely since they are now authenticated.
        const userRole = metadata.role || 'student';
        const { error: insertError } = await supabase
          .from("profiles")
          .upsert({
            id: userId,
            email: email || '',
            role: userRole,
            first_name: metadata.first_name,
            last_name: metadata.last_name,
            company_name: metadata.company_name,
          });
          
        if (!insertError) {
          setRole(userRole as Role);
          // Sync to cookie for Middleware
          document.cookie = `casec_role=${userRole}; path=/; max-age=3600; SameSite=Lax;`;
          document.cookie = `casec_logged_in=true; path=/; max-age=3600; SameSite=Lax;`;
        } else {
          console.error("Error auto-creating profile on first login:", insertError);
        }
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
    }
  };

  const signOut = async () => {
    // 1. Set state to null immediately for reactive UI updates
    setUser(null);
    setRole(null);
    
    // 2. Faster navigation first, then thorough cleanup
    router.replace("/login");
    globalLogout().catch(console.error);
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
