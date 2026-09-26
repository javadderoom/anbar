import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'anbar_session';
const JWT_SECRET_STRING = process.env.JWT_SECRET || 'anbar_default_secure_key_32_characters_long_min!';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

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
      const { payload } = await jwtVerify(sessionCookie, JWT_SECRET);
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

  // Public customer catalog routes (/c/[token])
  if (pathname.startsWith('/c/')) {
    return NextResponse.next();
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
