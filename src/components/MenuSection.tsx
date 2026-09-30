"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, X, RotateCcw, AlertCircle } from "lucide-react";
import { MenuItem } from "@/types";
import { MenuItemCard } from "./MenuItemCard";

export function MenuSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch("/api/menu"),
        fetch("/api/categories"),
      ]);

      if (!menuRes.ok || !catRes.ok) {
        throw new Error("Unable to load menu. Please check your network.");
      }

      const menuData = await menuRes.json();
      const catData = await catRes.json();

      if (menuData.success && Array.isArray(menuData.data)) {
        setItems(menuData.data);
      }
      if (catData.success && Array.isArray(catData.data)) {
        setCategories(catData.data);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load menu items.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadInitial() {
      try {
        const [menuRes, catRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/categories"),
        ]);
        if (!menuRes.ok || !catRes.ok) {
          throw new Error("Unable to load menu.");
        }
        const menuData = await menuRes.json();
        const catData = await catRes.json();

        if (!ignore) {
          if (menuData.success && Array.isArray(menuData.data)) {
            setItems(menuData.data);
          }
          if (catData.success && Array.isArray(catData.data)) {
            setCategories(catData.data);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load menu items.");
          setLoading(false);
        }
      }
    }

    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  // Filter items in client for instant responsive filtering
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      // Veg only filter
      if (vegOnly && !item.isVeg) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCat;
      }
      return true;
    });
  }, [items, selectedCategory, vegOnly, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setVegOnly(false);
  };

  return (
    <section id="menu" className="w-full py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matching Inspiration "Our Regular Menu Pack") */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
            Our Regular Menu Pack
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Discover our collection of freshly made culinary delights crafted with love
          </p>
        </div>

        {/* Filter Controls: Search & Category Capsules */}
        <div className="flex flex-col items-center gap-6 mb-12">
          {/* Category Capsules (Matching Inspiration Pill Slider) */}
          <div className="flex items-center justify-center flex-wrap gap-2.5 max-w-4xl mx-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs ${
                    isSelected
                      ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-400/30 scale-105"
                      : "bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80 hover:border-amber-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search bar & Veg toggle */}
          <div className="w-full max-w-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pizzas, burgers, pasta, desserts..."
                className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-xs"
                aria-label="Search dishes"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Pure Veg Filter Toggle Capsule */}
            <button
              type="button"
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all border shrink-0 shadow-xs ${
                vegOnly
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  vegOnly ? "bg-emerald-600" : "bg-stone-300"
                }`}
              />
              <span>Veg Only</span>
            </button>
          </div>
        </div>

        {/* Loading State Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-5 border border-stone-100 flex flex-col gap-4 animate-pulse shadow-sm"
              >
                <div className="w-full h-44 bg-stone-200 rounded-2xl" />
                <div className="h-5 bg-stone-200 rounded-full w-3/4" />
                <div className="h-3 bg-stone-100 rounded-full w-full" />
                <div className="h-3 bg-stone-100 rounded-full w-4/5" />
                <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                  <div className="h-6 bg-stone-200 rounded-full w-16" />
                  <div className="h-9 bg-stone-200 rounded-full w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State with Retry Button */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-8 rounded-3xl text-center flex flex-col items-center gap-3 max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-600" />
            <h3 className="font-bold text-lg">Unable to load the menu</h3>
            <p className="text-xs sm:text-sm text-rose-700">{error}</p>
            <button
              type="button"
              onClick={fetchMenuData}
              className="mt-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty Search State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="bg-white border border-stone-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="font-extrabold text-stone-900 text-lg">No dishes found</h3>
            <p className="text-xs sm:text-sm text-stone-500">
              We couldn’t find any dish matching your search or filters. Try another keyword or clear filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-3 px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
