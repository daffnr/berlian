import React from "react";
import { getLocations } from "@/lib/actions/waste";
import { MapView } from "@/components/ui/map-view";

export const revalidate = 0;

export default async function UserLocationsPage() {
  const locations = await getLocations();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Peta Lokasi Bank Sampah</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400 mb-6">
          Lihat alamat cabang operasional dan navigasikan koordinat jemput terdekat dari rumah Anda.
        </p>

        <MapView locations={locations} />
      </div>
    </div>
  );
}
