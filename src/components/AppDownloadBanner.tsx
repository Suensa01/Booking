import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function AppDownloadBanner() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[40px] bg-[#FAF5ED] border border-amber-200/50 p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-5 z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-200/60 px-3.5 py-1 rounded-full w-fit">
                Instant Mobile Ordering
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
                Never Feel Hungry! <br />
                Download Our Mobile App <br />
                Enjoy Delicious Food
              </h2>
              <p className="text-sm sm:text-base text-stone-600 max-w-lg leading-relaxed">
                Make online reservations, track delivery live in real-time, get exclusive members-only chef specials, and enjoy contactless checkout directly from your mobile device.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/#menu"
                  className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-stone-950 font-bold text-sm shadow-md transition-all text-center"
                >
                  Order on Web App Now
                </Link>

                <div className="flex items-center gap-3 text-xs font-semibold text-stone-700">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant Push Alerts</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Real-Time Kitchen Tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Mobile Phone Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 sm:w-72 bg-white rounded-[36px] p-5 shadow-2xl border-4 border-stone-800 flex flex-col gap-4">
                <div className="w-20 h-4 bg-stone-800 rounded-full mx-auto" />
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
                  <span className="text-3xl">🍕</span>
                  <div className="font-black text-stone-900 text-sm mt-1">Bites App</div>
                  <div className="text-[10px] text-stone-500">We Serve The Taste You Love</div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-stone-100 rounded-full w-3/4" />
                  <div className="h-3 bg-stone-100 rounded-full w-full" />
                  <div className="h-8 bg-amber-400 rounded-xl flex items-center justify-center text-xs font-bold text-stone-950">
                    Order Hot & Fresh
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
