"use client";

import React, { useState } from "react";
import { updateWastePrice, createWasteType } from "@/lib/actions/waste";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast";
import { Loader2, Plus, Edit3, Check, DollarSign } from "lucide-react";

interface WasteTypeItem {
  id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  pricePerKg: number;
}

interface WasteTypesClientProps {
  initialWasteTypes: WasteTypeItem[];
}

const newWasteSchema = z.object({
  name: z.string().min(3, "Nama jenis sampah minimal 3 karakter"),
  code: z.string().min(3, "Kode minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  pricePerKg: z.coerce.number().min(100, "Harga minimal Rp100/kg"),
});

type NewWasteFormValues = z.infer<typeof newWasteSchema>;

export function WasteTypesClient({ initialWasteTypes }: WasteTypesClientProps) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(newWasteSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      pricePerKg: 1000,
    },
  });

  const handleEditClick = (item: WasteTypeItem) => {
    setEditingId(item.id);
    setEditingPrice(item.pricePerKg);
  };

  const handlePriceUpdate = async (id: string) => {
    if (editingPrice < 100) {
      toast({
        title: "Harga Tidak Valid",
        description: "Harga sampah minimal Rp100/kg.",
        type: "error",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateWastePrice(id, editingPrice);
      if (res.success) {
        toast({
          title: "Harga Diperbarui",
          description: "Harga beli sampah berhasil diselamatkan ke sistem.",
          type: "success",
        });
        setEditingId(null);
      }
    } catch (err: any) {
      toast({
        title: "Pembaruan Gagal",
        description: err.message || "Gagal memperbarui harga sampah.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNewWaste = async (data: any) => {
    setIsAdding(true);
    try {
      const res = await createWasteType(data);
      if (res.success) {
        toast({
          title: "Jenis Sampah Ditambahkan",
          description: `Kategori ${data.name} berhasil didaftarkan.`,
          type: "success",
        });
        reset();
      }
    } catch (err: any) {
      toast({
        title: "Gagal Menambahkan",
        description: err.message || "Gagal menambahkan jenis sampah.",
        type: "error",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Daftar Jenis Sampah */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Kategori Aktif</h3>
        <div className="flex flex-col gap-4">
          {initialWasteTypes.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-900/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover border dark:border-zinc-800"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-1">{item.description}</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Kode: {item.code}</span>
                </div>
              </div>

              {/* Price rate controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-850">
                {editingId === item.id ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <span className="font-bold text-slate-500">Rp</span>
                    <input
                      type="number"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(parseInt(e.target.value) || 0)}
                      className="w-20 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-2 py-1 font-bold text-center text-xs"
                    />
                    <button
                      onClick={() => handlePriceUpdate(item.id)}
                      disabled={isUpdating}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                      Rp{item.pricePerKg.toLocaleString("id-ID")} / kg
                    </span>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 rounded-lg border border-slate-250 hover:bg-slate-50 hover:text-emerald-600 dark:border-zinc-700 dark:hover:bg-zinc-850 dark:hover:text-emerald-400 transition-all ml-2"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kolom Kanan: Form Tambah Kategori */}
      <div className="lg:col-span-5">
        <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/20 dark:border-zinc-850 dark:bg-zinc-900/10">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Tambah Kategori Baru</h3>
          
          <form onSubmit={handleSubmit(handleAddNewWaste)} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Nama Jenis Sampah</label>
              <input
                type="text"
                placeholder="Plastik HDPE Keras"
                {...register("name")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                  errors.name ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.name && <span className="text-[10px] text-rose-500">{errors.name.message as any}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Kode Unik (Capslock)</label>
              <input
                type="text"
                placeholder="PLASTIC_HDPE_KERAS"
                {...register("code")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                  errors.code ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.code && <span className="text-[10px] text-rose-500">{errors.code.message as any}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Tarif Awal Beli (Rupiah / kg)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  placeholder="2500"
                  {...register("pricePerKg")}
                  className={`w-full bg-white dark:bg-zinc-800 border rounded-xl pl-8 pr-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                    errors.pricePerKg ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                  }`}
                />
              </div>
              {errors.pricePerKg && <span className="text-[10px] text-rose-500">{errors.pricePerKg.message as any}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Deskripsi Sampah</label>
              <textarea
                rows={3}
                placeholder="Deskripsikan ciri-ciri fisik plastik yang diterima..."
                {...register("description")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white resize-none ${
                  errors.description ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.description && <span className="text-[10px] text-rose-500">{errors.description.message as any}</span>}
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50 mt-2"
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Tambah Kategori
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
