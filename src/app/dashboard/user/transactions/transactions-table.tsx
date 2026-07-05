"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, History } from "lucide-react";

interface TransactionItem {
  id: string;
  date: string;
  wasteTypeName: string;
  weight: number;
  pricePerKg: number;
  totalPrice: number;
  pointsEarned: number;
  staffName: string;
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
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-850">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-550 uppercase tracking-wider dark:border-zinc-850 dark:bg-zinc-900/50 dark:text-zinc-400">
              <th className="p-4">Tanggal</th>
              <th className="p-4">Jenis Sampah</th>
              <th className="p-4 text-right">Berat</th>
              <th className="p-4 text-right">Harga/kg</th>
              <th className="p-4 text-right">Total Pendapatan</th>
              <th className="p-4 text-right">Poin</th>
              <th className="p-4">Petugas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                <td className="p-4 font-medium text-slate-700 dark:text-zinc-300">
                  {new Date(item.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4 font-bold">{item.wasteTypeName}</td>
                <td className="p-4 text-right font-semibold">{item.weight} kg</td>
                <td className="p-4 text-right text-slate-500 dark:text-zinc-400">
                  Rp{item.pricePerKg.toLocaleString("id-ID")}
                </td>
                <td className="p-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                  Rp{item.totalPrice.toLocaleString("id-ID")}
                </td>
                <td className="p-4 text-right font-semibold text-yellow-600 dark:text-yellow-400">
                  +{item.pointsEarned} Poin
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
