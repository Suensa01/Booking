"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, MessageSquarePlus } from "lucide-react";
import { CustomerReview } from "@/types";
import { ReviewModal } from "./ReviewModal";

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      }
    } catch (e) {
      console.error("Error loading reviews", e);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.data)) {
          setReviews(data.data);
        }
      } catch (e) {
        console.error("Error loading reviews", e);
      }
    }
    loadReviews();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section id="reviews" className="py-16 sm:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-12">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/70 px-3 py-1 rounded-full">
              Community Love
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight mt-2">
              What Our Customer Says?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Real reviews from diners who love our handcrafted dishes
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-xs shadow-xs hover:border-amber-400 transition-all shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-500" />
            <span>Leave a Review</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.slice(0, 6).map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= r.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-stone-200 text-stone-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                  “{r.comment}”
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-100">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-stone-100 shrink-0 ring-2 ring-amber-400/50">
                  <Image
                    src={
                      r.avatar ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={r.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-sm">{r.name}</h4>
                  <span className="text-[11px] text-stone-400">{r.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchReviews}
      />
    </section>
  );
}
