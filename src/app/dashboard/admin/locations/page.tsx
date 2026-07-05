import React from "react";
import { auth } from "@/auth";
import { getLocations } from "@/lib/actions/waste";
import { LocationsClient } from "./locations-client";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AdminLocationsPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const locations = await getLocations();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Manajemen Kantor Cabang</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Kelola cabang operasional, alamat kantor, nomor telepon layanan, serta koordinat peta GPS.
        </p>
      </div>

      <LocationsClient initialLocations={locations} />
    </div>
  );
}
