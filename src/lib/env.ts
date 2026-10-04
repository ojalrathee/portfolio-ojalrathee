
/**
 * Environment variable verification and validation.
 * Verifies that all required environment variables are configured properly.
 * The application will refuse to start if critical variables (database URL, API keys) are missing.
 */

export interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  adminEmail: string;
  isProduction: boolean;
}

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  config?: EnvConfig;
}

export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isProduction = import.meta.env.PROD ?? false;

  // 1. Critical: Supabase URL (Database / API Endpoint)
  if (!supabaseUrl) {
    errors.push('Missing critical environment variable: VITE_SUPABASE_URL (Database / API URL).');
  } else if (
    !supabaseUrl.startsWith('https://') &&
    !(supabaseUrl.startsWith('http://localhost') || supabaseUrl.startsWith('http://127.0.0.1'))
  ) {
    errors.push(
      'Invalid VITE_SUPABASE_URL: Database connection must use HTTPS/TLS in production.'
    );
  } else if (supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project')) {
    errors.push('Invalid VITE_SUPABASE_URL: Contains placeholder text.');
  }

  // 2. Critical: Supabase Public API Key
  if (!supabaseAnonKey) {
    errors.push(
      'Missing critical environment variable: VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY (Client API Key).'
    );
  } else if (
    supabaseAnonKey.includes('placeholder') ||
    supabaseAnonKey.includes('your-supabase')
  ) {
    errors.push('Invalid Supabase API key: Contains placeholder value.');
  }

  // 3. Critical: Admin Email
  if (!adminEmail || !adminEmail.includes('@')) {
    errors.push('Missing critical environment variable: VITE_ADMIN_EMAIL (Administrator account email).');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    errors: [],
    config: {
      supabaseUrl,
      supabaseAnonKey,
      adminEmail: adminEmail.toLowerCase(),
      isProduction,
    },
  };
}

export const envValidation = validateEnvironment();

export function requireEnv(): EnvConfig {
  if (!envValidation.isValid || !envValidation.config) {
    const errorDetails = envValidation.errors.join(' | ');
    throw new Error(
      `[Startup Security Gate] Critical environment variable missing: ${errorDetails}. Application refused to start.`
    );
  }
  return envValidation.config;
}
