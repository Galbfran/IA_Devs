export interface GuardrailResult {
  safe: boolean;
  reason?: string;
  sanitized: string;
}

export interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private timestamps: number[] = [];
  constructor(private config: RateLimiterConfig) {}
  check(): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    this.timestamps = this.timestamps.filter((t) => t > windowStart);
    if (this.timestamps.length >= this.config.maxRequests) {
      return false;
    }
    return true;
  }
  reset(): void {
    this.timestamps = [];
  }
  get remaining(): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const active = this.timestamps.filter((t) => t > windowStart).length;
    return Math.max(0, this.config.maxRequests - active);
  }
}

export function sanitizeInput(input: string): string {
  const MAX_LENGTH = 8_000;
  let result = input
    .replace(/\0/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[\x00-\x1F\x7F]/g, "");
  if (result.length > MAX_LENGTH) {
    result = result.slice(0, MAX_LENGTH) + "\n El texto supera las 8.000 lines";
  }
  return result;
}
