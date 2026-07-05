"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/toast";
import { Recycle, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login Gagal",
          description: "Email atau password salah, atau akun dinonaktifkan.",
          type: "error",
        });
      } else {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang kembali di Bank Sampah BERLIAN!",
          type: "success",
        });
        // Redirect akan ditangani oleh router atau middleware.
        // Untuk amannya, kita paksa re-route ke dashboard user.
        router.push("/dashboard/user");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Terjadi Kesalahan",
        description: "Terjadi kesalahan sistem saat mencoba masuk.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 sm:px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-xl p-8 relative backdrop-blur-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="rounded-xl bg-emerald-600 p-2 text-white">
              <Recycle className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">
              BERLIAN<span className="text-emerald-600">V2</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold dark:text-white">Masuk sebagai Nasabah</h2>
          <p className="text-xs text-slate-550 dark:text-zinc-400 mt-1">
            Gunakan email dan kata sandi Anda untuk mengelola tabungan.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              {...register("email")}
              className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
                errors.email ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
              }`}
            />
            {errors.email && (
              <span className="text-[10px] text-rose-500 font-semibold">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                {...register("password")}
                className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
                  errors.password ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
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
                Masuk ke Dashboard
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-zinc-400">
          Belum terdaftar sebagai nasabah?{" "}
          <Link href="/register" className="text-emerald-600 hover:underline font-semibold dark:text-emerald-400">
            Daftar Di Sini
          </Link>
        </div>
      </div>
    </div>
  );
}
