import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { rateLimiter } from '@/lib/rateLimiter';
import { toSafeErrorMessage } from '@/lib/error';

const ALLOWED_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // 1. Enforce rate limiting: Minimum 5 attempts per minute
    const limitCheck = rateLimiter.checkLogin();
    if (!limitCheck.allowed) {
      return { error: limitCheck.errorMessage || 'Too many login attempts. Please wait before retrying.' };
    }

    // 2. Validate email address matches operator
    if (email.toLowerCase() !== ALLOWED_EMAIL) {
      rateLimiter.recordLoginAttempt();
      return { error: 'Invalid credentials.' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        rateLimiter.recordLoginAttempt();
        return { error: toSafeErrorMessage(error, 'Invalid credentials.') };
      }

      // Successful authentication resets rate limit counters
      rateLimiter.resetLogin();
      return { error: null };
    } catch (err) {
      rateLimiter.recordLoginAttempt();
      return { error: toSafeErrorMessage(err, 'Authentication failed. Please try again.') };
    }
  };

  const resetPassword = async (email: string) => {
    // Enforce rate limiting: Minimum 3 attempts per hour on password reset
    const limitCheck = rateLimiter.checkPasswordReset();
    if (!limitCheck.allowed) {
      return { error: limitCheck.errorMessage || 'Too many password reset attempts. Please wait.' };
    }

    rateLimiter.recordPasswordResetAttempt();

    if (email.toLowerCase() !== ALLOWED_EMAIL) {
      // Return safe message without leaking email existence
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { error: toSafeErrorMessage(error, 'Unable to process password reset request.') };
      }
      return { error: null };
    } catch (err) {
      return { error: toSafeErrorMessage(err, 'Unable to process password reset request.') };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut({ scope: 'global' });
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signIn, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
