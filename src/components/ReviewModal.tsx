"use client";

import React, { useState } from "react";
import { X, Star, Loader2, MessageSquarePlus } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [role, setRole] = useState("Dine-in Customer");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setError("Please write at least a sentence about your experience (min 5 chars).");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, rating, comment }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to submit review.");
      }
      showToast("Thank you! Your review has been published.", "success");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting review.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-[32px] shadow-2xl border border-stone-200 p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close review modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Customer Feedback</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Share Your Experience
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tell other food lovers what dish you loved at Bites.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Star Rating Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 focus:outline-hidden hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-stone-200 text-stone-200"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-stone-700 ml-2">
                {rating === 5 ? "Exceptional! 5/5" : `${rating}/5 Stars`}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Your Relationship to Bites
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-amber-400"
            >
              <option value="Dine-in Customer">Dine-in Customer</option>
              <option value="Delivery Customer">Delivery Customer</option>
              <option value="Weekend Regular">Weekend Regular</option>
              <option value="First-Time Diner">First-Time Diner</option>
              <option value="Food Blogger / Critic">Food Blogger / Critic</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Your Review / Favorite Dish
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Loved the wood-fired Margherita and truffle fries! Friendly staff and super fast delivery."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-amber-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 disabled:bg-amber-200 text-stone-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Review...</span>
              </>
            ) : (
              <span>Submit Review</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
