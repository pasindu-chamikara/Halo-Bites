import Link from 'next/link';
import { Heart, Sparkles, Gift, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#050505] text-white font-sans min-h-screen selection:bg-[#E91E63] selection:text-white">
      {/* Hero Section - Magazine Style */}
      <section className="relative h-[80vh] md:h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E91E63] blur-[150px] opacity-30"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FBA8BE] blur-[200px] opacity-20"></div>
        </div>
        
        <div className="z-10 text-center container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-[15vw] md:text-[12vw] leading-none font-black tracking-tighter uppercase mix-blend-difference">
            The Art Of
          </h1>
          <div className="flex items-center justify-center gap-4 md:gap-8 mt-2 md:mt-4">
            <img src="/hero2.png" alt="Cake" className="w-24 md:w-56 h-24 md:h-56 object-cover hover:scale-110 transition-transform duration-700" />
            <h1 className="text-[15vw] md:text-[12vw] leading-none font-black tracking-tighter uppercase text-[#E91E63]">
              Surprise
            </h1>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 text-right hidden lg:block z-10">
          <p className="text-zinc-400 max-w-xs text-sm uppercase tracking-widest leading-loose font-medium">
            Est. 2024 • Crafting unforgettable moments through premium cake bites and explosion boxes.
          </p>
        </div>
      </section>

      {/* Sticky Scroll Story Section */}
      <section className="bg-white text-black relative">
        <div className="container mx-auto px-4 sm:px-8 max-w-[1440px] flex flex-col lg:flex-row relative">
          
          {/* Sticky Left Column */}
          <div className="lg:w-1/3 lg:sticky lg:top-0 h-auto lg:h-screen flex flex-col justify-center py-20 lg:py-0 border-r border-zinc-100 pr-8 lg:pr-16 z-10 bg-white">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">Our <br/> Story</h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-12">
              Halo Bites was born out of a passion for bringing people together through beautiful, handcrafted treats hidden inside spectacular surprise boxes.
            </p>
            <Link href="/shop" className="group flex items-center gap-4 text-xl font-bold hover:text-[#E91E63] transition-colors w-max">
              Shop The Collection
              <span className="w-12 h-12 bg-black text-white flex items-center justify-center group-hover:bg-[#E91E63] transition-colors">
                <ArrowRight size={20} />
              </span>
            </Link>
          </div>

          {/* Scrolling Right Column */}
          <div className="lg:w-2/3 pb-20 lg:py-32 lg:pl-24 space-y-20 lg:space-y-32">
            
            <div className="group">
              <div className="overflow-hidden mb-8 bg-[#FFF5F8]">
                <img src="/chooseyourbox.jpg" alt="Choose Box" className="w-full h-[40vh] md:h-[60vh] object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 tracking-tight">01. The Concept</h3>
              <p className="text-zinc-500 text-lg md:text-xl leading-relaxed max-w-2xl">
                What if a gift could be as exciting to open as it is delicious to eat? We wanted to transcend traditional bakery items by engineering an unboxing experience that guarantees a "wow" moment.
              </p>
            </div>

            <div className="group">
              <div className="overflow-hidden mb-8 bg-[#FFF5F8]">
                <img src="/personalize.jpg" alt="Personalize" className="w-full h-[40vh] md:h-[60vh] object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 tracking-tight">02. The Craft</h3>
              <p className="text-zinc-500 text-lg md:text-xl leading-relaxed max-w-2xl">
                Every detail matters. From hand-whisked frosting to intricately layered cake bites, our kitchen is a studio where flavor meets art. We source only the finest ingredients to ensure the taste matches the magic.
              </p>
            </div>

            <div className="group">
              <div className="overflow-hidden mb-8 bg-[#FFF5F8]">
                <img src="/scheduleandsend.jpg" alt="Send" className="w-full h-[40vh] md:h-[60vh] object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 tracking-tight">03. The Delivery</h3>
              <p className="text-zinc-500 text-lg md:text-xl leading-relaxed max-w-2xl">
                Whether it's a cascade of flying butterflies or a personalized photo explosion, your custom box arrives flawlessly packaged, ready to create an unforgettable memory.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Bento Box Values Section */}
      <section className="bg-[#FFF5F8] text-black py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-8 max-w-[1440px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[600px]">
            
            {/* Main large block */}
            <div className="md:col-span-2 md:row-span-2 bg-[#E91E63] text-white p-10 md:p-12 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500 shadow-2xl shadow-[#E91E63]/20">
              <Sparkles size={48} className="mb-8" />
              <div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Premium Quality</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  We never compromise on taste. Every cake bite is baked fresh to order using top-tier, locally sourced ingredients for an unparalleled flavor experience.
                </p>
              </div>
            </div>

            {/* Small top block */}
            <div className="md:col-span-1 md:row-span-1 bg-white p-8 flex flex-col justify-center border border-[#F8DCE3] hover:-translate-y-2 transition-transform duration-500">
              <Gift size={32} className="text-[#E91E63] mb-6" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Unforgettable Unboxing</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Engineered to surprise and delight every single time.</p>
            </div>

            {/* Image block */}
            <div className="md:col-span-1 md:row-span-2 bg-cover bg-center overflow-hidden group h-[300px] md:h-auto">
               <img src="/hero6.png" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 bg-zinc-100" />
            </div>

            {/* Small bottom block */}
            <div className="md:col-span-1 md:row-span-1 bg-black text-white p-8 flex flex-col justify-center hover:-translate-y-2 transition-transform duration-500">
              <Heart size={32} className="text-[#E91E63] mb-6" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Made with Love</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">Crafted by artisans who care deeply about your special moments.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
