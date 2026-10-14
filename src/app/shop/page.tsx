"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, Filter, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getPersistentData } from '@/utils/storage';
import ProductCard from '@/components/product/ProductCard';

// Mock Product Data
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Strawberry Dream Box",
    price: 35.00,
    category: "Love Gifts",
    rating: 4.9,
    reviews: 128,
    image: "/hero1.png"
  },
  {
    id: 2,
    name: "Classic Chocolate Explosion",
    price: 40.00,
    category: "Birthday Gifts",
    rating: 5.0,
    reviews: 245,
    image: "/hero2.png"
  },
  {
    id: 3,
    name: "Vanilla Funfetti Surprise",
    price: 32.00,
    category: "Birthday Gifts",
    rating: 4.8,
    reviews: 89,
    image: "/hero3.png"
  },
  {
    id: 4,
    name: "Red Velvet Romance",
    price: 45.00,
    category: "Love Gifts",
    rating: 4.9,
    reviews: 156,
    image: "/hero4.png"
  },
  {
    id: 5,
    name: "Golden Congrats Box",
    price: 38.00,
    category: "Congrats Gifts",
    rating: 4.7,
    reviews: 72,
    image: "/hero5.png"
  },
  {
    id: 6,
    name: "Mother's Day Special",
    price: 50.00,
    category: "Mother's Day",
    rating: 5.0,
    reviews: 310,
    image: "/hero6.png"
  },
  {
    id: 7,
    name: "Matcha Magic",
    price: 36.00,
    category: "Congrats Gifts",
    rating: 4.6,
    reviews: 45,
    image: "/hero7.png"
  }
];

const DEFAULT_CATEGORIES = ["All", "Birthday Gifts", "Love Gifts", "Congrats Gifts", "Mother's Day"];

export default function ShopPage() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        let prodsList: any[] | null = await getPersistentData<any[]>('halo_bites_admin_products');
        if (!prodsList) {
          const local = localStorage.getItem('halo_bites_admin_products');
          if (local) prodsList = JSON.parse(local);
        }

        if (prodsList !== null && Array.isArray(prodsList)) {
          const normalized = prodsList.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0,
            category: p.category || 'General',
            rating: p.rating || 5.0,
            reviews: p.reviews || 12,
            image: p.image || '/hero1.png'
          }));
          setProducts(normalized);

          // Merge categories from admin categories and any categories present on products
          const productCats = normalized.map((p: any) => p.category).filter(Boolean);
          let availableCats: string[] = [];
          const savedCats = await getPersistentData<any[]>('halo_bites_admin_categories');
          if (savedCats && Array.isArray(savedCats)) {
            availableCats = savedCats
              .filter((c: any) => c.status !== 'Draft')
              .map((c: any) => (typeof c === 'string' ? c : c.name))
              .filter(Boolean);
          } else {
            const rawCats = localStorage.getItem('halo_bites_admin_categories');
            if (rawCats) {
              const parsed = JSON.parse(rawCats);
              if (Array.isArray(parsed)) {
                availableCats = parsed
                  .filter((c: any) => c.status !== 'Draft')
                  .map((c: any) => (typeof c === 'string' ? c : c.name))
                  .filter(Boolean);
              }
            }
          }

          const combined = Array.from(new Set([...availableCats, ...productCats]));
          if (combined.length > 0) {
            setCategories(["All", ...combined]);
          }
        }
      } catch {
        // ignore
      }
    };

    loadStoreData();

    window.addEventListener('storage', loadStoreData);
    window.addEventListener('halo_bites_products_updated', loadStoreData);
    window.addEventListener('halo_bites_categories_updated', loadStoreData);

    return () => {
      window.removeEventListener('storage', loadStoreData);
      window.removeEventListener('halo_bites_products_updated', loadStoreData);
      window.removeEventListener('halo_bites_categories_updated', loadStoreData);
    };
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pt-32 pb-24">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-[1440px]">
        
        {/* Top Controls: Search & Categories */}
        <div className="mb-8 sm:mb-10 flex flex-col gap-4 sm:gap-6">
          <div className="w-full relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-zinc-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search for a cake or surprise box..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 py-3 sm:py-4 pl-11 pr-4 text-xs sm:text-[15px] font-medium text-[#050505] placeholder:text-zinc-400 focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all shadow-xs"
            />
          </div>

          <div className="flex flex-row items-center gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-2">
            <div className="flex items-center gap-2 text-[#050505] mr-1 sm:mr-2 flex-shrink-0">
              <Filter size={16} />
              <span className="font-bold text-xs sm:text-sm tracking-tight">Categories:</span>
            </div>
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${activeCategory === category ? 'bg-[#E91E63] text-white shadow-md shadow-[#E91E63]/25 scale-[1.02]' : 'bg-white text-[#555555] hover:bg-[#FFF5F8] hover:text-[#E91E63] border border-zinc-200 hover:border-[#F8DCE3]'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid (3 by 3 on Mobile) */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {filteredProducts.map(product => (
            <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(prod, qty) =>
                  addToCart({
                    id: typeof prod.id === 'number' ? prod.id : Number(prod.id) || 1,
                    name: prod.name,
                    price: prod.price,
                    flavor: prod.category,
                    image: prod.image
                  }, qty)
                }
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-24 bg-white border border-zinc-100">
              <h3 className="text-xl font-bold text-[#050505] mb-2">No products found</h3>
              <p className="text-[#777777]">Try adjusting your search or selecting a different category.</p>
            </div>
          )}
      </div>
    </div>
  );
}
