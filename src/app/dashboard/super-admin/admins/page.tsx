import React from "react";
import { auth } from "@/auth";
import { getUsers } from "@/lib/actions/users";
import { AdminsClient } from "./admins-client";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function SuperAdminAdminsPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const users = await getUsers();
  const internalAccounts = users.filter((u: any) => ["ADMIN", "STAFF"].includes(u.role));

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Manajemen Admin & Staff Lapangan</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Daftarkan akun Admin Cabang baru, Staff Penjemput Budi, atau ubah status keanggotaan internal.
        </p>
      </div>

      <AdminsClient internalAccounts={internalAccounts} />
    </div>
  );
}
