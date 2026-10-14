import React from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">Get in Touch</h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Have a question about an order, want to request a custom cake, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Contact Info (Left Side) */}
          <div className="lg:w-1/3 space-y-10">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFF5F8] border border-[#F8DCE3] flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-[#E91E63]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-500 mb-1">Email Us</h3>
                    <p className="font-medium">hello@halobites.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFF5F8] border border-[#F8DCE3] flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[#E91E63]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-500 mb-1">Call Us</h3>
                    <p className="font-medium">306-509-5001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFF5F8] border border-[#F8DCE3] flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#E91E63]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-500 mb-1">Location</h3>
                    <p className="font-medium text-zinc-700">123 Bakery Lane<br />Sweet City, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFF5F8] border border-[#F8DCE3] flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-[#E91E63]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-500 mb-1">Business Hours</h3>
                    <p className="font-medium text-zinc-700">Mon - Fri: 9am - 6pm<br />Sat - Sun: 10am - 4pm</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-black p-8 text-white">
              <h3 className="font-black text-xl uppercase mb-3">Looking for quick answers?</h3>
              <p className="text-zinc-400 mb-6 text-sm leading-relaxed">Check out our FAQ page for immediate answers regarding shipping, dietary restrictions, and customizing your surprise box.</p>
              <a href="/faq" className="inline-flex items-center gap-2 text-[#E91E63] font-bold hover:text-white transition-colors">
                Read FAQs <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="lg:w-2/3">
            <div className="bg-white p-8 md:p-12 border border-zinc-200 shadow-sm">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Send us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-bold text-zinc-700">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      className="w-full bg-[#FAFAFA] border border-zinc-200 py-3 px-4 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-bold text-zinc-700">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      className="w-full bg-[#FAFAFA] border border-zinc-200 py-3 px-4 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-zinc-700">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-[#FAFAFA] border border-zinc-200 py-3 px-4 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="orderNumber" className="block text-sm font-bold text-zinc-700">Order Number (Optional)</label>
                  <input 
                    type="text" 
                    id="orderNumber" 
                    className="w-full bg-[#FAFAFA] border border-zinc-200 py-3 px-4 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all"
                    placeholder="ORD-XXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-bold text-zinc-700">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full bg-[#FAFAFA] border border-zinc-200 py-3 px-4 text-[15px] focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  className="w-full bg-[#E91E63] text-white font-bold uppercase tracking-widest py-4 hover:bg-[#050505] transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
