"use client";

import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function MobileCartBar() {
  const { itemCount, total, setIsCartOpen, isHydrated } = useCart();

  if (!isHydrated || itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 p-3 sm:hidden bg-linear-to-t from-stone-950/20 via-transparent to-transparent pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="w-full flex items-center justify-between p-3.5 px-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-xl shadow-stone-900/30 transition-all transform active:scale-98 border border-stone-800"
          aria-label="View cart and proceed to checkout"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[11px] text-stone-400 font-medium">
                {itemCount} {itemCount === 1 ? "dish" : "dishes"} selected
              </div>
              <div className="text-base font-black tracking-tight text-white">
                ₹{total.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black bg-amber-400 text-stone-950 px-4 py-2 rounded-full shadow-xs">
            <span>View Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    </div>
  );
}
