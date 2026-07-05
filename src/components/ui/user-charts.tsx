"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  weight: number;
}

interface UserChartsProps {
  data: ChartDataPoint[];
}

export function UserCharts({ data }: UserChartsProps) {
  // Fallback data jika belum ada transaksi
  const chartData = data.length > 0 
    ? [...data].reverse().map(d => ({
        date: new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        "Berat Sampah (kg)": d.weight
      }))
    : [
        { date: "Senin", "Berat Sampah (kg)": 0 },
        { date: "Selasa", "Berat Sampah (kg)": 0 },
        { date: "Rabu", "Berat Sampah (kg)": 0 },
        { date: "Kamis", "Berat Sampah (kg)": 0 },
        { date: "Jumat", "Berat Sampah (kg)": 0 },
      ];

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }} 
            tickLine={false} 
            axisLine={false}
            stroke="#94a3b8"
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            tickLine={false} 
            axisLine={false}
            stroke="#94a3b8"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(255, 255, 255, 0.95)", 
              border: "1px solid #e2e8f0", 
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
              fontSize: "12px"
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="Berat Sampah (kg)" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorWeight)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
