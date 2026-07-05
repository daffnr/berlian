"use client";

import React, { useState } from "react";
import { createLocation, deleteLocation } from "@/lib/actions/waste";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast";
import { Loader2, Plus, Trash2, MapPin, Phone, Mail } from "lucide-react";

interface LocationItem {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
}

interface LocationsClientProps {
  initialLocations: LocationItem[];
}

const locationSchema = z.object({
  name: z.string().min(3, "Nama cabang minimal 3 karakter"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  latitude: z.coerce.number().min(-90, "Latitude antara -90 s/d 90").max(90),
  longitude: z.coerce.number().min(-180, "Longitude antara -180 s/d 180").max(180),
  phone: z.string().min(6, "Nomor telepon minimal 6 karakter"),
  email: z.string().email("Format email tidak valid"),
});

type LocationFormValues = z.infer<typeof locationSchema>;

export function LocationsClient({ initialLocations }: LocationsClientProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: -6.175,
      longitude: 106.827,
      phone: "",
      email: "",
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lokasi cabang ini?")) {
      return;
    }

    setIsDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await deleteLocation(id);
      if (res.success) {
        toast({
          title: "Cabang Dihapus",
          description: "Lokasi operasional berhasil dihapus dari sistem.",
          type: "success",
        });
      }
    } catch (err: any) {
      toast({
        title: "Gagal Menghapus",
        description: err.message || "Gagal menghapus cabang.",
        type: "error",
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCreate = async (data: any) => {
    setIsAdding(true);
    try {
      const res = await createLocation(data);
      if (res.success) {
        toast({
          title: "Cabang Dibuat",
          description: `Cabang ${data.name} berhasil terdaftar di sistem.`,
          type: "success",
        });
        reset();
      }
    } catch (err: any) {
      toast({
        title: "Gagal Membuat",
        description: err.message || "Gagal mendaftarkan cabang baru.",
        type: "error",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Daftar Lokasi */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Cabang Terdaftar</h3>
        <div className="flex flex-col gap-4">
          {initialLocations.map((loc) => (
            <div
              key={loc.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-900/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs"
            >
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{loc.name}</span>
                  <span className="text-[10px] text-slate-450">
                    ({loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)})
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-slate-550 dark:text-zinc-400">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span>{loc.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <span>{loc.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-850">
                <button
                  onClick={() => handleDelete(loc.id)}
                  disabled={isDeleting[loc.id]}
                  className="p-2 rounded-lg border border-slate-200 text-rose-500 hover:border-rose-300 hover:bg-rose-50 dark:border-zinc-700 dark:hover:bg-rose-950/20 transition-all disabled:opacity-50"
                >
                  {isDeleting[loc.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}

          {initialLocations.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              Belum ada cabang terdaftar.
            </div>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Form Tambah Cabang */}
      <div className="lg:col-span-5">
        <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/20 dark:border-zinc-850 dark:bg-zinc-900/10">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Daftarkan Cabang Baru</h3>
          
          <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Nama Cabang</label>
              <input
                type="text"
                placeholder="Bank Sampah Cabang Bekasi"
                {...register("name")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                  errors.name ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.name && <span className="text-[10px] text-rose-500">{errors.name.message as any}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Alamat Lengkap</label>
              <textarea
                rows={2}
                placeholder="Jl. Pahlawan No. 78, Bekasi Timur"
                {...register("address")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white resize-none ${
                  errors.address ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.address && <span className="text-[10px] text-rose-500">{errors.address.message as any}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700 dark:text-zinc-300">Latitude (GPS)</label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="-6.234"
                  {...register("latitude")}
                  className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                    errors.latitude ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                  }`}
                />
                {errors.latitude && <span className="text-[10px] text-rose-500">{errors.latitude.message as any}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-700 dark:text-zinc-300">Longitude (GPS)</label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="106.845"
                  {...register("longitude")}
                  className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                    errors.longitude ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                  }`}
                />
                {errors.longitude && <span className="text-[10px] text-rose-500">{errors.longitude.message as any}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Telepon Layanan</label>
              <input
                type="text"
                placeholder="021-8889900"
                {...register("phone")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                  errors.phone ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.phone && <span className="text-[10px] text-rose-500">{errors.phone.message as any}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Email Resmi Cabang</label>
              <input
                type="email"
                placeholder="bekasi@berlian.com"
                {...register("email")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                  errors.email ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.email && <span className="text-[10px] text-rose-500">{errors.email.message as any}</span>}
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50 mt-2"
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Daftarkan Cabang
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
