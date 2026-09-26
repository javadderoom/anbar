/**
 * Industrial Bitmask Permissions System for Anbar
 * Each permission is represented as a single bit (power of 2: 1 << n).
 */

export const Permission = {
  VIEW_INVENTORY:  1 << 0, //   1 (0b00000001) - Read catalog products & stock
  EDIT_STOCK:      1 << 1, //   2 (0b00000010) - Adjust inventory counts & details
  ADD_PRODUCT:     1 << 2, //   4 (0b00000100) - Create new products & import Excel
  DELETE_PRODUCT:  1 << 3, //   8 (0b00001000) - Delete products permanently
  MANAGE_LINKS:    1 << 4, //  16 (0b00010000) - Generate & copy client catalog tokens
  CONVERT_ORDERS:  1 << 5, //  32 (0b00100000) - Convert quote requests into invoices & deduct stock
  MANAGE_SETTINGS: 1 << 6, //  64 (0b01000000) - Edit business profile, units, and system settings
  MANAGE_USERS:    1 << 7, // 128 (0b10000000) - Manage operators and assign permission bitmasks
} as const;

export type PermissionKey = keyof typeof Permission;

/**
 * Composite Pre-configured Role Bundles (Bitwise OR |)
 */
export const UserRole = {
  // Read-only Viewer: 1
  VIEWER: Permission.VIEW_INVENTORY, // 1

  // Warehouse Operator: view + edit stock + add products + links + convert orders
  // 1 | 2 | 4 | 16 | 32 = 55
  OPERATOR:
    Permission.VIEW_INVENTORY |
    Permission.EDIT_STOCK |
    Permission.ADD_PRODUCT |
    Permission.MANAGE_LINKS |
    Permission.CONVERT_ORDERS, // 55

  // Warehouse Manager: everything except user permission management
  // 1 | 2 | 4 | 8 | 16 | 32 | 64 = 127
  MANAGER:
    Permission.VIEW_INVENTORY |
    Permission.EDIT_STOCK |
    Permission.ADD_PRODUCT |
    Permission.DELETE_PRODUCT |
    Permission.MANAGE_LINKS |
    Permission.CONVERT_ORDERS |
    Permission.MANAGE_SETTINGS, // 127

  // Super Admin: full access to all features (255)
  ADMIN: 255,
} as const;

/**
 * Check if a bitmask role has a specific permission
 */
export function hasPermission(roleMask: number, permission: number): boolean {
  if (roleMask === UserRole.ADMIN) return true;
  return (roleMask & permission) === permission;
}

/**
 * Check if a bitmask role has ANY of the specified permissions
 */
export function hasAnyPermission(roleMask: number, permissions: number[]): boolean {
  if (roleMask === UserRole.ADMIN) return true;
  return permissions.some((perm) => (roleMask & perm) === perm);
}

/**
 * Check if a bitmask role has ALL of the specified permissions
 */
export function hasAllPermissions(roleMask: number, permissions: number[]): boolean {
  if (roleMask === UserRole.ADMIN) return true;
  return permissions.every((perm) => (roleMask & perm) === perm);
}

/**
 * Add a permission flag to an existing bitmask
 */
export function addPermission(roleMask: number, permission: number): number {
  return roleMask | permission;
}

/**
 * Remove a permission flag from an existing bitmask
 */
export function removePermission(roleMask: number, permission: number): number {
  return roleMask & ~permission;
}

/**
 * Get human-readable role name for badge displays
 */
export function getRoleName(roleMask: number): string {
  if (roleMask === UserRole.ADMIN) return 'مدیر ارشد سامانه';
  if (roleMask === UserRole.MANAGER) return 'مدیر انبار و بازرگانی';
  if (roleMask === UserRole.OPERATOR) return 'اپراتور انبار';
  if (roleMask === UserRole.VIEWER) return 'کاربر ناظر (مشاهده)';
  return `نقش سفارشی (بیت‌ماسک: ${roleMask})`;
}

/**
 * Persian labels and descriptions for all individual bitmask permissions
 */
export const PERMISSION_METADATA: Record<number, { title: string; description: string }> = {
  [Permission.VIEW_INVENTORY]: {
    title: 'مشاهده موجودی انبار',
    description: 'مشاهده لیست کالاها، قیمت‌ها و موجودی انبار',
  },
  [Permission.EDIT_STOCK]: {
    title: 'ویرایش موجودی و اطلاعات کالا',
    description: 'تغییر موجودی، قیمت و مشخصات کالاها',
  },
  [Permission.ADD_PRODUCT]: {
    title: 'ثبت و ورود کالا از اکسل',
    description: 'افزودن کالای جدید و بارگذاری دسته‌جمعی از فایل اکسل',
  },
  [Permission.DELETE_PRODUCT]: {
    title: 'حذف کالا',
    description: 'امکان حذف دائم کالا از پایگاه داده انبار',
  },
  [Permission.MANAGE_LINKS]: {
    title: 'مدیریت لینک‌های اختصاصی',
    description: 'تولید و کپی لینک کاتالوگ برای مشتریان و خریداران',
  },
  [Permission.CONVERT_ORDERS]: {
    title: 'تأیید سفارش و صدور فاکتور',
    description: 'تبدیل استعلام مشتری به فاکتور قطعی و کسر خودکار موجودی',
  },
  [Permission.MANAGE_SETTINGS]: {
    title: 'تنظیمات فروشگاه و سامانه',
    description: 'تغییر مشخصات شرکت، آدرس، تلفن و تنظیمات سربرگ فاکتور',
  },
  [Permission.MANAGE_USERS]: {
    title: 'مدیریت کاربران و دسترسی‌ها',
    description: 'تعریف کاربر جدید و تنظیم بیت‌ماسک دسترسی‌ها',
  },
};
