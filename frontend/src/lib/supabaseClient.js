import { createClient } from '@supabase/supabase-js';

// These are loaded from your .env file (REACT_APP_ prefix required by Create React App)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL') {
    console.warn(
        '⚠️  Supabase URL is not set. Open frontend/.env and paste your REACT_APP_SUPABASE_URL.'
    );
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn(
        '⚠️  Supabase Anon Key is not set. Open frontend/.env and paste your REACT_APP_SUPABASE_ANON_KEY.'
    );
}

/**
 * Pre-configured Supabase client.
 *
 * Usage anywhere in the app:
 *   import supabase from '../lib/supabaseClient';
 *
 *   // Query example
 *   const { data, error } = await supabase.from('patients').select('*');
 *
 *   // Auth example
 *   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
 */
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
