"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TableReservationModal } from "@/components/TableReservationModal";

export default function ReservePage() {
  const router = useRouter();

  return (
    <div className="py-12 sm:py-20 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <TableReservationModal isOpen={true} onClose={() => router.push("/")} />
      </div>
    </div>
  );
}
