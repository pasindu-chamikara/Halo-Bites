"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    login(email);
    // Redirect based on role after 2 seconds
    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail.startsWith('adminsuper@')) {
        router.push('/admin');
      } else {
        router.push('/orders');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex pt-[100px]">
      
      {/* Left Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF5F8] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[#E91E63]/5 z-0"></div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center">
          <img 
            src="/hero2.png" 
            alt="Halo Bites Signature Cake" 
            className="w-3/4 max-w-md object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
          />
          <div className="mt-12 max-w-md">
            <h2 className="text-3xl font-black uppercase tracking-tight text-[#050505] mb-4">Unwrap the Joy</h2>
            <p className="text-zinc-600 font-medium">Log in to track your orders, manage your saved addresses, and discover exclusive new surprise box flavors before anyone else.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-white">
        <div className="w-full max-w-md">
          
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tight text-[#050505] mb-2">Welcome Back</h1>
            <p className="text-zinc-500">Please enter your details to sign in.</p>
          </div>

          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center rounded-full mb-4 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-emerald-800 mb-2">Login Successful!</h3>
              <p className="text-emerald-700 font-medium">Loading your account...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-zinc-700 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-zinc-200 py-4 px-5 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-bold text-zinc-700 uppercase tracking-wide">Password</label>
                  <Link href="/forgot-password" className="text-sm font-bold text-[#E91E63] hover:text-black transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    required
                    className="w-full bg-[#FAFAFA] border border-zinc-200 py-4 px-5 pr-12 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#E91E63] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#E91E63] text-white font-black uppercase tracking-widest py-4 mt-4 hover:bg-[#050505] transition-colors shadow-lg shadow-[#E91E63]/20"
              >
                Sign In
              </button>
            </form>
          )}

          <div className="mt-10 text-center">
            <p className="text-zinc-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-[#050505] hover:text-[#E91E63] transition-colors underline underline-offset-4">
                Create one now
              </Link>
            </p>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
