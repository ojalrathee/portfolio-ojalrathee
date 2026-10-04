/**
 * Client-side Rate Limiting Engine.
 * Enforces strict attempt thresholds on authentication and sensitive forms:
 * - Login: Maximum 5 attempts per minute (60s).
 * - Password Reset: Maximum 3 attempts per hour (3600s).
 * - Contact Dispatch: Maximum 5 messages per 10 minutes (600s).
 *
 * Tracks attempts with sliding-window timestamps stored in browser session storage.
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  label: string;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  'auth:login': {
    maxAttempts: 5,
    windowMs: 60 * 1000, // 1 minute
    label: 'login',
  },
  'auth:password_reset': {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    label: 'password reset',
  },
  'contact:submit': {
    maxAttempts: 5,
    windowMs: 10 * 60 * 1000, // 10 minutes
    label: 'message submission',
  },
};

interface RateLimitRecord {
  timestamps: number[];
}

function getStorageKey(actionKey: string): string {
  return `rate_limit:${actionKey}`;
}

function getStoredTimestamps(actionKey: string): number[] {
  try {
    const raw = sessionStorage.getItem(getStorageKey(actionKey));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RateLimitRecord;
    return Array.isArray(parsed.timestamps) ? parsed.timestamps : [];
  } catch {
    return [];
  }
}

function saveStoredTimestamps(actionKey: string, timestamps: number[]): void {
  try {
    sessionStorage.setItem(
      getStorageKey(actionKey),
      JSON.stringify({ timestamps })
    );
  } catch {
    // Ignore storage quota or disabled storage errors
  }
}

export interface RateLimitCheckResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
  errorMessage?: string;
}

export function checkRateLimit(actionKey: string): RateLimitCheckResult {
  const config = RATE_LIMIT_CONFIGS[actionKey];
  if (!config) {
    return { allowed: true, remainingAttempts: 999, retryAfterSeconds: 0 };
  }

  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Filter timestamps within current sliding window
  const activeTimestamps = getStoredTimestamps(actionKey).filter((t) => t > windowStart);

  if (activeTimestamps.length >= config.maxAttempts) {
    // Oldest attempt in window determines when the next slot frees up
    const oldestTimestamp = Math.min(...activeTimestamps);
    const retryAfterMs = oldestTimestamp + config.windowMs - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

    const unit = retryAfterSeconds > 60
      ? `${Math.ceil(retryAfterSeconds / 60)} minute(s)`
      : `${retryAfterSeconds} second(s)`;

    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
      errorMessage: `Too many ${config.label} attempts. Rate limit exceeded. Please wait ${unit} before retrying.`,
    };
  }

  return {
    allowed: true,
    remainingAttempts: config.maxAttempts - activeTimestamps.length,
    retryAfterSeconds: 0,
  };
}

export function recordAttempt(actionKey: string): RateLimitCheckResult {
  const config = RATE_LIMIT_CONFIGS[actionKey];
  if (!config) {
    return { allowed: true, remainingAttempts: 999, retryAfterSeconds: 0 };
  }

  const now = Date.now();
  const windowStart = now - config.windowMs;
  const activeTimestamps = getStoredTimestamps(actionKey).filter((t) => t > windowStart);

  activeTimestamps.push(now);
  saveStoredTimestamps(actionKey, activeTimestamps);

  return checkRateLimit(actionKey);
}

export function resetRateLimit(actionKey: string): void {
  try {
    sessionStorage.removeItem(getStorageKey(actionKey));
  } catch {
    // Ignore
  }
}

// Specialized helpers for authentication
export const rateLimiter = {
  checkLogin(): RateLimitCheckResult {
    return checkRateLimit('auth:login');
  },
  recordLoginAttempt(): RateLimitCheckResult {
    return recordAttempt('auth:login');
  },
  resetLogin(): void {
    resetRateLimit('auth:login');
  },

  checkPasswordReset(): RateLimitCheckResult {
    return checkRateLimit('auth:password_reset');
  },
  recordPasswordResetAttempt(): RateLimitCheckResult {
    return recordAttempt('auth:password_reset');
  },
  resetPasswordReset(): void {
    resetRateLimit('auth:password_reset');
  },

  checkContactSubmit(): RateLimitCheckResult {
    return checkRateLimit('contact:submit');
  },
  recordContactSubmit(): RateLimitCheckResult {
    return recordAttempt('contact:submit');
  },
};
