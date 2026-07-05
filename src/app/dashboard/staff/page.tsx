import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { getPickupsByStaffId } from "@/lib/actions/pickups";
import { MapPin, Scale, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function StaffDashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const staffId = session.user.id as string;
  const pickups = await getPickupsByStaffId(staffId);

  // Pisahkan tugas aktif dan riwayat tugas selesai
  const activeTasks = pickups.filter((p: any) => ["ASSIGNED", "PICKED_UP"].includes(p.status));
  const completedTasks = pickups.filter((p: any) => p.status === "COMPLETED");

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/10">
        <h2 className="text-xl sm:text-2xl font-bold">Portal Staff Lapangan</h2>
        <p className="text-xs sm:text-sm mt-2 opacity-90 leading-relaxed max-w-xl">
          Tinjau alamat jemput, datangi lokasi nasabah, timbang berat sampah terpilah, dan input berat aktual untuk memperbarui saldo tabungan nasabah.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Daftar Tugas Aktif */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">
              Tugas Penjemputan Aktif ({activeTasks.length})
            </h3>

            <div className="flex flex-col gap-4">
              {activeTasks.map((t: any) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 flex flex-col sm:flex-row justify-between gap-4 text-xs"
                >
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800 dark:text-white">
                        {t.user?.name || (t as any).userName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full border text-[9px] font-bold bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400">
                        Ditugaskan
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-slate-550 dark:text-zinc-400">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <span>{t.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                          Jadwal: {t.scheduledAt ? new Date(t.scheduledAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Belum dijadwalkan"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-zinc-300">
                        <Scale className="h-3.5 w-3.5 text-gray-400" />
                        <span>Sampah: {t.wasteType?.name || (t as any).wasteTypeName} (Estimasi {t.estimatedWeight} kg)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-end shrink-0">
                    <Link
                      href={`/dashboard/staff/task/${t.id}`}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10"
                    >
                      Mulai Timbang
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}

              {activeTasks.length === 0 && (
                <div className="text-center py-12 text-slate-400 border border-dashed border-slate-100 rounded-xl dark:border-zinc-800">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm">Bagus! Semua tugas penjemputan telah diselesaikan.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Riwayat Tugas Selesai */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">
              Riwayat Tugas Selesai ({completedTasks.length})
            </h3>

            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
              {completedTasks.map((t: any) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-slate-50 bg-slate-50/20 dark:border-zinc-850 dark:bg-zinc-900/10 text-xs flex justify-between items-center"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">{t.user?.name || (t as any).userName}</span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                      {t.completedAt ? new Date(t.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-lg px-2.5 py-1">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>Selesai</span>
                  </div>
                </div>
              ))}

              {completedTasks.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada riwayat tugas penjemputan selesai.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
