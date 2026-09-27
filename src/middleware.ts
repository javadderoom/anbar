import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_PRESETS,
  rateLimitExceededResponse,
  withRateLimitHeaders,
} from '@/lib/rate-limit';

const SESSION_COOKIE_NAME = 'anbar_session';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'test') {
      return new TextEncoder().encode('test_jwt_secret_must_be_at_least_32_characters_long');
    }
    throw new Error('FATAL: JWT_SECRET environment variable is missing.');
  }
  return new TextEncoder().encode(secret);
}

// Paths accessible to the public without authentication
const PUBLIC_PATHS = ['/login', '/c'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets & Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Read session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, getJwtSecret());
      if (payload.id && typeof payload.role === 'number') {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // If authenticated user navigates to /login, redirect to /admin
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Public customer catalog routes (/c/[token]) with scraper rate limiting (60 req/min)
  if (pathname.startsWith('/c/')) {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`catalog:${clientIp}`, RATE_LIMIT_PRESETS.CATALOG_BROWSE);
    if (!rateLimit.success) {
      return rateLimitExceededResponse(
        rateLimit,
        'تعداد درخواست‌های مشاهده کاتالوگ بیش از حد مجاز است. لطفاً یک دقیقه دیگر مراجعه نمایید.'
      );
    }
    const res = NextResponse.next();
    return withRateLimitHeaders(res, rateLimit);
  }

  // Public customer order submission API (POST /api/requests) & catalog products (GET /api/products)
  if (pathname === '/api/requests' && request.method === 'POST') {
    return NextResponse.next();
  }
  if (pathname === '/api/products' && request.method === 'GET') {
    return NextResponse.next();
  }

  // Protected Admin Pages (/admin and sub-routes)
  if (pathname.startsWith('/admin') || pathname === '/') {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protected Admin Mutation APIs
  if (pathname.startsWith('/api/')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          code: 'UNAUTHORIZED',
          message: 'دسترسی غیرمجاز. لطفاً وارد حساب کاربری خود شوید.',
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
