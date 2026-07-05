"use client";

import React, { useState } from "react";
import { Search, Calendar, Scale, Users, ShieldAlert, CheckCircle2, XCircle, Clock } from "lucide-react";

interface PickupItem {
  id: string;
  userId: string;
  user?: { id: string; name: string } | null;
  userName?: string;
  wasteTypeId: string;
  wasteType?: { name: string } | null;
  wasteTypeName?: string;
  estimatedWeight: number;
  description: string | null;
  status: "PENDING" | "VERIFIED" | "ASSIGNED" | "PICKED_UP" | "COMPLETED" | "CANCELLED";
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  completedAt?: Date | string | null;
  createdAt: Date | string;
  transactions?: {
    weight: number;
    pricePerKg: number;
    totalPrice: number;
    pointsEarned: number;
    staff?: { name: string } | null;
    staffName?: string;
  }[];
}

interface HistoryClientProps {
  initialPickups: PickupItem[];
  staffId: string;
  staffName: string;
}

export function HistoryClient({ initialPickups, staffId, staffName }: HistoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Helper untuk menggabungkan data asli database dengan dummy data historis untuk demo
  const getStaffHistory = (): PickupItem[] => {
    // Ambil data asli milik staff saat ini yang berstatus COMPLETED, CANCELLED, atau ASSIGNED
    const dbPickups = initialPickups.filter(
      (p) => p.status === "COMPLETED" || p.status === "CANCELLED" || p.status === "ASSIGNED"
    );

    // Jika database sudah memiliki 5 atau lebih data penjemputan, tampilkan langsung
    if (dbPickups.length >= 5) {
      return dbPickups;
    }

    // Buat dummy data pelengkap agar total riwayat minimal 5 untuk demo
    const countNeeded = 5 - dbPickups.length;
    const generatedDummyPickups: PickupItem[] = [];
    const now = Date.now();

    for (let i = 0; i < countNeeded; i++) {
      // Selisih tanggal: dibuat 3 hari sekali ke masa lalu
      const timeOffset = (i + 1) * 3 * 24 * 60 * 60 * 1000;
      const completedDate = new Date(now - timeOffset);
      const isBotol = i % 2 === 0;
      const estWeight = 5.0 + (i * 2.5);
      const actWeight = parseFloat((estWeight * 1.05).toFixed(1));
      const pricePerKg = isBotol ? 3000 : 2000;
      const totalPrice = actWeight * pricePerKg;

      generatedDummyPickups.push({
        id: `dummy-hist-p-${staffId}-${i}`,
        userId: "u-1",
        user: { id: "u-1", name: "Nasabah Setia Andi" },
        wasteTypeId: isBotol ? "w-1" : "w-2",
        wasteType: { name: isBotol ? "Botol Plastik" : "Gelas Plastik" },
        estimatedWeight: estWeight,
        description: "Jemput rutin.",
        status: "COMPLETED",
        address: "Jl. Pemuda No. 12, Pancoran Mas, Depok",
        latitude: -6.375678,
        longitude: 106.831234,
        completedAt: completedDate,
        createdAt: new Date(completedDate.getTime() - 24 * 60 * 60 * 1000),
        transactions: [
          {
            weight: actWeight,
            pricePerKg,
            totalPrice,
            pointsEarned: Math.round(totalPrice / 100),
            staff: { name: staffName },
          },
        ],
      });
    }

    // Gabungkan data DB + Dummy dan urutkan berdasarkan waktu penyelesaian terbaru
    const merged = [...dbPickups, ...generatedDummyPickups];
    return merged.sort((a, b) => {
      const dateA = new Date(a.completedAt || a.createdAt).getTime();
      const dateB = new Date(b.completedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  };

  const allHistory = getStaffHistory();

  // Hitung Statistik Ringkasan
  const completedHistory = allHistory.filter((p) => p.status === "COMPLETED");
  const totalCompleted = completedHistory.length;

  const totalWeight = completedHistory.reduce((sum, p) => {
    const weight = p.transactions?.[0]?.weight ?? 0;
    return sum + weight;
  }, 0);

  const uniqueCustomers = new Set(
    completedHistory.map((p) => p.userId || p.user?.id)
  ).size;

  // Filter pencarian berdasarkan nama nasabah atau alamat penjemputan
  const filteredHistory = allHistory.filter((p) => {
    const name = (p.user?.name || p.userName || "Nasabah").toLowerCase();
    const address = (p.address || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || address.includes(query);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 px-2.5 py-0.5 rounded-full text-[10px]">
            <CheckCircle2 className="h-3 w-3" /> Selesai
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 px-2.5 py-0.5 rounded-full text-[10px]">
            <XCircle className="h-3 w-3" /> Dibatalkan
          </span>
        );
      case "ASSIGNED":
      case "PICKED_UP":
      default:
        return (
          <span className="flex items-center gap-1.5 font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900 px-2.5 py-0.5 rounded-full text-[10px]">
            <Clock className="h-3 w-3" /> Diproses
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Ringkasan Statistik (Stats Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Selesai */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
              Total Penjemputan Selesai
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalCompleted} Tugas
            </span>
          </div>
          <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950/50 p-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Total Berat */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
              Total Berat Dijemput
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalWeight.toFixed(1)} kg
            </span>
          </div>
          <div className="rounded-xl bg-blue-100 dark:bg-blue-950/50 p-3 text-blue-600 dark:text-blue-400">
            <Scale className="h-6 w-6" />
          </div>
        </div>

        {/* Nasabah Dilayani */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
              Nasabah Dilayani
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {uniqueCustomers} Orang
            </span>
          </div>
          <div className="rounded-xl bg-purple-100 dark:bg-purple-950/50 p-3 text-purple-600 dark:text-purple-400">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 2. Bar Pencarian */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari nasabah atau alamat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-black dark:text-zinc-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-700"
        />
      </div>

      {/* 3. Tabel Riwayat */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-850">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-550 uppercase tracking-wider dark:border-zinc-850 dark:bg-zinc-900/50 dark:text-zinc-400">
              <th className="p-4">Waktu</th>
              <th className="p-4">Nasabah / ID</th>
              <th className="p-4">Alamat Penjemputan</th>
              <th className="p-4">Jenis Sampah</th>
              <th className="p-4 text-right">Estimasi</th>
              <th className="p-4 text-right">Timbangan Aktual</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Diterima Oleh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 text-slate-700 dark:text-zinc-300">
            {filteredHistory.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/15 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {new Date(h.completedAt || h.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(h.completedAt || h.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} WIB
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {h.user?.name || h.userName || "Nasabah"}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      ID: {h.userId || h.user?.id}
                    </span>
                  </div>
                </td>
                <td className="p-4 max-w-xs truncate" title={h.address}>
                  {h.address}
                </td>
                <td className="p-4 font-semibold">
                  {h.wasteType?.name || h.wasteTypeName}
                </td>
                <td className="p-4 text-right text-slate-400">
                  {h.estimatedWeight} kg
                </td>
                <td className="p-4 text-right">
                  {h.status === "COMPLETED" && h.transactions?.[0] ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {h.transactions[0].weight} kg
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono">-</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center">{getStatusBadge(h.status)}</div>
                </td>
                <td className="p-4 text-slate-500 font-medium">
                  {h.status === "COMPLETED" && h.transactions?.[0] ? (
                    h.transactions[0].staff?.name || h.transactions[0].staffName || staffName
                  ) : (
                    <span className="text-slate-400 font-mono">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <ShieldAlert className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-xs">Tidak ada riwayat penjemputan yang cocok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
