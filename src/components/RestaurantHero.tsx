import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star } from "lucide-react";

export function RestaurantHero() {
  const categoriesQuickPills = [
    { label: "Dishes", icon: "🍲" },
    { label: "Dessert", icon: "🍨" },
    { label: "Drinks", icon: "🥤" },
    { label: "Platter", icon: "🍱" },
    { label: "Snacks", icon: "🥪" },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative background sprinkles / dots */}
      <div className="absolute top-12 left-10 text-stone-300 text-2xl select-none opacity-50">
        ✦ • ✦
      </div>
      <div className="absolute bottom-16 left-1/3 text-stone-300 text-2xl select-none opacity-40">
        •••
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6 z-10">
            {/* Headline matching the inspiration */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.15]">
              We Serve The Taste <br className="hidden sm:inline" />
              You Love <span className="inline-block animate-bounce">😍</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              This is a type of artisanal kitchen which serves handcrafted gourmet dishes, wood-fired pizzas, smash burgers, and fresh refreshments prepared with farm-fresh organic ingredients.
            </p>

            {/* Call to Actions matching the inspiration */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/#menu"
                className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                Explore Food
              </Link>

              <Link
                href="/#menu"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-800 font-bold text-sm shadow-xs hover:border-amber-300 transition-all"
              >
                <Search className="w-4 h-4 text-stone-500" />
                <span>Search Dishes</span>
              </Link>
            </div>

            {/* Quality indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-stone-600">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="font-bold text-stone-900">4.9 / 5.0</span>
                <span className="text-stone-400">(1,420+ Reviews)</span>
              </div>
              <span className="text-stone-300">•</span>
              <div className="text-stone-700">
                ⚡ 25–35 Mins Average Delivery
              </div>
            </div>
          </div>

          {/* Right Visual Column (Matching Inspiration Circular Plate & Floating Pills) */}
          <div className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center">
            {/* Outer Circular Cream Backdrop */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 xl:w-[420px] xl:h-[420px] rounded-full bg-[#F4EDE2] flex items-center justify-center p-6 shadow-inner">
              {/* Inner Plate Image */}
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-8 ring-white/60">
                <Image
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious gourmet dish on plate"
                  fill
                  priority
                  sizes="(max-width: 768px) 320px, 420px"
                  className="object-cover"
                />
              </div>

              {/* Floating Vertical Quick Category Pills on Right (Exact layout from image) */}
              <div className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20">
                {categoriesQuickPills.map((pill) => (
                  <Link
                    key={pill.label}
                    href="/#menu"
                    className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-md border border-stone-100 hover:border-amber-400 hover:scale-105 transition-all text-xs font-bold text-stone-800"
                  >
                    <span className="text-sm">{pill.icon}</span>
                    <span className="pr-1">{pill.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
