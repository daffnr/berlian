"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Navigation, Search } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
}

interface MapViewProps {
  locations: Location[];
}

export function MapView({ locations }: MapViewProps) {
  const [selectedLoc, setSelectedLoc] = useState<Location>(locations[0] || null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (loc: Location) => {
    setSelectedLoc(loc);
  };

  // Hitung letak pin di SVG berdasarkan koordinat (skala relatif untuk Jakarta-Depok)
  const getSvgCoords = (lat: number, lng: number) => {
    const minLat = -6.42;
    const maxLat = -6.15;
    const minLng = 106.75;
    const maxLng = 106.90;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((lat - maxLat) / (minLat - maxLat)) * 100;

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-2xl border border-slate-150 bg-white p-4 shadow-xl dark:border-zinc-850 dark:bg-zinc-900/50 backdrop-blur-md">
      {/* Sidebar List */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari lokasi bank sampah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-black dark:text-zinc-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-700"
          />
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[350px] pr-1">
          {filteredLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className={`text-left p-3 rounded-xl border transition-all duration-300 ${
                selectedLoc?.id === loc.id
                  ? "bg-cyan-50 border-cyan-300 text-cyan-950 dark:bg-cyan-950/20 dark:border-cyan-800 dark:text-cyan-100"
                  : "bg-white border-slate-100 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-850 dark:hover:border-zinc-700 text-gray-700 dark:text-zinc-300"
              }`}
            >
              <div className="flex items-start gap-2">
                <MapPin className={`h-5 w-5 mt-0.5 shrink-0 ${
                  selectedLoc?.id === loc.id ? "text-cyan-600" : "text-gray-400"
                }`} />
                <div>
                  <h4 className="font-semibold text-sm">{loc.name}</h4>
                  <p className="text-xs opacity-80 mt-1 line-clamp-2">{loc.address}</p>
                </div>
              </div>
            </button>
          ))}
          {filteredLocations.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Lokasi tidak ditemukan
            </div>
          )}
        </div>
      </div>

      {/* Visual Interactive Map Screen & Detail Info (Underneath Map) */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Map SVG Box */}
        <div className="h-[320px] relative rounded-xl border border-slate-100 bg-gradient-to-tr from-cyan-50/20 to-blue-50/20 dark:from-cyan-950/5 dark:to-blue-950/5 overflow-hidden dark:border-zinc-850 flex items-center justify-center">
          {/* Mock Map Background grid lines & patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />
          
          {/* Stylized vector map paths */}
          <svg className="absolute inset-0 w-full h-full text-cyan-100/50 dark:text-cyan-900/10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M10,20 Q25,30 40,15 T70,35 T90,30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="1,2" />
            <path d="M15,45 Q35,65 55,40 T85,75" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M30,10 Q50,55 20,80" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Map Pins */}
          {filteredLocations.map((loc) => {
            const coords = getSvgCoords(loc.latitude, loc.longitude);
            const isSelected = selectedLoc?.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
              >
                <div className="relative">
                  {/* Ping animation effect */}
                  <div className={`absolute -inset-2.5 rounded-full bg-cyan-500 opacity-0 transition-all ${
                    isSelected ? "animate-ping opacity-25" : "group-hover:opacity-10"
                  }`} />
                  {/* Bouncing Pin marker */}
                  <div className={`p-2 rounded-full border shadow-md transition-all duration-300 ${
                    isSelected
                      ? "bg-cyan-600 border-cyan-400 text-white scale-125"
                      : "bg-white border-slate-350 text-cyan-600 dark:bg-zinc-800 dark:border-zinc-650 scale-100 hover:scale-110"
                  }`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Location Card / Keterangan Operasional - Pindahkan di bagian bawah peta */}
        {selectedLoc && (
          <div className="bg-slate-50/50 dark:bg-zinc-950/40 p-4 rounded-xl border border-cyan-100 dark:border-cyan-950/30 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Keterangan Operasional
                </span>
                <span className="text-[10px] text-gray-400">
                  {selectedLoc.latitude.toFixed(6)}, {selectedLoc.longitude.toFixed(6)}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{selectedLoc.name}</h3>
              <p className="text-xs text-gray-505 dark:text-zinc-400 mt-1">{selectedLoc.address}</p>
              
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-cyan-600" />
                  <span>{selectedLoc.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-cyan-600" />
                  <span>{selectedLoc.email}</span>
                </div>
              </div>
            </div>
            
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedLoc.latitude},${selectedLoc.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-cyan-500/10 transition-all shrink-0 w-full sm:w-auto text-center"
            >
              <Navigation className="h-3.5 w-3.5" />
              Buka di Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
