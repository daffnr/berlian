"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  weight: number;
}

interface UserChartsProps {
  data: ChartDataPoint[];
}

export function UserCharts({ data }: UserChartsProps) {
  // Urutkan data secara kronologis untuk menghitung akumulasi sum secara berurutan
  const sortedData = data.length > 0
    ? [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  let cumulativeWeight = 0;

  const chartData = sortedData.length > 0 
    ? sortedData.map(d => {
        cumulativeWeight += d.weight;
        return {
          date: new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
          "Total Sampah (kg)": parseFloat(cumulativeWeight.toFixed(1))
        };
      })
    : [
        { date: "Senin", "Total Sampah (kg)": 5 },
        { date: "Selasa", "Total Sampah (kg)": 12 },
        { date: "Rabu", "Total Sampah (kg)": 22 },
        { date: "Kamis", "Total Sampah (kg)": 35 },
        { date: "Jumat", "Total Sampah (kg)": 50 },
      ];

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
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
          <Line 
            type="monotone" 
            dataKey="Total Sampah (kg)" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 3 }}
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
