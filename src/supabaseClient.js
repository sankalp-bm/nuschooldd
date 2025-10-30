import { createClient } from '@supabase/supabase-js';

// Get keys from the .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the connection client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Now, any file can import and use 'supabase' to talk to the database.