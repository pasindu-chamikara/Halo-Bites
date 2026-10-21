"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Star, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { getStoredProductsAsync } from '@/utils/storage';
import { DEFAULT_PRODUCTS, ProductItem } from '@/data/catalog';
import { useCart } from '@/context/CartContext';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id ? String(params.id) : '';
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const prods = await getStoredProductsAsync();
        const found = prods.find(p => String(p.id) === productId);
        if (found) {
          setProduct(found);
        } else {
          // Check default products as fallback
          const defaultFound = DEFAULT_PRODUCTS.find(p => String(p.id) === productId);
          if (defaultFound) {
            setProduct(defaultFound);
          }
        }
      } catch (err) {
        console.warn('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    const numericPrice = typeof product.price === 'number'
      ? product.price
      : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;

    addToCart({
      id: typeof product.id === 'number' ? product.id : Number(product.id) || 1,
      name: product.name,
      price: numericPrice,
      flavor: product.category,
      image: product.image || '/hero1.png'
    }, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-36 pb-24 flex items-center justify-center font-sans text-zinc-500 text-sm">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-36 pb-24 font-sans container mx-auto px-4 max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-black mb-3">Product Not Found</h1>
        <p className="text-zinc-500 mb-8 text-sm">The sweet treat you are looking for does not exist or has been removed.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#E91E63] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#d81b5c] transition-all"
        >
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const numericPrice = typeof product.price === 'number'
    ? product.price
    : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 bg-white border border-zinc-200 p-6 sm:p-10 lg:p-12">
          {/* Image */}
          <div className="aspect-square bg-[#FFF5F8] border border-[#F8DCE3]/60 flex items-center justify-center p-8 overflow-hidden">
            <img
              src={product.image || '/hero1.png'}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = '/hero1.png';
              }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E91E63] mb-2">
                <span>{product.category || 'Specialty Dessert'}</span>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-500">In Stock ({product.stock ?? 20})</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center text-amber-500 gap-1 text-sm">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold text-black">{product.rating || 5.0}</span>
                </div>
                <span className="text-xs text-zinc-400">({product.reviews || 24} customer reviews)</span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-black mb-6">
                Rs. {numericPrice.toFixed(2)}
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed mb-8">
                {product.description || "Handcrafted fresh using the finest artisan ingredients, rich Belgian chocolate, and velvety butter cream. Made to order for special celebrations."}
              </p>
            </div>

            <div>
              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-zinc-200 bg-zinc-50">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-zinc-600 hover:text-black cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-zinc-600 hover:text-black cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#E91E63] hover:bg-[#d81b5c] text-white shadow-md shadow-[#E91E63]/25'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#E91E63]" />
                  <span>Hand Delivered Fresh Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#E91E63]" />
                  <span>100% Quality Guaranteed</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
