"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Shield, 
  UserPlus, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Users, 
  Lock, 
  Eye, 
  Sparkles,
  Store,
  ShieldCheck
} from 'lucide-react';
import { AdminRole, useAuth } from '@/context/AuthContext';
import { StaffMember, INITIAL_STAFF_MEMBERS, ROLES_METADATA } from '@/utils/rbac';
import { setPersistentData, getPersistentData } from '@/utils/storage';

interface StoreSettings {
  storeName: string;
  supportEmail: string;
  contactPhone: string;
  currency: string;
  instagramUrl: string;
  returnPolicyUrl: string;
}

export default function SettingsPage() {
  const { adminRole, setAdminRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'rbac' | 'general'>('rbac');

  // Staff State
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'order_manager' as AdminRole
  });
  const [staffNotice, setStaffNotice] = useState('');

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'Halo Bites',
    supportEmail: 'support@halobites.com',
    contactPhone: '+94 77 123 4567',
    currency: 'LKR',
    instagramUrl: 'https://instagram.com/halobites',
    returnPolicyUrl: '/refund-policy'
  });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Load persisted staff and settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedStaff = await getPersistentData<StaffMember[]>('halo_bites_admin_staff');
        if (savedStaff && Array.isArray(savedStaff) && savedStaff.length > 0) {
          setStaffList(savedStaff);
        } else {
          await setPersistentData('halo_bites_admin_staff', INITIAL_STAFF_MEMBERS);
        }

        const savedSettings = await getPersistentData<StoreSettings>('halo_bites_store_settings');
        if (savedSettings) {
          setStoreSettings(savedSettings);
        }
      } catch (err) {
        console.warn('Error loading settings:', err);
      }
    };

    loadSettings();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;

    const createdStaff: StaffMember = {
      id: `STAFF-${Date.now()}`,
      name: newStaff.name.trim(),
      email: newStaff.email.trim().toLowerCase(),
      role: newStaff.role,
      status: 'Active',
      lastActive: 'Invited'
    };

    const updated = [...staffList, createdStaff];
    setStaffList(updated);
    await setPersistentData('halo_bites_admin_staff', updated);
    setIsAddModalOpen(false);
    setNewStaff({ name: '', email: '', role: 'order_manager' });
    setStaffNotice(`Added ${createdStaff.name} with ${ROLES_METADATA[createdStaff.role].title} role.`);
    setTimeout(() => setStaffNotice(''), 4000);
  };

  const handleUpdateStaffRole = async (staffId: string, role: AdminRole) => {
    const updated = staffList.map(s => s.id === staffId ? { ...s, role } : s);
    setStaffList(updated);
    await setPersistentData('halo_bites_admin_staff', updated);
    setStaffNotice('Staff role updated successfully.');
    setTimeout(() => setStaffNotice(''), 3000);
  };

  const handleToggleStaffStatus = async (staffId: string) => {
    const updated = staffList.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          status: s.status === 'Active' ? 'Suspended' as const : 'Active' as const
        };
      }
      return s;
    });
    setStaffList(updated);
    await setPersistentData('halo_bites_admin_staff', updated);
  };

  const handleDeleteStaff = async (staffId: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from admin staff?`)) {
      const updated = staffList.filter(s => s.id !== staffId);
      setStaffList(updated);
      await setPersistentData('halo_bites_admin_staff', updated);
      setStaffNotice(`Staff member ${name} removed.`);
      setTimeout(() => setStaffNotice(''), 3000);
    }
  };

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await setPersistentData('halo_bites_store_settings', storeSettings);
    setSettingsSavedMsg('Store settings saved successfully!');
    setTimeout(() => setSettingsSavedMsg(''), 4000);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'rbac'
              ? 'text-[#E91E63] border-[#E91E63] bg-white/5'
              : 'text-zinc-400 border-transparent hover:text-white'
          }`}
        >
          <Shield size={15} />
          Role-Based Access Control (RBAC) & Team
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'general'
              ? 'text-[#E91E63] border-[#E91E63] bg-white/5'
              : 'text-zinc-400 border-transparent hover:text-white'
          }`}
        >
          <Store size={15} />
          General Store Settings
        </button>
      </div>

      {/* TAB 1: Role-Based Access Control (RBAC) */}
      {activeTab === 'rbac' && (
        <div className="space-y-8 animate-in fade-in-50">
          
          {/* Header Banner */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E91E63] mb-2 bg-[#E91E63]/10 px-2.5 py-1 border border-[#E91E63]/25">
                <ShieldCheck size={12} /> Live RBAC Security Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                Team Roles & Permissions
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
                Configure team member accounts, assign specialized operational roles, and enforce route guards across the administrative dashboard.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#E91E63] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-lg shadow-[#E91E63]/20 cursor-pointer rounded-none"
            >
              <UserPlus size={14} /> Add Team Member
            </button>
          </div>

          {/* Feedback Notice */}
          {staffNotice && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-emerald-400" />
                {staffNotice}
              </span>
              <button onClick={() => setStaffNotice('')} className="text-zinc-400 hover:text-white">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Staff Roster Table */}
          <div className="bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Authorized Staff Members ({staffList.length})
              </h3>
              <span className="text-xs text-zinc-400">
                Active Role: <span className="text-[#E91E63] font-bold uppercase">{adminRole || 'super_admin'}</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-black/40">
                    <th className="p-4">Member Name</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Activity</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {staffList.map((staff) => {
                    const roleMeta = ROLES_METADATA[staff.role];
                    return (
                      <tr key={staff.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white text-sm">{staff.name}</p>
                          <p className="text-zinc-400 text-xs font-mono">{staff.email}</p>
                        </td>

                        <td className="p-4">
                          <select
                            value={staff.role}
                            onChange={(e) => handleUpdateStaffRole(staff.id, e.target.value as AdminRole)}
                            className={`bg-black/60 border px-3 py-1.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#E91E63] ${roleMeta.badgeBorder} ${roleMeta.badgeText}`}
                          >
                            <option value="super_admin">Super Administrator</option>
                            <option value="order_manager">Order Manager</option>
                            <option value="inventory_manager">Inventory Manager</option>
                            <option value="kitchen_staff">Kitchen & Dispatcher</option>
                          </select>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStaffStatus(staff.id)}
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                              staff.status === 'Active'
                                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/60'
                                : 'bg-red-950/60 border-red-500/50 text-red-400 hover:bg-red-900/60'
                            }`}
                          >
                            {staff.status}
                          </button>
                        </td>

                        <td className="p-4 text-zinc-400">
                          {staff.lastActive}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteStaff(staff.id, staff.name)}
                            disabled={staff.role === 'super_admin' && staffList.filter(s => s.role === 'super_admin').length <= 1}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-white/5 disabled:opacity-20 transition-colors cursor-pointer"
                            title="Remove Staff Member"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Permissions Matrix Reference Table */}
          <div className="bg-white/5 border border-white/10 p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-white mb-1">
                Role Permissions Matrix
              </h3>
              <p className="text-xs text-zinc-400">
                Detailed capabilities matrix by assigned role:
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-black/60">
                    <th className="p-3">Capability / Workspace Area</th>
                    <th className="p-3 text-center text-[#E91E63]">Super Admin</th>
                    <th className="p-3 text-center text-blue-400">Order Manager</th>
                    <th className="p-3 text-center text-emerald-400">Inventory Mgr</th>
                    <th className="p-3 text-center text-amber-400">Kitchen Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 text-zinc-300 font-semibold">Store Dashboard & Analytics Overview</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-300 font-semibold">Manage & Fulfill Customer Orders</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓ (Kitchen view)</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-300 font-semibold">Products, Cakes & Stock Management</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-300 font-semibold">Category Taxonomy & Banners</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-300 font-semibold">Customer Records & CRM Spend</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-300 font-semibold">Promo Codes & Discounts</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-300 font-semibold">Financial Reports, P&L & Revenue</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-300 font-semibold">Store Settings & Staff Role RBAC</td>
                    <td className="p-3 text-center text-emerald-400 font-black">✓</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                    <td className="p-3 text-center text-zinc-600 font-black">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Staff Member Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-white/20 p-6 sm:p-8 max-w-md w-full shadow-2xl rounded-none">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <UserPlus size={16} className="text-[#E91E63]" /> Add Staff Member
                  </h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStaff.name}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Kasun Bandara"
                      className="w-full bg-black/60 border border-white/20 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Staff Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={newStaff.email}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. kasun@halobites.com"
                      className="w-full bg-black/60 border border-white/20 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Assign Role *
                    </label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, role: e.target.value as AdminRole }))}
                      className="w-full bg-black/60 border border-white/20 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#E91E63]"
                    >
                      <option value="super_admin">Super Administrator (Full Access)</option>
                      <option value="order_manager">Order Manager (Orders & Customers)</option>
                      <option value="inventory_manager">Inventory Manager (Products & Stock)</option>
                      <option value="kitchen_staff">Kitchen Staff (Order Baking Display)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-white/10 text-zinc-300 hover:bg-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#E91E63] text-white hover:bg-white hover:text-black transition-colors"
                    >
                      Create Staff
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: General Store Settings */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveStoreSettings} className="space-y-8 animate-in fade-in-50">
          
          {settingsSavedMsg && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check size={16} className="text-emerald-400" />
              {settingsSavedMsg}
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 pb-4 border-b border-white/10">General Store Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Store Name</label>
                <input 
                  type="text" 
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#E91E63] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Support Email</label>
                <input 
                  type="email" 
                  value={storeSettings.supportEmail}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#E91E63] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Contact Phone</label>
                <input 
                  type="text" 
                  value={storeSettings.contactPhone}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#E91E63] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Store Currency</label>
                <select 
                  value={storeSettings.currency} 
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:outline-none focus:border-[#E91E63] transition-colors appearance-none"
                >
                  <option value="LKR">LKR (Rs)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 pb-4 border-b border-white/10">Policies & Social Links</h2>
            
            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Return Policy URL</label>
                <input 
                  type="text" 
                  value={storeSettings.returnPolicyUrl}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, returnPolicyUrl: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#E91E63] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Instagram Profile</label>
                <input 
                  type="text" 
                  value={storeSettings.instagramUrl}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, instagramUrl: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#E91E63] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-[#E91E63] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-lg shadow-[#E91E63]/20"
            >
              <Save size={16} /> Save Store Settings
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
