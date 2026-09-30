import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = authenticateAdmin(body);

    if (!result.authenticated || !result.token) {
      return NextResponse.json(
        { success: false, error: result.error || "Authentication failed." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin authenticated successfully.",
      admin: result.admin,
    });

    // Set secure cookie
    response.cookies.set("savoria_admin_session", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
