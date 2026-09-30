"use client";

import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { initialMenuItems } from "@/data/restaurantData";
import { MenuItemCard } from "./MenuItemCard";

export function PopularDishesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const popularItems = initialMenuItems.slice(0, 4);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section id="popular" className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left Heading and Right Arrows */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Popular Dishes
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Hand-picked customer favorites prepared fresh every single hour
            </p>
          </div>

          {/* Navigation Arrows (Matching Inspiration) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="w-10 h-10 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center shadow-xs transition-colors focus:outline-hidden"
              aria-label="Scroll popular dishes left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs transition-colors focus:outline-hidden"
              aria-label="Scroll popular dishes right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Popular Dishes Grid / Responsive Row */}
        <div
          ref={scrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-2 scrollbar-none"
        >
          {popularItems.map((item) => (
            <MenuItemCard key={`popular-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
