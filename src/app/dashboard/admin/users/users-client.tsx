"use client";

import React, { useState } from "react";
import { updateUserStatus, resetUserPassword } from "@/lib/actions/users";
import { useToast } from "@/components/ui/toast";
import { Search, ShieldAlert, Key, UserCheck, UserX, Info, Phone, MapPin } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: "USER" | "STAFF" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE";
  balance: number;
  points: number;
  createdAt: Date;
}

interface UsersClientProps {
  users: UserItem[];
  currentUserRole: "USER" | "STAFF" | "ADMIN" | "SUPER_ADMIN";
}

export function UsersClient({ users, currentUserRole }: UsersClientProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filters
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleStatusToggle = async (userId: string, currentStatus: "ACTIVE" | "INACTIVE") => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await updateUserStatus(userId, nextStatus);
      if (res.success) {
        toast({
          title: "Status Diperbarui",
          description: `Pengguna berhasil di-${nextStatus === "ACTIVE" ? "aktifkan" : "nonaktifkan"}.`,
          type: "success",
        });
      }
    } catch (err: any) {
      toast({
        title: "Pembaruan Gagal",
        description: err.message || "Gagal mengubah status pengguna.",
        type: "error",
      });
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin mereset password pengguna ini menjadi 'password123'?")) {
      return;
    }
    try {
      const res = await resetUserPassword(userId);
      if (res.success) {
        toast({
          title: "Sandi Direset",
          description: "Kata sandi pengguna disetel ulang menjadi 'password123'.",
          type: "success",
        });
      }
    } catch (err: any) {
      toast({
        title: "Gagal Reset",
        description: err.message || "Gagal mereset kata sandi.",
        type: "error",
      });
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "Super Admin";
      case "ADMIN": return "Admin";
      case "STAFF": return "Staff";
      case "USER": return "Nasabah";
      default: return role;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400";
      case "ADMIN": return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400";
      case "STAFF": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400";
      case "USER":
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Role filter buttons */}
        <div className="flex gap-2 flex-wrap text-xs font-semibold bg-slate-50 dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-100 dark:border-zinc-800">
          {["ALL", "USER", "STAFF", "ADMIN", "SUPER_ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                roleFilter === role
                  ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {role === "ALL" ? "Semua" : getRoleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-850">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-550 uppercase tracking-wider dark:border-zinc-850 dark:bg-zinc-900/50 dark:text-zinc-400">
              <th className="p-4">Pengguna</th>
              <th className="p-4">Peran</th>
              <th className="p-4 text-right">Saldo</th>
              <th className="p-4 text-right">Poin</th>
              <th className="p-4">Status</th>
              {currentUserRole === "SUPER_ADMIN" && <th className="p-4 text-center">Aksi Super Admin</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                <td className="p-4 flex flex-col gap-0.5">
                  <span className="font-bold">{u.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">{u.email}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${getRoleBadgeStyle(u.role)}`}>
                    {getRoleLabel(u.role)}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-slate-700 dark:text-zinc-300">
                  Rp{u.balance.toLocaleString("id-ID")}
                </td>
                <td className="p-4 text-right font-semibold text-yellow-600 dark:text-yellow-400">
                  {u.points} pts
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 font-bold ${
                    u.status === "ACTIVE" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${u.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {u.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                  </span>
                </td>

                {currentUserRole === "SUPER_ADMIN" && (
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Password Reset */}
                      <button
                        onClick={() => handleResetPassword(u.id)}
                        title="Reset Kata Sandi ke 'password123'"
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-yellow-300 hover:text-yellow-600 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-yellow-400 transition-colors"
                      >
                        <Key className="h-4 w-4" />
                      </button>

                      {/* Deactivation toggle */}
                      {u.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={() => handleStatusToggle(u.id, u.status)}
                          title={u.status === "ACTIVE" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.status === "ACTIVE"
                              ? "border-slate-200 text-rose-500 hover:border-rose-300 hover:bg-rose-50 dark:border-zinc-700 dark:hover:bg-rose-950/20"
                              : "border-slate-200 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:hover:bg-emerald-950/20"
                          }`}
                        >
                          {u.status === "ACTIVE" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <ShieldAlert className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-xs">Tidak ada data pengguna yang cocok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
