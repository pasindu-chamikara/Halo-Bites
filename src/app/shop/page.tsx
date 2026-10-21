"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, Star, Filter, Search, AlertCircle, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getStoredProductsAsync, getStoredCategoriesAsync } from '@/utils/storage';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES as CATALOG_CATEGORIES } from '@/data/catalog';
import ProductCard from '@/components/product/ProductCard';

const INITIAL_SHOP_CATEGORIES = ["All", ...CATALOG_CATEGORIES.map(c => c.name)];

function ShopContent() {
  const [products, setProducts] = useState<any[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_SHOP_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  const searchParams = useSearchParams();
  const alertParam = searchParams.get('alert');
  const categoryParam = searchParams.get('category');
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (alertParam === 'empty-cart') {
      setShowEmptyAlert(true);
    }
  }, [alertParam]);

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const [prodsList, catsList] = await Promise.all([
          getStoredProductsAsync(),
          getStoredCategoriesAsync()
        ]);

        if (prodsList && Array.isArray(prodsList)) {
          const normalized = prodsList.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0,
            category: p.category || 'General',
            stock: typeof p.stock === 'number' ? p.stock : 20,
            status: p.status || 'Active',
            rating: p.rating || 5.0,
            reviews: p.reviews || 12,
            image: p.image || '/hero1.png',
            description: p.description || ''
          }));
          setProducts(normalized);

          const availableCats = catsList
            .filter((c: any) => c.status !== 'Draft')
            .map((c: any) => (typeof c === 'string' ? c : c.name))
            .filter(Boolean);

          const productCats = normalized
            .map((p: any) => p.category)
            .filter(Boolean);

          const combined = Array.from(new Set([...availableCats, ...productCats]));
          setCategories(["All", ...combined]);
        }
      } catch (err) {
        console.warn('Error syncing shop store data:', err);
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
        
        {/* Inline Empty Cart Alert */}
        {showEmptyAlert && (
          <div 
            id="shop-empty-cart-alert"
            role="alert"
            className="mb-8 p-4 bg-[#FFF5F8] border border-[#F8DCE3] text-[#E91E63] flex items-center justify-between shadow-xs animate-in fade-in-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white border border-[#F8DCE3] flex items-center justify-center flex-shrink-0">
                <AlertCircle size={18} className="text-[#E91E63]" />
              </div>
              <div>
                <p className="font-bold text-sm">Your cart is empty.</p>
                <p className="text-xs text-zinc-600 mt-0.5">Please add at least one treat or gift box to your cart before proceeding to checkout.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowEmptyAlert(false)}
              className="text-zinc-400 hover:text-black text-sm p-1 cursor-pointer font-bold"
              aria-label="Dismiss alert"
            >
              <X size={16} />
            </button>
          </div>
        )}

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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 flex items-center justify-center font-sans text-zinc-500 text-sm">
        Loading sweet treats catalog...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
