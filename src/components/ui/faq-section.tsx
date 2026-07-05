"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Bagaimana cara mencairkan saldo tabungan sampah?",
    answer:
      "Saldo tabungan sampah Anda terakumulasi secara otomatis di dashboard. Pencairan dapat dilakukan secara tunai melalui kantor cabang Bank Sampah BERLIAN terdekat, atau ditarik non-tunai (transfer bank/e-wallet) dengan berkoordinasi bersama Admin/Super Admin.",
  },
  {
    question: "Apakah ada batasan minimum berat sampah untuk penjemputan?",
    answer:
      "Ya, untuk mengefisienkan operasional armada penjemput Budi, minimum berat sampah sekali request penjemputan adalah 5 kg. Jika berat sampah Anda kurang dari itu, Anda dapat menyetorkannya langsung secara mandiri ke cabang terdekat.",
  },
  {
    question: "Jenis sampah plastik apa saja yang diterima saat ini?",
    answer:
      "Saat ini kami berfokus pada dua jenis sampah plastik bernilai tinggi: Botol Plastik bekas minuman (PET/PETE) dan Gelas Plastik cup bekas (PP/PS). Pastikan sampah diserahkan dalam keadaan bersih dari sisa cairan dan telah terpilah.",
  },
  {
    question: "Berapa lama waktu tunggu dari request hingga penjemputan?",
    answer:
      "Setelah mengajukan request penjemputan di dashboard nasabah, Admin akan memverifikasi request Anda dalam waktu maksimal 12 jam dan menugaskan Staff Penjemput. Penjemputan biasanya dijadwalkan keesokan harinya.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="flex flex-col gap-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <button
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-800 dark:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900/30 transition-colors"
            >
              <span>{faq.question}</span>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
              )}
            </button>
            
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-40 border-t border-slate-50 dark:border-zinc-800" : "max-h-0"
              }`}
            >
              <p className="p-5 text-xs sm:text-sm text-slate-550 dark:text-zinc-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
