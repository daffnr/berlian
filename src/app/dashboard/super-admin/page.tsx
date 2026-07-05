import React from "react";
import { auth } from "@/auth";
import { getUsers } from "@/lib/actions/users";
import { getPickups } from "@/lib/actions/pickups";
import { getTransactions, getActivityLogs } from "@/lib/actions/waste";
import { AdminCharts } from "@/components/ui/admin-charts";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Scale, Wallet, Activity, ClipboardList } from "lucide-react";

export const revalidate = 0;

export default async function SuperAdminDashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const users = await getUsers();
  const pickups = await getPickups();
  const transactions = await getTransactions();
  const logs = await getActivityLogs();

  const totalAdmins = users.filter((u: any) => u.role === "ADMIN").length;
  const totalStaff = users.filter((u: any) => u.role === "STAFF").length;
  const totalWeight = transactions.reduce((acc: number, curr: any) => acc + curr.weight, 0);
  const totalPayout = transactions.reduce((acc: number, curr: any) => acc + curr.totalPrice, 0);

  // Group 7 recent transactions for chart
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
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-850 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/10">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Akses Penuh Sistem</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">Portal Super Administrator</h2>
        <p className="text-xs sm:text-sm mt-2 opacity-90 leading-relaxed max-w-xl">
          Gunakan konsol ini untuk mengawasi audit trail sistem (Activity Log), membuat akun Admin/Staff baru, mereset password, serta menonaktifkan pengguna.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Admin & Staff */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Admin & Staff</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalAdmins + totalStaff} Orang
            </span>
            <span className="text-[10px] text-slate-450 mt-0.5">({totalAdmins} Admin, {totalStaff} Staff)</span>
          </div>
          <div className="rounded-xl bg-purple-100 dark:bg-purple-950/50 p-3 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Sampah Masuk */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Total Sampah</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalWeight.toFixed(1)} kg
            </span>
          </div>
          <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950/50 p-3 text-emerald-600 dark:text-emerald-400">
            <Scale className="h-6 w-6" />
          </div>
        </div>

        {/* Total Payout */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Saldo Disalurkan</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Rp{totalPayout.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="rounded-xl bg-blue-100 dark:bg-blue-950/50 p-3 text-blue-600 dark:text-blue-400">
            <Wallet className="h-6 w-6" />
          </div>
        </div>

        {/* Total Logs */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Audit Logs</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {logs.length} Log
            </span>
          </div>
          <div className="rounded-xl bg-yellow-100 dark:bg-yellow-950/50 p-3 text-yellow-600 dark:text-yellow-400">
            <Activity className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts & Audit Logs panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Grafik Penerimaan Sampah Harian</h3>
          <p className="text-[10px] text-slate-550 dark:text-zinc-400">
            Kapasitas penerimaan tonase harian cabang Bank Sampah BERLIAN.
          </p>
          <AdminCharts data={chartData} />
        </div>

        {/* Audit Log mini feed */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">Audit Log Sistem</h3>
            <Link
              href="/dashboard/super-admin/logs"
              className="text-[10px] font-semibold text-purple-600 hover:underline flex items-center gap-0.5"
            >
              Selengkapnya
            </Link>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {logs.slice(0, 5).map((l: any) => (
              <div
                key={l.id}
                className="p-3 rounded-xl border border-slate-50 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-900/10 text-[10px] flex flex-col gap-1"
              >
                <div className="flex justify-between items-center font-bold text-slate-700 dark:text-zinc-300">
                  <span>{l.user?.name || "Sistem"}</span>
                  <span className="text-[8px] opacity-70">
                    {new Date(l.createdAt).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <span className="font-semibold text-purple-600 dark:text-purple-400 uppercase text-[8px] tracking-wider">
                  {l.action}
                </span>
                <p className="text-slate-550 dark:text-zinc-400 text-[10px]">{l.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
