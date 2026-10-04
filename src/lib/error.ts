/**
 * Safe error handling and sanitization utility.
 * Guarantees that no stack traces, database query details, file paths,
 * or internal server/database schema details leak to the client UI.
 * Returns generic messages accompanied by a unique correlation ID.
 * Detailed internal diagnostics are restricted to server-side / console error logs.
 */

export interface SafeErrorResult {
  message: string;
  correlationId: string;
}

export function generateCorrelationId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `err_${timestamp}_${randomPart}`;
}

// Patterns that identify internal database, network, or server info that must NEVER be exposed to clients
const SENSITIVE_PATTERNS = [
  /pgrst/i,
  /postgres/i,
  /syntax error/i,
  /relation .* does not exist/i,
  /column .* does not exist/i,
  /violates .* constraint/i,
  /duplicate key/i,
  /foreign key/i,
  /null value in column/i,
  /permission denied/i,
  /at file:\/\//i,
  /at \/.*/i,
  /stack trace/i,
  /node_modules/i,
  /supabase/i,
  /jwt/i,
  /bearer/i,
  /sql/i,
  /table/i,
  /schema/i,
  /42[0-9a-z]{3}/i, // Postgres SQLSTATE syntax/data exception codes
  /23[0-9a-z]{3}/i, // Postgres integrity constraint violation codes
];

// Whitelist of user-safe validation messages
const SAFE_USER_MESSAGES = [
  'Invalid credentials.',
  'Title is required.',
  'Title and description are required.',
  'Title, issuer, and issue date are required.',
  'Image must be JPEG, PNG, WebP, or AVIF.',
  'File size exceeds 5MB limit.',
  'Too many attempts. Please try again later.',
  'Too many login attempts. Please wait before trying again.',
  'Too many password reset attempts. Please wait before trying again.',
];

export function formatSafeError(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred. Please try again later.'
): SafeErrorResult {
  const correlationId = generateCorrelationId();

  // Extract raw error message
  let rawMessage = '';
  let stack: string | undefined;

  if (error instanceof Error) {
    rawMessage = error.message;
    stack = error.stack;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    rawMessage = String((error as { message: unknown }).message);
  } else if (typeof error === 'string') {
    rawMessage = error;
  }

  // Server-side / operator logging (restricted; never sent in client UI response)
  if (import.meta.env.DEV) {
    console.error(`[Security Log] [${correlationId}]`, {
      error: rawMessage,
      stack,
      raw: error,
    });
  }

  // Check if error contains sensitive patterns
  const isSensitive = SENSITIVE_PATTERNS.some((pattern) => pattern.test(rawMessage));

  // Check if message is a clean, pre-approved safe user-facing message
  const isWhitelisted = SAFE_USER_MESSAGES.some(
    (safe) => safe.toLowerCase() === rawMessage.trim().toLowerCase()
  );

  if (isWhitelisted && !isSensitive) {
    return {
      message: `${rawMessage} (Ref: ${correlationId})`,
      correlationId,
    };
  }

  // Otherwise, return a safe generic message with the correlation ID
  return {
    message: `${fallbackMessage} (Ref: ${correlationId})`,
    correlationId,
  };
}

export function toSafeErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred. Please try again later.'
): string {
  return formatSafeError(error, fallbackMessage).message;
}
