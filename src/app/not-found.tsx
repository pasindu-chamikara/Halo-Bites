import Link from 'next/link';
import { Home, ShoppingBag, Truck, HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505] flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-8 max-w-2xl text-center">
        
        {/* Visual Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E91E63] mb-4 bg-[#FFF5F8] px-3.5 py-1.5 border border-[#F8DCE3]">
          Error 404 • Page Not Found
        </div>

        {/* Big Headline */}
        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tight text-zinc-900 mb-4">
          Oops!
        </h1>
        
        <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
          The sweet treat or page you're searching for seems to have crumbled, moved, or was already savored.
        </p>

        {/* Navigation Quick Links */}
        <div className="bg-white border border-zinc-200 p-8 shadow-xs max-w-md mx-auto mb-8 text-left space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Popular Destinations</p>
          
          <Link
            href="/"
            className="flex items-center justify-between p-3 border border-zinc-100 hover:border-[#E91E63] hover:bg-[#FFF5F8] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Home size={18} className="text-[#E91E63]" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">Home Page</span>
            </div>
            <span className="text-xs text-zinc-400 group-hover:text-[#E91E63]">→</span>
          </Link>

          <Link
            href="/shop"
            className="flex items-center justify-between p-3 border border-zinc-100 hover:border-[#E91E63] hover:bg-[#FFF5F8] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} className="text-[#E91E63]" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">Browse Shop & Treats</span>
            </div>
            <span className="text-xs text-zinc-400 group-hover:text-[#E91E63]">→</span>
          </Link>

          <Link
            href="/my-orders"
            className="flex items-center justify-between p-3 border border-zinc-100 hover:border-[#E91E63] hover:bg-[#FFF5F8] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Truck size={18} className="text-[#E91E63]" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">My Orders & Tracking</span>
            </div>
            <span className="text-xs text-zinc-400 group-hover:text-[#E91E63]">→</span>
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-between p-3 border border-zinc-100 hover:border-[#E91E63] hover:bg-[#FFF5F8] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={18} className="text-[#E91E63]" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">Contact Support</span>
            </div>
            <span className="text-xs text-zinc-400 group-hover:text-[#E91E63]">→</span>
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-[#E91E63] transition-colors"
        >
          <ArrowLeft size={16} /> Return to Halo Bites Home
        </Link>

      </div>
    </div>
  );
}
