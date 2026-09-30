import { NextResponse } from "next/server";
import { getOrders, processGuestOrder } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    const orders = await getOrders(status);

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await processGuestOrder(body);

    if (!result.success || !result.order) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to process order." },
        { status: 400 }
      );
    }

    // Send confirmation email to customer email ID
    try {
      await sendOrderConfirmationEmail(result.order);
    } catch (emailErr) {
      console.warn("Order confirmation email notice:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Order #${result.order.id} placed successfully! Confirmation sent to ${result.order.email}.`,
        data: result.order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order. Please try again." },
      { status: 500 }
    );
  }
}
