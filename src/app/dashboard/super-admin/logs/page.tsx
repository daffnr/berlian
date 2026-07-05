import React from "react";
import { auth } from "@/auth";
import { getActivityLogs } from "@/lib/actions/waste";
import { Activity, ShieldAlert, Clock, Info } from "lucide-react";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function SuperAdminLogsPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/internal/login");
  }

  const logs = await getActivityLogs();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Log Aktivitas & Audit Trail</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Tinjau seluruh rekaman aksi sensitif yang terjadi di sistem manajemen Bank Sampah BERLIAN.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
        {logs.map((log: any) => (
          <div
            key={log.id}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-900/10 flex flex-col sm:flex-row justify-between gap-4 text-xs"
          >
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-850 dark:text-white">
                  {log.user?.name || "System Autopilot"}
                </span>
                <span className="px-2 py-0.5 rounded-full border text-[8px] font-extrabold tracking-wider bg-purple-50 text-purple-800 border-purple-200 uppercase">
                  {log.user?.role || "SYSTEM"}
                </span>
                <span className="px-2 py-0.5 rounded-full border text-[8px] font-bold bg-zinc-150 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 uppercase tracking-wider">
                  {log.action}
                </span>
              </div>
              <p className="text-slate-655 dark:text-zinc-400 font-medium">{log.details}</p>
            </div>

            <div className="flex flex-col justify-between sm:items-end shrink-0 text-slate-450 dark:text-zinc-500 text-[10px]">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {new Date(log.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              <span className="font-semibold mt-1">IP: {log.ipAddress || "127.0.0.1"}</span>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-16 text-slate-400 border border-dashed border-slate-100 rounded-xl">
            <ShieldAlert className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm">Belum ada log aktivitas terekam.</p>
          </div>
        )}
      </div>
    </div>
  );
}
