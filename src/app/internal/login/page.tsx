"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn, getSession } from "next-auth/react";
import { useToast } from "@/components/ui/toast";
import { ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function InternalLoginPage() {
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
          description: "Kredensial salah atau akun dinonaktifkan.",
          type: "error",
        });
      } else {
        const session = await getSession();
        const role = (session?.user as any)?.role;

        if (role === "USER") {
          // Nasabah dilarang login lewat portal internal
          toast({
            title: "Akses Ditolak",
            description: "Akun Anda terdaftar sebagai nasabah. Silakan login melalui halaman nasabah biasa.",
            type: "error",
          });
          // Log out
          router.push("/login");
        } else {
          toast({
            title: "Login Berhasil",
            description: `Selamat datang kembali, ${session?.user?.name}!`,
            type: "success",
          });
          
          // Mengarahkan ke dashboard yang sesuai
          if (role === "SUPER_ADMIN") {
            router.push("/dashboard/super-admin");
          } else if (role === "ADMIN") {
            router.push("/dashboard/admin");
          } else if (role === "STAFF") {
            router.push("/dashboard/staff");
          }
          router.refresh();
        }
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 sm:px-6 relative overflow-hidden">


      <div className="w-full max-w-md bg-zinc-950/70 border border-zinc-800 rounded-2xl shadow-2xl p-8 relative backdrop-blur-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="mb-4">
            <Logo className="h-8 w-8" showText={true} />
          </Link>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            Portal Internal
          </div>
          <h2 className="text-xl font-bold text-white">Login Staff / Admin</h2>
          <p className="text-xs text-zinc-400 mt-1 text-center">
            Gunakan email organisasi Anda untuk masuk ke sistem manajemen.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-300">Email Internal</label>
            <input
              type="email"
              placeholder="staff@berlian.com"
              {...register("email")}
              className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all ${
                errors.email ? "border-rose-500" : "border-zinc-850"
              }`}
            />
            {errors.email && (
              <span className="text-[10px] text-rose-500 font-semibold">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-300">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                {...register("password")}
                className={`w-full bg-zinc-900 border rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all ${
                  errors.password ? "border-rose-500" : "border-zinc-850"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-zinc-400 hover:text-white transition-colors"
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
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 mt-2 hover:scale-[1.01]"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Masuk Sistem
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500">
          Nasabah Setia?{" "}
          <Link href="/login" className="text-emerald-500 hover:underline font-semibold">
            Masuk Portal Nasabah
          </Link>
        </div>
      </div>
    </div>
  );
}
