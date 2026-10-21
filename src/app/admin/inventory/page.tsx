"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getStoredProductsAsync } from '@/utils/storage';
import { DEFAULT_PRODUCTS, ProductItem } from '@/data/catalog';

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>(DEFAULT_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = async () => {
    try {
      const normalize = (list: any[]) =>
        list.map((p) => ({
          ...p,
          price: typeof p.price === 'string' ? p.price.replace(/^\$\s*/, 'Rs. ') : `Rs. ${p.price || 0}`
        }));

      const prods = await getStoredProductsAsync();
      if (prods && Array.isArray(prods)) {
        setProducts(normalize(prods));
      }
    } catch (err) {
      console.warn("Failed to load inventory products:", err);
    }
  };

  useEffect(() => {
    loadProducts();

    const handleUpdate = () => loadProducts();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('halo_bites_products_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('halo_bites_products_updated', handleUpdate);
    };
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-md p-4 border border-white/10">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#E91E63] transition-colors" 
          />
        </div>
        <button 
          onClick={loadProducts}
          className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-6 py-2.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors cursor-pointer"
        >
          Sync Stock
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-black/20 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <th className="p-4 pl-6 border-b border-white/5">Product Name</th>
              <th className="p-4 border-b border-white/5">SKU</th>
              <th className="p-4 border-b border-white/5">Category</th>
              <th className="p-4 border-b border-white/5">In Stock</th>
              <th className="p-4 border-b border-white/5">Status</th>
              <th className="p-4 pr-6 border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500 text-sm">
                  No inventory items match your search.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const stock = Number(product.stock) || 0;
                return (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                    <td className="p-4 pl-6 font-bold">{product.name}</td>
                    <td className="p-4 text-zinc-400">HB-{1000 + (Number(product.id) % 9000 || 1)}</td>
                    <td className="p-4 text-zinc-400">{product.category || 'General'}</td>
                    <td className="p-4 font-bold">{stock}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${stock > 10 ? 'bg-emerald-950 text-emerald-400 border-emerald-900' : stock > 0 ? 'bg-orange-950 text-orange-400 border-orange-900' : 'bg-red-950 text-red-400 border-red-900'}`}>
                        {stock > 10 ? 'Healthy' : stock > 0 ? 'Low Stock' : 'Depleted'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="text-[#E91E63] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer">Adjust</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
