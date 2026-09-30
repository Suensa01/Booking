import { NextResponse } from "next/server";
import { fetchMenu, addNewMenuItem } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const items = await fetchMenu(category, search);

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("GET /api/menu error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await isAuthorizedAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required to add menu dishes." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = await addNewMenuItem(body);

    if (!result.success || !result.item) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to add menu item." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: `Dish "${result.item.name}" added to menu catalog!`, data: result.item },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/menu error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add menu item." },
      { status: 500 }
    );
  }
}
