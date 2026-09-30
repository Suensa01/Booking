import React from "react";
import Link from "next/link";
import { Utensils, Phone, Mail, MapPin, Clock, ShieldCheck, Heart, Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1C1917] text-stone-300 pt-16 pb-12 mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-hidden"
              aria-label="Bites Home"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-stone-950 shadow-md shadow-amber-400/20">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Bites
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              We Serve The Taste You Love. Handcrafted wood-fired pizzas, gourmet smash burgers, and artisanal pastas prepared fresh daily with organic local ingredients.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold bg-stone-800/80 px-3 py-1.5 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rated 4.9 ★ by 1,420+ Happy Diners</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-wider font-black text-white">Quick Links</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/#menu"
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Our Regular Menu Pack
                </Link>
              </li>
              <li>
                <Link
                  href="/#popular"
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Popular Dishes
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Track Active Order
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Admin Order Management
                </Link>
              </li>
              <li>
                <Link
                  href="/#reviews"
                  className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Menu Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-wider font-black text-white">Menu Categories</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/#menu" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Wood-Fired Pizza
                </Link>
              </li>
              <li>
                <Link href="/#menu" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Artisan Smash Burgers
                </Link>
              </li>
              <li>
                <Link href="/#menu" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Hand-Rolled Fresh Pasta
                </Link>
              </li>
              <li>
                <Link href="/#menu" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Crispy Sides & Fries
                </Link>
              </li>
              <li>
                <Link href="/#menu" className="text-stone-400 hover:text-amber-400 transition-colors">
                  Italian Desserts & Drinks
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Clickable Phone & Email) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-wider font-black text-white">Visit & Order</h3>
            <div className="flex flex-col gap-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>442 Culinary Boulevard, Gourmet District, NY 10012</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon - Sun: 11:00 AM – 11:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="tel:+15557286742"
                  className="text-stone-300 hover:text-amber-400 font-bold transition-colors"
                  title="Call Bites directly"
                >
                  +1 (555) 728-6742
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="mailto:mohit.work@gmail.com"
                  className="text-stone-300 hover:text-amber-400 font-medium transition-colors"
                  title="Email Us"
                >
                  mohit.work@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Copyright (Requirement 9) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {currentYear} Bites. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made by Suensa with <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </p>
        </div>
      </div>
    </footer>
  );
}
