"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return (
    <footer className="bg-[#0a0a0a] pt-16 pb-8 text-zinc-400 font-sans">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:px-8 max-w-7xl">
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-2xl font-black text-white tracking-tighter">HaloBites</h3>
          <p className="text-sm max-w-xs mb-6 text-zinc-300">
            HaloBites Delightful bites of joy, perfect for every sweet little celebration.
          </p>
          <div className="flex gap-3">
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12 3 12c.5.1 1.1.2 1.6.1C2 10.6 2 7 2 7c.6.3 1.3.5 2 .5C1.8 6 2.4 3 3.4 1.8 5.7 4.6 9.4 6.3 13.5 6.5 13.2 4.1 15 2 17.5 2c1.4 0 2.6.6 3.4 1.5 1.1-.2 2.1-.6 3.1-1.2-.4 1.1-1.1 2-2 2.6z"></path></svg>
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="mb-4 text-sm text-zinc-200">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-xs text-zinc-400">
            <li><Link href="/products" className="hover:text-white transition-colors">Our Products</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="mb-4 text-sm text-zinc-200">Stay Connected</h4>
          <ul className="flex flex-col gap-3 text-xs text-zinc-400">
            <li><Link href="#" className="hover:text-white transition-colors">Sign up for SMS/Text Updates</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Sign up for Email Updates</Link></li>
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
            <li className="flex items-center gap-2"><Mail size={14} /> hello@halobites.com</li>
            <li className="flex items-center gap-2"><Phone size={14} /> 306-509-5001</li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-16 border-t border-zinc-800/50 px-4 pt-8 text-center text-xs text-zinc-500 sm:px-8 max-w-7xl">
        <p>&copy; {new Date().getFullYear()} - All Rights Reserved</p>
      </div>
    </footer>
  );
}
