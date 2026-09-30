import { NextResponse } from "next/server";
import { getReviews, createReview } from "@/lib/db";

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json({ success: true, data: reviews });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, rating, comment } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: "Please enter your name." }, { status: 400 });
    }

    if (!comment || comment.trim().length < 5) {
      return NextResponse.json({ success: false, error: "Please share a brief review comment (min 5 chars)." }, { status: 400 });
    }

    const newRev = await createReview({
      name: name.trim(),
      role: role?.trim() || "Verified Guest",
      rating: Number(rating) || 5,
      comment: comment.trim(),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for sharing your review!",
      data: newRev,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to submit review" }, { status: 500 });
  }
}
