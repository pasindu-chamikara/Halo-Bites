"use client";

import React from 'react';
import Link from 'next/link';
import { Truck, Clock, ShieldCheck, MapPin, AlertCircle, ArrowLeft, HeartHandshake } from 'lucide-react';

export default function DeliveryPolicyPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/shop" 
            id="dp-back-to-shop-link"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white border border-zinc-200 p-8 sm:p-12 mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E91E63] mb-3 bg-[#FFF5F8] px-3 py-1 border border-[#F8DCE3]">
            <Truck size={14} /> Fresh Delivery Guarantee
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#050505] mb-4">
            Delivery Policy
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-2xl">
            At Halo Bites, our artisanal cakes, donuts, and surprise boxes are baked fresh daily and delivered with extreme care to ensure your sweetest celebrations arrive in perfect condition.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          
          {/* 1. Delivery Zones & Timelines */}
          <div className="bg-white border border-zinc-200 p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2.5">
              <MapPin size={18} className="text-[#E91E63]" />
              <span>1. Delivery Zones & Windows</span>
            </h2>
            <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
              <p>
                We currently provide direct temperature-controlled hand delivery across Greater Colombo and surrounding suburbs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="p-3 bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-xs uppercase text-zinc-900 block">Morning Slot</span>
                  <span className="text-xs text-zinc-500">10:00 AM – 1:00 PM</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-xs uppercase text-zinc-900 block">Afternoon Slot</span>
                  <span className="text-xs text-zinc-500">1:00 PM – 5:00 PM</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-xs uppercase text-zinc-900 block">Evening Surprise</span>
                  <span className="text-xs text-zinc-500">5:00 PM – 8:00 PM</span>
                </div>
              </div>
              <p>
                Same-day orders placed before 1:00 PM are eligible for afternoon or evening delivery slots. Orders placed after 1:00 PM will be scheduled for the following day or your chosen future date.
              </p>
            </div>
          </div>

          {/* 2. Surprise Delivery Protocol */}
          <div className="bg-white border border-zinc-200 p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2.5">
              <HeartHandshake size={18} className="text-[#E91E63]" />
              <span>2. Surprise Gift Deliveries</span>
            </h2>
            <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
              <p>
                If your order is a surprise gift, our delivery courier will not spoil the surprise beforehand! We only call the recipient upon arrival at their doorstep, unless special instructions indicate a direct drop-off with a concierge or building reception.
              </p>
              <p>
                Please ensure recipient contact numbers and address details are accurate to avoid delays with fresh bakery items.
              </p>
            </div>
          </div>

          {/* 3. Delivery Fees & Free Shipping */}
          <div className="bg-white border border-zinc-200 p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-[#E91E63]" />
              <span>3. Delivery Rates</span>
            </h2>
            <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-zinc-900">Standard Hand Delivery:</strong> Rs. 5.00 flat fee across all standard delivery zones.</li>
                <li><strong className="text-zinc-900">Orders Over Rs. 100.00:</strong> Enjoy complimentary FREE fresh delivery automatically applied at checkout.</li>
                <li><strong className="text-zinc-900">Promotional Codes:</strong> Free delivery coupons (e.g. <code className="bg-zinc-100 px-1 py-0.5 text-xs font-bold text-[#E91E63]">FREEDEL</code>) waive all delivery charges.</li>
              </ul>
            </div>
          </div>

          {/* 4. Quality & Freshness Guarantee */}
          <div className="bg-white border border-zinc-200 p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2.5">
              <Clock size={18} className="text-[#E91E63]" />
              <span>4. Damaged or Delayed Goods</span>
            </h2>
            <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
              <p>
                Every treat box is packaged securely with food-safe insulation and protective supports. In the rare event of transit damage or delay beyond the scheduled slot, please contact our support team immediately at <a href="mailto:hello@halobites.com" id="dp-email-link" className="font-bold text-[#E91E63] hover:underline">hello@halobites.com</a> with a photo, and we will issue an immediate fresh replacement or full refund.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Support Banner */}
        <div className="mt-8 bg-zinc-900 text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold mb-1">Have Questions About Your Delivery?</h3>
            <p className="text-xs text-zinc-400">Our customer care team is available daily from 8:00 AM to 9:00 PM.</p>
          </div>
          <Link
            href="/contact"
            className="bg-[#E91E63] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#d81b5c] transition-colors whitespace-nowrap"
          >
            Contact Customer Support
          </Link>
        </div>

      </div>
    </div>
  );
}
