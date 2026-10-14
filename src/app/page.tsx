"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  count?: number;
  status?: string;
  description?: string;
  image?: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'CAT-1',
    name: 'Signature Cakes',
    count: 12,
    status: 'Active',
    description: 'Our premium custom cakes for all occasions.',
    image: '/hero1.png'
  },
  {
    id: 'CAT-2',
    name: 'Donuts',
    count: 24,
    status: 'Active',
    description: 'Freshly baked classic and artisanal donuts.',
    image: '/hero2.png'
  },
  {
    id: 'CAT-3',
    name: 'Macarons',
    count: 8,
    status: 'Active',
    description: 'Delicate French macarons in various flavors.',
    image: '/hero3.png'
  },
  {
    id: 'CAT-4',
    name: 'Pastries',
    count: 15,
    status: 'Active',
    description: 'Flaky and buttery morning pastries.',
    image: '/hero4.png'
  },
];

const TESTIMONIALS = [
  {
    name: "Noah Collins",
    role: "Verified Customer",
    text: "Incredible Flavors, Stunning Design, And Exceptional Service—A Must-Try For Every Donut Lover!",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Olivia Bennett",
    role: "Sweet Treats Fan",
    text: "Absolutely Delicious Donuts With Perfect Sweetness And Beautiful Presentation. Loved Every Bite!",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    name: "Ethan Parker",
    role: "Verified Customer",
    text: "Fresh, Soft, And Full Of Flavor—Halo Bites Never Disappoints. Highly Recommended!",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    name: "Sophia Mitchell",
    role: "Gift Box Buyer",
    text: "Amazing Taste, Beautiful Packaging, And A Wonderful Experience. Definitely Ordering Again!",
    avatar: "https://i.pravatar.cc/150?img=49"
  },
  {
    name: "Liam Anderson",
    role: "Verified Customer",
    text: "Every Donut Was A Delight! The Perfect Treat For Anyone With A Sweet Tooth.",
    avatar: "https://i.pravatar.cc/150?img=33"
  },
  {
    name: "Ava Thompson",
    role: "Regular Customer",
    text: "Delicious Flavors And Lovely Designs Make Halo Bites My Favorite Sweet Spot!",
    avatar: "https://i.pravatar.cc/150?img=44"
  },
  {
    name: "Lucas Williams",
    role: "Verified Customer",
    text: "From The First Bite To The Last, Everything Was Simply Amazing. Truly Worth Trying!",
    avatar: "https://i.pravatar.cc/150?img=15"
  },
  {
    name: "Isabella Davis",
    role: "Celebration Host",
    text: "Beautifully Crafted Donuts With Incredible Taste. Perfect For Sharing With Friends And Family!",
    avatar: "https://i.pravatar.cc/150?img=20"
  },
  {
    name: "James Wilson",
    role: "Verified Customer",
    text: "Outstanding Quality, Fresh Ingredients, And Unforgettable Flavors. Absolutely Loved It!",
    avatar: "https://i.pravatar.cc/150?img=59"
  },
  {
    name: "Mia Robinson",
    role: "Food Enthusiast",
    text: "Such A Wonderful Sweet Experience! The Donuts Look Gorgeous And Taste Even Better!",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    name: "Benjamin Taylor",
    role: "Verified Customer",
    text: "Rich Flavors, Soft Texture, And Excellent Presentation—Everything A Donut Lover Could Ask For!",
    avatar: "https://i.pravatar.cc/150?img=68"
  },
  {
    name: "Charlotte Lewis",
    role: "Happy Gifter",
    text: "Halo Bites Turns Every Sweet Craving Into A Special Experience. Can't Wait To Order Again!",
    avatar: "https://i.pravatar.cc/150?img=26"
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Testimonials Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalTestimonialSlides = isMobile ? TESTIMONIALS.length : Math.ceil(TESTIMONIALS.length / 3);

  // Auto-advance testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % totalTestimonialSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalTestimonialSlides]);

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + totalTestimonialSlides) % totalTestimonialSlides);
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % totalTestimonialSlides);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('halo_bites_admin_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const activeOnly = parsed.filter(cat => cat.status !== 'Draft');
          setCategories(activeOnly.length > 0 ? activeOnly : parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 340;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % 7);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const heroImages = [
    { src: "/hero1.png", alt: "Cake 1" },
    { src: "/hero2.png", alt: "Cake 2" },
    { src: "/hero3.png", alt: "Cake 3" },
    { src: "/hero4.png", alt: "Cake 4" },
    { src: "/hero5.png", alt: "Cake 5" },
    { src: "/hero6.png", alt: "Cake 6" },
    { src: "/hero7.png", alt: "Cake 7" }
  ];

  return (
    <div className="flex flex-col bg-[#FFFFFF] min-h-screen relative font-sans overflow-hidden">

      {/* Small Decorative Line-Art Icons */}
      <div className="opacity-0 animate-fade-in delay-400">
        {/* Upper Left Cake */}
        <svg className="absolute left-[8%] top-[18%] w-12 h-12 text-[#F8DCE3] -rotate-12 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z"></path>
          <path d="M2 14h20"></path>
          <path d="M12 8v-4"></path>
          <path d="M12 4h.01"></path>
          <path d="M8 8v-2"></path>
          <path d="M8 6h.01"></path>
          <path d="M16 8v-2"></path>
          <path d="M16 6h.01"></path>
        </svg>
        {/* Upper Right Cake */}
        <svg className="absolute right-[8%] top-[15%] w-10 h-10 text-[#F8DCE3] rotate-12 animate-float-delayed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z"></path>
          <path d="M2 14h20"></path>
          <path d="M12 8v-4"></path>
          <path d="M12 4h.01"></path>
        </svg>
        {/* Lower Left Cupcake */}
        <svg className="absolute left-[12%] bottom-[20%] w-10 h-10 text-[#F8DCE3] -rotate-6 animate-float-delayed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"></path>
        </svg>
        {/* Lower Right Cupcake */}
        <svg className="absolute right-[10%] bottom-[25%] w-10 h-10 text-[#F8DCE3] rotate-12 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"></path>
        </svg>
      </div>

      {/* Hero Section */}
      <main className="relative w-full flex-1 flex flex-col items-center pt-[130px] pb-0 px-4 mx-auto max-w-[1440px]">

        {/* Main Heading */}
        <div className="relative z-30 w-full text-center opacity-0 animate-fade-in-up">
          <h1 className="text-[48px] md:text-[64px] lg:text-[76px] font-[900] tracking-tighter text-[#050505] leading-[0.98]">
            Delivering Incredible<br />Moments
          </h1>
        </div>

        {/* Cake Composition */}
        <div className="relative w-full h-[280px] md:h-[400px] lg:h-[480px] flex justify-center items-start mt-[-20px] md:mt-[-60px] lg:mt-[-80px]">

          {/* Large Pink Curved Shape */}
          <div className="absolute bottom-[-10%] md:bottom-[-15%] left-1/2 -translate-x-1/2 w-[200%] min-w-[1400px] max-w-[2800px] aspect-square rounded-[100%] border-[100px] md:border-[180px] border-[#FBA8BE] pointer-events-none z-0 opacity-0 animate-fade-in delay-200"></div>

          {/* Animated Hero Cakes */}
          {heroImages.map((img, i) => {
            const diff = (i - currentIndex + 7) % 7;

            let positionStyle = "";
            switch (diff) {
              case 0: // Left
                positionStyle = "left-[15%] sm:left-[20%] lg:left-[22%] -translate-x-1/2 top-[2%] md:top-[4%] w-40 sm:w-56 md:w-72 lg:w-[320px] z-20 opacity-100 drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] scale-100";
                break;
              case 1: // Center
                positionStyle = "left-[50%] -translate-x-1/2 top-[10%] md:top-[12%] w-56 sm:w-72 md:w-96 lg:w-[460px] z-30 opacity-100 drop-shadow-[0_30px_50px_rgba(0,0,0,0.25)] scale-100";
                break;
              case 2: // Right
                positionStyle = "left-[85%] sm:left-[80%] lg:left-[78%] -translate-x-1/2 top-[0%] md:top-[2%] w-40 sm:w-56 md:w-72 lg:w-[320px] z-20 opacity-100 drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] scale-100";
                break;
              case 6: // Exiting Left
                positionStyle = "left-[-10%] sm:left-[0%] -translate-x-1/2 top-[2%] md:top-[4%] w-40 sm:w-56 md:w-72 lg:w-[320px] z-10 opacity-0 scale-75 pointer-events-none";
                break;
              case 3: // Entering Right
                positionStyle = "left-[110%] sm:left-[100%] -translate-x-1/2 top-[0%] md:top-[2%] w-40 sm:w-56 md:w-72 lg:w-[320px] z-10 opacity-0 scale-75 pointer-events-none";
                break;
              default: // Hidden in background
                positionStyle = "left-[50%] -translate-x-1/2 top-[5%] w-40 sm:w-56 md:w-72 lg:w-[320px] z-0 opacity-0 scale-50 pointer-events-none";
                break;
            }

            return (
              <div
                key={i}
                className={`absolute transition-all duration-1000 ease-in-out ${positionStyle}`}
              >
                <div className="animate-float">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            );
          })}

        </div>

        {/* Order Now Button */}
        <div className="mt-[-10px] md:mt-[-15px] lg:mt-[-20px] relative z-40 pb-4 opacity-0 animate-fade-in-up delay-400">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-[#E91E63] w-[154px] h-[42px] text-[14px] font-medium text-white transition-transform hover:scale-105 hover:bg-[#d81b5c]"
          >
            Order Now
          </Link>
        </div>

      </main>

      {/* Categories Section */}
      <section className="container mx-auto px-4 sm:px-8 max-w-7xl py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-black">Our Categories</h2>
            <p className="text-zinc-500 text-sm mt-1">Discover freshly baked cakes, pastries, and sweet delights</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scrollCategories('left')}
              aria-label="Previous categories"
              className="flex h-12 w-12 items-center justify-center rounded-none bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-black hover:border-black transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => scrollCategories('right')}
              aria-label="Next categories"
              className="flex h-12 w-12 items-center justify-center rounded-none bg-[#E91E63] text-white hover:bg-[#d81b5c] shadow-sm transition-colors cursor-pointer"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={categoryScrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href="/shop"
              className="min-w-[260px] sm:min-w-[280px] lg:flex-1 group flex flex-col items-center text-center p-6 bg-[#F8DCE3]/40 border border-[#F8DCE3] rounded-none transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#FBA8BE]/20 snap-start"
            >
              <div className="w-48 h-48 rounded-none mb-6 overflow-hidden bg-white/50 border border-white/80 drop-shadow-sm flex items-center justify-center">
                <img
                  src={cat.image || "/hero1.png"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="w-full text-center flex flex-col items-center flex-1 justify-between">
                <div>
                  <h3 className="font-bold text-xl text-black group-hover:text-[#E91E63] transition-colors">{cat.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description || "Freshly baked sweet treats crafted with love."}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#E91E63] uppercase tracking-wider group-hover:underline">
                  <span>Explore Category</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full bg-[#FFF5F8] py-12">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
          <h2 className="text-4xl font-bold tracking-tight text-black text-center mb-10">How it Works</h2>

          <div className="flex flex-col gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-1 relative">
                <img src="/chooseyourbox.jpg" alt="Choose" className="w-80 h-80 object-cover rounded-full mx-auto drop-shadow-xl" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-black mb-2">Choose Your Box</h3>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">Browse our unique collection of surprise boxes — from flying butterflies to themed cake explosions, there's something for every occasion.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-10">
              <div className="flex-1 relative">
                <img src="/personalize.jpg" alt="Personalize" className="w-80 h-80 object-cover rounded-full mx-auto drop-shadow-xl" />
              </div>
              <div className="flex-1 text-center md:text-left md:flex md:flex-col md:items-end">
                <div className="max-w-sm">
                  <h3 className="text-2xl font-bold text-black mb-2">Personalize the Experience</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">Add your favorite cake flavor, custom photos, sweet extras, and a heartfelt message to make it truly unforgettable.</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-1 relative">
                <img src="/scheduleandsend.jpg" alt="Schedule" className="w-80 h-80 object-cover rounded-full mx-auto drop-shadow-xl" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-black mb-2">Schedule & Send</h3>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">Pick your delivery date and we'll handle the rest — your surprise gift will arrive fresh, fun, and full of joy!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What customers are saying */}
      <section className="container mx-auto px-4 sm:px-8 max-w-7xl py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black text-center sm:text-left">
              What customers are saying
            </h2>
            <p className="text-zinc-500 text-sm mt-1 text-center sm:text-left">
              Real reviews from sweet lovers across the island
            </p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handlePrevTestimonial}
              aria-label="Previous testimonials"
              className="flex h-11 w-11 items-center justify-center rounded-none bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-black hover:border-black transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              onClick={handleNextTestimonial}
              aria-label="Next testimonials"
              className="flex h-11 w-11 items-center justify-center rounded-none bg-[#E91E63] text-white hover:bg-[#d81b5c] shadow-sm transition-colors cursor-pointer"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Window */}
        <div className="overflow-hidden w-full">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${testimonialIndex * 100}%)`
            }}
          >
            {TESTIMONIALS.map((testimonial, i) => (
              <div 
                key={i} 
                className="w-full md:w-1/3 flex-shrink-0 px-2 sm:px-3"
              >
                <div className="bg-[#FFF9FA] border border-[#F8DCE3] hover:border-black transition-colors rounded-none p-6 sm:p-8 flex flex-col h-full justify-between">
                  <div>
                    <div className="mb-4">
                      <h4 className="font-bold text-black text-base">{testimonial.name}</h4>
                      <p className="text-xs text-zinc-400 font-medium">{testimonial.role}</p>
                    </div>

                    <p className="text-sm text-zinc-700 leading-relaxed italic mb-6">
                      "{testimonial.text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F8DCE3]/60">
                    <div className="text-[#E91E63] text-sm tracking-widest font-black">
                      ★★★★★
                    </div>
                    <Quote className="text-[#F8DCE3]" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Indicator Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalTestimonialSlides }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setTestimonialIndex(dotIdx)}
              aria-label={`Go to testimonial slide ${dotIdx + 1}`}
              className={`h-2 transition-all rounded-none ${
                testimonialIndex === dotIdx 
                  ? 'w-8 bg-[#E91E63]' 
                  : 'w-2 bg-zinc-200 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Our Sweetest Moments */}
      <section className="container mx-auto px-4 sm:px-8 max-w-5xl py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-12">Our Sweetest Moments</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
          <div className="col-span-1 row-span-2 rounded-none overflow-hidden border border-zinc-200 group">
            <img src="/1.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Sweetest Moment 1" />
          </div>
          <div className="col-span-1 row-span-1 rounded-none overflow-hidden border border-zinc-200 group">
            <img src="/2.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Sweetest Moment 2" />
          </div>
          <div className="col-span-1 row-span-2 rounded-none overflow-hidden border border-zinc-200 group">
            <img src="/3.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Sweetest Moment 3" />
          </div>
          <div className="col-span-1 row-span-2 rounded-none overflow-hidden border border-zinc-200 group">
            <img src="/4.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Sweetest Moment 4" />
          </div>
          <div className="col-span-1 row-span-1 rounded-none overflow-hidden border border-zinc-200 group">
            <img src="/5.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Sweetest Moment 5" />
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="container mx-auto px-4 sm:px-8 max-w-5xl py-8 mb-6">
        <div className="bg-[#FFF9FA] border border-[#F8DCE3] rounded-none p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="max-w-md relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black mb-3 leading-snug">
              Treat Yourself. Celebrate Life with Halo Bites.
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-6">
              Delight in bite-sized joy made to brighten birthdays, sweeten surprises, and add magic to every moment.
            </p>
            <Link 
              href="/shop" 
              className="inline-block rounded-none bg-[#E91E63] px-6 py-3 font-bold text-xs uppercase tracking-widest text-white transition-all hover:bg-[#050505]"
            >
              Order Now
            </Link>
          </div>
          <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-end">
            <img 
              src="/treat.jpg" 
              alt="Treat Yourself with Halo Bites" 
              className="w-full max-w-[320px] h-[240px] sm:h-[260px] object-cover rounded-none border border-[#F8DCE3]" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
