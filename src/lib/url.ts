/**
 * URL and link sanitization utilities.
 * Protects against DOM XSS via javascript:, data:, and vbscript: URI schemes in href attributes.
 */

/**
 * Validates and sanitizes a URL for use in href attributes.
 * Allows only http:, https:, mailto:, or relative path (/) links.
 * Returns '#' if the URL is invalid or uses an unsafe protocol.
 */
export function sanitizeHref(url: string | null | undefined, fallback = '#'): string {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();

  // Explicitly deny javascript:, data:, vbscript: protocols
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return fallback;
  }

  // Allow only safe protocols or safe relative paths
  if (/^(https?:\/\/|mailto:|\/)/i.test(trimmed)) {
    return trimmed;
  }

  // If a raw domain is passed (e.g. "github.com/user"), prefix with https://
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return fallback;
}

export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return /^(https?:\/\/|mailto:|\/)/i.test(trimmed) && !/^(javascript|data|vbscript):/i.test(trimmed);
}
