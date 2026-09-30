"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Phone,
  User,
  Mail,
  MapPin,
  Loader2,
  Tag,
  CreditCard,
  QrCode,
  Banknote,
  Heart,
  Store,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Order, OrderType, PaymentMethod } from "@/types";

interface FormErrors {
  customerName?: string;
  mobile?: string;
  email?: string;
  address?: string;
}

// Audio sound effect using Web Audio API (zero external assets needed)
function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.log("Audio not supported or blocked", e);
  }
}

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart, isHydrated } = useCart();
  const { showToast } = useToast();

  const [orderType, setOrderType] = useState<OrderType>("Delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [tip, setTip] = useState<number>(0);

  // Promo code state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    email: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Dynamic calculations
  const pickupDiscount = orderType === "Pickup" ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
  const promoDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalDiscount = promoDiscount + pickupDiscount;
  const discountedSubtotal = Math.max(0, subtotal - totalDiscount);
  const calculatedTax = Math.round(discountedSubtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((discountedSubtotal + calculatedTax + tip) * 100) / 100;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = "Full Name must be at least 2 characters.";
    }

    const digits = formData.mobile.replace(/\D/g, "");
    if (!formData.mobile.trim() || digits.length < 10) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (orderType === "Delivery") {
      if (!formData.address.trim() || formData.address.trim().length < 5) {
        newErrors.address = "Please provide your street, building, and apartment details.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError(null);
  };

  const handleApplyCoupon = async (codeToTry?: string) => {
    const code = codeToTry || couponInput;
    if (!code.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });
      const data = await res.json().catch(() => null);
      if (data && data.valid) {
        setAppliedCoupon({ code: code.trim().toUpperCase(), discount: data.discount });
        showToast(data.message, "success");
      } else {
        setAppliedCoupon(null);
        showToast(data?.message || "Invalid coupon code.", "error");
      }
    } catch {
      showToast("Could not validate coupon.", "error");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please correct the highlighted form errors.", "error");
      return;
    }

    if (items.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        customerName: formData.customerName,
        mobile: formData.mobile,
        email: formData.email,
        address: orderType === "Pickup" ? "Restaurant Counter Pickup" : formData.address,
        notes: formData.notes,
        orderType,
        paymentMethod,
        couponCode: appliedCoupon?.code,
        tip,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to submit order.");
      }

      const newOrder = data.data as Order;
      setPlacedOrder(newOrder);
      clearCart();
      playSuccessChime();
      showToast(`Order #${newOrder.id} placed successfully!`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setServerError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  // ORDER SUCCESS STATE
  if (placedOrder) {
    return (
      <div className="py-12 sm:py-20 bg-[#FDFBF7] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-[36px] p-6 sm:p-10 shadow-xl border border-stone-200/80 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
              Order Confirmed & Saved to Database
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Thank You for Your Order, {placedOrder.customerName}!
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md">
              A receipt has been dispatched to <strong>{placedOrder.email}</strong>. Our kitchen is firing up your order right now.
            </p>

            {/* Reference Box */}
            <div className="w-full bg-[#FAF5ED] border border-amber-200/60 rounded-3xl p-5 my-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                  Order ID
                </span>
                <div className="font-mono text-2xl font-black text-amber-600">
                  {placedOrder.id}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                  {placedOrder.orderType === "Pickup" ? "Ready for Pickup" : "Delivery ETA"}
                </span>
                <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  25 – 35 Minutes
                </div>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                  Payment Status
                </span>
                <div className="text-sm font-extrabold text-stone-900">
                  {placedOrder.paymentMethod} ({placedOrder.paymentStatus})
                </div>
              </div>
            </div>

            {/* Dishes Summary */}
            <div className="w-full text-left border-t border-b border-stone-100 py-4 my-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Items Ordered
              </h3>
              <div className="flex flex-col gap-2.5">
                {placedOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-sm">
                    <span className="text-stone-800 font-medium">
                      {it.quantity}x {it.name}
                    </span>
                    <span className="text-stone-900 font-bold">
                      ₹{(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="w-full text-left text-xs sm:text-sm text-stone-600 bg-stone-50 p-4 rounded-2xl border border-stone-100 my-4 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block font-semibold mb-0.5">
                  {placedOrder.orderType === "Pickup" ? "Pickup Location" : "Delivering to"}:
                </strong>
                {placedOrder.address} • Contact: {placedOrder.mobile}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4">
              <Link
                href={`/track-order?id=${placedOrder.id}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm shadow-md transition-all text-center"
              >
                Track Live Order Status
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-all text-center"
              >
                Return to Bites Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART STATE
  if (items.length === 0) {
    return (
      <div className="py-20 sm:py-28 bg-[#FDFBF7] min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-stone-900">Your Cart is Empty</h1>
          <p className="text-sm text-stone-500 mt-2">
            Please add at least one handcrafted dish from our menu before checking out.
          </p>
          <Link
            href="/#menu"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm rounded-full shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Bites Menu
          </Link>
        </div>
      </div>
    );
  }

  // ACTIVE CHECKOUT FORM
  return (
    <div className="py-8 sm:py-14 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/#menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form & Options (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[36px] p-6 sm:p-8 shadow-sm border border-stone-200/80">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Checkout & Payment
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Choose your fulfillment method, enter delivery details, and place your order.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Contactless Delivery
              </div>
            </div>

            {/* Error Banner */}
            {serverError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Submission Error</strong>
                  {serverError}
                </div>
              </div>
            )}

            {/* Fulfillment Type Toggle (Delivery vs Pickup) */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Order Fulfillment
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType("Delivery")}
                  className={`p-4 rounded-2xl border flex items-center justify-center gap-2.5 font-bold text-xs sm:text-sm transition-all ${
                    orderType === "Delivery"
                      ? "bg-amber-400 text-stone-950 border-amber-500 shadow-xs"
                      : "bg-[#FDFBF7] text-stone-700 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Home Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("Pickup")}
                  className={`p-4 rounded-2xl border flex items-center justify-center gap-2.5 font-bold text-xs sm:text-sm transition-all ${
                    orderType === "Pickup"
                      ? "bg-amber-400 text-stone-950 border-amber-500 shadow-xs"
                      : "bg-[#FDFBF7] text-stone-700 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Takeaway / Pickup (5% Off!)</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="flex flex-col gap-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
                >
                  Customer Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Shah"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-stone-900 transition-all focus:outline-hidden ${
                      errors.customerName
                        ? "border-rose-400 bg-rose-50/30"
                        : "border-stone-200 focus:border-amber-400"
                    }`}
                  />
                </div>
                {errors.customerName && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.customerName}</p>
                )}
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
                  >
                    Mobile Phone <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-stone-900 transition-all focus:outline-hidden ${
                        errors.mobile
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-stone-200 focus:border-amber-400"
                      }`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.mobile}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul.shah@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-stone-900 transition-all focus:outline-hidden ${
                        errors.email
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-stone-200 focus:border-amber-400"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Delivery Address (only needed if delivery) */}
              {orderType === "Delivery" && (
                <div>
                  <label
                    htmlFor="address"
                    className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
                  >
                    Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Apartment/Suite, Building Name, Street, Landmark"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-stone-900 transition-all focus:outline-hidden ${
                        errors.address
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-stone-200 focus:border-amber-400"
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.address}</p>
                  )}
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                      paymentMethod === "COD"
                        ? "bg-amber-100/70 border-amber-400 text-stone-950"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                      paymentMethod === "UPI"
                        ? "bg-amber-100/70 border-amber-400 text-stone-950"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-amber-600" />
                    <span>UPI / Scan QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Card")}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                      paymentMethod === "Card"
                        ? "bg-amber-100/70 border-amber-400 text-stone-950"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span>Credit / Debit Card</span>
                  </button>
                </div>

                {/* UPI QR Display Simulator */}
                {paymentMethod === "UPI" && (
                  <div className="mt-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center flex flex-col items-center">
                    <span className="text-xs font-bold text-stone-800 mb-1">
                      Scan with any UPI App (GPay / PhonePe / Paytm)
                    </span>
                    <div className="w-28 h-28 bg-white p-2 rounded-xl border border-stone-200 shadow-xs flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-stone-800" />
                    </div>
                    <span className="text-[11px] text-stone-500 mt-2">
                      UPI ID: <strong className="font-mono text-stone-800">bites@upi</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Rider Tip Selector */}
              {orderType === "Delivery" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Add Delivery Rider Tip (Optional)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[0, 20, 50, 100].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTip(t)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                          tip === t
                            ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                            : "bg-[#FDFBF7] text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {t === 0 ? "No Tip" : `₹${t}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
                >
                  Kitchen Notes / Special Requests (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Ring bell twice, extra garlic dip, hot sauce please..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full py-4 px-6 rounded-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 disabled:bg-amber-200 text-stone-950 font-black text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98 focus:outline-hidden"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Order to Kitchen...</span>
                  </>
                ) : (
                  <span>Place Order (₹{grandTotal.toFixed(2)})</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary & Coupon (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-[36px] p-6 sm:p-8 shadow-sm border border-stone-200/80 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h2 className="font-black text-stone-900 text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  Order Summary
                </h2>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                  {itemCount} {itemCount === 1 ? "Dish" : "Dishes"}
                </span>
              </div>

              {/* Promo Code Input Box */}
              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-stone-200/80">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Have a Promo Code?</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. BITES10"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-mono font-bold uppercase text-stone-900 focus:outline-hidden focus:border-amber-400"
                  />
                  <button
                    type="button"
                    disabled={validatingCoupon || !couponInput.trim()}
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs disabled:opacity-50 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center justify-between">
                    <span>Coupon &apos;{appliedCoupon.code}&apos; Applied!</span>
                    <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}

                {/* Quick suggestions */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-200/60 text-[11px] text-stone-500">
                  <span>Try:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponInput("BITES10");
                      handleApplyCoupon("BITES10");
                    }}
                    className="text-amber-700 font-mono font-bold hover:underline"
                  >
                    BITES10
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponInput("WELCOME50");
                      handleApplyCoupon("WELCOME50");
                    }}
                    className="text-amber-700 font-mono font-bold hover:underline"
                  >
                    WELCOME50
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3.5 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-stone-400">
                        {item.quantity} × ₹{item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-stone-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="pt-4 border-t border-stone-100 flex flex-col gap-2 text-xs sm:text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">₹{subtotal.toFixed(2)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Total Discounts (Promo & Pickup)</span>
                    <span>-₹{totalDiscount.toFixed(2)}</span>
                  </div>
                )}

                {tip > 0 && (
                  <div className="flex justify-between text-stone-700">
                    <span>Delivery Rider Tip</span>
                    <span>₹{tip.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    GST & Tax (5%)
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </span>
                  <span>₹{calculatedTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xs text-stone-500">
                  <span>{orderType === "Delivery" ? "Standard Delivery" : "Counter Pickup"}</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-black text-stone-900">
                  <span>Grand Total</span>
                  <span className="text-amber-600 text-xl">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
