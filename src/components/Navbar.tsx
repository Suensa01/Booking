"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Phone, Menu as MenuIcon, X, Utensils, ShieldCheck, Calendar } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { TableReservationModal } from "./TableReservationModal";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  const navLinks = [
    { name: "About Us", href: "/#about" },
    { name: "Menu", href: "/#menu" },
    { name: "Popular", href: "/#popular" },
    { name: "Reviews", href: "/#reviews" },
    { name: "Track Order", href: "/track-order" },
    { name: "Admin", href: "/admin", isSpecial: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Clickable Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl p-1"
              aria-label="Bites Home"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-stone-950 shadow-md shadow-amber-400/20 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                Bites
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.replace("/#", "/"));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors ${
                      link.isSpecial
                        ? "text-amber-800 bg-amber-100/80 hover:bg-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                        : isActive
                        ? "text-amber-600 font-bold"
                        : "text-stone-600 hover:text-stone-950"
                    }`}
                  >
                    {link.isSpecial && <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />}
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Quick Actions (Cart & Table Reservation) */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Clickable Phone */}
              <a
                href="tel:+15557286742"
                className="hidden xl:flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-amber-700 py-1.5 px-3 rounded-full hover:bg-amber-50 transition-all border border-stone-200/80"
                title="Call Bites for quick reservations or queries"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>+1 (555) 728-6742</span>
              </a>

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative w-11 h-11 rounded-full bg-white border border-stone-200 hover:border-amber-400 text-stone-800 flex items-center justify-center shadow-xs transition-all hover:scale-105 focus:outline-hidden"
                aria-label={`Shopping Cart with ${itemCount} items`}
              >
                <ShoppingBag className="w-5 h-5 text-stone-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-black text-stone-950 bg-amber-400 rounded-full shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Reserve Table Pill Button */}
              <button
                type="button"
                onClick={() => setIsReservationOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all transform active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Table</span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors focus:outline-hidden"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200/80 bg-[#FDFBF7]/98 px-5 pt-4 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-base font-semibold text-stone-800 hover:bg-amber-100/60 transition-colors"
                >
                  <span>{link.name}</span>
                  {link.isSpecial ? (
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                  ) : (
                    <span className="text-stone-400 text-sm">→</span>
                  )}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-stone-200 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsReservationOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-amber-400 text-stone-950 text-sm font-bold shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  Reserve a Table
                </button>
                <a
                  href="tel:+15557286742"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white border border-stone-200 text-stone-800 text-sm font-bold shadow-xs"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  Call Us: +1 (555) 728-6742
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <TableReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
    </>
  );
}
