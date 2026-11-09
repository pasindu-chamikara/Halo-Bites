"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, CheckCircle2, Sparkles, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [subType, setSubType] = useState<'email' | 'sms'>('email');
  const [subEmail, setSubEmail] = useState('');
  const [subPhone, setSubPhone] = useState('');
  const [subError, setSubError] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleFooterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubError('');
    setSubSuccess(false);

    if (subType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!subEmail || !emailRegex.test(subEmail)) {
        setSubError('Please enter a valid email address.');
        return;
      }
      try {
        const existing = localStorage.getItem('halo_bites_subscriptions');
        const parsed = existing ? JSON.parse(existing) : {};
        localStorage.setItem(
          'halo_bites_subscriptions',
          JSON.stringify({ ...parsed, email: subEmail, enableEmail: true, updatedAt: new Date().toISOString() })
        );
      } catch {}
      setSubSuccess(true);
      setSubEmail('');
    } else {
      const cleaned = subPhone.replace(/\D/g, '');
      if (cleaned.length < 7) {
        setSubError('Please enter a valid phone number (at least 7 digits).');
        return;
      }
      try {
        const existing = localStorage.getItem('halo_bites_subscriptions');
        const parsed = existing ? JSON.parse(existing) : {};
        localStorage.setItem(
          'halo_bites_subscriptions',
          JSON.stringify({ ...parsed, phoneNumber: subPhone, enableSms: true, updatedAt: new Date().toISOString() })
        );
      } catch {}
      setSubSuccess(true);
      setSubPhone('');
    }
  };

  return (
    <footer className="bg-[#09090b] text-zinc-400 font-sans pt-16 pb-10 border-t border-zinc-800/80">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 max-w-7xl">
        
        {/* Top Newsletter Card */}
        <div className="bg-gradient-to-r from-zinc-900/90 via-zinc-900 to-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 lg:p-10 mb-14 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E91E63]/15 text-[#E91E63] border border-[#E91E63]/30 mb-3">
                <Sparkles size={13} />
                <span>Sweet Perks & Early Access</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Be First to Taste the Magic
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-lg">
                Subscribe for exclusive surprise box launches, fresh bakery drops, and 10% off your next sweet celebration.
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              {/* Type Switcher */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Choose channel:
                </span>
                <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    id="footer-email-toggle"
                    onClick={() => { setSubType('email'); setSubError(''); setSubSuccess(false); }}
                    className={`text-xs font-bold px-3 py-1 rounded-md transition-all cursor-pointer ${
                      subType === 'email' 
                        ? 'bg-[#E91E63] text-white shadow-sm shadow-[#E91E63]/25' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    id="footer-sms-toggle"
                    onClick={() => { setSubType('sms'); setSubError(''); setSubSuccess(false); }}
                    className={`text-xs font-bold px-3 py-1 rounded-md transition-all cursor-pointer ${
                      subType === 'sms' 
                        ? 'bg-[#E91E63] text-white shadow-sm shadow-[#E91E63]/25' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    SMS
                  </button>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleFooterSubscribe} id="footer-subscribe-form" className="flex flex-col gap-2">
                <div className="flex gap-2">
                  {subType === 'email' ? (
                    <input
                      type="email"
                      id="footer-sub-email-input"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      placeholder="Enter your email address"
                      aria-label="Email address for subscription"
                      className="flex-1 min-w-0 bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E91E63] transition-colors"
                    />
                  ) : (
                    <input
                      type="tel"
                      id="footer-sub-phone-input"
                      value={subPhone}
                      onChange={(e) => setSubPhone(e.target.value)}
                      placeholder="Enter your mobile number"
                      aria-label="Phone number for SMS subscription"
                      className="flex-1 min-w-0 bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E91E63] transition-colors"
                    />
                  )}
                  <button
                    type="submit"
                    id="footer-sub-submit-btn"
                    className="bg-[#E91E63] hover:bg-[#d81b5c] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#E91E63]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>

                {subError && (
                  <p id="footer-sub-error" className="text-xs text-rose-400 font-medium mt-1">
                    {subError}
                  </p>
                )}
                {subSuccess && (
                  <p id="footer-sub-success" className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
                    <CheckCircle2 size={14} /> Subscribed to {subType === 'email' ? 'Email' : 'SMS'} updates successfully!
                  </p>
                )}

                <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1">
                  <Link href="/subscribe?type=email" id="footer-email-sub-link" className="hover:text-zinc-300 transition-colors">
                    Email updates page
                  </Link>
                  <span>•</span>
                  <Link href="/subscribe?type=sms" id="footer-sms-link" className="hover:text-zinc-300 transition-colors">
                    SMS updates page
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-14">
          
          {/* Brand Info Column (Span 2 on desktop) */}
          <div className="lg:col-span-2">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 sm:gap-3 mb-4 focus:outline-none group inline-flex"
            >
              <img 
                src="/logo.png" 
                alt="Halo Bites Logo" 
                className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-2xl font-[900] tracking-tight text-white flex items-center gap-1.5">
                <span>Halo Bites</span>
                <span className="w-1.5 h-1.5 bg-[#E91E63]"></span>
              </span>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-sm">
              Delightful handcrafted cakes, celebration explosion boxes, and artisan dessert bites crafted fresh daily with premium ingredients.
            </p>

            {/* Direct Contact Pills */}
            <div className="flex flex-col gap-2.5 mb-6 text-xs">
              <a 
                href="mailto:hello@halobites.com" 
                id="footer-email-link"
                className="inline-flex items-center gap-2.5 text-zinc-300 hover:text-[#E91E63] transition-colors"
                title="Send us an email"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#E91E63]">
                  <Mail size={13} />
                </div>
                <span className="font-medium">hello@halobites.com</span>
              </a>

              <a 
                href="tel:306-509-5001" 
                id="footer-phone-link"
                className="inline-flex items-center gap-2.5 text-zinc-300 hover:text-[#E91E63] transition-colors"
                title="Call Halo Bites customer support"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#E91E63]">
                  <Phone size={13} />
                </div>
                <span className="font-medium">306-509-5001</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5">
              <a 
                href="https://facebook.com/halobites" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#E91E63] hover:border-[#E91E63] transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a 
                href="https://twitter.com/halobites" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#E91E63] hover:border-[#E91E63] transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12 3 12c.5.1 1.1.2 1.6.1C2 10.6 2 7 2 7c.6.3 1.3.5 2 .5C1.8 6 2.4 3 3.4 1.8 5.7 4.6 9.4 6.3 13.5 6.5 13.2 4.1 15 2 17.5 2c1.4 0 2.6.6 3.4 1.5 1.1-.2 2.1-.6 3.1-1.2-.4 1.1-1.1 2-2 2.6z"></path></svg>
              </a>
              <a 
                href="https://instagram.com/halobites" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#E91E63] hover:border-[#E91E63] transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Treats & Shop */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Sweet Treats
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-zinc-400">
              <li>
                <Link href="/shop" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Signature%20Cakes" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Signature Cakes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Birthday%20Gifts" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Surprise Explosion Boxes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Macarons" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Macarons & Bites
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Donuts" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Gourmet Donuts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/delivery-policy" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/my-orders" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-zinc-400">
              <li>
                <Link href="/faq" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#E91E63] transition-colors inline-block py-0.5">
                  Shipping Information
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Halo Bites. All rights reserved.</p>
          
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Handcrafted with</span>
            <Heart size={13} className="fill-[#E91E63] text-[#E91E63]" />
            <span>for your celebrations</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-500">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/delivery-policy" className="hover:text-zinc-300 transition-colors">Delivery</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
