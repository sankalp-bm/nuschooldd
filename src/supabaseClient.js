import { createClient } from '@supabase/supabase-js';

// Fetch keys using the Vite-required VITE_ prefix
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

// FINAL ROBUST CHECK: Prevents Vercel from crashing if keys are missing
if (supabaseUrl && supabaseAnonKey) {
    // Keys are present, create the live client
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Keys are missing, export a dummy client to prevent app crash
    console.error("SUPABASE ERROR: Environment variables are missing or incorrect. Check Vercel settings.");
    
    // Create a dummy client that returns errors instead of crashing
    supabase = {
        from: (tableName) => ({ 
            select: () => ({ 
                data: [], 
                error: { message: `Supabase keys missing. Cannot connect to ${tableName}.` } 
            }),
            insert: () => ({ error: { message: "Supabase keys missing." } }),
            delete: () => ({ error: { message: "Supabase keys missing." } })
        })
    };
}

// Export the variable outside the block to satisfy module requirements
export { supabase };
