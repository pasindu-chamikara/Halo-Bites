"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex pt-[100px]">
      
      {/* Left Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF5F8] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[#E91E63]/5 z-0"></div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center">
          <img 
            src="/hero3.png" 
            alt="Halo Bites Delivery Box" 
            className="w-3/4 max-w-md object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
          />
          <div className="mt-12 max-w-md">
            <h2 className="text-3xl font-black uppercase tracking-tight text-[#050505] mb-4">Join the Club</h2>
            <p className="text-zinc-600 font-medium">Create an account to track your orders, save your delivery preferences, and get early access to our limited-edition flavors.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-white">
        <div className="w-full max-w-md">
          
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tight text-[#050505] mb-2">Create Account</h1>
            <p className="text-zinc-500">Please fill in your details to sign up.</p>
          </div>

          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center rounded-full mb-4 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-emerald-800 mb-2">Account Created Successfully!</h3>
              <p className="text-emerald-700 font-medium">Redirecting you to the login page...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-zinc-700 uppercase tracking-wide">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  className="w-full bg-[#FAFAFA] border border-zinc-200 py-4 px-5 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all"
                  placeholder="Jane Doe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-zinc-700 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  className="w-full bg-[#FAFAFA] border border-zinc-200 py-4 px-5 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-zinc-700 uppercase tracking-wide">Password</label>
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
                Create Account
              </button>
            </form>
          )}

          <div className="mt-10 text-center">
            <p className="text-zinc-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#050505] hover:text-[#E91E63] transition-colors underline underline-offset-4">
                Log in here
              </Link>
            </p>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
