import { NextResponse, type NextRequest } from 'next/server';

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory sliding-window store
interface WindowRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, WindowRecord>();
const MAX_STORE_SIZE = 10000;

// Periodic cleanup to prevent memory bloat (runs every 60s)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 900000); // 15 mins max
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000);
}

/**
 * Extracts client IP from incoming request headers
 */
export function getClientIp(request: Request | NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();
  return '127.0.0.1';
}

/**
 * Standard Presets for different action types
 */
export const RATE_LIMIT_PRESETS = {
  // Quote submission: 5 orders per 10 minutes per IP
  QUOTE_SUBMIT: { limit: 5, windowMs: 10 * 60 * 1000 },
  // Auth login attempts: 5 attempts per 15 minutes per IP (brute-force defense)
  AUTH_LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 },
  // Customer catalog browsing: 60 requests per minute per IP
  CATALOG_BROWSE: { limit: 60, windowMs: 60 * 1000 },
  // General public API calls: 100 requests per minute per IP
  GENERAL_API: { limit: 100, windowMs: 60 * 1000 },
} as const;

/**
 * Evaluates rate limit against sliding window
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Optional: Check if Upstash Redis credentials are provided in env
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      // Execute atomic sliding window check via Upstash REST API pipeline
      const pipelineRes = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['ZREMRANGEBYSCORE', key, '-inf', windowStart],
          ['ZADD', key, now, `${now}-${Math.random()}`],
          ['ZCARD', key],
          ['PEXPIRE', key, config.windowMs],
        ]),
      });

      if (pipelineRes.ok) {
        const pipelineData = await pipelineRes.json();
        const currentCount = pipelineData[2]?.result ?? 1;
        const success = currentCount <= config.limit;
        const remaining = Math.max(0, config.limit - currentCount);
        const reset = now + config.windowMs;

        return { success, limit: config.limit, remaining, reset };
      }
    } catch {
      // Fallback to in-memory store if network/Upstash is unavailable
    }
  }

  // In-memory sliding window algorithm
  let record = rateLimitStore.get(key);
  if (!record) {
    if (rateLimitStore.size >= MAX_STORE_SIZE) {
      // Purge oldest key
      const firstKey = rateLimitStore.keys().next().value;
      if (firstKey) rateLimitStore.delete(firstKey);
    }
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= config.limit) {
    const oldestTimestamp = record.timestamps[0];
    const reset = oldestTimestamp + config.windowMs;
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset,
    };
  }

  // Add current hit
  record.timestamps.push(now);
  const remaining = config.limit - record.timestamps.length;
  const reset = now + config.windowMs;

  return {
    success: true,
    limit: config.limit,
    remaining,
    reset,
  };
}

/**
 * Constructs a standard 429 Too Many Requests response with RFC 6585 headers
 */
export function rateLimitExceededResponse(
  result: RateLimitResult,
  customMessage = 'تعداد درخواست‌های ارسالی بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش نمایید.'
): NextResponse {
  const retryAfterSec = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));

  return NextResponse.json(
    {
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: customMessage,
      retryAfter: retryAfterSec,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSec),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
      },
    }
  );
}

/**
 * Appends RateLimit headers to an existing successful response
 */
export function withRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.reset / 1000)));
  return response;
}
