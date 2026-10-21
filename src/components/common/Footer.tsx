"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, CheckCircle2 } from 'lucide-react';

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
    <footer className="bg-[#0a0a0a] pt-16 pb-8 text-zinc-400 font-sans">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:px-8 max-w-7xl">
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-2xl font-black text-white tracking-tighter">HaloBites</h3>
          <p className="text-sm max-w-xs mb-6 text-zinc-300">
            HaloBites Delightful bites of joy, perfect for every sweet little celebration.
          </p>
          <div className="flex gap-3">
            <a 
              href="https://facebook.com/halobites" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a 
              href="https://twitter.com/halobites" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12 3 12c.5.1 1.1.2 1.6.1C2 10.6 2 7 2 7c.6.3 1.3.5 2 .5C1.8 6 2.4 3 3.4 1.8 5.7 4.6 9.4 6.3 13.5 6.5 13.2 4.1 15 2 17.5 2c1.4 0 2.6.6 3.4 1.5 1.1-.2 2.1-.6 3.1-1.2-.4 1.1-1.1 2-2 2.6z"></path></svg>
            </a>
            <a 
              href="https://instagram.com/halobites" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="mb-4 text-sm text-zinc-200">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-xs text-zinc-400">
            <li><Link href="/shop" className="hover:text-white transition-colors">Our Products</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="mb-4 text-sm text-zinc-200">Stay Connected</h4>
          
          {/* Quick Subscribe Form */}
          <div className="bg-zinc-900 border border-zinc-800 p-3 mb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Updates</span>
              <div className="flex gap-1 bg-zinc-950 p-0.5 border border-zinc-800">
                <button
                  type="button"
                  id="footer-email-toggle"
                  onClick={() => { setSubType('email'); setSubError(''); setSubSuccess(false); }}
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 transition-colors cursor-pointer ${
                    subType === 'email' ? 'bg-[#E91E63] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  id="footer-sms-toggle"
                  onClick={() => { setSubType('sms'); setSubError(''); setSubSuccess(false); }}
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 transition-colors cursor-pointer ${
                    subType === 'sms' ? 'bg-[#E91E63] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  SMS
                </button>
              </div>
            </div>

            <form onSubmit={handleFooterSubscribe} id="footer-subscribe-form" className="flex flex-col gap-1.5">
              <div className="flex gap-1">
                {subType === 'email' ? (
                  <input
                    type="email"
                    id="footer-sub-email-input"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder="Enter email"
                    aria-label="Email address for subscription"
                    className="flex-1 min-w-0 bg-zinc-950 border border-zinc-700 px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E91E63]"
                  />
                ) : (
                  <input
                    type="tel"
                    id="footer-sub-phone-input"
                    value={subPhone}
                    onChange={(e) => setSubPhone(e.target.value)}
                    placeholder="Enter phone"
                    aria-label="Phone number for SMS subscription"
                    className="flex-1 min-w-0 bg-zinc-950 border border-zinc-700 px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E91E63]"
                  />
                )}
                <button
                  type="submit"
                  id="footer-sub-submit-btn"
                  className="bg-[#E91E63] hover:bg-[#d81b5c] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Join
                </button>
              </div>

              {subError && (
                <p id="footer-sub-error" className="text-[10px] text-red-400 font-medium">
                  {subError}
                </p>
              )}
              {subSuccess && (
                <p id="footer-sub-success" className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Subscribed to {subType === 'email' ? 'Email' : 'SMS'}!
                </p>
              )}
            </form>
          </div>

          <ul className="flex flex-col gap-2.5 text-xs text-zinc-400">
            <li><Link href="/subscribe?type=sms" id="footer-sms-link" className="hover:text-white transition-colors">Sign up for SMS/Text Updates</Link></li>
            <li><Link href="/subscribe?type=email" id="footer-email-sub-link" className="hover:text-white transition-colors">Sign up for Email Updates</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="mb-4 text-sm text-zinc-200">Customer Care</h4>
          <ul className="flex flex-col gap-3 text-xs text-zinc-400">
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="mb-4 text-sm text-zinc-200">Get In Touch</h4>
          <ul className="flex flex-col gap-3 text-xs text-zinc-400">
            <li>
              <a 
                href="mailto:hello@halobites.com" 
                id="footer-email-link"
                className="flex items-center gap-2 hover:text-white transition-colors"
                title="Send us an email"
              >
                <Mail size={14} className="text-[#E91E63]" />
                <span>hello@halobites.com</span>
              </a>
            </li>
            <li>
              <a 
                href="tel:306-509-5001" 
                id="footer-phone-link"
                className="flex items-center gap-2 hover:text-white transition-colors"
                title="Call Halo Bites customer support"
              >
                <Phone size={14} className="text-[#E91E63]" />
                <span>306-509-5001</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-16 border-t border-zinc-800/50 px-4 pt-8 text-center text-xs text-zinc-500 sm:px-8 max-w-7xl">
        <p>&copy; {new Date().getFullYear()} - All Rights Reserved</p>
      </div>
    </footer>
  );
}
