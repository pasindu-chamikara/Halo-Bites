"use client";

import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, MoreVertical, Mail, Phone } from 'lucide-react';
import { getStoredOrdersAsync, isTestOrder } from '@/utils/storage';

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orders: number;
  spent: string;
  status: 'Active' | 'VIP' | 'Inactive';
  date: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCustomers = async () => {
    try {
      // 1. Gather all real orders from Cloud Firestore, admin, and user storage
      const allOrders = await getStoredOrdersAsync();

      // Map customers strictly by email or name from real placed orders
      const customerMap = new Map<string, CustomerItem>();

      allOrders.forEach((order) => {
        if (!order || isTestOrder(order)) return;
        const name = typeof order.customer === 'string'
          ? order.customer
          : `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim();

        if (!name) return;

        const email = order.customerDetails?.email || order.customer?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@customer.com`;
        const phone = order.customerDetails?.phone || order.customer?.phone;
        const totalNum = typeof order.rawTotal === 'number'
          ? order.rawTotal
          : parseFloat(String(order.total).replace(/[^0-9.]/g, '')) || 0;

        const emailKey = email.toLowerCase();
        if (customerMap.has(emailKey)) {
          const existing = customerMap.get(emailKey)!;
          customerMap.set(emailKey, {
            ...existing,
            orders: existing.orders + 1,
            spent: `Rs. ${(parseFloat(existing.spent.replace(/[^0-9.]/g, '')) + totalNum).toFixed(2)}`
          });
        } else {
          customerMap.set(emailKey, {
            id: `CUS-${String(customerMap.size + 1).padStart(3, '0')}`,
            name,
            email,
            phone,
            orders: 1,
            spent: `Rs. ${totalNum.toFixed(2)}`,
            status: totalNum > 100 ? 'VIP' : 'Active',
            date: order.date || 'Recent'
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (e) {
      console.error('Failed to load customers', e);
    }
  };


  useEffect(() => {
    loadCustomers();

    const handleUpdate = () => {
      loadCustomers();
    };

    window.addEventListener('halo_bites_orders_updated', handleUpdate);
    return () => {
      window.removeEventListener('halo_bites_orders_updated', handleUpdate);
    };
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="Search customers by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E91E63] transition-colors"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button 
            onClick={loadCustomers}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-black/20 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <th className="p-4 pl-6 border-b border-white/5">Customer</th>
              <th className="p-4 border-b border-white/5">Status</th>
              <th className="p-4 border-b border-white/5">Total Orders</th>
              <th className="p-4 border-b border-white/5">Total Spent</th>
              <th className="p-4 border-b border-white/5">Joined / First Order</th>
              <th className="p-4 pr-6 border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E91E63]/20 rounded-none flex items-center justify-center font-black text-[#E91E63]">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white">{customer.name}</div>
                        <div className="text-xs text-zinc-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border
                      ${customer.status === 'VIP' ? 'bg-purple-900/30 text-purple-400 border-purple-500/50' : 
                        customer.status === 'Active' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50' : 
                        'bg-zinc-800 text-zinc-400 border-zinc-600'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-zinc-300">{customer.orders}</td>
                  <td className="p-4 font-bold text-white">{customer.spent}</td>
                  <td className="p-4 text-zinc-400 text-sm">{customer.date}</td>
                  <td className="p-4 pr-6 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors p-2">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="font-bold text-white text-base">No real customer profiles yet</p>
                    <p className="text-xs text-zinc-400 max-w-sm">
                      {searchTerm ? `No customers matched "${searchTerm}"` : 'Customer profiles and order histories will be created here automatically when customers make purchases.'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
