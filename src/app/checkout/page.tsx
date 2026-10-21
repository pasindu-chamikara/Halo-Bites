"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Banknote, 
  Gift, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Tag, 
  Lock,
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { setPersistentData, getPersistentData } from '@/utils/storage';
import { db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart, isLoaded } = useCart();
  const { isLoggedIn, userEmail } = useAuth();

  // Form State - Exclusively Cash on Delivery (COD)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: 'Colombo',
    postalCode: '',
    deliveryDate: '',
    deliverySlot: 'morning',
    includeGiftNote: false,
    giftTo: '',
    giftFrom: '',
    giftMessage: '',
    specialInstructions: '',
    paymentMethod: 'cod', // Exclusively Cash on Delivery
  });

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'percent' | 'fixed' } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Redirect to /shop with empty cart alert only after cart is verified loaded
  useEffect(() => {
    if (isLoaded && cartItems.length === 0 && !isSubmitting) {
      router.push('/shop?alert=empty-cart');
    }
  }, [isLoaded, cartItems.length, isSubmitting, router]);

  // Set default delivery date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, deliveryDate: dateStr }));
  }, []);

  // Pre-fill user profile if logged in or saved locally
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedProfile = await getPersistentData<any>('halo_bites_client_profile');
        if (savedProfile) {
          setFormData(prev => ({
            ...prev,
            email: prev.email || userEmail || savedProfile.email || '',
            firstName: prev.firstName || savedProfile.firstName || '',
            lastName: prev.lastName || savedProfile.lastName || '',
            phone: prev.phone || savedProfile.phone || '',
          }));
        } else if (userEmail) {
          setFormData(prev => ({
            ...prev,
            email: prev.email || userEmail
          }));
        }
      } catch (e) {
        console.warn('Could not auto-fill profile info', e);
      }
    };
    loadProfileData();
  }, [userEmail]);

  // Shipping calculation
  const baseShipping = cartItems.length > 0 ? (cartTotal > 100 ? 0 : 5.00) : 0;
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = (cartTotal * appliedPromo.discount) / 100;
    } else {
      discountAmount = appliedPromo.discount;
    }
  }
  const finalShipping = appliedPromo?.code === 'FREEDEL' ? 0 : baseShipping;
  const finalTotal = Math.max(0, cartTotal - discountAmount + finalShipping);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleQuickFillDemo = () => {
    setFormData(prev => ({
      ...prev,
      firstName: prev.firstName || 'Pasindu',
      lastName: prev.lastName || 'Chamikara',
      email: prev.email || userEmail || 'customer@halobites.com',
      phone: prev.phone || '+94 77 123 4567',
      address: prev.address || '42 Main Lotus Road',
      apartment: prev.apartment || 'Suite 4B',
      city: prev.city || 'Colombo',
      postalCode: prev.postalCode || '00700',
      paymentMethod: 'cod',
    }));
    setErrors({});
  };

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'HALO10') {
      setAppliedPromo({ code, discount: 10, type: 'percent' });
    } else if (code === 'SWEET') {
      setAppliedPromo({ code, discount: 10, type: 'fixed' });
    } else if (code === 'FREEDEL') {
      setAppliedPromo({ code, discount: 5, type: 'fixed' });
    } else {
      setPromoError('Invalid promo code. Try "HALO10" or "SWEET".');
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required (e.g. name@domain.com).';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required.';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Street delivery address is required.';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstField = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstField}"]`) as HTMLElement;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      } else {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}-${['A', 'B', 'C', 'X', 'K'][Math.floor(Math.random() * 5)]}`;
    const dateFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const customerFullName = `${formData.firstName} ${formData.lastName}`.trim();
    const calculatedTotalNum = cartTotal > 0 ? finalTotal : 40.00;

    const newOrder = {
      id: orderId,
      date: dateFormatted,
      status: 'Processing',
      customer: customerFullName,
      customerDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        postalCode: formData.postalCode,
        specialInstructions: formData.specialInstructions
      },
      delivery: {
        date: formData.deliveryDate,
        slot: formData.deliverySlot === 'morning' ? '10:00 AM - 1:00 PM' : (formData.deliverySlot === 'afternoon' ? '1:00 PM - 5:00 PM' : '5:00 PM - 8:00 PM'),
        giftNote: formData.includeGiftNote ? {
          to: formData.giftTo,
          from: formData.giftFrom,
          message: formData.giftMessage
        } : null
      },
      payment: {
        method: 'Cash on Delivery (COD)',
        status: 'Pending'
      },
      items: cartItems.length > 0 ? cartItems : [
        {
          id: 1,
          name: "Strawberry Dream Box",
          price: 35.00,
          flavor: "Love Gifts",
          image: "/hero1.png",
          quantity: 1
        }
      ],
      subtotal: Number(cartTotal > 0 ? cartTotal : 35.00),
      shipping: Number(finalShipping || 0),
      discount: Number(discountAmount || 0),
      total: Number(calculatedTotalNum || 0),
      rawTotal: Number(calculatedTotalNum || 0)
    };

    try {
      // 1. Save to user orders list in localStorage
      const existingUser = localStorage.getItem('halo_bites_user_orders');
      let userOrderList = [];
      if (existingUser) {
        try {
          userOrderList = JSON.parse(existingUser);
        } catch {}
      }
      userOrderList.unshift(newOrder);
      localStorage.setItem('halo_bites_user_orders', JSON.stringify(userOrderList));
      localStorage.setItem('halo_bites_last_order', JSON.stringify(newOrder));

      // 2. Save to admin orders list (in both localStorage and IndexedDB via setPersistentData)
      const existingAdmin = localStorage.getItem('halo_bites_admin_orders');
      let adminOrderList = [];
      if (existingAdmin) {
        try {
          adminOrderList = JSON.parse(existingAdmin);
        } catch {}
      }
      adminOrderList.unshift(newOrder);
      localStorage.setItem('halo_bites_admin_orders', JSON.stringify(adminOrderList));
      await setPersistentData('halo_bites_admin_orders', adminOrderList);

      // 3. Mirror directly to Cloud Firestore database
      try {
        await setDoc(doc(db, 'orders', orderId), newOrder);
      } catch (cloudErr) {
        console.warn('Could not mirror order to Firestore:', cloudErr);
      }

      // 4. Dispatch global event so Admin dashboard & orders update in real-time
      window.dispatchEvent(new Event('halo_bites_orders_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Storage save failed", err);
    }

    // Clear the cart
    clearCart();

    // Redirect to confirmation page
    setTimeout(() => {
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 600);
  };

  // While cart state is loading from storage
  if (!isLoaded) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  // If cart is empty and not submitting
  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505]">
        <div className="container mx-auto px-4 max-w-2xl text-center py-16 bg-white border border-zinc-200">
          <div className="w-16 h-16 bg-[#FFF5F8] border border-[#F8DCE3] flex items-center justify-center mx-auto mb-6 text-[#E91E63]">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-3">Your Cart is Empty</h1>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Looks like you haven't added any delicious surprise cakes or sweet treat boxes to your cart yet.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#050505] text-white px-8 py-3.5 font-bold text-xs uppercase tracking-widest hover:bg-[#E91E63] transition-colors"
            >
              Browse Treats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
        
        {/* Navigation / Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/cart" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Return to Cart
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
            <Lock size={14} className="text-emerald-600" />
            <span>Cash on Delivery (No Card Needed)</span>
          </div>
        </div>

        {/* Global Error Banner if validation failed */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-900 flex items-start gap-3 animate-in fade-in-50">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm">Please complete the required delivery information:</h4>
              <p className="text-xs mt-1 text-red-700 leading-relaxed">
                {Object.values(errors).join(' • ')}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Checkout Form (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Quick Fill Testing Helper Bar */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-700">
                  <Sparkles size={16} className="text-[#E91E63]" />
                  <span><strong>Testing checkout?</strong> Populate sample delivery details in 1 click:</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFillDemo}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#050505] hover:bg-[#E91E63] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 transition-colors self-start sm:self-auto shadow-sm"
                >
                  ⚡ Quick Fill Details
                </button>
              </div>

              {/* Step 1: Contact Information */}
              <div className="bg-white border border-zinc-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-black text-white text-xs font-black flex items-center justify-center">1</span>
                    <h2 className="text-lg font-black uppercase tracking-tight">Contact Information</h2>
                  </div>
                  <span className="text-xs text-zinc-400">Order updates will be sent here</span>
                </div>

                {/* Guest Checkout / Auth Status Reassurance */}
                {isLoggedIn ? (
                  <div className="flex items-center justify-between mb-5 p-3.5 bg-zinc-50 border border-zinc-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-zinc-700">Logged in as <strong className="text-zinc-950 font-bold">{userEmail}</strong></span>
                    </div>
                    <span className="text-zinc-400 text-[11px] font-medium">Details auto-filled</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 p-3.5 bg-emerald-50/50 border border-emerald-200/80 text-xs text-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-black uppercase tracking-wider text-[10px]">
                        Guest Checkout
                      </span>
                      <span className="font-semibold text-zinc-800">No account required to order!</span>
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Already have an account? <Link href="/login?redirect=/checkout" className="text-[#E91E63] font-bold hover:underline">Log In</Link>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-[#FAFAFA] border ${errors.email ? 'border-red-500 bg-red-50/20' : 'border-zinc-200'} p-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-colors`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+94 77 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full bg-[#FAFAFA] border ${errors.phone ? 'border-red-500 bg-red-50/20' : 'border-zinc-200'} p-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-colors`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery & Shipping Address */}
              <div className="bg-white border border-zinc-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-black text-white text-xs font-black flex items-center justify-center">2</span>
                    <h2 className="text-lg font-black uppercase tracking-tight">Delivery Address</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <Truck size={14} /> Fresh Hand Delivery
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Recipient's first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full bg-[#FAFAFA] border ${errors.firstName ? 'border-red-500 bg-red-50/20' : 'border-zinc-200'} p-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-colors`}
                      />
                      {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Recipient's last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full bg-[#FAFAFA] border ${errors.lastName ? 'border-red-500 bg-red-50/20' : 'border-zinc-200'} p-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-colors`}
                      />
                      {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="e.g. 42 Main Lotus Road"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full bg-[#FAFAFA] border ${errors.address ? 'border-red-500 bg-red-50/20' : 'border-zinc-200'} p-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-colors`}
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Apt / Suite / Floor
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        placeholder="Suite 4B"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className="w-full bg-[#FAFAFA] border border-zinc-200 p-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full bg-[#FAFAFA] border ${errors.city ? 'border-red-500 bg-red-50/20' : 'border-zinc-200'} p-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-colors`}
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="00700"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full bg-[#FAFAFA] border border-zinc-200 p-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>

                  {/* Delivery Schedule Selection */}
                  <div className="pt-4 border-t border-zinc-100">
                    <span className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3">
                      Preferred Delivery Window
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                          Delivery Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="deliveryDate"
                            value={formData.deliveryDate}
                            onChange={handleInputChange}
                            className="w-full bg-[#FAFAFA] border border-zinc-200 p-3 text-sm focus:bg-white focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                          Time Slot
                        </label>
                        <select
                          name="deliverySlot"
                          value={formData.deliverySlot}
                          onChange={handleInputChange}
                          className="w-full bg-[#FAFAFA] border border-zinc-200 p-3 text-sm focus:bg-white focus:outline-none focus:border-black"
                        >
                          <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
                          <option value="afternoon">Afternoon (1:00 PM – 5:00 PM)</option>
                          <option value="evening">Evening Surprise (5:00 PM – 8:00 PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Special Delivery Instructions */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Special Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      name="specialInstructions"
                      placeholder="e.g. Ring the bell, surprise birthday delivery for Sarah!"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAFAFA] border border-zinc-200 p-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Complimentary Handwritten Gift Note */}
              <div className="bg-white border border-zinc-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#E91E63] text-white text-xs font-black flex items-center justify-center">
                      <Gift size={14} />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-tight">Complimentary Gift Note</h2>
                  </div>
                  <span className="text-[11px] font-bold text-[#E91E63] uppercase tracking-wider bg-[#FFF5F8] px-2 py-0.5 border border-[#F8DCE3]">
                    Free Card
                  </span>
                </div>

                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                  Sending this as a sweet gift? Check below to include a complimentary handwritten card inside your surprise box.
                </p>

                <label className="flex items-center gap-3 cursor-pointer select-none mb-4">
                  <input
                    type="checkbox"
                    name="includeGiftNote"
                    checked={formData.includeGiftNote}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#E91E63] focus:ring-[#E91E63] border-zinc-300"
                  />
                  <span className="text-sm font-bold text-zinc-900">Include a personalized handwritten message</span>
                </label>

                {formData.includeGiftNote && (
                  <div className="space-y-4 pt-3 border-t border-zinc-100 animate-in fade-in-50 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">To</label>
                        <input
                          type="text"
                          name="giftTo"
                          placeholder="e.g. Sarah"
                          value={formData.giftTo}
                          onChange={handleInputChange}
                          className="w-full bg-[#FAFAFA] border border-zinc-200 p-2.5 text-sm focus:bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">From</label>
                        <input
                          type="text"
                          name="giftFrom"
                          placeholder="e.g. Liam & Friends"
                          value={formData.giftFrom}
                          onChange={handleInputChange}
                          className="w-full bg-[#FAFAFA] border border-zinc-200 p-2.5 text-sm focus:bg-white focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Card Message</label>
                      <textarea
                        rows={3}
                        name="giftMessage"
                        placeholder="Wishing you the sweetest birthday filled with endless happiness and cake!"
                        value={formData.giftMessage}
                        onChange={handleInputChange}
                        className="w-full bg-[#FAFAFA] border border-zinc-200 p-3 text-sm focus:bg-white focus:outline-none focus:border-black resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Payment Method - Exclusively Cash on Delivery */}
              <div className="bg-white border border-zinc-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-black text-white text-xs font-black flex items-center justify-center">3</span>
                    <h2 className="text-lg font-black uppercase tracking-tight">Payment Method</h2>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Cash on Delivery
                  </span>
                </div>

                {/* Cash on Delivery Feature Card */}
                <div className="p-5 border-2 border-zinc-950 bg-zinc-50 relative">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0">
                      <Banknote size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                          Cash on Delivery (COD)
                        </h3>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-600 text-white px-2 py-0.5">
                          100% Free • No Advance Required
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                        Pay with cash when your fresh bakery box arrives at your doorstep. Please have the exact payment amount ready for the rider.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold text-zinc-600 pt-3 border-t border-zinc-200">
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-600" />
                          <span>Inspect package before paying</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-600" />
                          <span>No credit card or bank transfer required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-zinc-200 p-6 sm:p-8 sticky top-28 shadow-sm">
                
                <h2 className="text-xl font-black uppercase tracking-tight mb-6 pb-4 border-b border-zinc-100 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-bold text-zinc-400">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                  </span>
                </h2>

                {/* Items List */}
                <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto mb-6 pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#FFF5F8] border border-[#F8DCE3] flex-shrink-0 flex items-center justify-center p-1.5 relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain" 
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = "/hero1.png";
                          }}
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-zinc-900 truncate">{item.name}</h4>
                        <p className="text-xs text-zinc-400">{item.flavor}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Rs. {item.price.toFixed(2)} each</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-zinc-950">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="mb-6 pt-4 border-t border-zinc-100">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. HALO10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-zinc-200 py-2.5 px-3 text-xs uppercase font-bold focus:bg-white focus:outline-none focus:border-black"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="bg-zinc-900 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#E91E63] transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {promoError && (
                    <p className="text-xs text-red-500 mt-1.5">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Tag size={12} /> {appliedPromo.code} applied!
                      </span>
                      <button
                        type="button"
                        onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                        className="text-emerald-700 hover:text-red-600 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Calculations */}
                <div className="space-y-3 mb-6 pt-4 border-t border-zinc-100 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-zinc-900">Rs. {cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-zinc-600">
                    <span>Fresh Bakery Delivery</span>
                    <span className="font-bold text-zinc-900">
                      {finalShipping === 0 ? (
                        <span className="text-emerald-700 font-extrabold uppercase">FREE</span>
                      ) : (
                        `Rs. ${finalShipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span>- Rs. {discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600">
                    <span>Payment Method</span>
                    <span className="font-bold text-emerald-700">Cash on Delivery</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline mb-6 pt-4 border-t border-zinc-200">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">Total Due</span>
                    <span className="text-xs text-zinc-500 font-medium">Pay Upon Delivery</span>
                  </div>
                  <span className="text-3xl font-black text-[#E91E63]">
                    Rs. {finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Validation Reminder Warning Above Button */}
                {Object.keys(errors).length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 text-xs animate-in fade-in-50">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertCircle size={14} className="text-red-600" />
                      <span>Missing Information</span>
                    </div>
                    <p className="text-[11px] text-red-600">
                      Please fill out the highlighted fields on the left before completing order.
                    </p>
                  </div>
                )}

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#050505] text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-[#E91E63] disabled:bg-zinc-400 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Your Order...</span>
                    </>
                  ) : (
                    <span>Complete Order • Rs. {finalTotal.toFixed(2)}</span>
                  )}
                </button>

                {/* Guarantee Badges */}
                <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <ShieldCheck size={20} className="text-zinc-400 mb-1" />
                    <span className="text-[10px] font-bold uppercase text-zinc-600">100% Freshness</span>
                    <span className="text-[9px] text-zinc-400">Baked daily with love</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck size={20} className="text-zinc-400 mb-1" />
                    <span className="text-[10px] font-bold uppercase text-zinc-600">Timely Delivery</span>
                    <span className="text-[9px] text-zinc-400">Carefully packaged</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
