import { NextResponse } from "next/server";
import { getMenuItems } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getMenuItems();
    const categoriesSet = new Set(items.map((item) => item.category));
    const categories = ["All", ...Array.from(categoriesSet)];

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
