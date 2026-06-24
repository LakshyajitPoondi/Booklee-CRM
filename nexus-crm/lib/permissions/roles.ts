import type { UserRole } from '@/types/database';

/* ============================================================
 * Role Hierarchy — higher index = more permissions
 * ============================================================ */
export const ROLE_HIERARCHY: UserRole[] = [
  'client',
  'staff',
  'admin',
  'super_admin',
];

export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

export function isRoleAtLeast(userRole: UserRole, requiredRole: UserRole): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
}

/* ============================================================
 * Permissions — actions each role can perform
 * ============================================================ */
export type Permission =
  // Leads
  | 'leads:read'
  | 'leads:create'
  | 'leads:update'
  | 'leads:delete'
  | 'leads:read_all'
  // Applications
  | 'applications:read'
  | 'applications:create'
  | 'applications:update'
  | 'applications:delete'
  | 'applications:read_all'
  // Universities
  | 'universities:read'
  | 'universities:create'
  | 'universities:update'
  | 'universities:delete'
  // Documents
  | 'documents:read'
  | 'documents:upload'
  | 'documents:update'
  | 'documents:delete'
  | 'documents:read_all'
  // Team
  | 'team:read'
  | 'team:invite'
  | 'team:remove'
  | 'team:update_role'
  // Settings
  | 'settings:read'
  | 'settings:update'
  | 'settings:company'
  // Support
  | 'support:read'
  | 'support:create'
  | 'support:update'
  | 'support:read_all'
  // Dashboard
  | 'dashboard:view'
  | 'dashboard:admin';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  client: [
    'leads:read',
    'applications:read',
    'applications:create',
    'universities:read',
    'documents:read',
    'documents:upload',
    'settings:read',
    'support:read',
    'support:create',
    'dashboard:view',
  ],
  staff: [
    'leads:read',
    'leads:create',
    'leads:update',
    'applications:read',
    'applications:create',
    'applications:update',
    'universities:read',
    'documents:read',
    'documents:upload',
    'documents:update',
    'settings:read',
    'support:read',
    'support:create',
    'support:update',
    'dashboard:view',
  ],
  admin: [
    'leads:read',
    'leads:create',
    'leads:update',
    'leads:delete',
    'leads:read_all',
    'applications:read',
    'applications:create',
    'applications:update',
    'applications:delete',
    'applications:read_all',
    'universities:read',
    'universities:create',
    'universities:update',
    'universities:delete',
    'documents:read',
    'documents:upload',
    'documents:update',
    'documents:delete',
    'documents:read_all',
    'team:read',
    'team:invite',
    'team:remove',
    'settings:read',
    'settings:update',
    'settings:company',
    'support:read',
    'support:create',
    'support:update',
    'support:read_all',
    'dashboard:view',
    'dashboard:admin',
  ],
  super_admin: [
    'leads:read',
    'leads:create',
    'leads:update',
    'leads:delete',
    'leads:read_all',
    'applications:read',
    'applications:create',
    'applications:update',
    'applications:delete',
    'applications:read_all',
    'universities:read',
    'universities:create',
    'universities:update',
    'universities:delete',
    'documents:read',
    'documents:upload',
    'documents:update',
    'documents:delete',
    'documents:read_all',
    'team:read',
    'team:invite',
    'team:remove',
    'team:update_role',
    'settings:read',
    'settings:update',
    'settings:company',
    'support:read',
    'support:create',
    'support:update',
    'support:read_all',
    'dashboard:view',
    'dashboard:admin',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/* ============================================================
 * Route access — which roles can access which routes
 * ============================================================ */
const ADMIN_ROUTES = ['/admin/leads', '/admin/universities', '/admin/settings'];

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  // Super admin and admin can access everything
  if (isRoleAtLeast(role, 'admin')) return true;

  // Client can only access portal routes
  if (role === 'client') {
    return pathname.startsWith('/client');
  }

  // Staff can access most operational routes
  if (role === 'staff') {
    return !ADMIN_ROUTES.some(
      (r) => pathname === r || pathname.startsWith(r + '/')
    ) || pathname.startsWith('/admin/dashboard');
  }

  return false;
}

/* ============================================================
 * Role display helpers
 * ============================================================ */
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  staff: 'Staff',
  client: 'Client',
};

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'client', label: 'Client' },
];
