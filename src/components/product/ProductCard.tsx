"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface ProductItem {
  id: number | string;
  name: string;
  price: number;
  category: string;
  rating?: number;
  reviews?: number;
  image: string;
  status?: string;
  stock?: number;
  description?: string;
}

export interface ProductCardProps {
  product: ProductItem;
  onAddToCart?: (product: ProductItem, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.status === 'Out of Stock' || (typeof product.stock === 'number' && product.stock <= 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    if (onAddToCart) {
      onAddToCart(product, 1);
    } else {
      addToCart({
        id: Number(product.id) || 1,
        name: product.name,
        price: product.price,
        flavor: product.category,
        image: product.image
      }, 1);
    }

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  const ratingValue = product.rating ?? 4.9;

  return (
    <div className="group flex flex-col bg-white rounded-xl border-0 border-none shadow-none hover:shadow-md transition-all duration-200 overflow-hidden h-full">
      {/* Product Image - Full edge-to-edge fit, zero borders */}
      <Link 
        href={`/product/${product.id}`}
        className="relative aspect-square w-full bg-white flex items-center justify-center overflow-hidden border-0 border-none"
      >
        <img 
          src={product.image} 
          alt={product.name} 
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = "/hero1.png";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 border-0 border-none"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center border-0 border-none">
            <span className="px-2.5 py-1 rounded bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white border-0 border-none">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E91E63] truncate">
              {product.category || 'Halo Bites'}
            </span>
            <span className="text-[11px] text-zinc-400 shrink-0 font-medium">
              ★ {ratingValue.toFixed(1)}
            </span>
          </div>

          {/* Product Title */}
          <Link 
            href={`/product/${product.id}`} 
            className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-[#E91E63] transition-colors line-clamp-2 leading-snug mb-2 block border-0 border-none"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Add to Cart Button (No Quantity Selector) */}
        <div className="pt-2 border-0 border-none">
          <div className="mb-2 sm:mb-2.5">
            <span className="text-xs sm:text-base font-extrabold text-zinc-900">
              Rs. {product.price.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer border-0 border-none outline-none ${
              isOutOfStock
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-900 hover:bg-[#E91E63] text-white active:scale-[0.98]'
            }`}
          >
            {justAdded ? (
              <>
                <Check size={15} />
                <span>Added!</span>
              </>
            ) : isOutOfStock ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add<span className="hidden sm:inline"> to Cart</span></span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export const ItemCard = ProductCard;
export default ProductCard;
