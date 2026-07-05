import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { getUsers } from "@/lib/actions/users";
import { getPickups } from "@/lib/actions/pickups";
import { getTransactions } from "@/lib/actions/waste";
import { AdminCharts } from "@/components/ui/admin-charts";
import { Users, Scale, Wallet, ClipboardList, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const users = await getUsers();
  const pickups = await getPickups();
  const transactions = await getTransactions();

  // Hitung metrik admin
  const totalCustomers = users.filter((u: any) => u.role === "USER").length;
  const totalWeight = transactions.reduce((acc: number, curr: any) => acc + curr.weight, 0);
  const totalPayout = transactions.reduce((acc: number, curr: any) => acc + curr.totalPrice, 0);
  const pendingRequests = pickups.filter((p: any) => p.status === "PENDING").length;

  // Siapkan data grafik harian (kelompokkan 7 transaksi terakhir)
  const chartData = transactions.slice(0, 10).map((t: any) => {
    const isBotol = (t.pickupRequest?.wasteType?.name || t.wasteTypeName || "").toLowerCase().includes("botol");
    return {
      date: t.createdAt.toISOString(),
      botolWeight: isBotol ? t.weight : 0,
      gelasWeight: !isBotol ? t.weight : 0,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Grid Widget Statistik Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Nasabah */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Total Nasabah</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalCustomers} Orang
            </span>
          </div>
          <div className="rounded-xl bg-indigo-100 dark:bg-indigo-950/50 p-3 text-indigo-600 dark:text-indigo-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Sampah Masuk */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Sampah Terkumpul</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalWeight.toFixed(1)} kg
            </span>
          </div>
          <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950/50 p-3 text-emerald-600 dark:text-emerald-400">
            <Scale className="h-6 w-6" />
          </div>
        </div>

        {/* Total Tabungan Tersalurkan */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Saldo Terbayar</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Rp{totalPayout.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="rounded-xl bg-blue-100 dark:bg-blue-950/50 p-3 text-blue-600 dark:text-blue-400">
            <Wallet className="h-6 w-6" />
          </div>
        </div>

        {/* Antrean Verifikasi */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Antrean Verifikasi</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {pendingRequests} Tugas
            </span>
          </div>
          <div className="rounded-xl bg-yellow-100 dark:bg-yellow-950/50 p-3 text-yellow-600 dark:text-yellow-400">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 2. Grafik Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik setoran */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Grafik Penerimaan Sampah Harian</h3>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400">
            Volume penerimaan sampah berdasarkan kategori jenis botol plastik dan gelas plastik.
          </p>
          <AdminCharts data={chartData} />
        </div>

        {/* Transaksi Terbaru */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">Aktivitas Setoran Terbaru</h3>
            <span className="text-[10px] text-slate-400">Live feed</span>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {transactions.slice(0, 5).map((t: any) => (
              <div
                key={t.id}
                className="p-3 rounded-xl border border-slate-50 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-900/10 text-xs flex items-center justify-between"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">{t.user?.name || "Nasabah"}</span>
                  <span className="text-[9px] text-slate-500 dark:text-zinc-400">
                    Staff: {t.staff?.name || "Staff"} · {t.pickupRequest?.wasteType?.name || t.wasteTypeName}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Rp{t.totalPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-zinc-400 font-semibold">{t.weight} kg</span>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 py-8 text-center text-slate-400 text-xs">
                Belum ada transaksi terekam.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
