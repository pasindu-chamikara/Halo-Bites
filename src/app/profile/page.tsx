"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  MapPin, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Edit2, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Bell, 
  KeyRound,
  Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { setPersistentData, getPersistentData } from '@/utils/storage';

interface Address {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  postalCode?: string;
  isDefault: boolean;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  favoriteFlavors: string;
  dietaryPreferences: string[];
  smsNotifications: boolean;
  promoEmails: boolean;
}

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'ADDR-1',
    title: 'Home',
    fullName: 'Jane Doe',
    phone: '+94 77 123 4567',
    street: '123 Bakery Lane',
    apartment: 'Suite 4B',
    city: 'Colombo 03',
    postalCode: '00300',
    isDefault: true
  },
  {
    id: 'ADDR-2',
    title: 'Office',
    fullName: 'Jane Doe',
    phone: '+94 77 123 4567',
    street: '456 Corporate Towers',
    apartment: 'Level 12',
    city: 'Colombo 02',
    postalCode: '00200',
    isDefault: false
  }
];

export default function ProfilePage() {
  const { userEmail, logout, updateEmail } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');

  // Profile Data State
  const [profile, setProfile] = useState<ProfileData>({
    firstName: 'Jane',
    lastName: 'Doe',
    email: userEmail || 'jane.doe@example.com',
    phone: '+94 77 123 4567',
    birthday: '1998-05-15',
    favoriteFlavors: 'Belgian Chocolate, Berry Bliss, Salted Caramel',
    dietaryPreferences: ['Nut-Conscious'],
    smsNotifications: true,
    promoEmails: true
  });

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData>(profile);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    title: 'Home',
    fullName: '',
    phone: '',
    street: '',
    apartment: '',
    city: 'Colombo',
    postalCode: '',
    isDefault: false
  });
  const [addressSuccessMsg, setAddressSuccessMsg] = useState('');

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // Load saved profile and addresses on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedProfile = await getPersistentData<ProfileData>('halo_bites_client_profile');
        if (savedProfile) {
          setProfile(prev => ({
            ...prev,
            ...savedProfile,
            email: userEmail || savedProfile.email || prev.email
          }));
          setEditForm(prev => ({
            ...prev,
            ...savedProfile,
            email: userEmail || savedProfile.email || prev.email
          }));
        } else if (userEmail) {
          setProfile(prev => ({ ...prev, email: userEmail }));
          setEditForm(prev => ({ ...prev, email: userEmail }));
        }

        const savedAddresses = await getPersistentData<Address[]>('halo_bites_saved_addresses');
        if (savedAddresses && Array.isArray(savedAddresses) && savedAddresses.length > 0) {
          setAddresses(savedAddresses);
        }
      } catch (err) {
        console.warn('Error loading user profile data:', err);
      }
    };

    loadUserData();
  }, [userEmail]);

  // Handle Profile Update
  const handleStartEditProfile = () => {
    setEditForm(profile);
    setProfileErrorMsg('');
    setProfileSuccessMsg('');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg('');

    if (!editForm.firstName.trim()) {
      setProfileErrorMsg('First name is required');
      return;
    }
    if (!editForm.email.trim() || !editForm.email.includes('@')) {
      setProfileErrorMsg('Please enter a valid email address');
      return;
    }
    if (!editForm.phone.trim()) {
      setProfileErrorMsg('Phone number is required');
      return;
    }

    const updated = { ...editForm };
    setProfile(updated);
    setIsEditingProfile(false);
    setProfileSuccessMsg('Profile details updated successfully!');

    // Persist to storage
    await setPersistentData('halo_bites_client_profile', updated);

    // If email changed, synchronize with AuthContext
    if (updated.email !== userEmail && updateEmail) {
      updateEmail(updated.email);
    }

    // Auto-hide success message
    setTimeout(() => {
      setProfileSuccessMsg('');
    }, 4000);
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      title: 'Home',
      fullName: `${profile.firstName} ${profile.lastName}`.trim(),
      phone: profile.phone,
      street: '',
      apartment: '',
      city: 'Colombo',
      postalCode: '',
      isDefault: addresses.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      title: addr.title,
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      apartment: addr.apartment || '',
      city: addr.city,
      postalCode: addr.postalCode || '',
      isDefault: addr.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.street || !addressForm.city) {
      alert('Please fill in recipient name, street address, and city.');
      return;
    }

    let updatedAddresses: Address[] = [];

    if (editingAddressId) {
      // Edit existing
      updatedAddresses = addresses.map(addr => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            ...addressForm
          };
        }
        return addressForm.isDefault ? { ...addr, isDefault: false } : addr;
      });
    } else {
      // Create new
      const newAddr: Address = {
        ...addressForm,
        id: `ADDR-${Date.now()}`
      };
      if (addressForm.isDefault) {
        updatedAddresses = addresses.map(a => ({ ...a, isDefault: false }));
        updatedAddresses.push(newAddr);
      } else {
        updatedAddresses = [...addresses, newAddr];
      }
    }

    setAddresses(updatedAddresses);
    await setPersistentData('halo_bites_saved_addresses', updatedAddresses);
    setIsAddressModalOpen(false);
    setAddressSuccessMsg('Address saved successfully!');
    setTimeout(() => setAddressSuccessMsg(''), 3000);
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const updated = addresses.filter(a => a.id !== id);
      setAddresses(updated);
      await setPersistentData('halo_bites_saved_addresses', updated);
      setAddressSuccessMsg('Address deleted.');
      setTimeout(() => setAddressSuccessMsg(''), 3000);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updated);
    await setPersistentData('halo_bites_saved_addresses', updated);
    setAddressSuccessMsg('Default delivery address updated.');
    setTimeout(() => setAddressSuccessMsg(''), 3000);
  };

  // Password Handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg('');
    setPasswordSuccessMsg('');

    if (!passwordForm.currentPassword) {
      setPasswordErrorMsg('Please enter your current password');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordErrorMsg('New password must be at least 6 characters long');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrorMsg('New passwords do not match');
      return;
    }

    setPasswordSuccessMsg('Your password has been updated securely.');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setPasswordSuccessMsg(''), 4000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-[120px] sm:pt-[140px] pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 max-w-[1440px]">
        
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E91E63] mb-2 bg-[#FFF5F8] px-3 py-1 border border-[#F8DCE3]">
            <User size={13} /> Customer Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#050505]">
            My Account
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage your personal details, delivery addresses, and sweet preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 border border-zinc-200 rounded-none shadow-xs flex flex-col gap-2">
              
              {/* User Avatar & Badge */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100">
                <div className="w-14 h-14 bg-[#FFF5F8] text-[#E91E63] border border-[#F8DCE3] rounded-none flex items-center justify-center font-black text-2xl">
                  {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-base font-bold text-zinc-900 truncate">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{profile.email}</p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button 
                onClick={() => setActiveTab('personal')}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer border ${
                  activeTab === 'personal' 
                    ? 'bg-[#E91E63] text-white border-[#E91E63]' 
                    : 'text-zinc-700 hover:bg-zinc-50 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User size={16} />
                  Personal Info
                </div>
                {activeTab !== 'personal' && <ChevronRight size={14} />}
              </button>

              <button 
                onClick={() => setActiveTab('addresses')}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer border ${
                  activeTab === 'addresses' 
                    ? 'bg-[#E91E63] text-white border-[#E91E63]' 
                    : 'text-zinc-700 hover:bg-zinc-50 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  Saved Addresses ({addresses.length})
                </div>
                {activeTab !== 'addresses' && <ChevronRight size={14} />}
              </button>

              <Link 
                href="/orders"
                className="flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:bg-zinc-50 transition-colors rounded-none border border-transparent"
              >
                <div className="flex items-center gap-3">
                  <Package size={16} />
                  My Orders & Tracking
                </div>
                <ChevronRight size={14} />
              </Link>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer border ${
                  activeTab === 'settings' 
                    ? 'bg-[#E91E63] text-white border-[#E91E63]' 
                    : 'text-zinc-700 hover:bg-zinc-50 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={16} />
                  Account Settings
                </div>
                {activeTab !== 'settings' && <ChevronRight size={14} />}
              </button>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors mt-6 border border-transparent rounded-none cursor-pointer"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full lg:w-3/4">
            
            {/* 1. Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="bg-white p-6 sm:p-10 border border-zinc-200 rounded-none shadow-xs">
                
                {/* Header Row */}
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#050505]">
                      Personal Details
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                      Your identity and contact information for deliveries and receipts.
                    </p>
                  </div>
                  {!isEditingProfile && (
                    <button 
                      onClick={handleStartEditProfile}
                      className="inline-flex items-center gap-2 bg-[#050505] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#E91E63] transition-colors rounded-none cursor-pointer"
                    >
                      <Edit2 size={13} /> Edit Details
                    </button>
                  )}
                </div>

                {/* Success Banner */}
                {profileSuccessMsg && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-between rounded-none animate-in fade-in-50">
                    <span className="flex items-center gap-2">
                      <Check size={16} className="text-emerald-600" />
                      {profileSuccessMsg}
                    </span>
                    <button onClick={() => setProfileSuccessMsg('')} className="text-emerald-800 hover:text-black">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {profileErrorMsg && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2 rounded-none animate-in fade-in-50">
                    <X size={16} className="text-red-600" />
                    {profileErrorMsg}
                  </div>
                )}

                {/* Edit Form Mode */}
                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editForm.firstName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full bg-white border border-zinc-300 py-3 px-4 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#E91E63] rounded-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full bg-white border border-zinc-300 py-3 px-4 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#E91E63] rounded-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-white border border-zinc-300 py-3 px-4 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#E91E63] rounded-none"
                        />
                        <span className="text-[11px] text-zinc-400 mt-1 block">Used for order receipts and login.</span>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-white border border-zinc-300 py-3 px-4 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#E91E63] rounded-none"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
                          Birthday (Optional)
                        </label>
                        <input
                          type="date"
                          value={editForm.birthday}
                          onChange={(e) => setEditForm(prev => ({ ...prev, birthday: e.target.value }))}
                          className="w-full bg-white border border-zinc-300 py-3 px-4 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#E91E63] rounded-none"
                        />
                        <span className="text-[11px] text-zinc-400 mt-1 block">We send sweet birthday treats & surprise perks!</span>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">
                          Favorite Sweet Flavors
                        </label>
                        <input
                          type="text"
                          value={editForm.favoriteFlavors}
                          onChange={(e) => setEditForm(prev => ({ ...prev, favoriteFlavors: e.target.value }))}
                          className="w-full bg-white border border-zinc-300 py-3 px-4 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#E91E63] rounded-none"
                          placeholder="e.g. Belgian Chocolate, Berry Swirl"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-6 border-t border-zinc-100">
                      <button
                        type="submit"
                        className="bg-[#E91E63] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#050505] transition-colors rounded-none cursor-pointer"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileErrorMsg('');
                        }}
                        className="bg-zinc-100 text-zinc-800 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-none cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display Mode */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-4 bg-zinc-50 border border-zinc-100">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        First Name
                      </span>
                      <p className="text-base font-bold text-zinc-950">{profile.firstName || '—'}</p>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-100">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Last Name
                      </span>
                      <p className="text-base font-bold text-zinc-950">{profile.lastName || '—'}</p>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-100">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Email Address
                      </span>
                      <p className="text-base font-bold text-zinc-950">{profile.email || '—'}</p>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-100">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Phone Number
                      </span>
                      <p className="text-base font-bold text-zinc-950">{profile.phone || '—'}</p>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-100">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Birthday Celebration Date
                      </span>
                      <p className="text-base font-bold text-zinc-950">
                        {profile.birthday ? new Date(profile.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not specified'}
                      </p>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-100">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Favorite Sweet Treats
                      </span>
                      <p className="text-base font-bold text-zinc-950">{profile.favoriteFlavors || 'Any sweet surprise'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-10 border border-zinc-200 rounded-none shadow-xs">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-zinc-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#050505]">
                      Saved Addresses
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                      Quickly select delivery destinations during checkout.
                    </p>
                  </div>
                  <button 
                    onClick={handleOpenAddAddress}
                    className="inline-flex items-center gap-2 bg-[#E91E63] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#050505] transition-colors rounded-none cursor-pointer"
                  >
                    <Plus size={14} /> Add New Address
                  </button>
                </div>

                {/* Success Banner */}
                {addressSuccessMsg && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 rounded-none">
                    <Check size={16} className="text-emerald-600" />
                    {addressSuccessMsg}
                  </div>
                )}

                {/* Addresses Grid */}
                {addresses.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-50 border border-dashed border-zinc-300 p-8">
                    <MapPin size={32} className="text-zinc-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-zinc-700 mb-1">No saved addresses yet</p>
                    <p className="text-xs text-zinc-400 mb-4">Add your home or office delivery address for faster checkout.</p>
                    <button
                      onClick={handleOpenAddAddress}
                      className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none hover:bg-[#E91E63] transition-colors"
                    >
                      Add First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        className={`p-6 border rounded-none relative flex flex-col justify-between ${
                          addr.isDefault 
                            ? 'border-2 border-[#E91E63] bg-[#FFF5F8]/20' 
                            : 'border-zinc-200 bg-white hover:border-zinc-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 px-2 py-0.5 border border-zinc-200">
                              {addr.title}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-black uppercase tracking-widest bg-[#E91E63] text-white px-2 py-0.5">
                                Default
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-base text-zinc-950 mb-1">{addr.fullName}</h3>
                          <p className="text-xs text-zinc-500 mb-3">{addr.phone}</p>

                          <p className="text-sm text-zinc-700 leading-relaxed mb-6">
                            {addr.street}
                            {addr.apartment && <>, {addr.apartment}</>}
                            <br />
                            {addr.city} {addr.postalCode && `— ${addr.postalCode}`}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                          <div className="flex gap-4">
                            <button 
                              onClick={() => handleOpenEditAddress(addr)}
                              className="text-xs font-bold text-[#E91E63] hover:text-[#050505] transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-xs font-bold text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>

                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[11px] font-bold text-zinc-500 hover:text-[#E91E63] transition-colors cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Address Edit/Add Modal */}
                {isAddressModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-zinc-200 p-6 sm:p-8 max-w-lg w-full rounded-none shadow-2xl animate-in fade-in-50">
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-100">
                        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-950">
                          {editingAddressId ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <button 
                          onClick={() => setIsAddressModalOpen(false)}
                          className="text-zinc-400 hover:text-black"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <form onSubmit={handleSaveAddress} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">
                              Address Label
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.title}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g. Home, Office"
                              className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-xs font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">
                              Recipient Name
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.fullName}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))}
                              placeholder="Full Name"
                              className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-xs font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+94 77 123 4567"
                            className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-xs font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.street}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                            placeholder="Street name, house/building number"
                            className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-xs font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">
                              Apartment / Suite
                            </label>
                            <input
                              type="text"
                              value={addressForm.apartment}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, apartment: e.target.value }))}
                              placeholder="Apt 4B (Optional)"
                              className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-xs font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">
                              City / Area
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.city}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="Colombo"
                              className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-xs font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={addressForm.postalCode}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                            placeholder="00300 (Optional)"
                            className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-xs font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                          />
                        </div>

                        <div className="pt-2">
                          <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={addressForm.isDefault}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                              className="w-4 h-4 text-[#E91E63] focus:ring-0 border-zinc-300 rounded-none"
                            />
                            <span>Set as default delivery address</span>
                          </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                          <button
                            type="button"
                            onClick={() => setIsAddressModalOpen(false)}
                            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 hover:bg-zinc-200 rounded-none"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#E91E63] text-white hover:bg-black rounded-none shadow-xs"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 3. Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white p-6 sm:p-10 border border-zinc-200 rounded-none shadow-xs space-y-10">
                
                {/* Change Password Card */}
                <div>
                  <div className="mb-6 pb-4 border-b border-zinc-100">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#050505] flex items-center gap-2">
                      <KeyRound size={20} className="text-[#E91E63]" />
                      Change Password
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                      Update your account security password.
                    </p>
                  </div>

                  {passwordSuccessMsg && (
                    <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 rounded-none">
                      <Check size={16} className="text-emerald-600" />
                      {passwordSuccessMsg}
                    </div>
                  )}

                  {passwordErrorMsg && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2 rounded-none">
                      <X size={16} className="text-red-600" />
                      {passwordErrorMsg}
                    </div>
                  )}

                  <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-sm font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">
                        New Password (Min 6 Characters)
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-sm font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full bg-white border border-zinc-300 py-2.5 px-3 text-sm font-semibold text-zinc-900 rounded-none focus:outline-none focus:border-[#E91E63]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#E91E63] transition-colors rounded-none cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Notifications & Preferences Card */}
                <div className="pt-8 border-t border-zinc-100">
                  <div className="mb-6 pb-4 border-b border-zinc-100">
                    <h3 className="text-xl font-black uppercase tracking-tight text-[#050505] flex items-center gap-2">
                      <Bell size={20} className="text-[#E91E63]" />
                      Communication & Delivery Notifications
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                      Choose how you receive updates on fresh batches and deliveries.
                    </p>
                  </div>

                  <div className="space-y-4 max-w-lg">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.smsNotifications}
                        onChange={async (e) => {
                          const val = e.target.checked;
                          const next = { ...profile, smsNotifications: val };
                          setProfile(next);
                          await setPersistentData('halo_bites_client_profile', next);
                        }}
                        className="w-4 h-4 mt-0.5 text-[#E91E63] focus:ring-0 rounded-none"
                      />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                          Delivery SMS & WhatsApp Alerts
                        </span>
                        <span className="text-xs text-zinc-500">
                          Receive live driver dispatches and estimated delivery arrival windows.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.promoEmails}
                        onChange={async (e) => {
                          const val = e.target.checked;
                          const next = { ...profile, promoEmails: val };
                          setProfile(next);
                          await setPersistentData('halo_bites_client_profile', next);
                        }}
                        className="w-4 h-4 mt-0.5 text-[#E91E63] focus:ring-0 rounded-none"
                      />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                          Sweet Offers & Seasonal Flavor Drops
                        </span>
                        <span className="text-xs text-zinc-500">
                          Be the first to hear about holiday gift boxes and exclusive discounts.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Account Removal */}
                <div className="pt-8 border-t border-zinc-100">
                  <h3 className="text-lg font-black uppercase tracking-tight text-red-600 mb-2">
                    Reset Client Data
                  </h3>
                  <p className="text-xs text-zinc-500 mb-4 max-w-md">
                    Clears your local client profile, saved addresses, and active session cache.
                  </p>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to reset your local client profile and address book?')) {
                        localStorage.removeItem('halo_bites_client_profile');
                        localStorage.removeItem('halo_bites_saved_addresses');
                        logout();
                        router.push('/');
                      }
                    }}
                    className="border border-red-500 text-red-600 px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors rounded-none cursor-pointer"
                  >
                    Reset & Sign Out
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
