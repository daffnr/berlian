import React from "react";
import { auth } from "@/auth";
import { getTransactionsByUserId } from "@/lib/actions/waste";
import { TransactionsTable } from "./transactions-table";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function UserTransactionsPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id as string;
  const transactions = await getTransactionsByUserId(userId);

  // Format data untuk mempermudah manipulasi client-side
  const formattedTxs = transactions.map((t: any) => ({
    id: t.id,
    date: t.createdAt.toISOString(),
    wasteTypeName: t.pickupRequest?.wasteType?.name || "Sampah Plastik",
    weight: t.weight,
    pricePerKg: t.pricePerKg,
    totalPrice: t.totalPrice,
    pointsEarned: t.pointsEarned,
    staffName: t.staff?.name || "Staff Lapangan",
  }));

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6">
        <h2 className="font-bold text-base text-slate-800 dark:text-white mb-1">Riwayat Setoran Sampah</h2>
        <p className="text-xs text-slate-550 dark:text-zinc-400">
          Cari dan tinjau seluruh transaksi timbangan dan histori kredit saldo Anda.
        </p>
      </div>

      <TransactionsTable data={formattedTxs} />
    </div>
  );
}
