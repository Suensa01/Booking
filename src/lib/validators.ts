import { OrderItem } from "@/types";

export interface GuestOrderInput {
  customerName: string;
  mobile: string;
  email: string;
  address?: string;
  items: OrderItem[];
  notes?: string;
  orderType?: "Delivery" | "Pickup";
  paymentMethod?: "COD" | "UPI" | "Card";
  paymentStatus?: "Pending" | "Paid";
  paymentId?: string;
  couponCode?: string;
  tip?: number;
}

export interface GuestReservationInput {
  customerName: string;
  mobile: string;
  email: string;
  guests: number;
  date: string;
  timeSlot: string;
  seatingArea?: string;
  specialRequests?: string;
}

export function validateGuestOrderInput(body: Partial<GuestOrderInput>): {
  valid: boolean;
  error?: string;
  data?: GuestOrderInput;
} {
  const {
    customerName,
    mobile,
    email,
    address,
    items,
    notes,
    orderType,
    paymentMethod,
    couponCode,
    tip,
  } = body;

  if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
    return { valid: false, error: "Please enter a valid full name (at least 2 characters)." };
  }

  const cleanedMobile = String(mobile || "").replace(/\D/g, "");
  if (cleanedMobile.length < 10) {
    return { valid: false, error: "Please enter a valid 10-digit contact mobile number." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return { valid: false, error: "Please enter a valid email address for order notifications." };
  }

  const finalOrderType = orderType === "Pickup" ? "Pickup" : "Delivery";

  if (finalOrderType === "Delivery" && (!address || typeof address !== "string" || address.trim().length < 5)) {
    return { valid: false, error: "Please enter a complete delivery address for dispatch." };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: "Your cart is empty. Please add items to order." };
  }

  return {
    valid: true,
    data: {
      customerName: customerName.trim(),
      mobile: cleanedMobile,
      email: email.trim().toLowerCase(),
      address: finalOrderType === "Pickup" ? "Self-Pickup at Restaurant Counter" : (address || "").trim(),
      items,
      notes: notes?.trim() || "",
      orderType: finalOrderType,
      paymentMethod: paymentMethod === "UPI" || paymentMethod === "Card" ? paymentMethod : "COD",
      paymentStatus: body.paymentStatus === "Paid" ? "Paid" : "Pending",
      paymentId: body.paymentId,
      couponCode: couponCode?.trim() || undefined,
      tip: Number(tip) > 0 ? Number(tip) : 0,
    },
  };
}

export function validateGuestReservationInput(body: Partial<GuestReservationInput>): {
  valid: boolean;
  error?: string;
  data?: GuestReservationInput;
} {
  const {
    customerName,
    mobile,
    email,
    guests,
    date,
    timeSlot,
    seatingArea,
    specialRequests,
  } = body;

  if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
    return { valid: false, error: "Please enter a valid name (at least 2 characters)." };
  }

  const cleanedMobile = String(mobile || "").replace(/\D/g, "");
  if (cleanedMobile.length < 10) {
    return { valid: false, error: "Please enter a valid 10-digit mobile number." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return { valid: false, error: "Please enter a valid email address for booking confirmation." };
  }

  const numGuests = Number(guests);
  if (!numGuests || numGuests < 1 || numGuests > 20) {
    return { valid: false, error: "Guests must be between 1 and 20." };
  }

  if (!date || typeof date !== "string") {
    return { valid: false, error: "Please select a booking date." };
  }

  if (!timeSlot || typeof timeSlot !== "string") {
    return { valid: false, error: "Please select a dining time slot." };
  }

  return {
    valid: true,
    data: {
      customerName: customerName.trim(),
      mobile: cleanedMobile,
      email: email.trim().toLowerCase(),
      guests: numGuests,
      date,
      timeSlot,
      seatingArea: seatingArea || "Indoor Dining",
      specialRequests: specialRequests?.trim() || "",
    },
  };
}
