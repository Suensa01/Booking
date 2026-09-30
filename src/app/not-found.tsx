import React from "react";
import Link from "next/link";
import { Utensils, Home, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | suensa",
  description: "The page or dish you are looking for does not exist on our menu. Return to suensa to explore handcrafted pizzas, smash burgers, and fresh pastas.",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center flex flex-col items-center">
        {/* Animated Visual */}
        <div className="w-24 h-24 rounded-full bg-orange-100/80 text-orange-600 flex items-center justify-center mb-6 shadow-inner relative">
          <Utensils className="w-12 h-12" />
          <span className="absolute -top-1 -right-1 bg-orange-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
            404
          </span>
        </div>

        <h1 className="font-serif text-3xl font-extrabold text-slate-900 tracking-tight">
          Dish Not on the Menu
        </h1>

        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          We looked high and low in the kitchen, but the recipe or page you requested cannot be found or may have been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-8">
          <Link
            href="/"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Menu</span>
          </Link>

          <Link
            href="/track-order"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Track Order</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 w-full text-xs text-slate-400">
          Need immediate support? Call our hotline at{" "}
          <a
            href="tel:+15557286742"
            className="text-orange-600 font-bold hover:underline"
          >
            +1 (555) 728-6742
          </a>
        </div>
      </div>
    </div>
  );
}
