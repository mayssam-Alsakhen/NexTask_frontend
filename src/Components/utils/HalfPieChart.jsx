"use client";

import { PieChart, Pie } from "recharts";

export default function HalfPieChart({ value }) {
  const data = [
    { value: value, fill: "#5e8cc4" }, // blue
    { value: 100 - value, fill: "#d5dceb" }, // light gray
  ];

  return (
    <div className="relative w-[200px] h-[100px] mx-auto">
      <PieChart width={200} height={100} margin={0}>
        <Pie
          data={data}
          startAngle={180}
          endAngle={0}
          cx={100}      // center x at middle (width / 2)
          cy={100}      // center y at bottom (height)
          innerRadius={60}
          outerRadius={100}
          stroke="none"
          dataKey="value"
        />
      </PieChart>

      {/* Center text */}
      <div className="absolute top-[80%] left-1/2 transform -translate-x-1/2 -translate-y-[30%] text-lg font-bold">
        {value}%
      </div>
    </div>
  );
}
