"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Truck, User, Menu, X, ArrowRight, Shield, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { isLoggedIn, userEmail, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Delivery Policy', href: '/delivery-policy' },
    { label: 'My Orders', href: '/orders' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-zinc-200 shadow-xs">
        <div className="container mx-auto flex h-16 sm:h-20 lg:h-[90px] items-center justify-between px-4 sm:px-8 lg:px-16 max-w-[1440px]">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl sm:text-[22px] font-[900] tracking-tight text-[#050505] flex items-center gap-1.5 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Halo Bites</span>
              <span className="w-1.5 h-1.5 bg-[#E91E63]"></span>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-semibold tracking-wide text-[#555555]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`transition-colors py-1 border-b-2 ${
                    isActive 
                      ? 'text-[#E91E63] border-[#E91E63]' 
                      : 'border-transparent hover:text-[#E91E63]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Order Tracking */}
            <Link 
              href="/orders" 
              title="Track Orders"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition-colors border border-zinc-200 rounded-none cursor-pointer"
            >
              <Truck size={17} />
            </Link>

            {/* Cart Icon with Live Counter */}
            <Link 
              href="/cart" 
              title="Cart"
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition-colors border border-zinc-200 rounded-none cursor-pointer"
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center bg-[#E91E63] text-[9px] font-bold text-white rounded-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User / Auth Menu (Desktop) */}
            {isLoggedIn ? (
              <div className="relative group hidden sm:block">
                <Link 
                  href="/profile" 
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition-colors border border-zinc-200 rounded-none"
                >
                  <User size={17} />
                </Link>
                <div className="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 shadow-xl rounded-none hidden group-hover:block divide-y divide-zinc-100 z-50">
                  <div className="px-4 py-3 text-xs text-zinc-500 font-semibold truncate bg-zinc-50">
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-400">Signed in as</span>
                    <span className="font-bold text-zinc-900 truncate block">{userEmail}</span>
                  </div>
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs font-bold text-[#E91E63] hover:bg-[#FFF5F8] transition-colors"
                    >
                      <Shield size={14} /> Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    href="/profile"
                    className="block w-full text-left px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden sm:inline-flex h-9 sm:h-10 items-center justify-center bg-[#E91E63] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#050505] transition-colors shadow-xs rounded-none"
              >
                Log In
              </Link>
            )}

            {/* Mobile Menu Toggle Button (Hamburger / Close) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="flex lg:hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center bg-[#E91E63] text-white hover:bg-[#050505] transition-colors border border-transparent rounded-none cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white shadow-2xl animate-in fade-in-50 duration-200">
            <div className="px-5 py-6 flex flex-col gap-1 max-h-[calc(100vh-80px)] overflow-y-auto">
              
              {/* Quick Announcement */}
              <div className="mb-4 pb-3 border-b border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E91E63]">
                  Halo Bites Treats
                </span>
                <span className="text-[10px] bg-[#FFF5F8] text-[#E91E63] px-2 py-0.5 font-bold border border-[#F8DCE3]">
                  Fresh Baked Daily
                </span>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border ${
                        isActive
                          ? 'bg-[#FFF5F8] text-[#E91E63] border-[#F8DCE3]'
                          : 'text-zinc-800 hover:bg-zinc-50 border-transparent'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={14} className={isActive ? 'text-[#E91E63]' : 'text-zinc-300'} />
                    </Link>
                  );
                })}
              </div>

              {/* Quick Action: Shop Now */}
              <div className="pt-4 mt-2">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#E91E63] text-white py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-[#050505] transition-colors shadow-xs"
                >
                  <span>Explore All Treats</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Mobile Auth / Account Section */}
              <div className="pt-5 mt-4 border-t border-zinc-200">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2.5 bg-zinc-50 border border-zinc-200">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Signed in as</span>
                      <span className="text-xs font-bold text-zinc-900 truncate block">{userEmail}</span>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E91E63] transition-colors"
                      >
                        <Shield size={14} /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700 bg-white border border-zinc-200 hover:border-black transition-colors"
                    >
                      <span>My Profile</span>
                      <ArrowRight size={14} />
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer border border-red-200"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider border border-zinc-300 hover:border-black text-zinc-800 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-[#E91E63] transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
