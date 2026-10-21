"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Copy, Trash2, Tag, Clock, X, Check, Tag as TagIcon } from 'lucide-react';
import { getPersistentData, setPersistentData } from '@/utils/storage';

export interface DiscountItem {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed Amount' | 'Free Shipping';
  value: string;
  usage: string;
  status: 'Active' | 'Expired';
  expires: string;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState<'Percentage' | 'Fixed Amount' | 'Free Shipping'>('Percentage');
  const [value, setValue] = useState('');
  const [expires, setExpires] = useState('');

  const loadDiscounts = async () => {
    try {
      const saved = await getPersistentData<DiscountItem[]>('halo_bites_admin_discounts');
      if (saved && Array.isArray(saved)) {
        // Filter out any stale mock discounts
        const realOnly = saved.filter(d => !['OFF-1', 'OFF-2', 'OFF-3', 'OFF-4'].includes(d.id));
        setDiscounts(realOnly);
        return;
      }
      const local = localStorage.getItem('halo_bites_admin_discounts');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            const realOnly = parsed.filter(d => !['OFF-1', 'OFF-2', 'OFF-3', 'OFF-4'].includes(d.id));
            setDiscounts(realOnly);
          }
        } catch {}
      }
    } catch (err) {
      console.warn("Failed to load discounts:", err);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  const saveDiscounts = async (updated: DiscountItem[]) => {
    setDiscounts(updated);
    await setPersistentData('halo_bites_admin_discounts', updated);
    localStorage.setItem('halo_bites_admin_discounts', JSON.stringify(updated));
    window.dispatchEvent(new Event('halo_bites_discounts_updated'));
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value.trim()) return;

    const newDiscount: DiscountItem = {
      id: `DISC-${Date.now().toString().slice(-4)}`,
      code: code.trim().toUpperCase(),
      type,
      value: type === 'Percentage' ? `${value}%` : type === 'Fixed Amount' ? `Rs. ${value}` : 'Free Shipping',
      usage: '0 / 100',
      status: 'Active',
      expires: expires.trim() || 'No Expiry'
    };

    const updated = [newDiscount, ...discounts];
    await saveDiscounts(updated);

    setCode('');
    setValue('');
    setExpires('');
    setIsModalOpen(false);
  };

  const handleDeleteDiscount = async (id: string, codeName: string) => {
    if (confirm(`Are you sure you want to delete promo code "${codeName}"?`)) {
      const updated = discounts.filter(d => d.id !== id);
      await saveDiscounts(updated);
    }
  };

  const handleCopy = (codeName: string) => {
    navigator.clipboard.writeText(codeName);
    setCopiedCode(codeName);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCount = discounts.filter(d => d.status === 'Active').length;

  return (
    <div className="space-y-8 font-sans">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="bg-white/5 border border-white/10 px-6 py-3 flex items-center gap-3">
            <TagIcon size={18} className="text-[#E91E63]" />
            <div>
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Active Offers</div>
              <div className="font-black text-white">{activeCount} Active</div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E91E63] text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-lg shadow-[#E91E63]/20 cursor-pointer"
        >
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
            {discounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-zinc-400 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <TagIcon size={24} className="text-zinc-600 mb-1" />
                    <p className="font-bold text-white text-base">No real discount codes created yet</p>
                    <p className="text-xs text-zinc-400 max-w-sm">
                      Click the "Create Discount" button above to add custom promotional vouchers or seasonal codes for your store.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="font-black text-white text-lg tracking-wider border border-white/20 bg-black/40 px-3 py-1 rounded-sm flex items-center gap-2">
                        {discount.code}
                        <button 
                          onClick={() => handleCopy(discount.code)}
                          className="text-zinc-500 hover:text-[#E91E63] transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === discount.code ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
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
                    <span className="text-xs text-zinc-400">{discount.usage}</span>
                  </td>
                  <td className="p-4 text-zinc-400 text-sm flex items-center gap-2">
                    <Clock size={14} className={discount.status === 'Expired' ? 'text-zinc-600' : 'text-emerald-500'} />
                    {discount.expires}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => handleDeleteDiscount(discount.id, discount.code)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Promo Code"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/20 w-full max-w-md p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <TagIcon size={16} className="text-[#E91E63]" /> Create New Discount
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDiscount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SWEET20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-black/50 border border-white/20 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#E91E63] font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                  Discount Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-black/50 border border-white/20 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                >
                  <option value="Percentage">Percentage Discount (%)</option>
                  <option value="Fixed Amount">Fixed Amount (Rs.)</option>
                  <option value="Free Shipping">Free Shipping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                  Discount Value *
                </label>
                <input
                  type="text"
                  required
                  placeholder={type === 'Percentage' ? 'e.g. 15 (for 15%)' : type === 'Fixed Amount' ? 'e.g. 50 (for Rs. 50)' : '0'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                  Expiry Date (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dec 31, 2026 or No Expiry"
                  value={expires}
                  onChange={(e) => setExpires(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/10 text-zinc-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#E91E63] text-white hover:bg-white hover:text-black transition-colors"
                >
                  Save Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
