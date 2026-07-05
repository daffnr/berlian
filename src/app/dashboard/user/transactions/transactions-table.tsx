"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, History } from "lucide-react";

interface TransactionItem {
  id: string;
  date: string;
  customerName: string;
  customerId: string;
  wasteTypeName: string;
  estimatedWeight: number;
  weight: number;
  pricePerKg: number;
  totalPrice: number;
  pointsEarned: number;
  staffName: string;
  status: string;
}

interface TransactionsTableProps {
  data: TransactionItem[];
}

export function TransactionsTable({ data }: TransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data berdasarkan pencarian
  const filteredData = data.filter(
    (item) =>
      item.wasteTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.staffName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset page ke 1
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari jenis sampah atau petugas..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-black dark:text-zinc-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-700"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-850">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-550 uppercase tracking-wider dark:border-zinc-850 dark:bg-zinc-900/50 dark:text-zinc-400">
              <th className="p-4">Tanggal & Waktu</th>
              <th className="p-4">ID & Nasabah</th>
              <th className="p-4">Jenis Sampah</th>
              <th className="p-4 text-right">Estimasi</th>
              <th className="p-4 text-right">Timbangan Aktual</th>
              <th className="p-4 text-right">Harga/kg</th>
              <th className="p-4 text-right">Total Transaksi</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Diproses Oleh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition-colors text-xs">
                <td className="p-4 font-medium text-slate-700 dark:text-zinc-300">
                  <div className="flex flex-col">
                    <span>
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.date).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} WIB
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">{item.customerName}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{item.customerId}</span>
                  </div>
                </td>
                <td className="p-4 font-bold">{item.wasteTypeName}</td>
                <td className="p-4 text-right font-medium text-slate-500 dark:text-zinc-400">{item.estimatedWeight} kg</td>
                <td className="p-4 text-right font-extrabold text-slate-900 dark:text-white">{item.weight} kg</td>
                <td className="p-4 text-right text-slate-550 dark:text-zinc-400">
                  Rp{item.pricePerKg.toLocaleString("id-ID")}
                </td>
                <td className="p-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                  Rp{item.totalPrice.toLocaleString("id-ID")}
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-0.5 rounded-full border text-[9px] font-bold bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900">
                    Selesai
                  </span>
                </td>
                <td className="p-4 text-slate-655 dark:text-zinc-400 font-medium">{item.staffName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <History className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-xs">Tidak ada transaksi setoran yang cocok.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-zinc-400">
          <span>
            Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
            {filteredData.length} transaksi
          </span>

          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex items-center px-3 font-semibold border rounded-lg bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
