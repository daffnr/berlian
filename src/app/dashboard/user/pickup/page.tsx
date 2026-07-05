import React from "react";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/users";
import { getWasteTypes } from "@/lib/actions/waste";
import { getPickupsByUserId } from "@/lib/actions/pickups";
import { PickupForm } from "./pickup-form";
import { CalendarDays, Clock, MapPin, Truck, CheckCircle2, XCircle } from "lucide-react";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function UserPickupPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id as string;
  const user = await getUserById(userId);
  const wasteTypes = await getWasteTypes();
  const pickups = await getPickupsByUserId(userId);

  if (!user) redirect("/login");

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900";
      case "VERIFIED":
        return "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900";
      case "ASSIGNED":
        return "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900";
      case "PICKED_UP":
        return "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900";
      case "CANCELLED":
      default:
        return "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "Menunggu Verifikasi";
      case "VERIFIED": return "Terverifikasi";
      case "ASSIGNED": return "Staff Ditugaskan";
      case "PICKED_UP": return "Sedang Dijemput";
      case "COMPLETED": return "Selesai ditimbang";
      case "CANCELLED": return "Dibatalkan";
      default: return status;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Form Request */}
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Request Penjemputan Baru</h2>
          <p className="text-xs text-slate-550 dark:text-zinc-400 mb-6">
            Lengkapi data di bawah ini untuk memesan penjemputan sampah terpilah.
          </p>

          <PickupForm 
            userId={userId} 
            wasteTypes={wasteTypes} 
            defaultAddress={user.address || ""} 
            defaultPhone={user.phone || ""} 
          />
        </div>
      </div>

      {/* Kolom Kanan: Daftar Penjemputan Aktif */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="font-bold text-base text-slate-800 dark:text-white mb-4">Status & Riwayat Penjemputan</h2>
          
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-1">
            {pickups.map((p: any) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 flex flex-col sm:flex-row justify-between gap-4 text-xs"
              >
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">
                      {p.wasteType?.name || (p as any).wasteTypeName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getStatusStyle(p.status)}`}>
                      {getStatusLabel(p.status)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-slate-550 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>
                        Dibuat: {new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{p.address}</span>
                    </div>

                    {p.staff && (
                      <div className="flex items-center gap-1.5 mt-1 bg-blue-50/80 text-blue-900 border border-blue-100 rounded-lg px-2 py-1 w-fit dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/50">
                        <Truck className="h-3.5 w-3.5" />
                        <span>Petugas: {p.staff.name || (p as any).staffName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between sm:items-end shrink-0">
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 dark:text-zinc-400">Estimasi</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{p.estimatedWeight} kg</span>
                  </div>

                  {p.status === "COMPLETED" && (
                    <div className="flex items-center gap-1 text-emerald-600 font-bold mt-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Selesai</span>
                    </div>
                  )}

                  {p.status === "PENDING" && (
                    <span className="text-[10px] font-semibold text-yellow-600 mt-2">
                      Menunggu verifikasi admin
                    </span>
                  )}
                </div>
              </div>
            ))}

            {pickups.length === 0 && (
              <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl dark:border-zinc-800">
                <CalendarDays className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">Belum ada riwayat request penjemputan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
