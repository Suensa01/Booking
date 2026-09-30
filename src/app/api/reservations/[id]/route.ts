import { NextResponse } from "next/server";
import { updateReservationStatus } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await isAuthorizedAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required to update reservation." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["Confirmed", "Seated", "Cancelled"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid reservation status" }, { status: 400 });
    }

    const updated = await updateReservationStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Reservation #${id} is now ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/reservations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}
