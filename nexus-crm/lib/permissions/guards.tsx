'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { hasPermission, isRoleAtLeast, type Permission } from './roles';
import type { UserRole } from '@/types/database';

/**
 * Hook: check if current user has a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return hasPermission(user.role, permission);
}

/**
 * Hook: check if current user has at least the given role
 */
export function useRoleAtLeast(role: UserRole): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return isRoleAtLeast(user.role, role);
}

/**
 * Component: conditionally render children based on permission
 */
export function PermissionGate({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const allowed = usePermission(permission);
  return <>{allowed ? children : fallback}</>;
}

/**
 * Component: conditionally render children based on minimum role
 */
export function RoleGate({
  minRole,
  fallback = null,
  children,
}: {
  minRole: UserRole;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const allowed = useRoleAtLeast(minRole);
  return <>{allowed ? children : fallback}</>;
}
