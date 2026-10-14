"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Package, Clock, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { getPersistentData } from '@/utils/storage';
import { AdminOrder } from './orders/page';

const BASE_MOCK_ORDERS = [
  { id: 'ORD-1001', customer: 'Jane Doe', date: 'Oct 8, 2026', total: 'Rs. 114.00', status: 'Processing', rawTotal: 114.00 },
  { id: 'ORD-1002', customer: 'John Smith', date: 'Oct 7, 2026', total: 'Rs. 35.00', status: 'Delivered', rawTotal: 35.00 },
  { id: 'ORD-1003', customer: 'Alice Johnson', date: 'Oct 7, 2026', total: 'Rs. 85.00', status: 'In Transit', rawTotal: 85.00 },
  { id: 'ORD-1004', customer: 'Bob Brown', date: 'Oct 6, 2026', total: 'Rs. 45.00', status: 'Delivered', rawTotal: 45.00 },
];

export default function AdminOverview() {
  const [orders, setOrders] = useState<any[]>(BASE_MOCK_ORDERS);
  const [productCount, setProductCount] = useState<number>(24);
  const [totalRevenue, setTotalRevenue] = useState<number>(24592.00);

  const loadDashboardData = async () => {
    try {
      // 1. Load Admin Orders
      let adminOrders = await getPersistentData<any[]>('halo_bites_admin_orders');
      if (!adminOrders) {
        const local = localStorage.getItem('halo_bites_admin_orders');
        if (local) {
          try { adminOrders = JSON.parse(local); } catch {}
        }
      }

      // 2. Also check user orders from checkout to guarantee no orders are missed
      let userOrders: any[] = [];
      const localUser = localStorage.getItem('halo_bites_user_orders');
      if (localUser) {
        try { userOrders = JSON.parse(localUser); } catch {}
      }

      const combinedMap = new Map<string, any>();
      BASE_MOCK_ORDERS.forEach(o => combinedMap.set(o.id, o));

      if (adminOrders && Array.isArray(adminOrders)) {
        adminOrders.forEach(o => combinedMap.set(o.id, o));
      }

      if (userOrders && Array.isArray(userOrders)) {
        userOrders.forEach(o => {
          const customerName = typeof o.customer === 'string'
            ? o.customer
            : `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim() || 'Customer';

          const formattedTotal = typeof o.total === 'string'
            ? o.total
            : `Rs. ${Number(o.total || 0).toFixed(2)}`;

          combinedMap.set(o.id, {
            id: o.id,
            customer: customerName,
            date: o.date || 'Recent',
            total: formattedTotal,
            rawTotal: typeof o.total === 'number' ? o.total : (parseFloat(formattedTotal.replace(/[^0-9.]/g, '')) || 0),
            status: o.status || 'Processing'
          });
        });
      }

      const allOrders = Array.from(combinedMap.values()).sort((a, b) => {
        const isStandardA = a.id.startsWith('ORD-100');
        const isStandardB = b.id.startsWith('ORD-100');
        if (!isStandardA && isStandardB) return -1;
        if (isStandardA && !isStandardB) return 1;
        return 0;
      });

      setOrders(allOrders);

      // Compute Total Revenue
      const addedRevenue = allOrders.reduce((sum, order) => {
        const val = typeof order.rawTotal === 'number'
          ? order.rawTotal
          : parseFloat(String(order.total).replace(/[^0-9.]/g, '')) || 0;
        return sum + val;
      }, 0);
      setTotalRevenue(24000 + addedRevenue);

      // 3. Load product count
      const prods = await getPersistentData<any[]>('halo_bites_admin_products');
      if (prods && Array.isArray(prods)) {
        setProductCount(prods.length);
      } else {
        const localProds = localStorage.getItem('halo_bites_admin_products');
        if (localProds) {
          try {
            const parsed = JSON.parse(localProds);
            if (Array.isArray(parsed)) setProductCount(parsed.length);
          } catch {}
        }
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener('halo_bites_orders_updated', handleUpdate);
    window.addEventListener('halo_bites_products_updated', handleUpdate);

    return () => {
      window.removeEventListener('halo_bites_orders_updated', handleUpdate);
      window.removeEventListener('halo_bites_products_updated', handleUpdate);
    };
  }, []);

  const pendingCount = orders.filter(o => o.status === 'Processing').length;
  const recentOrders = orders.slice(0, 6);

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, trend: '+14.2%', isUp: true },
    { label: 'Total Orders', value: `${840 + orders.length}`, trend: '+8.1%', isUp: true },
    { label: 'Pending Processing', value: `${pendingCount}`, trend: pendingCount > 0 ? 'Needs Attention' : 'All Clear', isUp: pendingCount === 0 },
    { label: 'Active Products', value: `${productCount}`, trend: 'In Stock', isUp: true },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-md p-6 border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-4">{stat.label}</h3>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black">{stat.value}</span>
              <span className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-emerald-400' : 'text-[#E91E63]'}`}>
                {stat.isUp ? <ArrowUpRight size={14} className="mr-0.5" /> : null}
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
            <p className="text-xs text-zinc-400 mt-0.5">Live store orders & customer purchases</p>
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
            {recentOrders.map((order, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="p-4 pl-6 font-mono font-bold text-[#E91E63]">
                  {order.id}
                </td>
                <td className="p-4 text-zinc-200 font-medium">{order.customer}</td>
                <td className="p-4 text-zinc-400 text-sm">{order.date}</td>
                <td className="p-4"><StatusBadge status={order.status} /></td>
                <td className="p-4 pr-6 text-right font-black text-white">{order.total}</td>
              </tr>
            ))}
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
