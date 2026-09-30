"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Users, MapPin, CheckCircle2, AlertCircle, Loader2, Sparkles, Phone } from "lucide-react";
import { Reservation } from "@/types";
import { useToast } from "@/context/ToastContext";

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
];

const SEATING_AREAS: Reservation["seatingArea"][] = [
  "Indoor Dining",
  "Outdoor Terrace",
  "Chef's Counter",
  "Private Lounge",
];

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function TableReservationModal({ isOpen, onClose }: TableReservationModalProps) {
  const { showToast } = useToast();
  const [minDate] = useState(getTodayDateString);

  const [formData, setFormData] = useState(() => ({
    customerName: "",
    mobile: "",
    email: "",
    guests: 2,
    date: getTomorrowDateString(),
    timeSlot: "07:30 PM",
    seatingArea: "Indoor Dining" as Reservation["seatingArea"],
    specialRequests: "",
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    const digits = formData.mobile.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to reserve table.");
      }

      setConfirmedBooking(data.data);
      showToast(`Table booked successfully! Reference #${data.data.id}`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity" onClick={handleReset} />

      <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-[36px] shadow-2xl border border-stone-200 p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-5 top-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Booking Confirmation State */
          <div className="text-center flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
              Table Reserved
            </span>

            <h3 className="font-extrabold text-2xl text-stone-900">
              We Look Forward to Hosting You, {confirmedBooking.customerName}!
            </h3>

            <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-sm">
              A booking confirmation has been sent to <strong>{confirmedBooking.email}</strong>. Please arrive 5 minutes prior to your time slot.
            </p>

            <div className="w-full bg-white rounded-2xl p-5 border border-stone-200/80 my-6 text-left flex flex-col gap-2.5 text-xs sm:text-sm text-stone-700">
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-400">Booking Reference</span>
                <strong className="font-mono text-amber-600 font-bold">{confirmedBooking.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Date & Time</span>
                <strong className="text-stone-900">{confirmedBooking.date} at {confirmedBooking.timeSlot}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Party Size</span>
                <strong className="text-stone-900">{confirmedBooking.guests} Guests ({confirmedBooking.seatingArea})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Guest Phone</span>
                <strong className="text-stone-900">{confirmedBooking.mobile}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-sm transition-all"
              >
                Done
              </button>
              <a
                href="tel:+15557286742"
                className="w-full py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Host Desk
              </a>
            </div>
          </div>
        ) : (
          /* Reservation Form */
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Dining Reservation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Reserve Your Table
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Zero booking fees. Enjoy priority seating and handcrafted dining.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Row 1: Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={minDate}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-amber-400 appearance-none"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Guests & Seating Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-amber-400 appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest (Solo Diner)" : `${n} Guests`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Seating Area
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.seatingArea}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seatingArea: e.target.value as Reservation["seatingArea"],
                        })
                      }
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-amber-400 appearance-none"
                    >
                      {SEATING_AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Guest Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Shah"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-amber-400"
                  required
                />
              </div>

              {/* Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Special Requests / Occasion (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Birthday celebration, anniversary, high chair needed..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 disabled:bg-amber-200 text-stone-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Table...</span>
                  </>
                ) : (
                  <span>Confirm Reservation</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
