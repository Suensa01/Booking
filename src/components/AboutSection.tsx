import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Smartphone,
  CalendarDays,
  Clock,
  UtensilsCrossed,
  Sparkles,
  ChefHat,
  ArrowRight,
} from "lucide-react";

export function AboutSection() {
  const services = [
    {
      icon: Smartphone,
      title: "Online Order",
      desc: "Fast, contactless online delivery to your doorstep",
    },
    {
      icon: CalendarDays,
      title: "Pre-Reservation",
      desc: "Book your dining table effortlessly in advance",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      desc: "Fresh late-night bites & round-the-clock kitchen",
    },
    {
      icon: UtensilsCrossed,
      title: "Organized Foodie Place",
      desc: "Warm ambiance & curated artisanal seating",
    },
    {
      icon: Sparkles,
      title: "Clean Kitchen",
      desc: "Triple-sanitized prep stations & spotless standards",
    },
    {
      icon: ChefHat,
      title: "Super Chefs",
      desc: "Master culinary artists passionate about every recipe",
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-y border-stone-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Chef Collage in Circular Frame */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background circular glow */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#F5EDE1] p-4 flex items-center justify-center shadow-lg">
              <div className="relative w-full h-full rounded-full overflow-hidden ring-8 ring-white shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                  alt="Executive Master Chef at Bites Bistro"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              {/* Floating decorative food badge */}
              <div className="absolute -bottom-2 -left-2 bg-white p-3.5 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3">
                <span className="text-2xl">🍕</span>
                <div>
                  <div className="text-xs font-black text-stone-900">100% Handcrafted</div>
                  <div className="text-[10px] text-stone-400 font-medium">Stone Hearth Fired</div>
                </div>
              </div>

              {/* Floating review badge */}
              <div className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 p-3 rounded-2xl shadow-lg font-bold text-xs flex items-center gap-1.5">
                <span>★ 4.9 Super Chef</span>
              </div>
            </div>
          </div>

          {/* Right Column: Text & 2x3 Services Grid */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/70 px-3 py-1 rounded-full">
                Why Choose Bites
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 mt-3 tracking-tight leading-tight">
                We Are More Than <br className="hidden sm:inline" />
                Multiple Service
              </h2>
              <p className="text-sm sm:text-base text-stone-600 mt-3 max-w-xl leading-relaxed">
                This is a type of artisanal kitchen which serves fresh food and drinks, in addition to light refreshments and gourmet comfort dining. Every recipe is created with love and premium organic farm ingredients.
              </p>
            </div>

            {/* 2x3 Services Grid (Matching Inspiration) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-[#FDFBF7] border border-stone-100/90 hover:border-amber-300 hover:shadow-sm transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-sm">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Button */}
            <div className="pt-2">
              <Link
                href="/#menu"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-sm shadow-sm hover:shadow-md transition-all transform active:scale-95"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
