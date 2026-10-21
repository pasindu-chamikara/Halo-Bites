"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex pt-[100px]">
      
      {/* Left Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF5F8] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[#E91E63]/5 z-0"></div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center">
          <img 
            src="/hero3.png" 
            alt="Halo Bites Treats" 
            className="w-80 h-80 object-contain drop-shadow-2xl mb-8 hover:scale-105 transition-transform duration-500" 
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = "/hero1.png";
            }}
          />
          <h2 className="text-3xl font-black uppercase tracking-tight text-[#050505] mb-2">
            Reset Your Access
          </h2>
          <p className="text-zinc-500 max-w-sm text-sm">
            We will help you regain access to your favorite treats and order tracking history in seconds.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
        <div className="max-w-md w-full">
          
          <div className="mb-8">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft size={16} /> Back to Log In
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <KeyRound size={20} className="text-[#E91E63]" />
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#050505]">
                Forgot Password
              </h1>
            </div>
            <p className="text-zinc-500 text-sm mt-1">
              Enter your registered account email and we'll send you a password reset link.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#FFF5F8] border border-[#F8DCE3] text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#E91E63] border border-[#F8DCE3]">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 mb-2">Reset Link Dispatched</h3>
              <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                If an account exists for <strong className="text-zinc-900">{email}</strong>, you will receive password reset instructions within 2 minutes. Please check your inbox and spam folder.
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full py-3 bg-white border border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:border-black transition-colors"
                >
                  Try Another Email
                </button>
                <Link
                  href="/login"
                  className="w-full block py-3 bg-[#E91E63] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#d81b5c] transition-colors"
                >
                  Return to Log In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="reset-email" className="block text-sm font-bold text-zinc-700 uppercase tracking-wide">
                  Account Email
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    id="reset-email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-zinc-200 py-4 px-5 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all"
                    placeholder="you@example.com"
                  />
                  <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#E91E63] hover:bg-[#d81b5c] text-white font-bold py-4 uppercase tracking-wider text-sm transition-colors shadow-md shadow-[#E91E63]/20 cursor-pointer"
              >
                Send Reset Link
              </button>

              <div className="text-center text-xs text-zinc-500 pt-4">
                Remembered your password?{' '}
                <Link href="/login" className="font-bold text-[#050505] hover:text-[#E91E63] transition-colors underline underline-offset-4">
                  Log In
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
