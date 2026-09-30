import { NextResponse } from "next/server";
import { restaurantInfo } from "@/data/restaurantData";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: restaurantInfo,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch restaurant info" },
      { status: 500 }
    );
  }
}
