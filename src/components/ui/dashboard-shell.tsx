"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Recycle,
  User,
  History,
  MapPin,
  Calendar,
  ClipboardList,
  Users,
  Settings,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  FileText
} from "lucide-react";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: "USER" | "STAFF" | "ADMIN" | "SUPER_ADMIN";
    avatarUrl?: string;
  };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Navigasi link berdasarkan Role
  const getLinks = (): SidebarLink[] => {
    switch (user.role) {
      case "SUPER_ADMIN":
        return [
          { label: "Overview", href: "/dashboard/super-admin", icon: LayoutDashboard },
          { label: "Kelola Admin/Staff", href: "/dashboard/super-admin/admins", icon: ShieldCheck },
          { label: "Kelola Nasabah", href: "/dashboard/admin/users", icon: Users },
          { label: "Kelola Penjemputan", href: "/dashboard/admin/pickups", icon: ClipboardList },
          { label: "Jenis & Harga Sampah", href: "/dashboard/admin/waste-types", icon: Recycle },
          { label: "Lokasi Bank Sampah", href: "/dashboard/admin/locations", icon: MapPin },
          { label: "Log Aktivitas", href: "/dashboard/super-admin/logs", icon: Activity },
          { label: "Konfigurasi Sistem", href: "/dashboard/super-admin/settings", icon: Settings },
        ];
      case "ADMIN":
        return [
          { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
          { label: "Kelola Nasabah", href: "/dashboard/admin/users", icon: Users },
          { label: "Kelola Penjemputan", href: "/dashboard/admin/pickups", icon: ClipboardList },
          { label: "Jenis & Harga Sampah", href: "/dashboard/admin/waste-types", icon: Recycle },
          { label: "Lokasi Bank Sampah", href: "/dashboard/admin/locations", icon: MapPin },
        ];
      case "STAFF":
        return [
          { label: "Daftar Tugas", href: "/dashboard/staff", icon: ClipboardList },
        ];
      case "USER":
      default:
        return [
          { label: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
          { label: "Jemput Sampah", href: "/dashboard/user/pickup", icon: Calendar },
          { label: "Riwayat Setoran", href: "/dashboard/user/transactions", icon: History },
          { label: "Peta Lokasi", href: "/dashboard/user/locations", icon: MapPin },
          { label: "Profil Saya", href: "/dashboard/user/profile", icon: User },
        ];
    }
  };

  const links = getLinks();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  // Tentukan warna tema berdasarkan role
  const getRoleTheme = () => {
    switch (user.role) {
      case "SUPER_ADMIN":
        return {
          bg: "bg-purple-650",
          text: "text-purple-600 dark:text-purple-400",
          border: "border-purple-100 dark:border-purple-900/50",
          accent: "hover:bg-purple-50 hover:text-purple-900 dark:hover:bg-purple-950/20 dark:hover:text-purple-100",
          active: "bg-purple-600 text-white shadow-md shadow-purple-500/20 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800 border-transparent",
        };
      case "ADMIN":
        return {
          bg: "bg-indigo-650",
          text: "text-indigo-600 dark:text-indigo-400",
          border: "border-indigo-100 dark:border-indigo-900/50",
          accent: "hover:bg-indigo-50 hover:text-indigo-900 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-100",
          active: "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800 border-transparent",
        };
      case "STAFF":
        return {
          bg: "bg-blue-650",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-100 dark:border-blue-900/50",
          accent: "hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-blue-950/20 dark:hover:text-blue-100",
          active: "bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800 border-transparent",
        };
      case "USER":
      default:
        return {
          bg: "bg-emerald-650",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-100 dark:border-emerald-900/50",
          accent: "hover:bg-emerald-50 hover:text-emerald-900 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-100",
          active: "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800 border-transparent",
        };
    }
  };

  const theme = getRoleTheme();

  const getRoleLabel = () => {
    switch (user.role) {
      case "SUPER_ADMIN": return "Super Admin";
      case "ADMIN": return "Admin Cabang";
      case "STAFF": return "Staff Armada";
      case "USER": return "Nasabah";
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-slate-100 dark:border-zinc-800 w-64">
      {/* Brand Header */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-100 dark:border-zinc-800 shrink-0">
        <div className="rounded-lg bg-emerald-600 p-1.5 text-white">
          <Recycle className="h-5 w-5" />
        </div>
        <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">
          BERLIAN<span className="text-emerald-600">V2</span>
        </span>
      </div>

      {/* User Card */}
      <div className="p-4 border-b border-slate-100 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-zinc-950/40 rounded-xl border border-slate-100 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
            className="h-10 w-10 rounded-lg object-cover bg-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs truncate text-slate-800 dark:text-white">{user.name}</h4>
            <span className={`inline-block text-[9px] font-bold uppercase tracking-wider mt-0.5 ${theme.text}`}>
              {getRoleLabel()}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                isActive ? theme.active : `border-transparent text-slate-650 hover:border-slate-100 dark:text-zinc-400 ${theme.accent}`
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-zinc-800 shrink-0">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-900 border border-transparent dark:text-rose-450 dark:hover:bg-rose-950/20 dark:hover:text-rose-100 transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar header */}
        <header className="h-16 border-b border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-extrabold text-sm sm:text-base capitalize tracking-tight text-slate-800 dark:text-white">
              {pathname.split("/").pop() === "user" ||
              pathname.split("/").pop() === "staff" ||
              pathname.split("/").pop() === "admin" ||
              pathname.split("/").pop() === "super-admin"
                ? "Overview Dashboard"
                : pathname.split("/").pop()?.replace(/-/g, " ")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-slate-100 text-slate-655 dark:bg-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {getRoleLabel()}
            </span>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
