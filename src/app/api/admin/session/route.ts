import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { authorized, email } = await isAuthorizedAdmin();
    return NextResponse.json({
      authenticated: authorized,
      email: authorized ? email : undefined,
    });
  } catch (error) {
    console.error("GET /api/admin/session error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
