"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp, BarChart3, PieChart, ShoppingBag, Package } from 'lucide-react';
import { getStoredProductsAsync, getStoredOrdersAsync, isTestOrder } from '@/utils/storage';

export default function ReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [productCount, setProductCount] = useState<number>(0);
  const [topProducts, setTopProducts] = useState<{ name: string; units: number; revenue: number }[]>([]);

  useEffect(() => {
    const loadReportsData = async () => {
      try {
        let allOrders: any[] = [];
        try {
          if (typeof getStoredOrdersAsync === 'function') {
            allOrders = await getStoredOrdersAsync();
          }
        } catch (err) {
          console.warn('Error reading stored orders:', err);
        }

        if (!allOrders || allOrders.length === 0) {
          const local = (typeof window !== 'undefined' ? localStorage.getItem('halo_bites_admin_orders') : null);
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed)) allOrders = parsed.filter(o => !isTestOrder(o));
            } catch {}
          }
        }

        setOrders(allOrders);

        // Aggregate product sales from real orders
        const productSalesMap = new Map<string, { units: number; revenue: number }>();
        allOrders.forEach(order => {
          if (Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
              const name = item.name || 'Sweet Treat';
              const qty = Number(item.quantity) || 1;
              const price = typeof item.price === 'number'
                ? item.price
                : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
              const lineRevenue = qty * price;

              if (productSalesMap.has(name)) {
                const prev = productSalesMap.get(name)!;
                productSalesMap.set(name, {
                  units: prev.units + qty,
                  revenue: prev.revenue + lineRevenue
                });
              } else {
                productSalesMap.set(name, { units: qty, revenue: lineRevenue });
              }
            });
          }
        });

        const sortedTop = Array.from(productSalesMap.entries())
          .map(([name, data]) => ({ name, units: data.units, revenue: data.revenue }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setTopProducts(sortedTop);

        const prods = await getStoredProductsAsync();
        setProductCount(prods.length);
      } catch (err) {
        console.warn('Error calculating reports:', err);
      }
    };

    loadReportsData();

    window.addEventListener('halo_bites_orders_updated', loadReportsData);
    window.addEventListener('storage', loadReportsData);

    return () => {
      window.removeEventListener('halo_bites_orders_updated', loadReportsData);
      window.removeEventListener('storage', loadReportsData);
    };
  }, []);

  const totalRevenue = orders.reduce((sum, o) => {
    const val = typeof o.rawTotal === 'number'
      ? o.rawTotal
      : parseFloat(String(o.total).replace(/[^0-9.]/g, '')) || 0;
    return sum + val;
  }, 0);

  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length) : 0;
  const totalUnitsSold = orders.reduce((acc, order) => {
    if (Array.isArray(order.items)) {
      return acc + order.items.reduce((s: number, i: any) => s + (Number(i.quantity) || 1), 0);
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-md p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Gross Revenue</h3>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-full"><TrendingUp size={16} /></div>
          </div>
          <div className="text-3xl font-black mb-1">
            Rs. {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-zinc-400 font-bold flex items-center gap-1">
            {orders.length > 0 ? `${orders.length} real order(s) processed` : 'Awaiting first order'}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Avg Order Value</h3>
            <div className="p-2 bg-[#E91E63]/10 text-[#E91E63] rounded-full"><BarChart3 size={16} /></div>
          </div>
          <div className="text-3xl font-black mb-1">
            Rs. {avgOrderValue.toFixed(2)}
          </div>
          <div className="text-xs text-zinc-400 font-bold flex items-center gap-1">
            Calculated from live orders
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Units Sold</h3>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-full"><Package size={16} /></div>
          </div>
          <div className="text-3xl font-black mb-1">
            {totalUnitsSold}
          </div>
          <div className="text-xs text-zinc-400 font-bold flex items-center gap-1">
            Across {productCount} catalog products
          </div>
        </div>
      </div>
      
      {/* Top Products Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-x-auto">
        <div className="p-6 border-b border-white/10">
          <h3 className="font-black uppercase tracking-tight text-lg">Top Performing Products</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Ranked by actual sales and units ordered by customers</p>
        </div>
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-black/20 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <th className="p-4 pl-6 border-b border-white/5">Product Name</th>
              <th className="p-4 border-b border-white/5">Units Sold</th>
              <th className="p-4 border-b border-white/5 text-right pr-6">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-12 text-center text-zinc-400 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShoppingBag size={24} className="text-zinc-600 mb-1" />
                    <p className="font-bold text-white text-base">No product sales recorded yet</p>
                    <p className="text-xs text-zinc-400 max-w-sm">When customers purchase items from your shop, sales performance and revenue per treat will be tracked here in real time.</p>
                  </div>
                </td>
              </tr>
            ) : (
              topProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="p-4 pl-6 font-bold flex items-center gap-3">
                    <span className="w-6 text-zinc-500 font-mono text-xs">#{idx + 1}</span>
                    <span className="text-white">{p.name}</span>
                  </td>
                  <td className="p-4 text-zinc-300 font-medium">{p.units}</td>
                  <td className="p-4 text-right pr-6 font-bold text-[#E91E63]">
                    Rs. {p.revenue.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
