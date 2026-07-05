import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPickupsByStaffId } from "@/lib/actions/pickups";
import { HistoryClient } from "./history-client";

export const revalidate = 0;

export default async function StaffHistoryPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const staffId = session.user.id as string;
  const staffName = session.user.name || "Staff Armada";
  const pickups = await getPickupsByStaffId(staffId);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Riwayat Penjemputan</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Tinjau seluruh riwayat tugas penjemputan dan penimbangan sampah yang telah Anda selesaikan.
        </p>
      </div>

      <HistoryClient initialPickups={pickups} staffId={staffId} staffName={staffName} />
    </div>
  );
}
