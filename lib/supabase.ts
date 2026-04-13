import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
  console.error("⛔ SUPABASE CONFIGURATION ERROR: NEXT_PUBLIC_SUPABASE_URL is missing or set to a placeholder.");
  console.error("Please create a .env.local file in the root directory with your real Supabase project URL.");
}

if (!supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
  console.error("⛔ SUPABASE CONFIGURATION ERROR: Supabase anon key is missing.");
  console.error("Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
