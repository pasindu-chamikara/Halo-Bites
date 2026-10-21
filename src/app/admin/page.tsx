"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Package, Clock, DollarSign, Users, ShoppingBag, Trash2, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getPersistentData, getStoredProductsAsync, getStoredOrdersAsync, isTestOrder, purgeAllTestDataFromBrowser } from '@/utils/storage';
import { DEFAULT_PRODUCTS } from '@/data/catalog';

export default function AdminOverview() {
  const [orders, setOrders] = useState<any[]>([]);
  const [productCount, setProductCount] = useState<number>(DEFAULT_PRODUCTS.length);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [purgedNotice, setPurgedNotice] = useState<string>('');
  const [isCleaning, setIsCleaning] = useState<boolean>(false);

  const loadDashboardData = async () => {
    try {
      // 1. Automatically purge any residual test orders on load
      if (typeof window !== 'undefined' && !localStorage.getItem('halo_bites_test_orders_purged')) {
        await purgeAllTestDataFromBrowser();
      }

      // 2. Load all real orders from Cloud Firestore and local storage
      const rawOrders = await getStoredOrdersAsync();
      const allRealOrders = rawOrders.map(o => {
        const customerName = typeof o.customer === 'string'
          ? o.customer
          : `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim() || 'Customer';

        const formattedTotal = typeof o.total === 'string'
          ? o.total
          : `Rs. ${Number(o.total || 0).toFixed(2)}`;

        return {
          id: o.id,
          customer: customerName,
          date: o.date || 'Recent',
          total: formattedTotal,
          rawTotal: typeof o.total === 'number' ? o.total : (parseFloat(formattedTotal.replace(/[^0-9.]/g, '')) || 0),
          status: o.status || 'Processing'
        };
      });

      setOrders(allRealOrders);

      // Compute Total Revenue strictly from real placed orders
      const realRevenue = allRealOrders.reduce((sum, order) => {
        const val = typeof order.rawTotal === 'number'
          ? order.rawTotal
          : parseFloat(String(order.total).replace(/[^0-9.]/g, '')) || 0;
        return sum + val;
      }, 0);
      setTotalRevenue(realRevenue);

      // 4. Load product count strictly from real products in storage/catalog (excluding test products)
      const prods = await getStoredProductsAsync();
      if (prods && Array.isArray(prods)) {
        const activeOnly = prods.filter(p => p.status !== 'Draft');
        setProductCount(activeOnly.length);
      } else {
        setProductCount(0);
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    }
  };

  const handleManualPurge = async () => {
    setIsCleaning(true);
    const result = await purgeAllTestDataFromBrowser();
    await loadDashboardData();
    setIsCleaning(false);
    setPurgedNotice(`Cleaned all test data! Ready for real orders & products.`);
    setTimeout(() => setPurgedNotice(''), 5000);
  };

  useEffect(() => {
    loadDashboardData();

    const handleUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener('halo_bites_orders_updated', handleUpdate);
    window.addEventListener('halo_bites_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('halo_bites_orders_updated', handleUpdate);
      window.removeEventListener('halo_bites_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const pendingCount = orders.filter(o => o.status === 'Processing').length;
  const recentOrders = orders.slice(0, 6);

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, trend: totalRevenue > 0 ? 'Live Revenue' : 'Awaiting Sales', isUp: totalRevenue > 0 },
    { label: 'Total Orders', value: `${orders.length}`, trend: orders.length > 0 ? `${orders.length} Placed` : '0 Orders', isUp: orders.length > 0 },
    { label: 'Pending Processing', value: `${pendingCount}`, trend: pendingCount > 0 ? 'Action Required' : 'All Fulfilled', isUp: pendingCount === 0 },
    { label: 'Active Products', value: `${productCount}`, trend: 'Live Catalog', isUp: productCount > 0 },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Real Data Status Banner */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Live Real Data Mode Active
            </p>
            <p className="text-[11px] text-zinc-400">
              All mock/test orders and dummy items have been removed. Dashboard reflects 100% real storefront operations.
            </p>
          </div>
        </div>

        <button
          onClick={handleManualPurge}
          disabled={isCleaning}
          className="shrink-0 text-[11px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white px-3.5 py-1.5 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={13} className={isCleaning ? 'animate-spin' : ''} />
          {isCleaning ? 'Purging...' : 'Force Purge Test Data'}
        </button>
      </div>

      {purgedNotice && (
        <div className="bg-[#E91E63]/10 border border-[#E91E63]/30 p-3 text-xs text-white flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#E91E63]" />
          <span>{purgedNotice}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-md p-6 border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-4">{stat.label}</h3>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black">{stat.value}</span>
              <span className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-emerald-400' : 'text-zinc-400'}`}>
                {stat.isUp && <ArrowUpRight size={14} className="mr-0.5" />}
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-x-auto">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h3 className="font-black uppercase text-lg tracking-tight">Recent Orders</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Real customer purchases from live checkout</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-[#E91E63] uppercase tracking-widest hover:text-white transition-colors">
            Manage All Orders ({orders.length}) →
          </Link>
        </div>
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-black/20 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <th className="p-4 pl-6 border-b border-white/5">Order ID</th>
              <th className="p-4 border-b border-white/5">Customer</th>
              <th className="p-4 border-b border-white/5">Date</th>
              <th className="p-4 border-b border-white/5">Status</th>
              <th className="p-4 pr-6 border-b border-white/5 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-zinc-400 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShoppingBag size={28} className="text-zinc-600 mb-1" />
                    <p className="font-bold text-white text-base">No real orders received yet</p>
                    <p className="text-xs text-zinc-400 max-w-sm">When customers place orders on the shop and checkout, their real purchases will appear here automatically.</p>
                    <Link
                      href="/shop"
                      className="mt-3 text-xs font-bold bg-[#E91E63] text-white px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase tracking-wider"
                    >
                      Visit Shop to Place Real Order →
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="p-4 pl-6 font-mono font-bold text-[#E91E63]">
                    {order.id}
                  </td>
                  <td className="p-4 text-zinc-200 font-medium">{order.customer}</td>
                  <td className="p-4 text-zinc-400 text-sm">{order.date}</td>
                  <td className="p-4"><StatusBadge status={order.status} /></td>
                  <td className="p-4 pr-6 text-right font-black text-white">{order.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = "bg-white/5 text-zinc-400 border border-white/10";
  if (status === 'Delivered') color = "bg-emerald-950/50 text-emerald-400 border border-emerald-900";
  if (status === 'Processing') color = "bg-[#E91E63]/10 text-[#E91E63] border border-[#E91E63]/20";
  if (status === 'In Transit') color = "bg-blue-950/50 text-blue-400 border border-blue-900";
  if (status === 'Cancelled') color = "bg-red-950/50 text-red-400 border border-red-900";
  
  return (
    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${color}`}>
      {status}
    </span>
  );
}
