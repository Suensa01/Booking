"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    tax,
    total,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-200/80 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-stone-900 text-lg leading-tight">
                  Your Order Cart
                </h2>
                <p className="text-xs text-stone-500">
                  {itemCount} {itemCount === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-full hover:bg-rose-50 transition-colors"
                  title="Remove all items from cart"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-black text-stone-800 text-lg">Your cart is empty</h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xs">
                  Discover our freshly baked pizzas, smash burgers, and handcrafted pastas to begin your order.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-7 py-3 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-sm rounded-full shadow-sm transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-3 sm:gap-4 bg-white p-3 rounded-2xl mb-2.5 border border-stone-100/90 shadow-xs">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isVeg ? "bg-emerald-600" : "bg-rose-600"
                        }`}
                      />
                      <h4 className="font-bold text-stone-900 text-sm truncate">
                        {item.name}
                      </h4>
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      ₹{item.price.toFixed(2)} each
                    </div>
                    <div className="text-sm font-black text-stone-900 mt-1">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-[#FDFBF7] border border-stone-200/80 rounded-full p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-full bg-white text-stone-700 hover:bg-amber-400 hover:text-stone-950 flex items-center justify-center shadow-xs transition-colors"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-black text-xs text-stone-900">
                      {item.quantity}
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

                  {/* Delete Item Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-stone-300 hover:text-rose-600 transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-stone-200/80 bg-white flex flex-col gap-4">
              {/* Cost Breakdown */}
              <div className="flex flex-col gap-2 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    GST & Restaurant Tax (5%)
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-base font-black text-stone-900">
                  <span>Grand Total</span>
                  <span className="text-amber-600 text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-5 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-center focus:outline-hidden"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
