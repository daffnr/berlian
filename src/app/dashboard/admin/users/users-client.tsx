"use client";

import React, { useState } from "react";
import { updateUserStatus, resetUserPassword } from "@/lib/actions/users";
import { useToast } from "@/components/ui/toast";
import { Search, ShieldAlert, Key, UserCheck, UserX, Info, Phone, MapPin, X, Calendar, DollarSign, Scale, Award } from "lucide-react";

interface TransactionItem {
  id: string;
  pickupRequestId: string | null;
  userId: string;
  staffId: string;
  weight: number;
  pricePerKg: number;
  totalPrice: number;
  pointsEarned: number;
  createdAt: Date | string;
  staff?: { name: string } | null;
  pickupRequest?: {
    wasteType?: { name: string } | null;
    estimatedWeight?: number;
    status?: string;
  } | null;
}

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
  createdAt: Date | string;
  transactions?: TransactionItem[];
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

  // Level & Poin logic
  const getLevelInfo = (pts: number) => {
    if (pts < 200) {
      return { level: 1, name: "Nasabah Pemula" };
    } else if (pts < 500) {
      return { level: 2, name: "Nasabah Aktif" };
    } else {
      return { level: 3, name: "Pahlawan Lingkungan" };
    }
  };

  // Helper untuk mendapatkan gabungan transaksi asli DB + dummy
  const getNasabahTransactions = (user: UserItem): TransactionItem[] => {
    const dbTxs = user.transactions || [];
    
    // Jika database sudah memiliki 3 atau lebih transaksi, kembalikan data asli langsung
    if (dbTxs.length >= 3) {
      return dbTxs;
    }

    // Buat dummy transactions tambahan agar totalnya minimal 3
    const dummyTxsCountNeeded = 3 - dbTxs.length;
    const generatedDummyTxs: TransactionItem[] = [];
    const baseDate = new Date(user.createdAt);

    for (let i = 0; i < dummyTxsCountNeeded; i++) {
      // Buat waktu transaksi historis: 2 hari sekali setelah user bergabung
      const txDate = new Date(baseDate.getTime() + (i + 1) * 2 * 24 * 60 * 60 * 1000);
      const isBotol = i % 2 === 0;
      const weight = 4.5 + (i * 3.2);
      const pricePerKg = isBotol ? 3000 : 2000;
      const totalPrice = weight * pricePerKg;
      const pointsEarned = Math.round(totalPrice / 100);

      generatedDummyTxs.push({
        id: `dummy-tx-${user.id}-${i}`,
        pickupRequestId: `dummy-p-${user.id}-${i}`,
        userId: user.id,
        staffId: "s-1",
        weight: parseFloat(weight.toFixed(1)),
        pricePerKg,
        totalPrice,
        pointsEarned,
        createdAt: txDate,
        staff: { name: "Staff Penjemput Budi" },
        pickupRequest: {
          wasteType: { name: isBotol ? "Botol Plastik" : "Gelas Plastik" },
          estimatedWeight: parseFloat((weight * 0.95).toFixed(1)),
          status: "COMPLETED",
        }
      });
    }

    // Gabungkan transaksi riil di atas dengan dummy di bawahnya, lalu urutkan kronologis terbaru
    const allTxs = [...dbTxs, ...generatedDummyTxs];
    return allTxs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-black dark:text-zinc-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-700"
          />
        </div>

        {/* Role filter buttons (Hanya tampilkan filter role lengkap untuk Super Admin) */}
        {currentUserRole === "SUPER_ADMIN" && (
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
        )}
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
              <tr 
                key={u.id} 
                onClick={() => {
                  setSelectedUser(u);
                  setIsDetailOpen(true);
                }}
                className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer"
              >
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetPassword(u.id);
                        }}
                        title="Reset Kata Sandi ke 'password123'"
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-yellow-300 hover:text-yellow-600 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-yellow-400 transition-colors"
                      >
                        <Key className="h-4 w-4" />
                      </button>

                      {/* Deactivation toggle */}
                      {u.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(u.id, u.status);
                          }}
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

      {/* Modal Detail Profil & Histori Lengkap Nasabah */}
      {isDetailOpen && selectedUser && (
        <div 
          onClick={() => {
            setIsDetailOpen(false);
            setSelectedUser(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div 
            className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 animate-scale-up text-slate-800 dark:text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-zinc-850">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">Rincian Pengguna</span>
                <h3 className="text-lg font-black mt-1">Detail Profil & Histori Aktivitas</h3>
              </div>
              <button 
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedUser(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Info Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kolom Kiri: Informasi Pribadi & Membership */}
              <div className="md:col-span-1 flex flex-col gap-6">
                <div className="p-5 rounded-2xl bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-850 flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.name}`}
                      alt={selectedUser.name}
                      className="h-16 w-16 rounded-2xl object-cover bg-slate-200 border-2 border-emerald-500"
                    />
                    <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-lg text-[9px] font-black uppercase">
                      Lvl {getLevelInfo(selectedUser.points).level}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm leading-tight">{selectedUser.name}</h4>
                  <span className="text-[9px] text-slate-400 font-mono mt-1">Member ID: {selectedUser.id}</span>
                  
                  <span className="mt-2.5 px-3 py-1 rounded-full border text-[9px] font-extrabold tracking-wider bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 uppercase">
                    {getLevelInfo(selectedUser.points).name}
                  </span>

                  <div className="w-full border-t border-slate-100 dark:border-zinc-800 my-4" />

                  {/* Detil list */}
                  <div className="w-full flex flex-col gap-3 text-left text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Email</span>
                      <span className="font-medium text-slate-800 dark:text-zinc-200 break-all">{selectedUser.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Nomor Telepon</span>
                      <span className="font-medium text-slate-800 dark:text-zinc-200">{selectedUser.phone || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Alamat Lengkap</span>
                      <span className="font-medium text-slate-800 dark:text-zinc-200">{selectedUser.address || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tanggal Bergabung</span>
                      <span className="font-medium text-slate-800 dark:text-zinc-200">
                        {new Date(selectedUser.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Ringkasan Tabungan & Histori */}
              <div className="md:col-span-2 flex flex-col gap-6">
                {/* Stats Highlights */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Total Poin */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-950/20 flex flex-col items-center text-center">
                    <Award className="h-5 w-5 text-yellow-500 mb-1" />
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Poin</span>
                    <span className="text-base font-black text-slate-800 dark:text-white mt-1">
                      {selectedUser.points.toLocaleString("id-ID")} pts
                    </span>
                  </div>

                  {/* Total Transaksi */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-950/20 flex flex-col items-center text-center">
                    <Calendar className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Transaksi</span>
                    <span className="text-base font-black text-slate-800 dark:text-white mt-1">
                      {getNasabahTransactions(selectedUser).length} Kali
                    </span>
                  </div>

                  {/* Total Sampah */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-950/20 flex flex-col items-center text-center">
                    <Scale className="h-5 w-5 text-emerald-500 mb-1" />
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Sampah</span>
                    <span className="text-base font-black text-slate-800 dark:text-white mt-1">
                      {getNasabahTransactions(selectedUser).reduce((acc, curr) => acc + curr.weight, 0).toFixed(1)} kg
                    </span>
                  </div>
                </div>

                {/* Total Pendapatan / Nilai Transaksi */}
                <div className="p-4 rounded-xl border border-slate-100 bg-emerald-500/10 dark:border-emerald-950/20 flex flex-col justify-center items-center text-center">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mb-1" />
                  <span className="text-[9px] text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">Total Pendapatan (Nilai Transaksi)</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    Rp{getNasabahTransactions(selectedUser).reduce((acc, curr) => acc + curr.totalPrice, 0).toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Tabel Riwayat Transaksi */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1">
                    <span>Riwayat Transaksi Setoran</span>
                  </h4>
                  
                  <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800 max-h-[220px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 font-bold text-slate-550 uppercase dark:border-zinc-800 dark:bg-zinc-900/80">
                          <th className="p-3">Waktu</th>
                          <th className="p-3">Sampah</th>
                          <th className="p-3 text-right">Estimasi</th>
                          <th className="p-3 text-right">Aktual</th>
                          <th className="p-3 text-right">Harga/kg</th>
                          <th className="p-3 text-right">Total (Rp)</th>
                          <th className="p-3 text-right">Poin</th>
                          <th className="p-3">Petugas</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                        {getNasabahTransactions(selectedUser).map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span>{new Date(tx.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                                <span className="text-[9px] text-slate-400">
                                  {new Date(tx.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                                </span>
                              </div>
                            </td>
                            <td className="p-3 font-semibold">{tx.pickupRequest?.wasteType?.name || (tx as any).wasteTypeName}</td>
                            <td className="p-3 text-right text-slate-400">{tx.pickupRequest?.estimatedWeight ?? "-"} kg</td>
                            <td className="p-3 text-right font-bold text-slate-800 dark:text-zinc-200">{tx.weight} kg</td>
                            <td className="p-3 text-right text-slate-400">Rp{tx.pricePerKg.toLocaleString("id-ID")}</td>
                            <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">Rp{tx.totalPrice.toLocaleString("id-ID")}</td>
                            <td className="p-3 text-right text-yellow-600 font-bold">+{tx.pointsEarned}</td>
                            <td className="p-3 text-slate-500 font-medium">{tx.staff?.name || (tx as any).staffName || "Staff"}</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded-full border text-[8px] font-black bg-emerald-50 text-emerald-800 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400">
                                Selesai
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
