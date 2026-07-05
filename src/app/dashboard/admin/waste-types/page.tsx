import React from "react";
import { auth } from "@/auth";
import { getWasteTypes } from "@/lib/actions/waste";
import { WasteTypesClient } from "./waste-types-client";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AdminWasteTypesPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const wasteTypes = await getWasteTypes();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Daftar Jenis & Harga Sampah</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Ubah tarif pembelian per kg atau tambahkan jenis sampah plastik baru ke sistem.
        </p>
      </div>

      <WasteTypesClient initialWasteTypes={wasteTypes} />
    </div>
  );
}
