"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  botolWeight: number;
  gelasWeight: number;
}

interface AdminChartsProps {
  data: ChartDataPoint[];
}

export function AdminCharts({ data }: AdminChartsProps) {
  // Urutkan data secara kronologis (dari terlama ke terbaru) untuk menghitung akumulasi sum secara berurutan
  const sortedData = data.length > 0
    ? [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  let cumulativeBotol = 0;
  let cumulativeGelas = 0;

  const chartData = sortedData.length > 0 
    ? sortedData.map(d => {
        cumulativeBotol += d.botolWeight;
        cumulativeGelas += d.gelasWeight;
        return {
          date: new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
          "Botol Plastik (kg)": parseFloat(cumulativeBotol.toFixed(1)),
          "Gelas Plastik (kg)": parseFloat(cumulativeGelas.toFixed(1)),
        };
      })
    : [
        { date: "Senin", "Botol Plastik (kg)": 12, "Gelas Plastik (kg)": 8 },
        { date: "Selasa", "Botol Plastik (kg)": 27, "Gelas Plastik (kg)": 18 },
        { date: "Rabu", "Botol Plastik (kg)": 45, "Gelas Plastik (kg)": 32 },
        { date: "Kamis", "Botol Plastik (kg)": 67, "Gelas Plastik (kg)": 51 },
        { date: "Jumat", "Botol Plastik (kg)": 95, "Gelas Plastik (kg)": 76 },
      ];

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Line 
            type="monotone" 
            dataKey="Botol Plastik (kg)" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 3 }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="Gelas Plastik (kg)" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 3 }}
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
