/**
 * ============================================
 * SECURITY UTILITIES
 * Centralized security functions for Zero Graph
 * ============================================
 */

// ============================================
// Content Security Policy (CSP) Configuration
// ============================================

/**
 * CSP directives for production deployment
 * To be added to server response headers or meta tag
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in dev, consider removing in strict prod
    "https://ai.gateway.lovable.dev",
    "https://*.supabase.co",
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind/styled-components
    "https://fonts.googleapis.com",
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
    "data:",
  ],
  'img-src': [
    "'self'",
    "data:",
    "blob:",
    "https://*.supabase.co",
    "https://images.unsplash.com",
  ],
  'connect-src': [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://ai.gateway.lovable.dev",
  ],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': [],
} as const;

/**
 * Generate CSP header string from directives
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => {
      if (values.length === 0) return directive;
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

// ============================================
// Security Headers Configuration
// ============================================

/**
 * Recommended security headers for deployment
 * Add these to your CDN/hosting configuration (Cloudflare, Vercel, etc.)
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy - limit referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // HSTS - force HTTPS (2 years)
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // Permissions policy - restrict browser features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self)',
  
  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
} as const;

// ============================================
// Password Strength Validation
// ============================================

export interface PasswordStrengthResult {
  score: number; // 0-4 (0 = very weak, 4 = very strong)
  feedback: string[];
  isStrong: boolean;
}

/**
 * Evaluate password strength
 * Implements NIST SP 800-63B guidelines
 */
export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  // Length check (most important factor)
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters');
  }

  // Character variety
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasLowercase) feedback.push('Add lowercase letters');
  if (!hasUppercase) feedback.push('Add uppercase letters');
  if (!hasNumbers) feedback.push('Add numbers');
  
  if (hasLowercase && hasUppercase && hasNumbers) score++;
  if (hasSpecial) score++;

  // Common patterns to avoid
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^admin/i,
    /(.)\1{3,}/, // Repeated characters (4+)
    /^[a-z]+$/i, // Only letters
    /^[0-9]+$/, // Only numbers
  ];

  const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
  if (hasCommonPattern) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common patterns and sequences');
  }

  return {
    score: Math.min(4, Math.max(0, score)),
    feedback,
    isStrong: score >= 3 && password.length >= 8,
  };
}

// ============================================
// Session Security
// ============================================

/**
 * Session timeout configuration (in milliseconds)
 */
export const SESSION_CONFIG = {
  // Idle timeout: 30 minutes
  IDLE_TIMEOUT_MS: 30 * 60 * 1000,
  
  // Absolute timeout: 24 hours
  ABSOLUTE_TIMEOUT_MS: 24 * 60 * 60 * 1000,
  
  // Warning before timeout: 5 minutes
  WARNING_BEFORE_MS: 5 * 60 * 1000,
} as const;

/**
 * Track user activity for session timeout
 */
export class SessionActivityTracker {
  private lastActivityTime: number;
  private sessionStartTime: number;
  private timeoutCallback?: () => void;
  private warningCallback?: () => void;
  private checkInterval?: number;

  constructor() {
    this.lastActivityTime = Date.now();
    this.sessionStartTime = Date.now();
  }

  start(onTimeout: () => void, onWarning?: () => void): void {
    this.timeoutCallback = onTimeout;
    this.warningCallback = onWarning;
    this.sessionStartTime = Date.now();
    this.recordActivity();
    
    // Check every minute
    this.checkInterval = window.setInterval(() => this.checkTimeout(), 60000);
    
    // Listen for user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, () => this.recordActivity(), { passive: true });
    });
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private recordActivity(): void {
    this.lastActivityTime = Date.now();
  }

  private checkTimeout(): void {
    const now = Date.now();
    const idleTime = now - this.lastActivityTime;
    const sessionDuration = now - this.sessionStartTime;

    // Check absolute timeout
    if (sessionDuration >= SESSION_CONFIG.ABSOLUTE_TIMEOUT_MS) {
      this.timeoutCallback?.();
      return;
    }

    // Check idle timeout
    if (idleTime >= SESSION_CONFIG.IDLE_TIMEOUT_MS) {
      this.timeoutCallback?.();
      return;
    }

    // Warning check
    const timeUntilIdleTimeout = SESSION_CONFIG.IDLE_TIMEOUT_MS - idleTime;
    if (timeUntilIdleTimeout <= SESSION_CONFIG.WARNING_BEFORE_MS && timeUntilIdleTimeout > 0) {
      this.warningCallback?.();
    }
  }
}

// ============================================
// CSRF Protection
// ============================================

/**
 * Generate a CSRF token for forms
 * Note: Primary CSRF protection is handled by Supabase Auth
 * This provides additional defense-in-depth
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store and retrieve CSRF token from session storage
 */
export const csrfTokenManager = {
  TOKEN_KEY: 'csrf_token',
  
  generate(): string {
    const token = generateCSRFToken();
    sessionStorage.setItem(this.TOKEN_KEY, token);
    return token;
  },
  
  get(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  },
  
  validate(token: string): boolean {
    const storedToken = this.get();
    if (!storedToken || !token) return false;
    
    // Constant-time comparison to prevent timing attacks
    if (storedToken.length !== token.length) return false;
    
    let result = 0;
    for (let i = 0; i < storedToken.length; i++) {
      result |= storedToken.charCodeAt(i) ^ token.charCodeAt(i);
    }
    return result === 0;
  },
  
  regenerate(): string {
    sessionStorage.removeItem(this.TOKEN_KEY);
    return this.generate();
  },
};

// ============================================
// Secure Cookie Configuration
// ============================================

/**
 * Secure cookie options
 * Note: Supabase handles auth cookies, these are for custom cookies
 */
export const COOKIE_OPTIONS = {
  // Prevent JavaScript access
  httpOnly: true,
  
  // HTTPS only in production
  secure: window.location.protocol === 'https:',
  
  // Strict same-site policy
  sameSite: 'strict' as const,
  
  // Path restriction
  path: '/',
  
  // Default expiry: 7 days
  maxAge: 7 * 24 * 60 * 60,
} as const;

// ============================================
// XSS Prevention Utilities
// ============================================

/**
 * Sanitize HTML content for safe rendering
 * Use this when you must render user-provided HTML
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Encode special characters for safe HTML insertion
 */
export function encodeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize URLs
 * Prevents javascript: and data: URI attacks
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.warn('Blocked unsafe URL protocol:', parsed.protocol);
      return null;
    }
    
    return parsed.href;
  } catch {
    // Invalid URL
    return null;
  }
}

// ============================================
// Rate Limiting (Client-Side)
// ============================================

/**
 * Client-side rate limiter for form submissions
 * Provides user feedback; server-side enforcement is primary
 */
export class ClientRateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  canAttempt(key: string): { allowed: boolean; waitMs: number } {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      const oldestAttempt = Math.min(...recentAttempts);
      const waitMs = this.windowMs - (now - oldestAttempt);
      return { allowed: false, waitMs };
    }
    
    // Record this attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return { allowed: true, waitMs: 0 };
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// ============================================
// Security Event Logging
// ============================================

export interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit' | 'validation_error' | 'suspicious_activity';
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

/**
 * Log security events for monitoring
 * In production, send these to your logging service
 */
export function logSecurityEvent(event: SecurityEvent): void {
  // In development, log to console
  console.warn('[SECURITY EVENT]', {
    ...event,
    timestamp: new Date(event.timestamp).toISOString(),
  });
  
  // In production, you would send to a logging service:
  // sendToLoggingService(event);
}

// ============================================
// Trusted Types (if supported)
// ============================================

/**
 * Check if Trusted Types are supported
 */
export function isTrustedTypesSupported(): boolean {
  return typeof (window as unknown as { trustedTypes?: unknown }).trustedTypes !== 'undefined';
}
