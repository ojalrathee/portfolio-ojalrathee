import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { envValidation } from './env';

export const isConfigured = envValidation.isValid;

// If environment variables are missing or invalid, fall back to safe placeholder endpoints.
// The startup gate in main.tsx guarantees the application will refuse to start and mount.
const supabaseUrl = envValidation.config?.supabaseUrl || 'https://unconfigured.supabase.co';
const supabaseAnonKey = envValidation.config?.supabaseAnonKey || 'unconfigured';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
