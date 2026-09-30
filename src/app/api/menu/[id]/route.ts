import { NextResponse } from "next/server";
import { updateMenuItem, toggleMenuItemAvailability, deleteMenuItem } from "@/lib/db";
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
        { success: false, error: "Unauthorized. Admin session required to modify menu items." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const numId = Number(id);
    const body = await request.json();

    if (body.toggleAvailability) {
      const updated = await toggleMenuItemAvailability(numId);
      if (!updated) {
        return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Dish "${updated.name}" is now marked as ${updated.available ? "Available" : "Sold Out"}`,
        data: updated,
      });
    }

    const updated = await updateMenuItem(numId, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Dish "${updated.name}" updated successfully`,
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await isAuthorizedAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required to delete menu items." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const numId = Number(id);
    const deleted = await deleteMenuItem(numId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Item not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dish deleted from menu catalog successfully.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete menu item." },
      { status: 500 }
    );
  }
}

