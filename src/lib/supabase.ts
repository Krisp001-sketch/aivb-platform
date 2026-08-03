import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Client for public / authenticated user requests in client components.
// Uses @supabase/ssr to automatically persist auth tokens in HTTP cookies.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Admin Client for secure backend API routes only (bypasses RLS safely on server).
// Kept separate using standard createClient with service role key.
export const getSupabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY in environment variables"
    );
  }
  return createClient(supabaseUrl, serviceRoleKey);
};