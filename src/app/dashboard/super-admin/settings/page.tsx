"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Settings, Save, Loader2, Info } from "lucide-react";

export default function SuperAdminSettingsPage() {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [appName, setAppName] = useState("Bank Sampah BERLIAN");
  const [pointRate, setPointRate] = useState(100); // 1 point per 100 Rp
  const [minWeight, setMinWeight] = useState(5.0); // 5kg minimum weight
  const [pickupCharge, setPickupCharge] = useState(0); // Rp0 admin charge

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Konfigurasi Disimpan",
        description: "Parameter global sistem berhasil diperbarui.",
        type: "success",
      });
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Konfigurasi Sistem Global</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Atur parameter bisnis, tarif pencatatan poin, dan batasan operasional penjemputan armada.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5 text-xs sm:text-sm">
        {/* Nama Platform */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Nama Platform Bank Sampah</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none"
          />
        </div>

        {/* Poin per Rupiah */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Konversi Poin (Rupiah per Poin)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rp</span>
            <input
              type="number"
              value={pointRate}
              onChange={(e) => setPointRate(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none"
            />
          </div>
          <span className="text-[10px] text-slate-450 mt-1 block">
            Contoh: Nilai 100 berarti nasabah memperoleh 1 Poin untuk setiap kelipatan transaksi Rp100.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Min Weight */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Min. Berat Jemput (kg)</label>
            <input
              type="number"
              step="0.5"
              value={minWeight}
              onChange={(e) => setMinWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Admin Charge */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Biaya Admin Jemput (Rp)</label>
            <input
              type="number"
              value={pickupCharge}
              onChange={(e) => setPickupCharge(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex gap-3 items-start">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
            <strong>Pemberitahuan:</strong> Parameter yang Anda ubah di halaman ini akan diaktifkan secara instan untuk transaksi baru nasabah, namun transaksi lama yang telah COMPLETED tidak akan dihitung ulang.
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-fit md:px-6 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/10 disabled:opacity-50 mt-2 hover:scale-[1.01]"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Simpan Konfigurasi
              <Save className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
