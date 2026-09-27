import { describe, it, expect } from 'vitest';
import {
  checkRateLimit,
  getClientIp,
  rateLimitExceededResponse,
} from '@/lib/rate-limit';

describe('Sliding Window Rate Limiter', () => {
  it('allows requests within limit quota', async () => {
    const key = `test-user-${Date.now()}`;
    const config = { limit: 3, windowMs: 5000 };

    const res1 = await checkRateLimit(key, config);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = await checkRateLimit(key, config);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = await checkRateLimit(key, config);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('rejects requests when limit is exceeded', async () => {
    const key = `test-blocked-${Date.now()}`;
    const config = { limit: 2, windowMs: 10000 };

    await checkRateLimit(key, config); // 1
    await checkRateLimit(key, config); // 2

    const blocked = await checkRateLimit(key, config);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.reset).toBeGreaterThan(Date.now());
  });

  it('generates standard 429 response with RFC headers', async () => {
    const fakeResult = {
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60000,
    };

    const response = rateLimitExceededResponse(fakeResult);
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBeDefined();
    expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
  });

  it('extracts IP correctly from headers', () => {
    const reqWithForwarded = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '198.51.100.1, 10.0.0.1' },
    });
    expect(getClientIp(reqWithForwarded)).toBe('198.51.100.1');

    const reqWithRealIp = new Request('http://localhost', {
      headers: { 'x-real-ip': '203.0.113.195' },
    });
    expect(getClientIp(reqWithRealIp)).toBe('203.0.113.195');

    const fallbackReq = new Request('http://localhost');
    expect(getClientIp(fallbackReq)).toBe('127.0.0.1');
  });
});
