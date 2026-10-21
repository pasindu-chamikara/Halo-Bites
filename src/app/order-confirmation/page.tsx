"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Clock, 
  MapPin, 
  Gift, 
  CreditCard, 
  ArrowRight, 
  Printer, 
  Sparkles,
  ShoppingBag,
  Copy,
  Check
} from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  flavor: string;
  image: string;
  quantity: number;
}

interface OrderData {
  id: string;
  date: string;
  status: string;
  customer: any;
  delivery: {
    date: string;
    slot: string;
    giftNote?: {
      to?: string;
      from?: string;
      message?: string;
    } | null;
  };
  payment: {
    method: string;
    status: string;
  };
  items: OrderItem[];
  subtotal: number | string;
  shipping: number | string;
  discount: number | string;
  total: number | string;
}

// Resilient price parsing that handles numbers, formatted strings (e.g. "Rs. 45.00"), and edge cases
const parsePrice = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

const formatPrice = (val: any): string => {
  return parsePrice(val).toFixed(2);
};

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('halo_bites_last_order');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!orderId || parsed.id === orderId) {
          setOrder(parsed);
          return;
        }
      }

      // Check all orders
      const allStored = localStorage.getItem('halo_bites_user_orders');
      if (allStored) {
        const list: OrderData[] = JSON.parse(allStored);
        const match = list.find(o => o.id === orderId);
        if (match) {
          setOrder(match);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load order", e);
    }

    // Fallback demonstration order if navigated directly without an order
    const fallbackId = orderId || `ORD-${Math.floor(10000 + Math.random() * 90000)}-A`;
    setOrder({
      id: fallbackId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      customer: {
        firstName: 'Valued',
        lastName: 'Customer',
        email: 'customer@example.com',
        phone: '+94 77 123 4567',
        address: '42 Main Lotus Road',
        apartment: 'Suite 4B',
        city: 'Colombo',
        postalCode: '00700'
      },
      delivery: {
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        slot: 'Morning (10:00 AM – 1:00 PM)',
        giftNote: {
          to: 'Sarah',
          from: 'Liam',
          message: 'Wishing you the sweetest day filled with love and treats!'
        }
      },
      payment: {
        method: 'Credit / Debit Card',
        status: 'Paid'
      },
      items: [
        {
          id: 1,
          name: 'Strawberry Dream Box',
          price: 35.00,
          flavor: 'Love Gifts',
          image: '/hero1.png',
          quantity: 2
        },
        {
          id: 2,
          name: 'Classic Chocolate Explosion',
          price: 40.00,
          flavor: 'Birthday Gifts',
          image: '/hero2.png',
          quantity: 1
        }
      ],
      subtotal: 110.00,
      shipping: 0.00,
      discount: 10.00,
      total: 100.00
    });
  }, [orderId]);

  const copyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
        
        {/* Celebration Header Card */}
        <div className="bg-white border border-zinc-200 p-8 sm:p-12 text-center mb-8 relative overflow-hidden">
          
          {/* Subtle Pink Header Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#FFF0F4] blur-3xl pointer-events-none -z-0" />

          {/* Success Badge */}
          <div className="relative z-10 w-20 h-20 bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="stroke-[2.5]" />
          </div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#E91E63] mb-3 bg-[#FFF5F8] border border-[#F8DCE3] px-3 py-1">
              <Sparkles size={13} /> Order Confirmed
            </span>

            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#050505] mb-3">
              Thank You For Your Order!
            </h1>

            <p className="text-zinc-500 max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-6">
              We've received your sweet order. Our bakers are preparing your freshly crafted surprise treats with care.
            </p>

            {/* Order Reference Number */}
            <div className="inline-flex items-center gap-3 bg-zinc-50 border border-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-900">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Order ID:</span>
              <span className="font-mono text-black">{order.id}</span>
              <button 
                onClick={copyOrderId} 
                className="text-zinc-400 hover:text-black ml-1 transition-colors"
                title="Copy Order ID"
                aria-label="Copy Order ID"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Delivery Progress Tracker */}
        <div className="bg-white border border-zinc-200 p-6 sm:p-8 mb-8">
          <h2 className="text-base font-black uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock size={18} className="text-[#E91E63]" />
            <span>Order Status & Progress</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1: Confirmed */}
            <div className="p-4 border-2 border-emerald-600 bg-emerald-50/40 relative">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 block mb-1">Step 1 • Done</span>
              <h3 className="font-bold text-sm text-zinc-950">Order Confirmed</h3>
              <p className="text-xs text-zinc-500 mt-1">Payment & details verified</p>
            </div>

            {/* Step 2: Baking */}
            <div className="p-4 border-2 border-[#E91E63] bg-[#FFF5F8] relative">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E91E63] block mb-1">Step 2 • Active</span>
              <h3 className="font-bold text-sm text-zinc-950">Baking with Love</h3>
              <p className="text-xs text-zinc-500 mt-1">Fresh ingredients handcrafted</p>
            </div>

            {/* Step 3: Packaging */}
            <div className="p-4 border border-zinc-200 bg-zinc-50/50 opacity-75">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Step 3 • Next</span>
              <h3 className="font-bold text-sm text-zinc-950">Surprise Box Packaging</h3>
              <p className="text-xs text-zinc-500 mt-1">Custom ribbon & gift tag</p>
            </div>

            {/* Step 4: Delivery */}
            <div className="p-4 border border-zinc-200 bg-zinc-50/50 opacity-75">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Step 4 • Upcoming</span>
              <h3 className="font-bold text-sm text-zinc-950">Out for Hand Delivery</h3>
              <p className="text-xs text-zinc-500 mt-1">Arriving on chosen window</p>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-zinc-600 gap-2">
            <div>
              <span className="font-bold text-zinc-900">Scheduled Arrival:</span> {order.delivery.date} ({order.delivery.slot})
            </div>
            <div className="text-zinc-500">
              Notification confirmation sent to <span className="font-bold text-zinc-900">
                {(order as any).customerDetails?.email || (typeof order.customer === 'object' ? (order.customer as any)?.email : '') || 'your email'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Purchased Items (7 Cols) */}
          <div className="md:col-span-7 bg-white border border-zinc-200 p-6 sm:p-8">
            <h2 className="text-base font-black uppercase tracking-wider mb-6 pb-4 border-b border-zinc-100 flex items-center justify-between">
              <span>Items Purchased</span>
              <span className="text-xs font-bold text-zinc-400">{order.items.length} Products</span>
            </h2>

            <div className="divide-y divide-zinc-100">
              {order.items.map((item, index) => {
                const itemPriceNum = parsePrice(item.price);
                const itemQty = Number(item.quantity) || 1;
                return (
                  <div key={index} className="py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#FFF5F8] border border-[#F8DCE3] flex-shrink-0 flex items-center justify-center p-1.5 relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain" 
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = "/hero1.png";
                        }}
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center">
                        {itemQty}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-zinc-900 truncate">{item.name}</h4>
                      <p className="text-xs text-zinc-400">{item.flavor}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Rs. {formatPrice(itemPriceNum)} each</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-zinc-950">
                        Rs. {formatPrice(itemPriceNum * itemQty)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pricing Breakdown */}
            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">Rs. {formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Bakery Hand Delivery</span>
                <span className="font-bold text-zinc-900">
                  {parsePrice(order.shipping) === 0 ? 'FREE' : `Rs. ${formatPrice(order.shipping)}`}
                </span>
              </div>
              {parsePrice(order.discount) > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount Applied</span>
                  <span>- Rs. {formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-4 border-t border-zinc-200">
                <span className="text-sm font-black uppercase tracking-wider">Total Paid</span>
                <span className="text-2xl font-black text-[#E91E63]">Rs. {formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery Info (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Delivery Destination */}
            <div className="bg-white border border-zinc-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-1.5">
                <MapPin size={14} className="text-[#E91E63]" /> Delivery Address
              </h3>
              <p className="font-bold text-sm text-zinc-900">
                {typeof order.customer === 'string' 
                  ? order.customer 
                  : `${(order.customer as any)?.firstName || ''} ${(order.customer as any)?.lastName || ''}`.trim() || 'Valued Customer'}
              </p>
              {(() => {
                const details = (order as any).customerDetails || (typeof order.customer === 'object' ? order.customer : null);
                if (!details) return null;
                return (
                  <>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      {details.address}
                      {details.apartment ? `, ${details.apartment}` : ''}<br />
                      {details.city}{details.postalCode ? ` - ${details.postalCode}` : ''}
                    </p>
                    <p className="text-xs text-zinc-500 mt-2 font-medium">
                      Phone: {details.phone}
                    </p>
                    {details.specialInstructions && (
                      <div className="mt-3 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500 italic">
                        Note: "{details.specialInstructions}"
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-zinc-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-1.5">
                <CreditCard size={14} className="text-[#E91E63]" /> Payment Details
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-zinc-900">{order.payment.method}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Status: <span className="font-bold text-emerald-600">{order.payment.status}</span></p>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-200">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Handwritten Gift Note (If provided) */}
            {order.delivery.giftNote?.message && (
              <div className="bg-[#FFF5F8] border border-[#F8DCE3] p-6 relative">
                <div className="flex items-center gap-2 mb-2 text-[#E91E63]">
                  <Gift size={16} />
                  <h3 className="text-xs font-black uppercase tracking-wider">Handwritten Card Message</h3>
                </div>
                <p className="text-xs text-zinc-800 italic leading-relaxed bg-white/80 p-3 border border-[#F8DCE3]/60 mb-2">
                  "{order.delivery.giftNote.message}"
                </p>
                <div className="text-[11px] font-bold text-zinc-600 flex justify-between">
                  <span>To: {order.delivery.giftNote.to || 'You'}</span>
                  <span>From: {order.delivery.giftNote.from || 'Someone who loves you'}</span>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-zinc-200 p-6">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors"
          >
            <Printer size={15} /> Print Receipt
          </button>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <Link
              href="/orders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-zinc-900 text-black px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-colors"
            >
              View in My Orders
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E91E63] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#d81b5c] transition-colors shadow-md shadow-[#E91E63]/20"
            >
              Continue Shopping <ArrowRight size={15} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
