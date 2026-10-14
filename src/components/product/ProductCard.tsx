"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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
}

interface ProductCardProps {
  product: ProductItem;
  onAddToCart?: (product: ProductItem, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => Math.min(99, prev + 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setQuantity(1);
    } else {
      setQuantity(Math.max(1, Math.min(99, val)));
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const chosenQty = quantity > 0 ? quantity : 1;

    if (onAddToCart) {
      onAddToCart(product, chosenQty);
    } else {
      addToCart({
        id: Number(product.id) || 1,
        name: product.name,
        price: product.price,
        flavor: product.category,
        image: product.image
      }, chosenQty);
    }

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  const ratingValue = product.rating ?? 4.9;
  const reviewCount = product.reviews ?? 120;

  return (
    <div className="group relative flex flex-col bg-white rounded-none border border-zinc-200 hover:border-black transition-colors duration-200 h-full">
      
      {/* Product Image Area */}
      <div className="relative aspect-square w-full rounded-none bg-[#FAFAFA] flex items-center justify-center p-2 sm:p-4 md:p-6 border-b border-zinc-100 overflow-hidden">

        {/* Product Image */}
        <Link 
          href={`/product/${product.id}`}
          className="relative w-full h-full flex items-center justify-center z-0 focus:outline-none rounded-none"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            onLoad={() => setIsImageLoaded(true)}
            className={`w-[90%] h-[90%] object-contain transition-transform duration-500 ease-out group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-80 scale-95'
            }`}
          />
        </Link>
      </div>

      {/* Product Info & Actions */}
      <div className="p-2 sm:p-4 md:p-5 flex flex-col flex-1">
        
        {/* Rating / Review Info (Pure Text, No Icons) */}
        <div className="hidden sm:flex items-center justify-between text-[11px] text-zinc-400 mb-1">
          <span className="font-medium truncate mr-1">
            {ratingValue.toFixed(1)} ★ ({reviewCount})
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider text-[#E91E63] truncate">
            {product.category || 'Halo Bites'}
          </span>
        </div>

        {/* Product Title */}
        <Link 
          href={`/product/${product.id}`} 
          className="text-xs sm:text-sm md:text-base font-bold text-zinc-900 leading-tight sm:leading-snug hover:text-[#E91E63] transition-colors line-clamp-2 mb-1.5 sm:mb-3 focus:outline-none"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Price Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2 sm:mb-4">
          <div>
            <span className="hidden sm:block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
              Unit Price
            </span>
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-zinc-900">Rs.</span>
              <span className="text-xs sm:text-base md:text-xl font-black text-zinc-950 tracking-tight">
                {product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {quantity > 1 && (
            <div className="sm:text-right mt-0.5 sm:mt-0">
              <span className="hidden sm:block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
                Total ({quantity})
              </span>
              <span className="text-[10px] sm:text-sm font-bold text-[#E91E63]">
                Rs. {(product.price * quantity).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Quantity Chooser & Add To Cart Button */}
        <div className="mt-auto pt-2 sm:pt-4 border-t border-zinc-100 flex flex-col gap-2 sm:gap-3">
          
          {/* Quantity Controls Row */}
          <div className="flex items-center justify-between gap-1">
            <span className="hidden sm:block text-[11px] font-bold uppercase tracking-wider text-zinc-600">
              Qty
            </span>

            <div className="inline-flex items-center border border-zinc-300 rounded-none bg-white w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors rounded-none select-none"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={99}
                value={quantity}
                onChange={handleQuantityChange}
                aria-label="Quantity"
                className="w-7 sm:w-10 h-6 sm:h-8 text-center text-[10px] sm:text-xs font-bold text-zinc-900 border-x border-zinc-300 rounded-none focus:outline-none focus:bg-zinc-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= 99}
                aria-label="Increase quantity"
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors rounded-none select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button (No Icons, Sharp Corners) */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full h-7 sm:h-10 px-1 sm:px-4 text-[9px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-widest transition-colors duration-200 rounded-none text-white flex items-center justify-center ${
              justAdded
                ? 'bg-emerald-700'
                : 'bg-zinc-950 hover:bg-[#E91E63]'
            }`}
          >
            {justAdded 
              ? (quantity > 1 ? `ADDED (${quantity})` : 'ADDED!') 
              : <span className="truncate">{quantity > 1 ? `ADD (${quantity})` : 'ADD TO CART'}</span>
            }
          </button>

        </div>

      </div>

    </div>
  );
}
