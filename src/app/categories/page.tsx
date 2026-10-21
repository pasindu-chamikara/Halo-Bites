"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { getStoredCategoriesAsync } from '@/utils/storage';
import { DEFAULT_CATEGORIES, CategoryItem } from '@/data/catalog';

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loaded = await getStoredCategoriesAsync();
        if (loaded && Array.isArray(loaded)) {
          const activeOnly = loaded.filter(c => c.status !== 'Draft');
          setCategories(activeOnly);
        }
      } catch (err) {
        console.warn("Failed to load categories:", err);
      }
    };

    loadCategories();

    const handleUpdate = () => loadCategories();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('halo_bites_categories_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('halo_bites_categories_updated', handleUpdate);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl pt-32 pb-24 min-h-screen font-sans">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E91E63] mb-2">
          <Layers size={14} />
          <span>Our Sweet Selections</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-black mb-3">Product Categories</h1>
        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
          Browse our freshly baked collections — from luxury explosion boxes and custom celebration cakes to Parisian macarons and morning pastries.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-white border border-zinc-200 p-8 max-w-lg mx-auto">
          <Layers size={36} className="text-zinc-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-black mb-1">No Categories Yet</h2>
          <p className="text-xs text-zinc-500 mb-6">Categories added in the Admin Dashboard will appear here automatically.</p>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 bg-[#E91E63] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
          >
            <span>Add Category in Admin</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col bg-white border border-zinc-200 hover:border-black transition-all p-6 text-center justify-between shadow-xs hover:shadow-lg"
            >
              <div>
                <div className="w-full aspect-square bg-[#FFF5F8] border border-[#F8DCE3]/60 mb-5 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={cat.image || '/hero1.png'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/hero1.png';
                    }}
                  />
                </div>
                <h2 className="text-xl font-bold text-black group-hover:text-[#E91E63] transition-colors">{cat.name}</h2>
                <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description || "Handcrafted fresh bakery delights made with love."}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs font-bold text-[#E91E63] uppercase tracking-wider group-hover:underline">
                <span>Browse {cat.name}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
