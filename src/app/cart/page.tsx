"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, X, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const isCartEmpty = cartItems.length === 0;
  const shipping = !isCartEmpty ? 5.00 : 0;
  const total = cartTotal + shipping;

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (isCartEmpty) {
      e.preventDefault();
      e.stopPropagation();
      router.push('/shop?alert=empty-cart');
      return;
    }
    router.push('/checkout');
  };

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
                {isCartEmpty ? (
                  <div id="cart-empty-state" className="p-12 text-center text-zinc-500">
                    <div className="w-16 h-16 bg-[#FFF5F8] border border-[#F8DCE3] rounded-full flex items-center justify-center mx-auto mb-4 text-[#E91E63]">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 mb-1">Your cart is empty.</h3>
                    <p className="text-xs text-zinc-500 mb-6 max-w-xs mx-auto">
                      Looks like you haven't added any sweet treats or surprise boxes yet.
                    </p>
                    <Link
                      href="/shop"
                      id="cart-empty-explore-shop-btn"
                      className="inline-flex items-center gap-2 bg-[#E91E63] hover:bg-[#050505] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Explore The Shop
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:grid sm:grid-cols-12 gap-6 items-center">
                      
                      <div className="col-span-6 w-full flex items-center gap-6">
                        <div className="w-24 h-24 bg-[#FFF5F8] border border-[#F8DCE3] flex-shrink-0 flex items-center justify-center p-2 relative group">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform" 
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = "/hero1.png";
                            }}
                          />
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
              <Link 
                href="/shop" 
                id="cart-continue-shopping-link"
                className="text-sm font-bold text-zinc-500 hover:text-[#E91E63] transition-colors flex items-center gap-2"
              >
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

              {/* Checkout Button & Alert Handling */}
              <div className="space-y-3">
                <div 
                  onClick={handleCheckoutClick}
                  className={`w-full ${isCartEmpty ? 'cursor-not-allowed' : ''}`}
                >
                  <button 
                    type="button"
                    disabled={isCartEmpty}
                    aria-disabled={isCartEmpty}
                    id="checkout-now-btn"
                    className={`w-full flex items-center justify-center gap-2 font-black uppercase tracking-widest py-5 transition-colors shadow-lg ${
                      isCartEmpty 
                        ? 'bg-zinc-200 text-zinc-400 border border-zinc-200 shadow-none pointer-events-none' 
                        : 'bg-[#050505] text-white hover:bg-[#E91E63] shadow-black/10 cursor-pointer group'
                    }`}
                  >
                    <span>Checkout Now</span>
                    <ArrowRight size={18} className={isCartEmpty ? '' : 'group-hover:translate-x-1 transition-transform'} />
                  </button>
                </div>

                {/* Inline Empty Cart Alert */}
                {isCartEmpty && (
                  <div 
                    id="cart-empty-alert"
                    role="alert"
                    className="p-3.5 bg-[#FFF5F8] border border-[#F8DCE3] text-[#E91E63] text-xs font-bold flex items-center gap-2 animate-in fade-in-50"
                  >
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>Your cart is empty.</span>
                  </div>
                )}
              </div>
              
              <div 
                id="cart-secure-checkout-indicator"
                className="mt-6 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <svg id="secure-checkout-svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

