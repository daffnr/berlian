"use client";

import React, { useState } from "react";
import { verifyPickupRequest, assignPickupRequest, completePickupRequest } from "@/lib/actions/pickups";
import { useToast } from "@/components/ui/toast";
import { Clock, MapPin, Truck, CheckCircle2, User, HelpCircle, ShieldAlert } from "lucide-react";

interface PickupItem {
  id: string;
  userId: string;
  estimatedWeight: number;
  description: string | null;
  status: "PENDING" | "VERIFIED" | "ASSIGNED" | "PICKED_UP" | "COMPLETED" | "CANCELLED";
  address: string;
  imageUrl?: string | null;
  createdAt: Date;
  scheduledAt?: Date | null;
  completedAt?: Date | null;
  user?: { name: string; phone: string | null };
  wasteType?: { name: string };
  staff?: { name: string } | null;
  // Fallbacks untuk dummy data structure
  userName?: string;
  wasteTypeName?: string;
  staffName?: string;
}

interface PickupsClientProps {
  pickups: PickupItem[];
  staffMembers: { id: string; name: string }[];
  adminId: string;
}

export function PickupsClient({ pickups, staffMembers, adminId }: PickupsClientProps) {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [assigningStaffMap, setAssigningStaffMap] = useState<Record<string, string>>({});
  const [isMutating, setIsMutating] = useState<Record<string, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [weighingId, setWeighingId] = useState<string | null>(null);
  const [actualWeight, setActualWeight] = useState<string>("");

  const handleWhatsAppRedirect = (p: PickupItem) => {
    const rawPhone = p.user?.phone || "";
    if (!rawPhone) {
      toast({
        title: "Nomor Kosong",
        description: "Nasabah ini tidak mendaftarkan nomor telepon.",
        type: "error",
      });
      return;
    }

    let formattedPhone = rawPhone.replace(/[^0-9]/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    }

    const wasteName = p.wasteType?.name || p.wasteTypeName || "Sampah Terpilah";
    const weight = p.estimatedWeight;
    const name = p.user?.name || p.userName || "Nasabah";
    const address = p.address;

    const message = `Halo ${name},\n\nKami dari *Bank Sampah BERLIAN* ingin mengonfirmasi jadwal penjemputan sampah Anda:\n- *Jenis*: ${wasteName}\n- *Estimasi Berat*: ${weight} kg\n- *Alamat*: ${address}\n\nMohon kabari kami jika lokasi dan jadwal sudah sesuai. Terima kasih! 🙏😊`;

    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  const handleWeighComplete = async (id: string) => {
    const weightNum = parseFloat(actualWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      toast({
        title: "Berat Tidak Valid",
        description: "Silakan masukkan berat timbangan yang valid (lebih dari 0 kg).",
        type: "error",
      });
      return;
    }

    setIsMutating((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await completePickupRequest(id, weightNum, adminId);
      if (res.success) {
        toast({
          title: "Timbangan Tersimpan",
          description: `Berhasil mencatat timbangan ${weightNum}kg. Transaksi selesai dan saldo nasabah telah diperbarui.`,
          type: "success",
        });
        setWeighingId(null);
        setActualWeight("");
      }
    } catch (err: any) {
      toast({
        title: "Gagal Menyimpan",
        description: err.message || "Gagal menyimpan timbangan.",
        type: "error",
      });
    } finally {
      setIsMutating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredPickups = pickups.filter(
    (p) => statusFilter === "ALL" || p.status === statusFilter
  );

  const handleVerify = async (id: string) => {
    setIsMutating((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await verifyPickupRequest(id);
      if (res.success) {
        toast({
          title: "Request Diverifikasi",
          description: "Status diubah ke VERIFIED. Silakan tugaskan petugas penjemput.",
          type: "success",
        });
      }
    } catch (err: any) {
      toast({
        title: "Gagal Verifikasi",
        description: err.message || "Gagal memverifikasi request.",
        type: "error",
      });
    } finally {
      setIsMutating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAssign = async (id: string) => {
    const staffId = assigningStaffMap[id];
    if (!staffId) {
      toast({
        title: "Pilih Staff",
        description: "Silakan pilih petugas staff terlebih dahulu.",
        type: "error",
      });
      return;
    }

    setIsMutating((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await assignPickupRequest(id, staffId);
      if (res.success) {
        toast({
          title: "Petugas Ditugaskan",
          description: "Staff penjemput berhasil dipilih dan dijadwalkan.",
          type: "success",
        });
      }
    } catch (err: any) {
      toast({
        title: "Gagal Menugaskan",
        description: err.message || "Gagal menugaskan staff.",
        type: "error",
      });
    } finally {
      setIsMutating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "Menunggu Verifikasi";
      case "VERIFIED": return "Terverifikasi";
      case "ASSIGNED": return "Staff Ditugaskan";
      case "PICKED_UP": return "Sedang Dijemput";
      case "COMPLETED": return "Selesai";
      case "CANCELLED": return "Dibatalkan";
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-50 text-yellow-800 border-yellow-250 dark:bg-yellow-950/20 dark:text-yellow-400";
      case "VERIFIED": return "bg-blue-50 text-blue-800 border-blue-250 dark:bg-blue-950/20 dark:text-blue-400";
      case "ASSIGNED": return "bg-indigo-50 text-indigo-800 border-indigo-250 dark:bg-indigo-950/20 dark:text-indigo-400";
      case "COMPLETED": return "bg-emerald-50 text-emerald-800 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400";
      case "CANCELLED":
      default:
        return "bg-rose-50 text-rose-800 border-rose-250 dark:bg-rose-950/20 dark:text-rose-400";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap text-xs font-semibold bg-slate-50 dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-100 dark:border-zinc-800 w-fit">
        {["ALL", "PENDING", "VERIFIED", "ASSIGNED", "COMPLETED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === status
                ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-slate-550 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            {status === "ALL" ? "Semua" : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPickups.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 shadow-sm hover:shadow-md transition-all dark:border-zinc-850 dark:bg-zinc-900/10 flex flex-col gap-4 text-xs"
          >
            {/* Header info */}
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-slate-200 dark:bg-zinc-800 p-1.5">
                  <User className="h-4 w-4 text-slate-600 dark:text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                    {p.user?.name || p.userName}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-slate-550 dark:text-zinc-400">
                      Telp: {p.user?.phone || "Tidak ada nomor"}
                    </span>
                    {(p.user?.phone || p.userName) && (
                      <button
                        onClick={() => handleWhatsAppRedirect(p)}
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        💬 Hubungi WA
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${getStatusStyle(p.status)}`}>
                {getStatusLabel(p.status)}
              </span>
            </div>

            {/* Request Details */}
            <div className="flex flex-col gap-1.5 text-slate-655 dark:text-zinc-350 bg-white dark:bg-zinc-950/20 p-3 rounded-xl border border-slate-100 dark:border-zinc-850">
              <div className="flex justify-between items-center font-bold text-slate-800 dark:text-zinc-200 border-b border-slate-50 dark:border-zinc-850 pb-1.5">
                <span>{p.wasteType?.name || p.wasteTypeName}</span>
                <span>Estimasi: {p.estimatedWeight} kg</span>
              </div>
              
              <div className="flex items-start gap-1.5 mt-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span>{p.address}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span>
                  Diajukan: {new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {p.description && (
                <div className="mt-1.5 text-[10px] bg-slate-50 dark:bg-zinc-800/40 p-2 rounded-lg italic">
                  &ldquo;{p.description}&rdquo;
                </div>
              )}

              {p.imageUrl && (
                <div className="mt-2.5">
                  <span className="text-[10px] font-bold text-slate-550 dark:text-zinc-400 block mb-1">Foto Sampah:</span>
                  <div 
                    onClick={() => setSelectedImage(p.imageUrl || null)}
                    className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-100 dark:border-zinc-800 cursor-zoom-in group shadow-sm bg-slate-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt="Foto Sampah" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                  </div>
                </div>
              )}
            </div>

            {/* Action panel */}
            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between gap-4">
              {weighingId === p.id ? (
                <div className="flex flex-col gap-2 w-full p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-slate-700 dark:text-zinc-350">Input Berat Timbangan (kg)</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Masukkan berat aktual (kg)..."
                      value={actualWeight}
                      onChange={(e) => setActualWeight(e.target.value)}
                      className="bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none w-full"
                    />
                    <button
                      onClick={() => handleWeighComplete(p.id)}
                      disabled={isMutating[p.id]}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-xl transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50 text-[10px] shrink-0 cursor-pointer"
                    >
                      {isMutating[p.id] ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      onClick={() => {
                        setWeighingId(null);
                        setActualWeight("");
                      }}
                      className="bg-slate-200 hover:bg-slate-350 dark:bg-zinc-800 dark:text-zinc-300 text-slate-700 font-semibold py-1.5 px-3 rounded-xl transition-all text-[10px] shrink-0 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Status PENDING Action */}
                  {p.status === "PENDING" && (
                    <button
                      onClick={() => handleVerify(p.id)}
                      disabled={isMutating[p.id]}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50 ml-auto cursor-pointer"
                    >
                      {isMutating[p.id] ? "Memverifikasi..." : "Verifikasi Kelayakan"}
                    </button>
                  )}

                  {/* Status VERIFIED Action */}
                  {p.status === "VERIFIED" && (
                    <div className="flex items-center gap-3 w-full justify-between flex-wrap">
                      <button
                        onClick={() => {
                          setWeighingId(p.id);
                          setActualWeight("");
                        }}
                        className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl transition-all shadow-md shadow-emerald-500/10 text-xs cursor-pointer hover:scale-[1.02]"
                      >
                        ⚖️ Timbang Langsung
                      </button>
                      <div className="flex items-center gap-2 ml-auto">
                        <select
                          value={assigningStaffMap[p.id] || ""}
                          onChange={(e) =>
                            setAssigningStaffMap((prev) => ({ ...prev, [p.id]: e.target.value }))
                          }
                          className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                        >
                          <option value="">Pilih Petugas...</option>
                          {staffMembers.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(p.id)}
                          disabled={isMutating[p.id]}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3.5 rounded-xl transition-all shadow-md shadow-blue-500/10 disabled:opacity-50 cursor-pointer"
                        >
                          {isMutating[p.id] ? "Menugaskan..." : "Tugaskan"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status ASSIGNED Action */}
                  {p.status === "ASSIGNED" && (
                    <div className="flex items-center gap-2 w-full justify-between flex-wrap">
                      <div className="flex items-center gap-1.5 text-blue-600 font-semibold dark:text-blue-400">
                        <Truck className="h-4 w-4" />
                        <span>Petugas: {p.staff?.name || p.staffName}</span>
                      </div>
                      <button
                        onClick={() => {
                          setWeighingId(p.id);
                          setActualWeight("");
                        }}
                        className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl transition-all shadow-md shadow-emerald-500/10 text-xs cursor-pointer ml-auto hover:scale-[1.02]"
                      >
                        ⚖️ Selesaikan Timbangan
                      </button>
                    </div>
                  )}

                  {p.status === "COMPLETED" && (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold ml-auto">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                      <span>Jemput & Timbang Selesai</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {filteredPickups.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-450">
            <HelpCircle className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-xs">Tidak ada data request penjemputan dalam kategori ini.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out" 
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-2xl max-h-[80vh] bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Foto Sampah Besar" className="max-w-full max-h-[75vh] object-contain rounded-xl" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-950 text-white rounded-full p-2 text-xs font-bold transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
