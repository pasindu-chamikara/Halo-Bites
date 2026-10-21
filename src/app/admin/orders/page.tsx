"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Gift, 
  X,
  CreditCard,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { getPersistentData, setPersistentData, isTestOrder } from '@/utils/storage';
import { db } from '@/config/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export interface OrderItem {
  id?: number | string;
  name: string;
  price: number;
  flavor?: string;
  image?: string;
  quantity: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  customerDetails?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    apartment?: string;
    city?: string;
    postalCode?: string;
    specialInstructions?: string;
  };
  delivery?: {
    date?: string;
    slot?: string;
    giftNote?: {
      to?: string;
      from?: string;
      message?: string;
    } | null;
  };
  payment?: {
    method?: string;
    status?: string;
  };
  date: string;
  total: string;
  rawTotal?: number;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  items?: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      // 1. Check persistent admin storage
      let adminOrders = await getPersistentData<AdminOrder[]>('halo_bites_admin_orders');
      if (!adminOrders) {
        const local = localStorage.getItem('halo_bites_admin_orders');
        if (local) {
          try { adminOrders = JSON.parse(local); } catch {}
        }
      }

      // Filter out ANY test orders
      if (adminOrders && Array.isArray(adminOrders)) {
        adminOrders = adminOrders.filter(o => !isTestOrder(o));
      }

      // 2. Check user orders from checkout
      let userOrders: any[] = [];
      const localUser = localStorage.getItem('halo_bites_user_orders');
      if (localUser) {
        try { userOrders = JSON.parse(localUser); } catch {}
      }

      // Merge real orders
      const combinedMap = new Map<string, AdminOrder>();

      // Saved admin orders
      if (adminOrders && Array.isArray(adminOrders)) {
        adminOrders.forEach(order => {
          if (order && order.id && !isTestOrder(order)) combinedMap.set(order.id, order);
        });
      }

      // User-placed orders from checkout
      if (userOrders && Array.isArray(userOrders)) {
        userOrders.forEach(o => {
          if (!o || !o.id || isTestOrder(o)) return;
          const customerName = typeof o.customer === 'string'
            ? o.customer
            : `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim() || 'Customer';

          const formattedTotal = typeof o.total === 'string'
            ? o.total
            : `Rs. ${Number(o.total || 0).toFixed(2)}`;

          combinedMap.set(o.id, {
            id: o.id,
            customer: customerName,
            customerDetails: o.customerDetails || (typeof o.customer === 'object' ? o.customer : {}),
            delivery: o.delivery,
            payment: o.payment,
            date: o.date || 'Recent',
            total: formattedTotal,
            rawTotal: typeof o.total === 'number' ? o.total : parseFloat(formattedTotal.replace(/[^0-9.]/g, '')) || 0,
            status: o.status || 'Processing',
            items: o.items || []
          });
        });
      }

      // 3. Query Cloud Firestore orders so orders placed from any device or browser are synchronized
      try {
        const snap = await getDocs(collection(db, 'orders'));
        if (!snap.empty) {
          snap.forEach(docSnap => {
            const data = docSnap.data();
            if (data && data.id && !isTestOrder(data)) {
              const formattedTotal = typeof data.total === 'string'
                ? data.total
                : `Rs. ${Number(data.total || 0).toFixed(2)}`;

              combinedMap.set(data.id, {
                id: data.id,
                customer: data.customer || 'Customer',
                customerDetails: data.customerDetails || {},
                delivery: data.delivery,
                payment: data.payment,
                date: data.date || 'Recent',
                total: formattedTotal,
                rawTotal: typeof data.total === 'number' ? data.total : parseFloat(formattedTotal.replace(/[^0-9.]/g, '')) || 0,
                status: (data.status as AdminOrder['status']) || 'Processing',
                items: data.items || []
              });
            }
          });
        }
      } catch (cloudErr) {
        // Fallback to local
      }

      const mergedList = Array.from(combinedMap.values());
      setOrders(mergedList);
      // Keep persistent storage clean without mock orders
      await setPersistentData('halo_bites_admin_orders', mergedList);
      localStorage.setItem('halo_bites_admin_orders', JSON.stringify(mergedList));
    } catch (e) {
      console.error('Failed to load orders', e);
    }
  };


  useEffect(() => {
    loadOrders();

    const handleUpdate = () => {
      loadOrders();
    };

    window.addEventListener('halo_bites_orders_updated', handleUpdate);
    return () => {
      window.removeEventListener('halo_bites_orders_updated', handleUpdate);
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: AdminOrder['status']) => {
    setIsUpdating(true);
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);

    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, status: newStatus });
    }

    try {
      await setPersistentData('halo_bites_admin_orders', updated);
      localStorage.setItem('halo_bites_admin_orders', JSON.stringify(updated));

      // Also sync to user orders so customer order tracking updates!
      const userOrdersRaw = localStorage.getItem('halo_bites_user_orders');
      if (userOrdersRaw) {
        try {
          const userOrders = JSON.parse(userOrdersRaw);
          const updatedUser = userOrders.map((uo: any) => uo.id === orderId ? { ...uo, status: newStatus } : uo);
          localStorage.setItem('halo_bites_user_orders', JSON.stringify(updatedUser));
        } catch {}
      }

      // Mirror status update to Firestore
      try {
        await setDoc(doc(db, 'orders', orderId), { status: newStatus }, { merge: true });
      } catch (cloudErr) {
        console.warn('Could not mirror order status update to Firestore', cloudErr);
      }

      window.dispatchEvent(new Event('halo_bites_orders_updated'));
    } catch (e) {
      console.error('Failed to save status', e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerDetails?.email && order.customerDetails.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerDetails?.city && order.customerDetails.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || order.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: orders.length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    'In Transit': orders.filter(o => o.status === 'In Transit').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white/5 backdrop-blur-md p-4 border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by order ID, customer name, email, or city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E91E63] transition-colors" 
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={loadOrders}
            className="bg-white/5 border border-white/10 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw size={14} className={isUpdating ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(['All', 'Processing', 'In Transit', 'Delivered', 'Cancelled'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedStatus(tab)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedStatus === tab
                ? 'bg-[#E91E63] text-white border-[#E91E63]'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            <span>{tab}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedStatus === tab ? 'bg-white/20 text-white' : 'bg-black/30 text-zinc-400'
            }`}>
              {statusCounts[tab as keyof typeof statusCounts] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-black/20 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <th className="p-4 pl-6 border-b border-white/5">Order ID</th>
              <th className="p-4 border-b border-white/5">Customer</th>
              <th className="p-4 border-b border-white/5">Date</th>
              <th className="p-4 border-b border-white/5">Items</th>
              <th className="p-4 border-b border-white/5">Status</th>
              <th className="p-4 border-b border-white/5">Total</th>
              <th className="p-4 pr-6 border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="p-4 pl-6 font-mono font-bold text-[#E91E63]">
                    {order.id}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{order.customer}</div>
                    {order.customerDetails?.email && (
                      <div className="text-xs text-zinc-400">{order.customerDetails.email}</div>
                    )}
                  </td>
                  <td className="p-4 text-zinc-400 text-sm">{order.date}</td>
                  <td className="p-4 text-zinc-300 text-sm">
                    {order.items && order.items.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Package size={14} className="text-zinc-500" />
                        {order.items.reduce((acc, i) => acc + (i.quantity || 1), 0)} items
                      </span>
                    ) : (
                      '1 item'
                    )}
                  </td>
                  <td className="p-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as AdminOrder['status'])}
                        className="bg-black/40 border border-white/10 text-xs font-bold uppercase tracking-wider py-1 px-2.5 rounded-none text-zinc-200 focus:outline-none focus:border-[#E91E63] cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="p-4 font-black text-white">{order.total}</td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => setActiveOrder(order)}
                      className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-[#E91E63] text-white transition-colors text-xs font-bold uppercase tracking-widest px-3 py-1.5 border border-white/10"
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Package size={28} className="text-zinc-600 mb-1" />
                    <p className="font-bold text-white text-base">No real customer orders found</p>
                    <p className="text-xs text-zinc-400 max-w-sm">
                      {searchTerm ? `No orders matched "${searchTerm}"` : 'Live customer purchases placed through the website will appear here in real time.'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal / Drawer */}
      {activeOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-[#E91E63] uppercase tracking-widest block mb-1">
                  Order Details
                </span>
                <h2 className="text-2xl font-black text-white font-mono flex items-center gap-3">
                  <span>{activeOrder.id}</span>
                  <StatusBadge status={activeOrder.status} />
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Placed on {activeOrder.date}</p>
              </div>
              <button 
                onClick={() => setActiveOrder(null)}
                className="text-zinc-400 hover:text-white p-2 border border-white/10 hover:border-white/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Change Control */}
            <div className="bg-white/5 border border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-0.5">
                  Update Fulfillment Status:
                </span>
                <span className="text-xs text-zinc-400">
                  Changing status updates customer tracking automatically
                </span>
              </div>
              <div className="flex gap-2">
                {(['Processing', 'In Transit', 'Delivered', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(activeOrder.id, st)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border ${
                      activeOrder.status === st
                        ? 'bg-[#E91E63] text-white border-[#E91E63]'
                        : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Delivery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Customer Info */}
              <div className="bg-white/5 border border-white/10 p-4 space-y-2">
                <span className="font-bold text-[#E91E63] uppercase tracking-wider block mb-1">
                  Customer Information
                </span>
                <div className="font-bold text-sm text-white">{activeOrder.customer}</div>
                {activeOrder.customerDetails?.email && (
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Mail size={13} className="text-zinc-500" />
                    <span>{activeOrder.customerDetails.email}</span>
                  </div>
                )}
                {activeOrder.customerDetails?.phone && (
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Phone size={13} className="text-zinc-500" />
                    <span>{activeOrder.customerDetails.phone}</span>
                  </div>
                )}
              </div>

              {/* Delivery Info */}
              <div className="bg-white/5 border border-white/10 p-4 space-y-2">
                <span className="font-bold text-[#E91E63] uppercase tracking-wider block mb-1">
                  Delivery Destination
                </span>
                {activeOrder.customerDetails?.address ? (
                  <div className="flex items-start gap-2 text-zinc-300 leading-relaxed">
                    <MapPin size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                    <div>
                      {activeOrder.customerDetails.address}
                      {activeOrder.customerDetails.apartment ? `, ${activeOrder.customerDetails.apartment}` : ''}<br />
                      {activeOrder.customerDetails.city} {activeOrder.customerDetails.postalCode || ''}
                    </div>
                  </div>
                ) : (
                  <div className="text-zinc-400">Direct Delivery on file</div>
                )}
                {activeOrder.delivery?.slot && (
                  <div className="text-zinc-400 pt-1 border-t border-white/5">
                    <span className="font-bold text-white">Window:</span> {activeOrder.delivery.slot}
                  </div>
                )}
              </div>

            </div>

            {/* Gift Note (If any) */}
            {activeOrder.delivery?.giftNote?.message && (
              <div className="bg-[#E91E63]/10 border border-[#E91E63]/30 p-4 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#E91E63] font-bold uppercase tracking-wider">
                  <Gift size={14} /> Handwritten Gift Note
                </div>
                <p className="text-zinc-200 italic leading-relaxed">
                  "{activeOrder.delivery.giftNote.message}"
                </p>
                <div className="text-[11px] text-zinc-400">
                  To: {activeOrder.delivery.giftNote.to || 'Recipient'} | From: {activeOrder.delivery.giftNote.from || 'Sender'}
                </div>
              </div>
            )}

            {/* Items Ordered */}
            <div className="border border-white/10 bg-white/5 p-4 space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-white block pb-2 border-b border-white/5">
                Items In Order
              </span>
              <div className="divide-y divide-white/5 max-h-56 overflow-y-auto pr-1">
                {activeOrder.items && activeOrder.items.length > 0 ? (
                  activeOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="w-10 h-10 bg-black/40 border border-white/10 flex items-center justify-center p-1">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-zinc-400">Qty: {item.quantity} {item.flavor ? `• ${item.flavor}` : ''}</div>
                        </div>
                      </div>
                      <div className="font-bold text-white">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-400 py-2">Standard surprise treat assortment</div>
                )}
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Charged:</span>
                <span className="text-lg font-black text-[#E91E63]">{activeOrder.total}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="bg-white/10 hover:bg-white hover:text-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

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
