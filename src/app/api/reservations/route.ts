import { NextResponse } from "next/server";
import { getReservations, processGuestReservation } from "@/lib/db";
import { sendReservationConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reservations = await getReservations();
    return NextResponse.json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error("GET /api/reservations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await processGuestReservation(body);

    if (!result.success || !result.reservation) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to reserve table." },
        { status: 400 }
      );
    }

    // Send confirmation email to customer email ID
    try {
      await sendReservationConfirmationEmail(result.reservation);
    } catch (emailErr) {
      console.warn("Reservation confirmation email notice:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Table reserved successfully! Confirmation sent to ${result.reservation.email}. Booking reference: #${result.reservation.id}`,
        data: result.reservation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reservations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reserve table. Please try again." },
      { status: 500 }
    );
  }
}
