"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Acids & Bases", value: 450 },
  { name: "Organic Solvents", value: 320 },
  { name: "Analytical Reagents", value: 280 },
  { name: "Inorganic Salts", value: 150 },
];

const COLORS = [
  "hsl(var(--primary))",
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6"  // violet
];

export default function InventoryChart() {
  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
              borderRadius: "8px"
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", color: "hsl(var(--foreground))" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
