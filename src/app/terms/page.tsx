import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 max-w-4xl bg-white p-8 md:p-16 border border-zinc-100 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">Terms and Conditions</h1>
        
        <div className="space-y-8 text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing our website and purchasing from Halo Bites, you agree to be bound by these Terms and Conditions. 
              If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. Products and Pricing</h2>
            <p>
              All surprise boxes and cake bites are subject to availability. We reserve the right to discontinue any product at any time. 
              Prices for all products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, 
              price change, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. Delivery and Shipping</h2>
            <p>
              While we strive to deliver your surprise boxes exactly on the scheduled date, Halo Bites is not responsible for delays caused by 
              couriers, weather conditions, or incorrect address information provided during checkout. 
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. Refunds and Returns</h2>
            <p>
              Because our products are perishable food items and customized gifts, all sales are final. We do not accept returns. 
              However, if your item arrives damaged, please contact our support team within 24 hours of delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Contact Information</h2>
            <p>
              Questions about the Terms and Conditions should be sent to us at <a href="mailto:hello@halobites.com" id="terms-email-link" className="text-[#E91E63] font-semibold hover:underline">hello@halobites.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
