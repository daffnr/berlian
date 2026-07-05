"use client";

import React, { useState } from "react";
import { createInternalAccount, updateUserStatus, resetUserPassword } from "@/lib/actions/users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast";
import { Loader2, Plus, UserCheck, UserX, Key, ShieldAlert } from "lucide-react";

interface AccountItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: "USER" | "STAFF" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
}

interface AdminsClientProps {
  internalAccounts: AccountItem[];
}

const accountSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["ADMIN", "STAFF"]),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export function AdminsClient({ internalAccounts }: AdminsClientProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isMutating, setIsMutating] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      role: "STAFF",
    },
  });

  const handleStatusToggle = async (userId: string, currentStatus: "ACTIVE" | "INACTIVE") => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setIsMutating((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await updateUserStatus(userId, nextStatus);
      if (res.success) {
        toast({
          title: "Status Diperbarui",
          description: `Akun internal berhasil di-${nextStatus === "ACTIVE" ? "aktifkan" : "nonaktifkan"}.`,
          type: "success",
        });
      }
    } catch (err: any) {
      toast({
        title: "Gagal Mengubah Status",
        description: err.message || "Gagal memperbarui status akun.",
        type: "error",
      });
    } finally {
      setIsMutating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin mereset password akun internal ini?")) {
      return;
    }

    try {
      const res = await resetUserPassword(userId);
      if (res.success) {
        toast({
          title: "Sandi Berhasil Direset",
          description: "Kata sandi diubah kembali ke default 'password123'.",
          type: "success",
        });
      }
    } catch (err: any) {
      toast({
        title: "Gagal Reset Sandi",
        description: err.message || "Terjadi kesalahan sistem.",
        type: "error",
      });
    }
  };

  const handleCreateAccount = async (data: AccountFormValues) => {
    setIsAdding(true);
    try {
      const res = await createInternalAccount(data);
      if (res.success) {
        toast({
          title: "Akun Berhasil Dibuat",
          description: `Akun ${data.role} untuk ${data.name} berhasil didaftarkan.`,
          type: "success",
        });
        reset();
      }
    } catch (err: any) {
      toast({
        title: "Registrasi Gagal",
        description: err.message || "Gagal membuat akun internal baru.",
        type: "error",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Kolom Kiri: Daftar Akun Internal */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Daftar Akun Internal</h3>
        
        <div className="flex flex-col gap-4">
          {internalAccounts.map((acc) => (
            <div
              key={acc.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-900/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs animate-slide-in"
            >
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-800 dark:text-white">{acc.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[8px] font-extrabold tracking-wider uppercase ${
                    acc.role === "ADMIN" 
                      ? "bg-indigo-150 text-indigo-800 border-indigo-200" 
                      : "bg-blue-150 text-blue-800 border-blue-200"
                  }`}>
                    {acc.role}
                  </span>
                  <span className={`inline-flex items-center gap-1 font-bold ${
                    acc.status === "ACTIVE" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {acc.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                
                <div className="text-slate-550 dark:text-zinc-400">
                  <p>Email: {acc.email}</p>
                  <p className="mt-0.5">Telepon: {acc.phone || "-"}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-850">
                <button
                  onClick={() => handleResetPassword(acc.id)}
                  title="Reset Password ke 'password123'"
                  className="p-1.5 rounded-lg border border-slate-200 hover:text-yellow-600 dark:border-zinc-700 dark:hover:text-yellow-400 transition-colors"
                >
                  <Key className="h-4.5 w-4.5" />
                </button>
                
                <button
                  onClick={() => handleStatusToggle(acc.id, acc.status)}
                  disabled={isMutating[acc.id]}
                  title={acc.status === "ACTIVE" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    acc.status === "ACTIVE"
                      ? "border-slate-200 text-rose-500 hover:border-rose-350 hover:bg-rose-50 dark:border-zinc-700 dark:hover:bg-rose-950/20"
                      : "border-slate-200 text-emerald-600 hover:border-emerald-350 hover:bg-emerald-50 dark:border-zinc-700 dark:hover:bg-emerald-950/20"
                  }`}
                >
                  {acc.status === "ACTIVE" ? <UserX className="h-4.5 w-4.5" /> : <UserCheck className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
          ))}

          {internalAccounts.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              Belum ada akun internal terdaftar.
            </div>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Tambah Akun Internal */}
      <div className="lg:col-span-5">
        <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/20 dark:border-zinc-850 dark:bg-zinc-900/10">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Buat Akun Internal</h3>

          <form onSubmit={handleSubmit(handleCreateAccount)} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Hak Akses (Role)</label>
              <select
                {...register("role")}
                className="w-full bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 focus:outline-none"
              >
                <option value="STAFF">Staff Lapangan (Penjemput)</option>
                <option value="ADMIN">Admin Cabang</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Budi Setiawan"
                {...register("name")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                  errors.name ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.name && <span className="text-[10px] text-rose-500">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Email Organisasi</label>
              <input
                type="email"
                placeholder="budi@berlian.com"
                {...register("email")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                  errors.email ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.email && <span className="text-[10px] text-rose-500">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Nomor Telepon</label>
              <input
                type="text"
                placeholder="0856xxxxxxxx"
                {...register("phone")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                  errors.phone ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.phone && <span className="text-[10px] text-rose-500">{errors.phone.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Kata Sandi Awal</label>
              <input
                type="password"
                placeholder="••••••"
                {...register("password")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white ${
                  errors.password ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.password && <span className="text-[10px] text-rose-500">{errors.password.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-slate-700 dark:text-zinc-300">Alamat Rumah</label>
              <textarea
                rows={2}
                placeholder="Jl. Bahagia Selalu No. 4, Jakarta"
                {...register("address")}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white resize-none ${
                  errors.address ? "border-rose-500" : "border-slate-200 dark:border-zinc-750"
                }`}
              />
              {errors.address && <span className="text-[10px] text-rose-500">{errors.address.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-purple-500/10 disabled:opacity-50 mt-2"
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Daftarkan Akun
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
