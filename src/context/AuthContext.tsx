'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/lib/auth';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRoleName,
  UserRole,
} from '@/lib/permissions';

interface AuthContextType {
  user: AuthUser | null;
  role: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  roleName: string;
  can: (permission: number) => boolean;
  canAny: (permissions: number[]) => boolean;
  canAll: (permissions: number[]) => boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  roleName: 'کاربر مهمان',
  can: () => false,
  canAny: () => false,
  canAll: () => false,
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({
  initialUser = null,
  children,
}: {
  initialUser?: AuthUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const router = useRouter();

  const role = user?.role ?? null;
  const isAdmin = role === UserRole.ADMIN;
  const isAuthenticated = !!user;
  const roleName = role !== null ? getRoleName(role) : 'کاربر مهمان';

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialUser) {
      refreshUser();
    }
  }, [initialUser]);

  const can = (permission: number) => {
    if (role === null) return false;
    return hasPermission(role, permission);
  };

  const canAny = (permissions: number[]) => {
    if (role === null) return false;
    return hasAnyPermission(role, permissions);
  };

  const canAll = (permissions: number[]) => {
    if (role === null) return false;
    return hasAllPermissions(role, permissions);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isAuthenticated,
        isAdmin,
        roleName,
        can,
        canAny,
        canAll,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Declarative Bitmask Permission Gate Component
 */
export function PermissionGate({
  permission,
  fallback = null,
  children,
}: {
  permission: number;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { can, isLoading } = useAuth();

  if (isLoading) return null;
  if (!can(permission)) return <>{fallback}</>;

  return <>{children}</>;
}
