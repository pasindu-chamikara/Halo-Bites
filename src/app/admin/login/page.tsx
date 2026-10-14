"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, isAdmin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If already logged in as admin, offer quick redirect
  if (isLoggedIn && isAdmin && !isLoading && !isSuccess) {
    router.push('/admin');
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMsg('Please enter your administrator email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your administrator password.');
      return;
    }

    // Role-based validation: supports all authorized staff accounts
    const isStaff = 
      normalizedEmail.startsWith('adminsuper@') ||
      normalizedEmail.startsWith('admin@') ||
      normalizedEmail.startsWith('manager@') ||
      normalizedEmail.startsWith('order@') ||
      normalizedEmail.startsWith('orders@') ||
      normalizedEmail.startsWith('inventory@') ||
      normalizedEmail.startsWith('kitchen@') ||
      normalizedEmail.startsWith('chef@') ||
      normalizedEmail.startsWith('staff@');

    if (!isStaff) {
      setErrorMsg(
        'Access denied: This portal is strictly for authorized Halo Bites staff & Super Admins (e.g. adminsuper@, manager@, inventory@, or kitchen@halobites.com).'
      );
      return;
    }

    setIsLoading(true);

    // Simulate quick authentication handshake
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        if (normalizedEmail.startsWith('kitchen@')) {
          router.push('/admin/orders');
        } else {
          router.push('/admin');
        }
      }, 1000);
    }, 600);
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Staff@Halo2026!');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#E91E63] selection:text-white">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#E91E63]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 w-full px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Storefront
        </Link>

        <span className="text-xs font-bold uppercase tracking-widest text-[#E91E63] bg-[#E91E63]/10 border border-[#E91E63]/30 px-3 py-1">
          Internal System
        </span>
      </div>

      {/* Center Auth Card */}
      <div className="relative z-10 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-2xl rounded-none">
          
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#E91E63] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#E91E63]/30">
              <Shield size={28} className="text-white" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-1">
              Halo<span className="text-[#E91E63]">Admin</span>
            </h1>
            <p className="text-xs uppercase tracking-widest font-bold text-zinc-400">
              Super Admin Portal
            </p>
          </div>

          {/* Demo Quick-Fill Roles */}
          <div className="mb-6 p-3 bg-white/5 border border-white/10 text-xs">
            <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider mb-2">
              Autofill RBAC Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemo('adminsuper@halobites.com')}
                className="p-1.5 bg-[#E91E63]/15 hover:bg-[#E91E63] text-[#E91E63] hover:text-white border border-[#E91E63]/30 text-[10px] font-bold uppercase tracking-wider text-left transition-colors truncate"
              >
                ★ Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('manager@halobites.com')}
                className="p-1.5 bg-blue-500/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider text-left transition-colors truncate"
              >
                📦 Order Manager
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('inventory@halobites.com')}
                className="p-1.5 bg-emerald-500/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider text-left transition-colors truncate"
              >
                🏷️ Inventory Mgr
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('kitchen@halobites.com')}
                className="p-1.5 bg-amber-500/15 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider text-left transition-colors truncate"
              >
                👨‍🍳 Kitchen Staff
              </button>
            </div>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center animate-in fade-in-50">
              <CheckCircle2 size={48} className="text-emerald-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Authorization Granted</h3>
              <p className="text-xs text-zinc-400">Redirecting to operations dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              
              {/* Error Message */}
              {errorMsg && (
                <div className="p-3.5 bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in-50">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adminsuper@halobites.com"
                  className="w-full bg-black/60 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E91E63] transition-colors rounded-none font-medium"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Master Password
                  </label>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Secured 256-bit
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/60 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E91E63] transition-colors rounded-none font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E91E63] text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg shadow-[#E91E63]/25 flex items-center justify-center gap-2 rounded-none cursor-pointer disabled:opacity-50 mt-6"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Admin Dashboard</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

            </form>
          )}

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-zinc-500">
              Looking for client shopping account?{' '}
              <Link href="/login" className="text-white hover:text-[#E91E63] font-bold underline">
                Customer Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="relative z-10 w-full px-6 py-4 text-center text-[11px] text-zinc-600">
        Halo Bites Management System • Internal Authorization Required
      </div>

    </div>
  );
}
