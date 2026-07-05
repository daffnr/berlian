"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createPickupRequest } from "@/lib/actions/pickups";
import { useToast } from "@/components/ui/toast";
import { Loader2, ArrowRight } from "lucide-react";

const pickupSchema = z.object({
  wasteTypeId: z.string().min(1, "Silakan pilih jenis sampah"),
  estimatedWeight: z.coerce.number().min(0.5, "Estimasi berat minimal 0.5 kg"),
  description: z.string().optional(),
  address: z.string().min(10, "Alamat penjemputan minimal 10 karakter"),
  waNumber: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),
});

type PickupFormValues = z.infer<typeof pickupSchema>;

interface PickupFormProps {
  userId: string;
  wasteTypes: { id: string; name: string; pricePerKg: number }[];
  defaultAddress: string;
  defaultPhone: string;
}

export function PickupForm({ userId, wasteTypes, defaultAddress, defaultPhone }: PickupFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      wasteTypeId: wasteTypes[0]?.id || "",
      estimatedWeight: 1,
      description: "",
      address: defaultAddress,
      waNumber: defaultPhone,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await createPickupRequest({
        userId,
        wasteTypeId: data.wasteTypeId,
        estimatedWeight: data.estimatedWeight,
        description: data.description,
        address: data.address,
        imageUrl: imagePreview || undefined,
      });

      if (res.success) {
        toast({
          title: "Request Terkirim",
          description: "Pesanan penjemputan berhasil dikirim. Menunggu verifikasi admin.",
          type: "success",
        });

        // WhatsApp redirection to Admin WA: +62 877 8534 9292
        const adminWa = "6287785349292";
        const waste = wasteTypes.find((w) => w.id === data.wasteTypeId);
        const wasteName = waste ? waste.name : "Sampah Terpilah";
        const weight = data.estimatedWeight;
        const address = data.address;
        const formattedUserWa = data.waNumber;

        const message = `Halo Admin Bank Sampah BERLIAN,\n\nSaya ingin mengonfirmasi request penjemputan sampah terpilah yang baru saja saya ajukan di website:\n- *Jenis*: ${wasteName}\n- *Estimasi Berat*: ${weight} kg\n- *Alamat*: ${address}\n- *No. WA Nasabah*: ${formattedUserWa}\n\nMohon bantuannya untuk memverifikasi dan menjadwalkan petugas penjemput. Terima kasih! 🙏`;

        const waUrl = `https://wa.me/${adminWa}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");

        reset({
          wasteTypeId: wasteTypes[0]?.id || "",
          estimatedWeight: 1,
          description: "",
          address: defaultAddress,
          waNumber: defaultPhone,
        });
        setImagePreview(null);
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Gagal Mengajukan",
        description: err.message || "Terjadi kesalahan saat mengajukan penjemputan.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Pilihan Jenis Sampah */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Jenis Sampah</label>
        <select
          {...register("wasteTypeId")}
          className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
        >
          {wasteTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} (Rp{type.pricePerKg.toLocaleString("id-ID")}/kg)
            </option>
          ))}
        </select>
        {errors.wasteTypeId && (
          <span className="text-[10px] text-rose-500 font-semibold">{errors.wasteTypeId.message as any}</span>
        )}
      </div>

      {/* Estimasi Berat */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Estimasi Berat (kg)</label>
        <input
          type="number"
          step="0.1"
          placeholder="5.0"
          {...register("estimatedWeight")}
          className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
            errors.estimatedWeight ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
          }`}
        />
        {errors.estimatedWeight && (
          <span className="text-[10px] text-rose-500 font-semibold">{errors.estimatedWeight.message as any}</span>
        )}
      </div>

      {/* Nomor WhatsApp */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Nomor WhatsApp Aktif</label>
        <input
          type="text"
          placeholder="Contoh: 087785349292"
          {...register("waNumber")}
          className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
            errors.waNumber ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
          }`}
        />
        {errors.waNumber && (
          <span className="text-[10px] text-rose-500 font-semibold">{errors.waNumber.message as any}</span>
        )}
      </div>

      {/* Alamat Penjemputan */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Alamat Lengkap Jemput</label>
        <textarea
          rows={3}
          placeholder="Masukkan detail alamat penjemputan"
          {...register("address")}
          className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all resize-none ${
            errors.address ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
          }`}
        />
        {errors.address && (
          <span className="text-[10px] text-rose-500 font-semibold">{errors.address.message as any}</span>
        )}
      </div>

      {/* Catatan Tambahan */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Catatan untuk Petugas (Opsional)</label>
        <input
          type="text"
          placeholder="Contoh: Jemput di lobi depan, kabari via telp."
          {...register("description")}
          className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
        />
      </div>

      {/* Upload Foto Sampah */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Foto Sampah Terpilah (Opsional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-950/40 dark:file:text-emerald-400 cursor-pointer"
        />
        {imagePreview && (
          <div className="mt-2 relative w-32 h-32 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 dark:border-zinc-850 shadow-sm flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Preview Sampah" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 text-[8px] font-extrabold shadow"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 mt-2 hover:scale-[1.01]"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Ajukan Penjemputan
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
