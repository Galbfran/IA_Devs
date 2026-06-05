import { INJECTION_PATTERNS } from "./injection-patterns.js";

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

export function detectPromptInjection(input: string): {
  detected: boolean;
  pattern?: string;
} {
  for (const { name, regex } of INJECTION_PATTERNS) {
    if (regex.test(input)) {
      return { detected: true, pattern: name };
    }
  }

  return {
    detected: false,
  };
}

export function checkGuardrails(
  input: string,
  rateLimiter: RateLimiter,
): GuardrailResult {
  const sanitized = sanitizeInput(input);
  const injectionCheck = detectPromptInjection(input);
  if (injectionCheck.detected) {
    return {
      safe: false,
      reason:
        "Tu mensaje contiene patrones que intentan modificar el comprotamiento del asistente",
      sanitized,
    };
  }
  if (!rateLimiter.check()) {
    return {
      safe: false,
      reason: "Demasiadas solicitudes en poco tiempo",
      sanitized,
    };
  }
  return {
    safe: true,
    sanitized: sanitized,
  };
}

export function createRateLimiter(
  config?: Partial<RateLimiterConfig>,
): RateLimiter {
  return new RateLimiter({
    maxRequests: config?.maxRequests ?? 10,
    windowMs: config?.windowMs ?? 60_000,
  });
}
