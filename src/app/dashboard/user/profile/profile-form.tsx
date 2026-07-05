"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfile } from "@/lib/actions/users";
import { useToast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";
import { Loader2, Camera, Eye, EyeOff, Save } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
  password: z.string().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialUser: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    avatarUrl: string;
  };
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const { toast } = useToast();
  const { update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(
    initialUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${initialUser.name}`
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialUser.name,
      phone: initialUser.phone,
      address: initialUser.address,
      password: "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran foto maksimal 2MB.",
          type: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        toast({
          title: "Foto Terunggah",
          description: "Simulasi UploadThing: Foto diunggah dalam memori.",
          type: "info",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const payload: any = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        avatarUrl: avatarPreview, // Menyimpan base64 data url
      };

      if (data.password && data.password.length >= 6) {
        payload.password = data.password;
      } else if (data.password && data.password.length < 6) {
        toast({
          title: "Validasi Gagal",
          description: "Password baru minimal 6 karakter.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      const res = await updateProfile(initialUser.id, payload);

      if (res.success) {
        // Update Session NextAuth client agar nama di sidebar berubah langsung
        await updateSession({ name: data.name });

        toast({
          title: "Profil Diperbarui",
          description: "Perubahan profil Anda berhasil disimpan.",
          type: "success",
        });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Pembaruan Gagal",
        description: err.message || "Gagal memperbarui profil.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Upload Foto Profil (Mock UploadThing) */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-24 w-24 rounded-full border-2 border-emerald-500 overflow-hidden bg-slate-100 group shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarPreview}
            alt={initialUser.name}
            className="h-full w-full object-cover"
          />
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-5 w-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
          Klik foto untuk mengunggah (Maks. 2MB)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email (Read Only) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Email (Tetap)</label>
          <input
            type="email"
            value={initialUser.email}
            disabled
            className="w-full bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm text-slate-550 dark:text-zinc-400 cursor-not-allowed"
          />
        </div>

        {/* Nama Lengkap */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Nama Lengkap</label>
          <input
            type="text"
            {...register("name")}
            className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
              errors.name ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
            }`}
          />
          {errors.name && (
            <span className="text-[10px] text-rose-500 font-semibold">{errors.name.message}</span>
          )}
        </div>

        {/* Nomor Telepon */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Nomor Telepon</label>
          <input
            type="text"
            {...register("phone")}
            className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all ${
              errors.phone ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
            }`}
          />
          {errors.phone && (
            <span className="text-[10px] text-rose-500 font-semibold">{errors.phone.message}</span>
          )}
        </div>

        {/* Kata Sandi Baru */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Kata Sandi Baru (Opsional)</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Kosongkan jika tidak ingin diubah"
              {...register("password")}
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Alamat Lengkap */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Alamat Lengkap Jemput</label>
        <textarea
          rows={3}
          {...register("address")}
          className={`w-full bg-slate-50 dark:bg-zinc-800 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all resize-none ${
            errors.address ? "border-rose-500" : "border-slate-200 dark:border-zinc-700"
          }`}
        />
        {errors.address && (
          <span className="text-[10px] text-rose-500 font-semibold">{errors.address.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full md:w-fit md:px-6 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 mt-2 hover:scale-[1.01]"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Simpan Perubahan
            <Save className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
