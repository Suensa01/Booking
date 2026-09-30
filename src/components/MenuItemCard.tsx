"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Star } from "lucide-react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group bg-white rounded-3xl p-5 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative">
      {/* Top Image Container - Clean plate appearance */}
      <div className="relative w-full h-44 sm:h-48 mb-4 overflow-hidden rounded-2xl bg-[#F9F6F0] flex items-center justify-center">
        {!imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
            priority={item.id <= 104}
          />
        ) : (
          <div className="text-center p-4 text-amber-600">
            <span className="text-4xl">🍽️</span>
            <div className="text-xs font-bold mt-1">{item.name}</div>
          </div>
        )}

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 border border-stone-100">
          <span
            className={`w-2 h-2 rounded-full ${
              item.isVeg ? "bg-emerald-600" : "bg-rose-600"
            }`}
          />
          <span className="text-[10px] font-bold text-stone-700">
            {item.isVeg ? "Veg" : "Non-Veg"}
          </span>
        </div>

        {/* Category tag */}
        <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Dish Name */}
          <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-amber-600 transition-colors leading-tight">
            {item.name}
          </h3>

          {/* Star Rating (5 golden stars) */}
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold text-stone-700 ml-1">
              {item.rating || 4.9}
            </span>
          </div>

          {/* Appetizing description */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Price & Add To Cart Button (Matching Inspiration Design) */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-stone-400 font-medium">Price</span>
            <span className="font-extrabold text-stone-950 text-xl">
              ₹{item.price.toFixed(2)}
            </span>
          </div>

          {quantity > 0 ? (
            <div className="flex items-center bg-amber-50 border border-amber-300 rounded-full p-1 shadow-xs">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, -1)}
                className="w-7 h-7 rounded-full bg-white text-stone-800 hover:bg-amber-400 hover:text-stone-950 flex items-center justify-center shadow-xs transition-colors"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-extrabold text-xs text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, 1)}
                className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 hover:bg-amber-500 flex items-center justify-center shadow-xs transition-colors"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(item)}
              className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs hover:shadow-md transition-all transform active:scale-95"
              aria-label={`Add ${item.name} to cart`}
            >
              Add To Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
