"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle, ChevronRight, Eye, ShoppingBag } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price?: number;
}

interface OrderRecord {
  id: string;
  date: string;
  status: string;
  total: number | string;
  items: OrderItem[];
}

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

import { isTestOrder } from '@/utils/storage';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('halo_bites_user_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const realOrders = parsed.filter(o => !isTestOrder(o));
          setOrders(realOrders);
        }
      }
    } catch (e) {
      console.error("Failed to parse orders", e);
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Processing': return <Package size={18} className="text-[#E91E63]" />;
      case 'In Transit': return <Truck size={18} className="text-blue-500" />;
      case 'Delivered': return <CheckCircle size={18} className="text-emerald-500" />;
      default: return <Package size={18} className="text-zinc-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Processing': return "bg-[#FFF5F8] text-[#E91E63] border-[#F8DCE3]";
      case 'In Transit': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'Delivered': return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-zinc-50 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-2">My Orders</h1>
            <p className="text-zinc-500">Track, manage, and review your recent Halo Bites deliveries.</p>
          </div>
          <Link
            href="/shop"
            id="mo-order-more-btn"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E91E63] hover:underline"
          >
            Order More Treats <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-zinc-200 shadow-sm transition-all hover:border-zinc-300">
              
              {/* Order Header */}
              <div className="border-b border-zinc-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
                <div className="flex flex-col sm:flex-row sm:gap-12 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="text-sm font-semibold">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Total</p>
                    <p className="text-sm font-semibold">Rs. {parsePrice(order.total).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Order #</p>
                    <p className="text-sm font-semibold font-mono">{order.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-1.5 flex items-center gap-2 border text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Order Body / Items */}
              <div className="p-6">
                <div className="flex flex-col gap-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-[#FFF5F8] border border-[#F8DCE3] flex-shrink-0 flex items-center justify-center p-2">
                        <img 
                          src={item.image} 
                          id={`mo-item-img-${order.id}-${idx}`}
                          alt={item.name} 
                          className="w-full h-full object-contain drop-shadow-md" 
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = "/hero1.png";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base mb-0.5">{item.name}</h3>
                        <p className="text-zinc-500 text-xs font-medium">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-zinc-100 pt-6">
                  <Link
                    href={`/order-confirmation?orderId=${order.id}`}
                    id={`mo-view-receipt-btn-${order.id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#050505] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#E91E63] transition-colors"
                  >
                    <Eye size={16} /> View Order & Receipt
                  </Link>
                  <Link
                    href={`/order-confirmation?orderId=${order.id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-zinc-200 text-[#050505] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                  >
                    Track Progress <ChevronRight size={16} />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
