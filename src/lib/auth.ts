import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const SESSION_COOKIE_NAME = 'anbar_session';
const JWT_SECRET_STRING = process.env.JWT_SECRET || 'anbar_default_secure_key_32_characters_long_min!';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: number; // Integer bitmask permissions
}

/**
 * Hash plain text password with bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify plain text password against bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign JWT session token containing user payload and bitmask role
 */
export async function signSessionToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify JWT session token and extract AuthUser payload
 */
export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.id || typeof payload.role !== 'number') {
      return null;
    }

    return {
      id: payload.id as string,
      email: (payload.email as string) || '',
      name: (payload.name as string | null) || null,
      role: payload.role as number,
    };
  } catch {
    return null;
  }
}

/**
 * Read and verify session user from cookies in Server Components or API Routes
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
