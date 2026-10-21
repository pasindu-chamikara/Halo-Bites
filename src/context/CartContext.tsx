"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  flavor: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoaded: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('halo_bites_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('halo_bites_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const cleanPrice = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const priceNum = cleanPrice(item.price);
    setCartItems(prev => {
      const existing = prev.find(i => String(i.id) === String(item.id));
      if (existing) {
        return prev.map(i => String(i.id) === String(item.id) ? { ...i, price: priceNum, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, price: priceNum, quantity }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => String(item.id) !== String(id)));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => String(item.id) === String(id) ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('halo_bites_cart');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (cleanPrice(item.price) * (item.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
