import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  signSessionToken,
  verifySessionToken,
  hashPassword,
  verifyPassword,
  getJwtSecret,
  type AuthUser,
} from '@/lib/auth';
import { Permission, UserRole } from '@/lib/permissions';

describe('Auth & Session Security', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'industrial_test_secret_at_least_32_characters_long_123';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('retrieves JWT secret from environment correctly', () => {
    const secretBytes = getJwtSecret();
    expect(secretBytes).toBeInstanceOf(Uint8Array);
    expect(secretBytes.length).toBeGreaterThanOrEqual(32);
  });

  it('signs and verifies JWT session tokens with bitmask role', async () => {
    const testUser: AuthUser = {
      id: 'usr-12345',
      email: 'warehouse-manager@example.com',
      name: 'مدیر انبار مرکزی',
      role: Permission.VIEW_INVENTORY | Permission.EDIT_STOCK | Permission.ADD_PRODUCT,
    };

    const token = await signSessionToken(testUser);
    expect(token).toBeTypeOf('string');
    expect(token.split('.')).toHaveLength(3);

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(testUser.id);
    expect(verified?.email).toBe(testUser.email);
    expect(verified?.name).toBe(testUser.name);
    expect(verified?.role).toBe(testUser.role);
  });

  it('signs and verifies Super Admin role (255)', async () => {
    const adminUser: AuthUser = {
      id: 'admin-1',
      email: 'admin@anbar.local',
      name: 'مدیر کل',
      role: UserRole.ADMIN,
    };

    const token = await signSessionToken(adminUser);
    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.role).toBe(255);
  });

  it('rejects tampered or forged tokens', async () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-z...invalid';
    const result = await verifySessionToken(fakeToken);
    expect(result).toBeNull();
  });

  it('hashes and securely verifies plain passwords', async () => {
    const password = 'IndustrialPassword2026!';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2')).toBe(true); // bcrypt prefix

    const isMatch = await verifyPassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword('WrongPassword123', hash);
    expect(isWrongMatch).toBe(false);
  });
});
