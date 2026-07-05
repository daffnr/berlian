import React from "react";
import { auth } from "@/auth";
import { getUsers } from "@/lib/actions/users";
import { UsersClient } from "./users-client";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const currentUserRole = (session.user as any).role;
  const users = await getUsers();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Manajemen Pengguna</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Kelola nasabah, staff lapangan, dan akun administrator.
          {currentUserRole === "SUPER_ADMIN" && " Anda memiliki akses Super Admin untuk mereset sandi dan memblokir akun."}
        </p>
      </div>

      <UsersClient users={users} currentUserRole={currentUserRole} />
    </div>
  );
}
