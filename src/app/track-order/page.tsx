"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Clock,
  CheckCircle2,
  ChefHat,
  Phone,
  ArrowLeft,
  AlertCircle,
  Loader2,
  PackageCheck,
  Calendar,
  MapPin,
  Utensils,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { restaurantInfo } from "@/data/restaurantData";

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ElementType; desc: string }[] = [
  {
    status: "Pending",
    label: "Order Placed",
    icon: Clock,
    desc: "Received by restaurant and waiting for kitchen confirmation",
  },
  {
    status: "Accepted",
    label: "Confirmed",
    icon: CheckCircle2,
    desc: "Order accepted by head chef and scheduled for preparation",
  },
  {
    status: "Preparing",
    label: "In the Kitchen",
    icon: ChefHat,
    desc: "Fresh ingredients being cooked and boxed for delivery",
  },
  {
    status: "Completed",
    label: "Ready / Delivered",
    icon: PackageCheck,
    desc: "Order dispatched and successfully delivered to customer",
  },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [orderId, setOrderId] = useState(initialId);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (idToFetch: string) => {
    if (!idToFetch.trim()) {
      setError("Please enter a valid Order ID (e.g. ORD-1001)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(idToFetch.trim().toUpperCase())}`);
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || `No order found matching "${idToFetch}".`);
      }

      setCurrentOrder(data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to retrieve order status.";
      setError(message);
      setCurrentOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialId) return;
    let ignore = false;

    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(initialId.trim())}`);
        const data = await res.json().catch(() => null);
        if (!ignore) {
          if (!res.ok || !data?.success) {
            setError(data?.error || `Order "${initialId}" not found.`);
            setCurrentOrder(null);
          } else {
            setCurrentOrder(data.data);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to retrieve order status.");
          setCurrentOrder(null);
          setLoading(false);
        }
      }
    }

    loadOrder();
    return () => {
      ignore = true;
    };
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  const getStepState = (stepStatus: OrderStatus, currentStatus: OrderStatus) => {
    const orderStages: OrderStatus[] = ["Pending", "Accepted", "Preparing", "Completed"];
    const currentIndex = orderStages.indexOf(currentStatus);
    const stepIndex = orderStages.indexOf(stepStatus);

    if (currentStatus === "Cancelled") {
      return "cancelled";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="py-8 sm:py-14 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Restaurant Menu
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Real-Time Updates
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Live Order Tracking
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Enter your order reference ID to check preparation progress and estimated arrival.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 mb-8 max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. ORD-1001)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium uppercase tracking-wider placeholder:normal-case placeholder:font-normal focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 disabled:bg-orange-400"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Try sample orders:</span>
            {["ORD-1001", "ORD-1002", "ORD-1003"].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setOrderId(sample);
                  fetchOrder(sample);
                }}
                className="text-orange-600 hover:underline font-mono font-semibold"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block">Order Lookup Failed</strong>
              {error}
            </div>
          </div>
        )}

        {/* Order Details & Progress Stepper */}
        {currentOrder && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col gap-8 animate-in fade-in duration-300">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-bold text-slate-900">
                    {currentOrder.id}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      currentOrder.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : currentOrder.status === "Preparing"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : currentOrder.status === "Accepted"
                        ? "bg-sky-100 text-sky-800 border border-sky-200"
                        : currentOrder.status === "Cancelled"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-orange-100 text-orange-800 border border-orange-200"
                    }`}
                  >
                    {currentOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Placed on {new Date(currentOrder.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Clickable Support Call */}
              <a
                href={`tel:${restaurantInfo.phone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold border border-orange-200 transition-colors w-fit"
                title="Call restaurant regarding your order"
              >
                <Phone className="w-3.5 h-3.5" />
                Need Assistance? Call Kitchen
              </a>
            </div>

            {/* Stepper Pipeline */}
            <div className="py-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Kitchen Pipeline Progress
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const state = getStepState(step.status, currentOrder.status);
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className={`flex flex-col items-start sm:items-center text-left sm:text-center p-4 rounded-2xl transition-all ${
                        state === "current"
                          ? "bg-orange-50/80 border-2 border-orange-500 shadow-sm"
                          : state === "completed"
                          ? "bg-emerald-50/50 border border-emerald-200"
                          : "bg-slate-50 border border-slate-100 opacity-60"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                          state === "current"
                            ? "bg-orange-600 text-white shadow-md shadow-orange-500/30"
                            : state === "completed"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Step {idx + 1}
                      </span>
                      <strong className="text-sm font-bold text-slate-900 mt-0.5">
                        {step.label}
                      </strong>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items & Customer Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* Ordered Items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  Order Summary
                </h4>
                <div className="divide-y divide-slate-100 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                  {currentOrder.items.map((it) => (
                    <div key={it.id} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-800">
                        {it.quantity}x {it.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        ₹{(it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 mt-2 flex justify-between text-xs text-slate-500">
                    <span>Tax (5% GST)</span>
                    <span>₹{currentOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 flex justify-between font-extrabold text-slate-900 text-base">
                    <span>Total Paid</span>
                    <span className="text-orange-600">₹{currentOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery & Contact Information
                </h4>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2.5 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Recipient</span>
                    <strong className="text-slate-900">{currentOrder.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Phone Contact</span>
                    <a
                      href={`tel:${currentOrder.mobile}`}
                      className="text-orange-600 hover:underline font-semibold"
                    >
                      {currentOrder.mobile}
                    </a>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Delivery Address</span>
                    <p className="text-slate-700 leading-snug">{currentOrder.address}</p>
                  </div>
                  {currentOrder.notes && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-xs text-slate-400 block font-semibold">Instructions</span>
                      <p className="text-xs text-slate-600 italic">“{currentOrder.notes}”</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
