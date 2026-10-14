"use client";

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const shipping = cartItems.length > 0 ? 5.00 : 0;
  const total = cartTotal + shipping;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        
        <div className="flex items-center gap-3 mb-10">
          <ShoppingBag size={28} className="text-[#E91E63]" />
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Your Cart</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white border border-zinc-200">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-zinc-100">
                {cartItems.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500">
                    Your cart is currently empty.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:grid sm:grid-cols-12 gap-6 items-center">
                      
                      <div className="col-span-6 w-full flex items-center gap-6">
                        <div className="w-24 h-24 bg-[#FFF5F8] border border-[#F8DCE3] flex-shrink-0 flex items-center justify-center p-2 relative group">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="absolute -top-2 -left-2 w-6 h-6 bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-[#E91E63] hover:border-[#E91E63] transition-colors shadow-sm z-10"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                          <p className="text-zinc-500 text-sm font-medium">Flavor: {item.flavor}</p>
                          <p className="text-zinc-500 text-sm font-medium mt-1 sm:hidden">Rs. {item.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="col-span-3 w-full sm:w-auto flex justify-center">
                        <div className="flex items-center border border-zinc-200 w-max">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-[#E91E63] hover:bg-zinc-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-12 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-[#E91E63] hover:bg-zinc-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-3 w-full sm:w-auto text-right">
                        <span className="font-black text-lg">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <Link href="/shop" className="text-sm font-bold text-zinc-500 hover:text-[#E91E63] transition-colors flex items-center gap-2">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-zinc-200 p-8 sticky top-32 shadow-sm">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6 pb-6 border-b border-zinc-100">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-black">Rs. {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 pt-4 border-t border-zinc-100">
                  <span>Tax</span>
                  <span className="text-xs text-zinc-400">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 pt-6 border-t border-zinc-200">
                <span className="text-lg font-bold">Total</span>
                <span className="text-4xl font-black text-[#E91E63]">Rs. {total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-[#050505] text-white font-black uppercase tracking-widest py-5 hover:bg-[#E91E63] transition-colors shadow-lg shadow-black/10 group">
                Checkout Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="mt-6 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
