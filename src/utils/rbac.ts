import { AdminRole } from '@/context/AuthContext';

export interface RoleMeta {
  key: AdminRole;
  title: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  allowedPaths: string[];
}

export const ROLES_METADATA: Record<AdminRole, RoleMeta> = {
  super_admin: {
    key: 'super_admin',
    title: 'Super Administrator',
    description: 'Unrestricted master access to all financial reports, store configurations, staff, orders, and products.',
    badgeBg: 'bg-[#E91E63]/15',
    badgeText: 'text-[#E91E63]',
    badgeBorder: 'border-[#E91E63]/30',
    allowedPaths: [
      '/admin',
      '/admin/orders',
      '/admin/products',
      '/admin/categories',
      '/admin/customers',
      '/admin/discounts',
      '/admin/inventory',
      '/admin/media',
      '/admin/reports',
      '/admin/settings'
    ]
  },
  order_manager: {
    key: 'order_manager',
    title: 'Order Manager',
    description: 'Manages incoming orders, customer communications, refunds, and delivery dispatches.',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-500/30',
    allowedPaths: [
      '/admin',
      '/admin/orders',
      '/admin/customers'
    ]
  },
  inventory_manager: {
    key: 'inventory_manager',
    title: 'Inventory & Catalog Manager',
    description: 'Oversees cake and pastry catalogs, pricing, categories, stock levels, and promotional discounts.',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    allowedPaths: [
      '/admin',
      '/admin/products',
      '/admin/categories',
      '/admin/inventory',
      '/admin/discounts',
      '/admin/media'
    ]
  },
  kitchen_staff: {
    key: 'kitchen_staff',
    title: 'Kitchen & Dispatcher',
    description: 'Real-time kitchen display unit to prepare fresh batches, pack surprise boxes, and dispatch riders.',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/30',
    allowedPaths: [
      '/admin/orders'
    ]
  }
};

/**
 * Checks whether a role has permission to access a specific admin route.
 */
export function isRouteAllowedForRole(path: string, role: AdminRole | null): boolean {
  if (!role) return false;
  const meta = ROLES_METADATA[role];
  if (!meta) return false;

  // Exact match or subpath match
  return meta.allowedPaths.some(allowed => path === allowed || path.startsWith(`${allowed}/`));
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'Active' | 'Suspended';
  lastActive: string;
}

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'STAFF-1',
    name: 'Dilshan Perera',
    email: 'adminsuper@halobites.com',
    role: 'super_admin',
    status: 'Active',
    lastActive: 'Just now'
  },
  {
    id: 'STAFF-2',
    name: 'Kavindi Silva',
    email: 'manager@halobites.com',
    role: 'order_manager',
    status: 'Active',
    lastActive: '12 mins ago'
  },
  {
    id: 'STAFF-3',
    name: 'Sachith Fernando',
    email: 'inventory@halobites.com',
    role: 'inventory_manager',
    status: 'Active',
    lastActive: '1 hour ago'
  },
  {
    id: 'STAFF-4',
    name: 'Amara Weerasinghe',
    email: 'kitchen@halobites.com',
    role: 'kitchen_staff',
    status: 'Active',
    lastActive: 'Active in Kitchen'
  }
];
