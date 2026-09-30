import React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ChefsSection() {
  const chefs = [
    {
      name: "Savannah Nguyen",
      role: "Executive Head Chef",
      image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Esther Howard",
      role: "Master Wood-Fired Baker",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Marvin McKinney",
      role: "Artisanal Pasta Specialist",
      image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Albert Flores",
      role: "Gourmet Pastry Chef",
      image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Arrows */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
              Meet Our Chefs
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              The passionate culinary masters behind every handcrafted recipe
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#FDFBF7] hover:bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center transition-colors shadow-xs"
              aria-label="Previous chefs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 flex items-center justify-center transition-colors shadow-xs"
              aria-label="Next chefs"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chefs Grid (Matching Inspiration Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chefs.map((chef) => (
            <div
              key={chef.name}
              className="group bg-[#FDFBF7] rounded-3xl p-4 border border-stone-100/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4 bg-stone-200">
                <Image
                  src={chef.image}
                  alt={chef.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-extrabold text-stone-900 text-base group-hover:text-amber-600 transition-colors">
                {chef.name}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">{chef.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
