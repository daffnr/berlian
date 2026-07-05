"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  botolWeight: number;
  gelasWeight: number;
}

interface AdminChartsProps {
  data: ChartDataPoint[];
}

export function AdminCharts({ data }: AdminChartsProps) {
  // Fallback data jika belum ada transaksi
  const chartData = data.length > 0 
    ? [...data].reverse().map(d => ({
        date: new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        "Botol Plastik (kg)": d.botolWeight,
        "Gelas Plastik (kg)": d.gelasWeight,
      }))
    : [
        { date: "Senin", "Botol Plastik (kg)": 12, "Gelas Plastik (kg)": 8 },
        { date: "Selasa", "Botol Plastik (kg)": 15, "Gelas Plastik (kg)": 10 },
        { date: "Rabu", "Botol Plastik (kg)": 18, "Gelas Plastik (kg)": 14 },
        { date: "Kamis", "Botol Plastik (kg)": 22, "Gelas Plastik (kg)": 19 },
        { date: "Jumat", "Botol Plastik (kg)": 28, "Gelas Plastik (kg)": 25 },
      ];

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
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
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          <Bar dataKey="Botol Plastik (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Gelas Plastik (kg)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
