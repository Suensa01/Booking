import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, message: "Please provide a promo code." }, { status: 400 });
    }

    const result = validateCoupon(code, Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ valid: false, message: "Failed to validate coupon" }, { status: 500 });
  }
}
