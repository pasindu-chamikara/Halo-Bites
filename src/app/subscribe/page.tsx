"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, Bell, CheckCircle2, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

function SubscribeContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type');

  const [enableEmail, setEnableEmail] = useState(() => initialType !== 'sms');
  const [enableSms, setEnableSms] = useState(() => initialType === 'sms');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dealAlerts, setDealAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [newFlavorAlerts, setNewFlavorAlerts] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Hydrate saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('halo_bites_subscriptions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
      }
    } catch {
      // Ignore parse error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!enableEmail && !enableSms) {
      setError('Please select at least one subscription channel (Email or SMS).');
      return;
    }

    if (enableEmail && (!email || !email.includes('@'))) {
      setError('Please provide a valid email address for Email Updates.');
      return;
    }

    if (enableSms && (!phoneNumber || phoneNumber.trim().length < 7)) {
      setError('Please provide a valid phone number for SMS/Text Updates.');
      return;
    }

    const payload = {
      email: enableEmail ? email : '',
      phoneNumber: enableSms ? phoneNumber : '',
      enableEmail,
      enableSms,
      dealAlerts,
      orderAlerts,
      newFlavorAlerts,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('halo_bites_subscriptions', JSON.stringify(payload));
    } catch {
      // Ignore
    }

    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 sm:px-8 max-w-2xl">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Card Header */}
        <div className="bg-white border border-zinc-200 p-8 sm:p-12 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E91E63] mb-3 bg-[#FFF5F8] px-3 py-1 border border-[#F8DCE3]">
            <Sparkles size={14} /> Stay Connected
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#050505] mb-3">
            Subscription Preferences
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            Customize how you receive sweet treats news, secret menu drops, order tracking alerts, and exclusive birthday discounts.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-zinc-200 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-[#FFF5F8] border border-[#F8DCE3] rounded-full flex items-center justify-center mx-auto mb-6 text-[#E91E63]">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-2">
              Preferences Saved!
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-md mx-auto mb-6">
              Thank you! Your notification preferences have been successfully updated. You will receive updates according to your chosen channels.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Edit Preferences
              </button>
              <Link
                href="/shop"
                className="px-6 py-3 bg-[#E91E63] hover:bg-[#d81b5c] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-block text-center"
              >
                Browse Sweet Treats
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-8 sm:p-12 space-y-8 shadow-xs">
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {error}
              </div>
            )}

            {/* Channels Section */}
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-4 flex items-center gap-2">
                <Bell size={16} className="text-[#E91E63]" />
                <span>1. Select Notification Channels</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Channel Card */}
                <div 
                  onClick={() => setEnableEmail(!enableEmail)}
                  className={`p-5 border cursor-pointer transition-all ${
                    enableEmail 
                      ? 'border-[#E91E63] bg-[#FFF5F8]/60 shadow-xs' 
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <Mail size={18} className={enableEmail ? 'text-[#E91E63]' : 'text-zinc-400'} />
                      <span className="font-bold text-sm text-zinc-900">Email Updates</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={enableEmail}
                      onChange={(e) => setEnableEmail(e.target.checked)}
                      className="accent-[#E91E63] h-4 w-4 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Receive weekly flavor newsletters, VIP discount codes, and digital receipts.
                  </p>
                </div>

                {/* SMS Channel Card */}
                <div 
                  onClick={() => setEnableSms(!enableSms)}
                  className={`p-5 border cursor-pointer transition-all ${
                    enableSms 
                      ? 'border-[#E91E63] bg-[#FFF5F8]/60 shadow-xs' 
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <Phone size={18} className={enableSms ? 'text-[#E91E63]' : 'text-zinc-400'} />
                      <span className="font-bold text-sm text-zinc-900">SMS/Text Updates</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={enableSms}
                      onChange={(e) => setEnableSms(e.target.checked)}
                      className="accent-[#E91E63] h-4 w-4 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Get instant dispatch alerts, delivery time estimates, and flash drop alerts via SMS.
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs based on selection */}
            <div className="space-y-4 pt-2">
              {enableEmail && (
                <div>
                  <label htmlFor="subscribe-email" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      id="subscribe-email"
                      type="email"
                      required={enableEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#FAFAFA] border border-zinc-200 py-3.5 px-4 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
                    />
                  </div>
                </div>
              )}

              {enableSms && (
                <div>
                  <label htmlFor="subscribe-phone" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      id="subscribe-phone"
                      type="tel"
                      required={enableSms}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#FAFAFA] border border-zinc-200 py-3.5 px-4 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    Message and data rates may apply. Reply STOP anytime to cancel.
                  </span>
                </div>
              )}
            </div>

            {/* Content Preferences */}
            <div className="pt-2 border-t border-zinc-100">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-900 mb-3">
                2. Notification Topics
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer text-xs text-zinc-700 select-none">
                  <input
                    type="checkbox"
                    checked={dealAlerts}
                    onChange={(e) => setDealAlerts(e.target.checked)}
                    className="accent-[#E91E63] h-4 w-4"
                  />
                  <span>Exclusive promotions, holiday coupons, and VIP seasonal gifts</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-xs text-zinc-700 select-none">
                  <input
                    type="checkbox"
                    checked={orderAlerts}
                    onChange={(e) => setOrderAlerts(e.target.checked)}
                    className="accent-[#E91E63] h-4 w-4"
                  />
                  <span>Live order confirmation, baking progress, and delivery hand-off updates</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-xs text-zinc-700 select-none">
                  <input
                    type="checkbox"
                    checked={newFlavorAlerts}
                    onChange={(e) => setNewFlavorAlerts(e.target.checked)}
                    className="accent-[#E91E63] h-4 w-4"
                  />
                  <span>New surprise box releases, limited-edition cake bites, and secret menus</span>
                </label>
              </div>
            </div>

            {/* Privacy notice and Submit button */}
            <div className="pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-5">
                <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                <span>We respect your privacy. No spam ever, unsubscribe in 1-click anytime.</span>
              </div>
              <button
                type="submit"
                className="w-full bg-[#E91E63] hover:bg-[#d81b5c] text-white py-4 px-6 text-xs font-black uppercase tracking-widest transition-colors shadow-sm cursor-pointer"
              >
                Save Subscription Preferences
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center font-sans text-zinc-500 text-sm">
        Loading subscription preferences...
      </div>
    }>
      <SubscribeContent />
    </Suspense>
  );
}
