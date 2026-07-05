"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "@/lib/actions/users";
import { useToast } from "@/components/ui/toast";
import { Recycle, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        toast({
          title: "Registrasi Sukses",
          description: "Akun Anda berhasil dibuat. Silakan masuk.",
          type: "success",
        });
        router.push("/login");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Registrasi Gagal",
        description: err.message || "Terjadi kesalahan saat membuat akun.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-xl p-8 relative backdrop-blur-md">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="rounded-xl bg-emerald-600 p-2 text-white">
              <Recycle className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">
              BERLIAN<span className="text-emerald-600">V2</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold dark:text-white">Daftar Nasabah Baru</h2>
          <p className="text-xs text-slate-550 dark:text-zinc-400 mt-1">
            Bergabunglah bersama kami dan mulailah menabung sampah.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Andi Wijaya"
              {...register("name")}
              className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
                errors.name ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
              }`}
            />
            {errors.name && (
              <span className="text-[10px] text-rose-500 font-semibold">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              {...register("email")}
              className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
                errors.email ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
              }`}
            />
            {errors.email && (
              <span className="text-[10px] text-rose-500 font-semibold">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Nomor Telepon</label>
            <input
              type="text"
              placeholder="0812xxxxxxxx"
              {...register("phone")}
              className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
                errors.phone ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
              }`}
            />
            {errors.phone && (
              <span className="text-[10px] text-rose-500 font-semibold">{errors.phone.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Alamat Lengkap</label>
            <textarea
              rows={2}
              placeholder="Jl. Raya Kemerdekaan No. 12, Depok"
              {...register("address")}
              className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all resize-none ${
                errors.address ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
              }`}
            />
            {errors.address && (
              <span className="text-[10px] text-rose-500 font-semibold">{errors.address.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                {...register("password")}
                className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
                  errors.password ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[10px] text-rose-500 font-semibold">{errors.password.message}</span>
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
                Daftar Sekarang
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-550 dark:text-zinc-400">
          Sudah terdaftar sebagai nasabah?{" "}
          <Link href="/login" className="text-emerald-600 hover:underline font-semibold dark:text-emerald-400">
            Masuk Di Sini
          </Link>
        </div>
      </div>
    </div>
  );
}
