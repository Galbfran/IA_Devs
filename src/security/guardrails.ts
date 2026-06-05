export interface GuardrailResult {
  safe: boolean;
  reason?: string;
  sanitized: string;
}

export interface RateLimiterConfig {
  mazRequests: number;
  windowMs: number;
}
