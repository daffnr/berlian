import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/users";
import { getTransactionsByUserId } from "@/lib/actions/waste";
import { UserCharts } from "@/components/ui/user-charts";
import { Wallet, Recycle, ArrowUpRight, Scale, Award } from "lucide-react";
import { redirect } from "next/navigation";

export const revalidate = 0; // Disable caching for dynamic dashboards

export default async function UserDashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id as string;
  const user = await getUserById(userId);
  if (!user) {
    redirect("/login");
  }

  const transactions = await getTransactionsByUserId(userId);

  // Hitung metrik
  const totalWeight = transactions.reduce((acc: number, curr: any) => acc + curr.weight, 0);
  const transactionCount = transactions.length;

  // Level & Poin logic
  // Level 1: < 200 poin
  // Level 2: 200 - 500 poin
  // Level 3: > 500 poin
  const getLevelInfo = (pts: number) => {
    if (pts < 200) {
      return { level: 1, name: "Nasabah Pemula", progress: (pts / 200) * 100, nextLevelThreshold: 200 };
    } else if (pts < 500) {
      return { level: 2, name: "Nasabah Aktif", progress: ((pts - 200) / 300) * 100, nextLevelThreshold: 500 };
    } else {
      return { level: 3, name: "Pahlawan Lingkungan", progress: 100, nextLevelThreshold: 1000 };
    }
  };

  const lvlInfo = getLevelInfo(user.points);

  // Format data grafik untuk UserCharts
  const chartPoints = transactions.slice(0, 7).map((t: any) => ({
    date: t.createdAt.toISOString(),
    weight: t.weight,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 sm:p-8 text-white shadow-xl shadow-emerald-600/10">
        <h2 className="text-xl sm:text-2xl font-bold">Halo, {user.name}! 👋</h2>
        <p className="text-xs sm:text-sm mt-2 opacity-90 leading-relaxed max-w-xl">
          Terima kasih telah berkontribusi menjaga kelestarian bumi. Terus pilah sampah Anda, ajukan penjemputan, dan kumpulkan poin reward-nya!
        </p>
      </div>

      {/* 2. Grid widget statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Saldo Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Saldo Tabungan</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Rp{user.balance.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950/50 p-3 text-emerald-600 dark:text-emerald-400">
            <Wallet className="h-6 w-6" />
          </div>
        </div>

        {/* Berat Sampah Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Total Setoran</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalWeight.toFixed(1)} kg
            </span>
          </div>
          <div className="rounded-xl bg-blue-100 dark:bg-blue-950/50 p-3 text-blue-600 dark:text-blue-400">
            <Scale className="h-6 w-6" />
          </div>
        </div>

        {/* Jumlah Transaksi Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Jumlah Transaksi</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {transactionCount} Kali
            </span>
          </div>
          <div className="rounded-xl bg-purple-100 dark:bg-purple-950/50 p-3 text-purple-600 dark:text-purple-400">
            <Recycle className="h-6 w-6" />
          </div>
        </div>

        {/* Poin & Level Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Level {lvlInfo.level}</span>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">{lvlInfo.name}</span>
            </div>
            <div className="rounded-xl bg-yellow-100 dark:bg-yellow-950/50 p-2 text-yellow-600 dark:text-yellow-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-zinc-400 mb-1">
              <span>{user.points} Poin</span>
              <span>Target: {lvlInfo.nextLevelThreshold} Poin</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${lvlInfo.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Panel Grafik & Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Penyetoran */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Grafik Penyetoran Sampah</h3>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400">
            Histori berat sampah (kg) yang disetorkan pada 7 transaksi terakhir Anda.
          </p>
          <UserCharts data={chartPoints} />
        </div>

        {/* Riwayat Transaksi Singkat */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">Riwayat Setoran</h3>
            <Link
              href="/dashboard/user/transactions"
              className="text-[10px] font-semibold text-emerald-650 hover:underline flex items-center gap-0.5"
            >
              Lihat Semua
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[250px] pr-1">
            {transactions.slice(0, 4).map((t: any) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 text-xs"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold">{t.pickupRequest?.wasteType?.name || "Sampah Plastik"}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                    {new Date(t.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +Rp{t.totalPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-zinc-400">{t.weight} kg</span>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 py-8 text-center text-slate-400 text-xs">
                Belum ada transaksi setoran.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
