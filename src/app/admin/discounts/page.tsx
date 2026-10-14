"use client";

import React, { useState } from 'react';
import { Plus, Copy, Trash2, Edit2, Percent, Tag, Clock } from 'lucide-react';

const MOCK_DISCOUNTS = [
  { id: 'OFF-1', code: 'HALO10', type: 'Percentage', value: '10%', usage: '145 / 500', status: 'Active', expires: 'Dec 31, 2026' },
  { id: 'OFF-2', code: 'FREESHIP26', type: 'Free Shipping', value: 'Shipping', usage: '89 / ∞', status: 'Active', expires: 'No Expiry' },
  { id: 'OFF-3', code: 'WELCOME20', type: 'Fixed Amount', value: 'Rs. 20.00', usage: '34 / 100', status: 'Active', expires: 'Nov 01, 2026' },
  { id: 'OFF-4', code: 'SUMMER50', type: 'Percentage', value: '50%', usage: '200 / 200', status: 'Expired', expires: 'Aug 31, 2026' },
];

export default function DiscountsPage() {
  const [discounts] = useState(MOCK_DISCOUNTS);

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="bg-white/5 border border-white/10 px-6 py-3 flex items-center gap-3">
            <Percent size={18} className="text-[#E91E63]" />
            <div>
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Active Offers</div>
              <div className="font-black">3 Active</div>
            </div>
          </div>
        </div>
        
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E91E63] text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-lg shadow-[#E91E63]/20">
          <Plus size={16} /> Create Discount
        </button>
      </div>

      {/* Discounts Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-black/20 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <th className="p-4 pl-6 border-b border-white/5">Promo Code</th>
              <th className="p-4 border-b border-white/5">Type & Value</th>
              <th className="p-4 border-b border-white/5">Status</th>
              <th className="p-4 border-b border-white/5">Usage</th>
              <th className="p-4 border-b border-white/5">Expires</th>
              <th className="p-4 pr-6 border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="font-black text-white text-lg tracking-wider border border-white/20 bg-black/40 px-3 py-1 rounded-sm flex items-center gap-2">
                      {discount.code}
                      <button className="text-zinc-500 hover:text-[#E91E63] transition-colors"><Copy size={14} /></button>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-[#E91E63]">{discount.value}</div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                    <Tag size={12} /> {discount.type}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border
                    ${discount.status === 'Active' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50' : 
                      'bg-zinc-800 text-zinc-400 border-zinc-600'}`}>
                    {discount.status}
                  </span>
                </td>
                <td className="p-4 font-medium text-zinc-300">
                  <div className="w-24 bg-black/40 rounded-full h-1.5 mb-1 overflow-hidden">
                    <div 
                      className={`h-full ${discount.status === 'Expired' ? 'bg-zinc-600' : 'bg-[#E91E63]'}`} 
                      style={{ width: discount.usage.includes('∞') ? '30%' : `${(parseInt(discount.usage.split('/')[0]) / parseInt(discount.usage.split('/')[1])) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-zinc-400">{discount.usage}</span>
                </td>
                <td className="p-4 text-zinc-400 text-sm flex items-center gap-2">
                  <Clock size={14} className={discount.status === 'Expired' ? 'text-zinc-600' : 'text-emerald-500'} />
                  {discount.expires}
                </td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-black/50 p-2 text-zinc-400 hover:text-white transition-colors"><Edit2 size={14} /></button>
                    <button className="bg-black/50 p-2 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
