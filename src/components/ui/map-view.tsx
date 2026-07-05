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
  // Jakarta Pusat: -6.175, 106.827
  // Depok Beji: -6.373, 106.832
  // Kita petakan lintang (-6.15 s/d -6.40) & bujur (106.75 s/d 106.90) ke persentase koordinat SVG
  const getSvgCoords = (lat: number, lng: number) => {
    const minLat = -6.42;
    const maxLat = -6.15;
    const minLng = 106.75;
    const maxLng = 106.90;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Lintang makin ke selatan (negatif lebih besar) makin ke bawah
    const y = ((lat - maxLat) / (minLat - maxLat)) * 100;

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50 backdrop-blur-md">
      {/* Sidebar List */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari lokasi bank sampah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-black dark:text-zinc-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-700"
          />
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[350px] pr-1">
          {filteredLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className={`text-left p-3 rounded-xl border transition-all duration-300 ${
                selectedLoc?.id === loc.id
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-100"
                  : "bg-white border-gray-100 hover:border-gray-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 text-gray-700 dark:text-zinc-300"
              }`}
            >
              <div className="flex items-start gap-2">
                <MapPin className={`h-5 w-5 mt-0.5 shrink-0 ${
                  selectedLoc?.id === loc.id ? "text-emerald-600" : "text-gray-400"
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

      {/* Visual Interactive Map Screen */}
      <div className="lg:col-span-2 h-[350px] lg:h-auto min-h-[300px] relative rounded-xl border border-gray-100 bg-gradient-to-tr from-emerald-50/50 to-blue-50/50 dark:from-emerald-950/10 dark:to-blue-950/10 overflow-hidden dark:border-zinc-800 flex items-center justify-center">
        {/* Mock Map Background grid lines & patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)]" />
        
        {/* Stylized vector map paths */}
        <svg className="absolute inset-0 w-full h-full text-emerald-100/50 dark:text-emerald-900/10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M10,20 Q25,30 40,15 T70,35 T90,30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="1,2" />
          <path d="M15,45 Q35,65 55,40 T85,75" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M30,10 Q50,55 20,80" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* Selected Location Card Pop-up */}
        {selectedLoc && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-white/95 dark:bg-zinc-950/95 p-4 rounded-xl border border-emerald-100 dark:border-emerald-950 shadow-2xl backdrop-blur-md z-10 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                Operasional
              </span>
              <span className="text-[10px] text-gray-400">
                {selectedLoc.latitude.toFixed(4)}, {selectedLoc.longitude.toFixed(4)}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{selectedLoc.name}</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{selectedLoc.address}</p>
            
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-1 text-xs text-gray-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-emerald-600" />
                <span>{selectedLoc.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-emerald-600" />
                <span>{selectedLoc.email}</span>
              </div>
            </div>
            
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedLoc.latitude},${selectedLoc.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 px-3 rounded-lg transition-colors"
            >
              <Navigation className="h-3 w-3" />
              Buka di Google Maps
            </a>
          </div>
        )}

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
                <div className={`absolute -inset-2.5 rounded-full bg-emerald-500 opacity-0 transition-all ${
                  isSelected ? "animate-ping opacity-25" : "group-hover:opacity-10"
                }`} />
                {/* Bouncing Pin marker */}
                <div className={`p-2 rounded-full border shadow-md transition-all duration-300 ${
                  isSelected
                    ? "bg-emerald-600 border-emerald-400 text-white scale-125"
                    : "bg-white border-gray-300 text-emerald-600 dark:bg-zinc-800 dark:border-zinc-600 scale-100 hover:scale-110"
                }`}>
                  <MapPin className="h-4 w-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
