import React from 'react';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: "How far in advance should I order?",
      answer: "We recommend placing your order at least 3-5 business days before your desired delivery date to ensure we have enough time to craft and ship your customized surprise box."
    },
    {
      question: "Can I customize the cake flavors in the box?",
      answer: "Absolutely! You can choose from our signature flavors including Classic Chocolate, Strawberry Dream, Vanilla Funfetti, Red Velvet, and Matcha Magic during the ordering process."
    },
    {
      question: "What happens when the box is opened?",
      answer: "Our boxes are engineered for a spectacular unboxing experience! Depending on the option you choose, opening the box can trigger flying paper butterflies, a pop-up photo cube, or a cascade of confetti."
    },
    {
      question: "Do you offer vegan or gluten-free options?",
      answer: "Currently, our standard products contain dairy, gluten, and eggs. We are actively working on a specialized dietary menu coming later this year!"
    },
    {
      question: "Where do you ship?",
      answer: "We currently ship nationwide across the continental United States. Unfortunately, we cannot ship to P.O. Boxes or internationally at this time."
    }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <HelpCircle size={48} className="mx-auto text-[#E91E63] mb-6" />
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-zinc-500 text-lg">Everything you need to know about ordering your Halo Bites surprise box.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-zinc-200 p-6 md:p-8 hover:border-[#E91E63] transition-colors shadow-sm">
              <h3 className="text-xl font-bold text-black mb-3">{faq.question}</h3>
              <p className="text-zinc-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-[#FFF5F8] p-8 border border-[#F8DCE3] text-center">
          <h3 className="text-xl font-bold text-black mb-2">Still have questions?</h3>
          <p className="text-zinc-600 mb-6">Our customer support team is here to help.</p>
          <Link href="/contact" className="inline-block bg-[#E91E63] text-white font-bold py-3 px-8 hover:bg-black transition-colors">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
