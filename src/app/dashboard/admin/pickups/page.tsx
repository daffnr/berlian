import React from "react";
import { auth } from "@/auth";
import { getPickups } from "@/lib/actions/pickups";
import { getUsers } from "@/lib/actions/users";
import { PickupsClient } from "./pickups-client";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AdminPickupsPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const pickups = await getPickups();
  const users = await getUsers();
  const staffMembers = users.filter((u: any) => u.role === "STAFF");

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Kelola Request Penjemputan</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Tinjau request penjemputan baru, verifikasi kelayakan berat minimum, dan tugaskan Staff Lapangan.
        </p>
      </div>

      <PickupsClient pickups={pickups} staffMembers={staffMembers} adminId={session.user.id as string} />
    </div>
  );
}
