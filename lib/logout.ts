import { supabase } from "./supabase";

/**
 * Centralized logout utility for the entire application.
 * Ensures Supabase session, localStorage, and auth cookies are fully cleared.
 * Finally redirects to /login to ensure a clean state.
 */
let isLoggingOut = false;

/**
 * Centralized logout utility for the entire application.
 * Ensures Supabase session, localStorage, and auth cookies are fully cleared.
 * Finally redirects to /login to ensure a clean state.
 */
export async function globalLogout() {
  if (isLoggingOut) return;
  isLoggingOut = true;

  try {
    // 1. Clear all local state and cookies IMMEDIATELY (before network request)
    if (typeof window !== "undefined") {
      // Clear all storage types
      localStorage.clear();
      sessionStorage.clear();

      // Thoroughly clear auth-related cookies with all common patterns
      const cookiesToClear = [
        "casec_role", 
        "casec_logged_in", 
        "sb-access-token", 
        "sb-refresh-token",
        "supabase-auth-token"
      ];
      
      cookiesToClear.forEach(cookieName => {
        // Clear for current path and root path
        const base = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        document.cookie = `${base} path=/;`;
        document.cookie = `${base} path=/; SameSite=Lax;`;
        document.cookie = `${base} path=/; SameSite=Strict;`;
        // Handle common domain variants if applicable (though path=/ is usually enough)
        document.cookie = `${base} path=/; domain=${window.location.hostname};`;
      });

      // 2. Start Supabase sign out (async, we don't necessarily need to await it before redirecting if it's slow)
      // but we do it to be a "good citizen" to the server.
      try {
        await Promise.race([
          supabase.auth.signOut({ scope: "global" }),
          new Promise((resolve) => setTimeout(resolve, 500)) // Don't wait more than 500ms for the network
        ]);
      } catch (err) {
        console.warn("SignOut request failed or timed out, proceeding with local logout", err);
      }

      // 3. Force a full page reload to /login to purge all in-memory state
      // This is the absolute hammer to ensure no dashboard state remains.
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Error during global logout:", error);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } finally {
    // We don't reset isLoggingOut because we are redirecting anyway.
  }
}
