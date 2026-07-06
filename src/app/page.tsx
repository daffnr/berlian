import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Award, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { getWasteTypes, getLocations } from "@/lib/actions/waste";
import { MapView } from "@/components/ui/map-view";
import { FAQSection } from "@/components/ui/faq-section";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const revalidate = 0; // Dynamic rendering

export default async function Home() {
  const wasteTypes = await getWasteTypes();
  const locations = await getLocations();

  // Dapatkan total statistik dummy
  const stats = [
    { label: "Nasabah Aktif", value: "1,200+" },
    { label: "Sampah Terkumpul", value: "15,800 kg" },
    { label: "Saldo Tersalurkan", value: "Rp45.6M+" },
    { label: "Cabang Bank Sampah", value: locations.length.toString() },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-50 overflow-x-hidden transition-colors duration-200">
      {/* 1. Header/Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/85 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/80">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo className="h-8 w-8" showText={true} />

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-zinc-350">
            <a href="#tentang" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Tentang</a>
            <a href="#cara-kerja" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Cara Kerja</a>
            <a href="#harga" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Daftar Harga</a>
            <a href="#lokasi" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Lokasi</a>
            <a href="#faq" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">FAQ</a>
            <a href="#kontak" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Kontak</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 text-slate-700 hover:text-cyan-600 dark:text-zinc-200 dark:hover:text-cyan-400 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90 text-white text-sm font-semibold px-4 py-2 shadow-md shadow-cyan-500/10 transition-all hover:scale-105"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-diamond-pattern">
        {/* Decorative Floating Diamond geometries */}
        <div className="absolute right-10 top-20 opacity-15 dark:opacity-10 pointer-events-none animate-bounce" style={{ animationDuration: "6s" }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-cyan-500">
            <polygon points="30,5 55,25 30,55 5,25" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute left-10 bottom-10 opacity-10 pointer-events-none animate-bounce" style={{ animationDuration: "9s" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-teal-500">
            <polygon points="20,4 36,17 20,36 4,17" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-150 text-xs font-semibold mb-6 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-900/40">
              <Logo className="h-4 w-4" />
              Sistem Bank Sampah Modern & Terintegrasi
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-slate-900 via-cyan-800 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-cyan-400 dark:to-white">
              Ubah Sampah Jadi Saldo Tabungan Melimpah
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-650 dark:text-zinc-350 leading-relaxed">
              Selamat datang di <strong>Bank Sampah BERLIAN</strong>. Kami melayani penjemputan sampah plastik terpilah langsung ke depan rumah Anda. Dapatkan poin reward dan konversikan langsung ke saldo tabungan rupiah.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 text-white font-bold px-6 py-3.5 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
              >
                Mulai Menabung Sampah
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#lokasi"
                className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold px-6 py-3.5 transition-all hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Cari Lokasi Kami
                <MapPin className="h-5 w-5 text-cyan-600" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Statistik Section */}
      <section className="border-y border-slate-100 bg-white py-12 dark:border-zinc-900 dark:bg-zinc-900/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <div key={idx} className="text-center">
                <span className="block text-3xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">{s.value}</span>
                <span className="block text-xs sm:text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wider dark:text-zinc-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Tentang BERLIAN */}
      <section id="tentang" className="py-20 md:py-28 bg-diamond-pattern">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tentang Bank Sampah BERLIAN</h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-455">
              BERLIAN berkomitmen menciptakan sirkular ekonomi terpadu yang memadukan kepedulian lingkungan dengan keuntungan finansial bagi masyarakat luas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-150 bg-white p-8 shadow-md hover:shadow-lg transition-all dark:border-zinc-850 dark:bg-zinc-900/40 glass-card">
              <div className="rounded-xl bg-cyan-50 p-3 text-cyan-700 w-fit mb-6 dark:bg-cyan-950/40 dark:text-cyan-400">
                <Logo className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Kelestarian Lingkungan</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                Kami membantu menekan jumlah limbah botol plastik sekali pakai agar tidak berakhir di tempat pembuangan akhir (TPA) atau mencemari lautan.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-150 bg-white p-8 shadow-md hover:shadow-lg transition-all dark:border-zinc-850 dark:bg-zinc-900/40 glass-card">
              <div className="rounded-xl bg-sky-50 p-3 text-sky-700 w-fit mb-6 dark:bg-sky-950/40 dark:text-sky-400">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sistem Terpercaya</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                Setiap penimbangan dicatat transparan dan langsung di-update oleh staff ke sistem. Saldo tabungan Anda aman dan dapat dicairkan kapan saja.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-150 bg-white p-8 shadow-md hover:shadow-lg transition-all dark:border-zinc-850 dark:bg-zinc-900/40 glass-card">
              <div className="rounded-xl bg-teal-50 p-3 text-teal-700 w-fit mb-6 dark:bg-teal-950/40 dark:text-teal-400">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pemberdayaan Reward</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                Dapatkan level reward. Semakin banyak sampah yang ditabung, semakin besar keuntungan per kilogram yang akan Anda peroleh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Cara Kerja */}
      <section id="cara-kerja" className="bg-slate-100/40 py-20 md:py-28 dark:bg-zinc-950/20 border-y border-slate-100 dark:border-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Bagaimana Cara Kerjanya?</h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400">
              Cukup dengan 4 langkah mudah, Anda sudah bisa berkontribusi menjaga kelestarian lingkungan dan menambah uang belanja bulanan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xl font-bold mb-4 shadow-lg shadow-cyan-500/20">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Registrasi & Login</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed px-4">
                Daftar akun nasabah secara gratis dan lengkapi alamat penjemputan Anda di dashboard profil.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xl font-bold mb-4 shadow-lg shadow-cyan-500/20">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Request Penjemputan</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed px-4">
                Pilih jenis sampah (Botol/Gelas Plastik), isi estimasi berat, klik ajukan penjemputan.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xl font-bold mb-4 shadow-lg shadow-cyan-500/20">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Penimbangan di Lokasi</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed px-4">
                Staff penjemput kami akan mendatangi lokasi Anda, memverifikasi, menimbang sampah, dan menginput hasil.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xl font-bold mb-4 shadow-lg shadow-cyan-500/20">
                4
              </div>
              <h3 className="font-bold text-lg mb-2">Saldo & Poin Bertambah</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed px-4">
                Sistem menghitung otomatis nilai nominal sampah. Saldo serta poin langsung masuk ke akun Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Daftar Harga Sampah */}
      <section id="harga" className="py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Update Harga Terkini
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-4">Daftar Harga Sampah Terpilah</h2>
                <p className="text-slate-600 dark:text-zinc-400 mt-4 leading-relaxed">
                  Kami menawarkan harga beli kompetitif yang selalu diperbarui secara berkala oleh tim Admin kami. Pisahkan sampah Anda agar nilai ekonomisnya lebih maksimal.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-xl flex gap-3 items-center shadow-sm">
                <div className="rounded-lg bg-cyan-50 dark:bg-cyan-950/40 p-2 text-cyan-600 dark:text-cyan-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400">
                  Harga di atas dihitung per kilogram berdasarkan berat aktual saat ditimbang staff lapangan kami.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-slate-150 bg-white shadow-xl dark:border-zinc-850 dark:bg-zinc-900/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-550 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                      <th className="p-4 sm:p-5">Gambar</th>
                      <th className="p-4 sm:p-5">Jenis Sampah</th>
                      <th className="p-4 sm:p-5">Kode</th>
                      <th className="p-4 sm:p-5 text-right">Harga / Satuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
                    {wasteTypes.map((type: any) => (
                      <tr key={type.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                        <td className="p-4 sm:p-5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={type.image}
                            alt={type.name}
                            className="h-12 w-12 rounded-lg object-cover border border-slate-100 dark:border-zinc-800"
                          />
                        </td>
                        <td className="p-4 sm:p-5 font-semibold">{type.name}</td>
                        <td className="p-4 sm:p-5 text-slate-500 dark:text-zinc-400 text-xs">{type.code}</td>
                        <td className="p-4 sm:p-5 text-right font-extrabold text-cyan-600 dark:text-cyan-400">
                          Rp{type.pricePerKg.toLocaleString("id-ID")} / kg
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Lokasi Bank Sampah (Map) */}
      <section id="lokasi" className="bg-gradient-to-br from-sky-50/70 to-cyan-50/50 dark:from-zinc-950/40 dark:to-zinc-950/20 py-20 md:py-28 border-y border-cyan-100 dark:border-cyan-950/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Lokasi Layanan Bank Sampah</h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400">
              Temukan cabang operasional Bank Sampah BERLIAN terdekat dari rumah Anda untuk penyerahan mandiri atau jangkauan armada jemput kami.
            </p>
          </div>

          <MapView locations={locations} />
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-20 md:py-28 bg-diamond-pattern">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">FAQ (Pertanyaan Umum)</h2>
            <p className="mt-4 text-slate-600 dark:text-zinc-400">
              Butuh informasi lebih lanjut? Berikut jawaban untuk beberapa pertanyaan yang paling sering diajukan nasabah kami.
            </p>
          </div>

          <FAQSection />
        </div>
      </section>

      {/* 9. Kontak Section */}
      <section id="kontak" className="bg-zinc-900 text-white py-20 md:py-28 dark:bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Hubungi Kami</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-4">Punya Pertanyaan atau Keluhan?</h2>
                <p className="text-zinc-400 mt-4 leading-relaxed">
                  Tim Layanan Pelanggan kami siap melayani Anda. Jangan ragu untuk mengirimkan pesan, keluhan, atau saran kemitraan.
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-zinc-800 p-3 text-cyan-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-zinc-400">Telepon Layanan</span>
                    <span className="font-semibold text-sm">021-555-1234 / 0812-3456-7890</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-zinc-800 p-3 text-cyan-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-zinc-400">Email Resmi</span>
                    <span className="font-semibold text-sm">support@berlian.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-zinc-800 p-3 text-cyan-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-zinc-400">Kantor Pusat</span>
                    <span className="font-semibold text-sm">Jl. Merdeka No. 10, Gambir, Jakarta Pusat</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-xl flex flex-col gap-5 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-400 font-semibold">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama Anda"
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-400 font-semibold">Alamat Email</label>
                    <input
                      type="email"
                      placeholder="email@domain.com"
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400 font-semibold">Perihal</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kemitraan, Keluhan Layanan"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400 font-semibold">Pesan Anda</label>
                  <textarea
                    rows={4}
                    placeholder="Tulis detail pertanyaan Anda..."
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white resize-none"
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Footer Section */}
      <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-500 text-xs py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white tracking-tight">BERLIAN</span>
            <span>© {new Date().getFullYear()} Bank Sampah BERLIAN. Hak Cipta Dilindungi.</span>
          </div>

          <div className="flex gap-6">
            <a href="#tentang" className="hover:text-white transition-colors">Tentang</a>
            <a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a>
            <a href="#harga" className="hover:text-white transition-colors">Daftar Harga</a>
            <Link href="/internal/login" className="flex items-center gap-1 hover:text-white transition-colors">
              Internal System Login
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating Theme Toggle untuk Mobile */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50 shadow-lg border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <ThemeToggle />
      </div>
    </div>
  );
}
