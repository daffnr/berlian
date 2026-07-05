import React from "react";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/users";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function UserProfilePage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id as string;
  const user = await getUserById(userId);

  if (!user) {
    redirect("/login");
  }

  // Format initial values
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    avatarUrl: user.avatarUrl || "",
  };

  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Pengaturan Profil</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Ubah data akun, kontak telepon, alamat penjemputan, atau kata sandi Anda.
        </p>
      </div>

      <ProfileForm initialUser={userData} />
    </div>
  );
}
