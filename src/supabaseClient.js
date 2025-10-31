import { createClient } from '@supabase/supabase-js';

// Get keys from the Vercel environment variables (VITE_ prefix for Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- CRITICAL FIX: Add a check for the existence of keys ---
// This prevents the application from crashing on Vercel if the keys are missing or delayed.
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing! Check Vercel settings.");
    // Export a dummy object to prevent app crash
    const dummySupabase = {
        from: () => ({ 
            select: () => ({ data: [], error: { message: "Keys missing." } }),
            insert: () => ({ error: { message: "Keys missing." } }),
            delete: () => ({ error: { message: "Keys missing." } })
        })
    };
    export const supabase = dummySupabase;
} else {
    // Create the actual connection client
    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Now, any file can import and use 'supabase' to talk to the database without crashing.