import { describe, it, expect } from 'vitest';
import {
  Permission,
  UserRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from '@/lib/permissions';

describe('Bitmask Numeric Permissions System', () => {
  it('identifies exact discrete bit values', () => {
    expect(Permission.VIEW_INVENTORY).toBe(1);
    expect(Permission.EDIT_STOCK).toBe(2);
    expect(Permission.ADD_PRODUCT).toBe(4);
    expect(Permission.DELETE_PRODUCT).toBe(8);
    expect(Permission.MANAGE_LINKS).toBe(16);
    expect(Permission.CONVERT_ORDERS).toBe(32);
    expect(Permission.MANAGE_SETTINGS).toBe(64);
    expect(Permission.MANAGE_USERS).toBe(128);
    expect(UserRole.ADMIN).toBe(255);
  });

  it('allows ADMIN (255) to perform all warehouse operations', () => {
    const adminMask = UserRole.ADMIN;
    expect(hasPermission(adminMask, Permission.VIEW_INVENTORY)).toBe(true);
    expect(hasPermission(adminMask, Permission.EDIT_STOCK)).toBe(true);
    expect(hasPermission(adminMask, Permission.ADD_PRODUCT)).toBe(true);
    expect(hasPermission(adminMask, Permission.DELETE_PRODUCT)).toBe(true);
    expect(hasPermission(adminMask, Permission.MANAGE_LINKS)).toBe(true);
    expect(hasPermission(adminMask, Permission.CONVERT_ORDERS)).toBe(true);
    expect(hasPermission(adminMask, Permission.MANAGE_SETTINGS)).toBe(true);
    expect(hasPermission(adminMask, Permission.MANAGE_USERS)).toBe(true);
  });

  it('restricts warehouse staff to authorized operations only', () => {
    // Staff with only VIEW_INVENTORY and EDIT_STOCK (1 | 2 = 3)
    const staffMask = Permission.VIEW_INVENTORY | Permission.EDIT_STOCK;

    expect(hasPermission(staffMask, Permission.VIEW_INVENTORY)).toBe(true);
    expect(hasPermission(staffMask, Permission.EDIT_STOCK)).toBe(true);
    expect(hasPermission(staffMask, Permission.ADD_PRODUCT)).toBe(false);
    expect(hasPermission(staffMask, Permission.DELETE_PRODUCT)).toBe(false);
    expect(hasPermission(staffMask, Permission.MANAGE_SETTINGS)).toBe(false);
  });

  it('evaluates hasAnyPermission correctly', () => {
    const orderManagerMask = Permission.CONVERT_ORDERS; // 32
    expect(
      hasAnyPermission(orderManagerMask, [Permission.DELETE_PRODUCT, Permission.CONVERT_ORDERS])
    ).toBe(true);
    expect(
      hasAnyPermission(orderManagerMask, [Permission.DELETE_PRODUCT, Permission.MANAGE_SETTINGS])
    ).toBe(false);
  });

  it('evaluates hasAllPermissions correctly', () => {
    const managerMask = Permission.VIEW_INVENTORY | Permission.EDIT_STOCK | Permission.ADD_PRODUCT;
    expect(
      hasAllPermissions(managerMask, [Permission.VIEW_INVENTORY, Permission.EDIT_STOCK])
    ).toBe(true);
    expect(
      hasAllPermissions(managerMask, [Permission.VIEW_INVENTORY, Permission.DELETE_PRODUCT])
    ).toBe(false);
  });
});
