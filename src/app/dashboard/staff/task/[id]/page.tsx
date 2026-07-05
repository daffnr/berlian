import React from "react";
import { auth } from "@/auth";
import { getPickupById } from "@/lib/actions/pickups";
import { getWasteTypes } from "@/lib/actions/waste";
import { WeighForm } from "./weigh-form";
import { MapPin, Scale, Phone, User, Info } from "lucide-react";
import { redirect } from "next/navigation";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StaffTaskPage({ params }: PageProps) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const { id } = await params;
  const pickup = await getPickupById(id);
  const wasteTypes = await getWasteTypes();

  if (!pickup) {
    redirect("/dashboard/staff");
  }

  const staffId = session.user.id as string;
  const matchedWaste = wasteTypes.find((w: any) => w.id === pickup.wasteTypeId);
  const currentPrice = matchedWaste?.pricePerKg ?? 2000;

  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Input Hasil Timbangan Sampah</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Ukur berat riil dan simpan transaksi penimbangan untuk mengkreditkan saldo tabungan nasabah.
        </p>
      </div>

      {/* Rincian Request */}
      <div className="bg-slate-50 dark:bg-zinc-950/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 mb-6 flex flex-col gap-3 text-xs sm:text-sm">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-zinc-800 pb-2">
          <Info className="h-4.5 w-4.5 text-blue-600" />
          Rincian Penjemputan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Nasabah</span>
            <div className="flex items-center gap-1.5 font-semibold">
              <User className="h-4 w-4 text-gray-400" />
              <span>{pickup.user?.name || (pickup as any).userName}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Telepon Nasabah</span>
            <div className="flex items-center gap-1.5 font-semibold">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{pickup.user?.phone || "Tidak ada nomor"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Alamat Lengkap</span>
            <div className="flex items-start gap-1.5 font-semibold">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <span>{pickup.address}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Jenis Sampah</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {pickup.wasteType?.name || (pickup as any).wasteTypeName}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Estimasi Berat</span>
            <div className="flex items-center gap-1.5 font-bold">
              <Scale className="h-4.5 w-4.5 text-gray-400" />
              <span>{pickup.estimatedWeight} kg</span>
            </div>
          </div>
        </div>
      </div>

      <WeighForm
        pickupId={pickup.id}
        staffId={staffId}
        wasteTypeName={pickup.wasteType?.name || (pickup as any).wasteTypeName}
        pricePerKg={currentPrice}
      />
    </div>
  );
}
