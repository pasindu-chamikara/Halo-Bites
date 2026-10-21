"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Lock,
  Tag,
  BarChart3,
  Layers,
  Shield,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, AdminRole } from '@/context/AuthContext';
import { isRouteAllowedForRole, ROLES_METADATA } from '@/utils/rbac';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const ALL_SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Orders & Dispatch', href: '/admin/orders', icon: <ShoppingCart size={18} /> },
  { label: 'Products', href: '/admin/products', icon: <Package size={18} /> },
  { label: 'Categories', href: '/admin/categories', icon: <Layers size={18} /> },
  { label: 'Customers', href: '/admin/customers', icon: <Users size={18} /> },
  { label: 'Discounts & Offers', href: '/admin/discounts', icon: <Tag size={18} /> },
  { label: 'Reports & Revenue', href: '/admin/reports', icon: <BarChart3 size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isAdmin, adminRole, setAdminRole, userEmail, logout } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Allow unauthenticated access to /admin/login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Guard: Not logged in or not an admin account
  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans text-white relative overflow-hidden p-4">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E91E63]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 bg-white/5 backdrop-blur-xl p-8 sm:p-12 border border-white/10 shadow-2xl max-w-md w-full text-center rounded-none">
          <div className="w-16 h-16 bg-[#E91E63] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#E91E63]/30">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2">Access Denied</h1>
          <p className="text-zinc-400 text-sm mb-6">You must be logged in as an authorized administrator to access this area.</p>
          <div className="flex flex-col gap-3">
            <Link href="/admin/login" className="block w-full bg-[#E91E63] text-white font-bold uppercase tracking-widest py-3.5 text-xs hover:bg-white hover:text-black transition-colors shadow-lg shadow-[#E91E63]/20 rounded-none">
              Go to Admin Login
            </Link>
            <Link href="/" className="block w-full bg-white/10 text-zinc-300 font-bold uppercase tracking-widest py-3 text-xs hover:bg-white/20 hover:text-white transition-colors rounded-none">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentRoleKey: AdminRole = adminRole || 'super_admin';
  const roleMeta = ROLES_METADATA[currentRoleKey];

  // RBAC Route Permission Check
  const hasRouteAccess = isRouteAllowedForRole(pathname, currentRoleKey);

  // Filter sidebar navigation items based on current role permissions
  const allowedSidebarItems = ALL_SIDEBAR_ITEMS.filter(item => 
    isRouteAllowedForRole(item.href, currentRoleKey)
  );

  const canAccessSettings = isRouteAllowedForRole('/admin/settings', currentRoleKey);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleRoleChange = (newRole: AdminRole) => {
    setAdminRole(newRole);
    setIsRoleDropdownOpen(false);

    // If current route is forbidden under the newly selected role, route to their default home
    if (!isRouteAllowedForRole(pathname, newRole)) {
      const targetMeta = ROLES_METADATA[newRole];
      const defaultDest = targetMeta.allowedPaths[0] || '/admin';
      router.push(defaultDest);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans text-white relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-[#E91E63]/10 rounded-full blur-[160px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-64 bg-black/60 backdrop-blur-2xl border-r border-white/10 flex-col fixed h-full z-30 top-0 left-0">
        
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <Link href="/admin" className="text-xl font-black tracking-tighter text-white">
            Halo<span className="text-[#E91E63]">Admin</span>
          </Link>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${roleMeta.badgeBg} ${roleMeta.badgeText} ${roleMeta.badgeBorder}`}>
            {currentRoleKey === 'super_admin' ? 'Super Admin' : currentRoleKey.replace('_', ' ')}
          </span>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 py-6 flex flex-col gap-1.5 px-3 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Operations ({allowedSidebarItems.length})
          </div>

          {allowedSidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarButton 
                key={item.href}
                active={isActive} 
                icon={item.icon} 
                label={item.label} 
                href={item.href} 
              />
            );
          })}
          
          {canAccessSettings && (
            <>
              <div className="mt-6 mb-2 px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Administration
              </div>
              <SidebarButton 
                active={pathname === '/admin/settings'} 
                icon={<Settings size={18} />} 
                label="Store & Team RBAC" 
                href="/admin/settings" 
              />
            </>
          )}
        </div>

        {/* User Info & Sign Out Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          <div className="mb-3 px-2">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Logged In Staff</span>
            <span className="text-xs font-bold text-white truncate block">{userEmail || 'adminsuper@halobites.com'}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 bg-white/5 border border-white/10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer rounded-none"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs" 
          />
          <div className="relative w-72 bg-black border-r border-white/15 h-full z-10 flex flex-col p-6">
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <span className="text-xl font-black text-white">
                Halo<span className="text-[#E91E63]">Admin</span>
              </span>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto">
              {allowedSidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider ${
                    pathname === item.href 
                      ? 'bg-[#E91E63] text-white' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}

              {canAccessSettings && (
                <Link
                  href="/admin/settings"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider mt-4 border-t border-white/10 ${
                    pathname === '/admin/settings'
                      ? 'bg-[#E91E63] text-white'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings size={18} /> Store & Team RBAC
                </Link>
              )}
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 w-full relative z-10 min-h-screen flex flex-col">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-20 bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-300 hover:text-white bg-white/5 border border-white/10"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                {pathname === '/admin' ? 'Dashboard Overview' : pathname.replace('/admin/', '').replace('-', ' ')}
              </h1>
              <p className="hidden sm:block text-xs text-zinc-400">
                Halo Bites Internal Operations & Role Access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Interactive RBAC Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(prev => !prev)}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${roleMeta.badgeBg} ${roleMeta.badgeText} ${roleMeta.badgeBorder} hover:bg-white/10`}
                title="Switch active role to test RBAC permissions"
              >
                <Shield size={14} className="hidden sm:inline" />
                <span>Role: {roleMeta.title}</span>
                <ChevronDown size={14} className={`transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Role Switcher Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-white/20 shadow-2xl p-3 z-50 animate-in fade-in-50">
                  <div className="mb-2 pb-2 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Live RBAC Role Simulator
                    </span>
                    <Sparkles size={12} className="text-[#E91E63]" />
                  </div>
                  <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
                    Switch role to preview sidebar visibility and route restrictions:
                  </p>

                  <div className="space-y-1.5">
                    {(Object.keys(ROLES_METADATA) as AdminRole[]).map((rKey) => {
                      const meta = ROLES_METADATA[rKey];
                      const isCurrent = currentRoleKey === rKey;
                      return (
                        <button
                          key={rKey}
                          onClick={() => handleRoleChange(rKey)}
                          className={`w-full text-left p-2.5 transition-colors border cursor-pointer ${
                            isCurrent
                              ? 'bg-white/10 border-[#E91E63] text-white'
                              : 'bg-black/40 border-white/5 hover:bg-white/5 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-white">
                              {meta.title}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] bg-[#E91E63] text-white px-1.5 py-0.2 font-black uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-400 line-clamp-1 leading-normal">
                            {meta.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* View Live Store */}
            <Link 
              href="/" 
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 bg-white/5 hover:bg-white hover:text-black border border-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink size={13} />
            </Link>

          </div>
        </header>

        {/* Content Body with RBAC Route Guard */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          {hasRouteAccess ? (
            children
          ) : (
            /* Permission Denied Guard Screen */
            <div className="bg-white/5 border border-red-500/30 p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 backdrop-blur-xl">
              <div className="w-16 h-16 bg-red-950/80 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto mb-6 shadow-xl">
                <ShieldAlert size={32} />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                Permission Denied
              </h2>
              <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                Your current role <span className="text-white font-bold underline">{roleMeta.title}</span> does not have authorization to access <span className="font-mono text-[#E91E63]">{pathname}</span>.
              </p>

              <div className="p-4 bg-black/60 border border-white/10 text-xs text-zinc-400 text-left mb-6 space-y-1 font-mono">
                <div>• Required Privileges: Super Admin or Authorized Department Manager</div>
                <div>• Current Role: {currentRoleKey}</div>
                <div>• Status: Unauthorized Route Attempt Blocked by Halo Bites RBAC</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => router.push(roleMeta.allowedPaths[0] || '/admin')}
                  className="w-full sm:w-auto bg-[#E91E63] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-none cursor-pointer"
                >
                  Go to Authorized Workspace
                </button>
                <button
                  onClick={() => handleRoleChange('super_admin')}
                  className="w-full sm:w-auto bg-white/10 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-none cursor-pointer"
                >
                  Switch to Super Admin
                </button>
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

function SidebarButton({ active, icon, label, href }: { active: boolean, icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
        active 
          ? 'bg-[#E91E63] text-white shadow-lg shadow-[#E91E63]/25' 
          : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      {icon} <span>{label}</span>
    </Link>
  );
}
