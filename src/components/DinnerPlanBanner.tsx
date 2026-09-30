"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Phone, Calendar } from "lucide-react";
import { TableReservationModal } from "./TableReservationModal";

export function DinnerPlanBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[40px] bg-white border border-stone-100 shadow-md p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 flex flex-col gap-5 z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/70 px-3 py-1 rounded-full w-fit">
                  Table Booking & Dine-In
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
                  Do You Have Any Dinner <br className="hidden sm:inline" />
                  Plan Today? Reserve <br className="hidden sm:inline" />
                  Your Table
                </h2>
                <p className="text-sm sm:text-base text-stone-600 max-w-lg leading-relaxed">
                  Make online reservations, read restaurant reviews from diners, and enjoy an unforgettable evening with handcrafted gourmet specialties in our wood-fired dining room.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-sm shadow-sm hover:shadow-md transition-all transform active:scale-95 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Make Reservation</span>
                  </button>
                  <a
                    href="tel:+15557286742"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FDFBF7] hover:bg-stone-100 border border-stone-200 text-stone-800 font-bold text-sm transition-all"
                  >
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span>Call Kitchen Line</span>
                  </a>
                </div>
              </div>

              {/* Right Circular Dish Presentation */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#F5EDE1] p-4 flex items-center justify-center shadow-lg">
                  <div className="relative w-full h-full rounded-full overflow-hidden ring-8 ring-white shadow-xl">
                    <Image
                      src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=700&q=80"
                      alt="Authentic dinner platter at Bites"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TableReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
