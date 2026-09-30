import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";
import { OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

const VALID_STATUSES: OrderStatus[] = ["Pending", "Accepted", "Preparing", "Completed", "Cancelled"];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order with ID "${id}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await isAuthorizedAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required to update order status." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status "${status}". Allowed values: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, status as OrderStatus);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Order with ID "${id}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order status successfully updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
