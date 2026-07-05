"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { completePickupRequest } from "@/lib/actions/pickups";
import { useToast } from "@/components/ui/toast";
import { Loader2, Check } from "lucide-react";

const weighSchema = z.object({
  weight: z.coerce.number().min(0.1, "Berat sampah minimal 0.1 kg"),
});

type WeighFormValues = z.infer<typeof weighSchema>;

interface WeighFormProps {
  pickupId: string;
  staffId: string;
  wasteTypeName: string;
  pricePerKg: number;
}

export function WeighForm({
  pickupId,
  staffId,
  wasteTypeName,
  pricePerKg,
}: WeighFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [liveWeight, setLiveWeight] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(weighSchema),
    defaultValues: {
      weight: 0,
    },
  });

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setLiveWeight(val);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await completePickupRequest(pickupId, data.weight, staffId);
      if (res.success) {
        toast({
          title: "Penimbangan Selesai",
          description: `Timbangan sebesar ${data.weight}kg untuk ${wasteTypeName} berhasil disimpan. Saldo nasabah telah ditambahkan.`,
          type: "success",
        });
        router.push("/dashboard/staff");
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Penyimpanan Gagal",
        description: err.message || "Gagal menyimpan hasil timbangan.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Kalkulator kalkulasi live
  const calculatedBalance = liveWeight * pricePerKg;
  const calculatedPoints = Math.round(calculatedBalance / 100);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Input Berat Timbangan */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold  text-black">
          Masukkan Berat Aktual (kg)
        </label>
        <input
          type="number"
          step="0.1"
          placeholder="0.0"
          {...register("weight", { onChange: handleWeightChange })}
          className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white transition-all ${
            errors.weight
              ? "border-rose-500"
              : "border-slate-200 dark:border-zinc-700"
          }`}
        />
        {errors.weight && (
          <span className="text-[10px] text-rose-500 font-semibold">
            {errors.weight.message as any}
          </span>
        )}
      </div>

      {/* Rincian Penghitungan Live */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/50 flex flex-col gap-2.5 text-xs sm:text-sm">
        <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400">
          <span>Harga Satuan ({wasteTypeName})</span>
          <span className="font-semibold">
            Rp{pricePerKg.toLocaleString("id-ID")} / kg
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400">
          <span>Berat Terbaca</span>
          <span className="font-bold text-slate-800 dark:text-zinc-250">
            {liveWeight} kg
          </span>
        </div>
        <div className="h-px bg-slate-100 dark:bg-zinc-800" />

        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-700 dark:text-zinc-300">
            Total Kredit Saldo
          </span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
            Rp{calculatedBalance.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-700 dark:text-zinc-300">
            Total Kredit Poin
          </span>
          <span className="font-bold text-yellow-600 dark:text-yellow-400">
            +{calculatedPoints} Poin
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard/staff")}
          className="flex-1 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold py-3 rounded-xl transition-colors text-center"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isLoading || liveWeight <= 0}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Simpan & Konfirmasi
              <Check className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
