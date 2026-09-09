"use client";

import { useRef, useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, type PieProps } from "recharts";

interface DataEntry {
  name: string;
  value: number;
}

interface MonitoringChartProps {
  data: DataEntry[];
  colors?: string[];
  title?: string;
}

const DEFAULT_COLORS = ["#22C55E", "#EF4444"];

function CenterLabel({ cx, cy, data, colors }: { cx?: number; cy?: number; data: DataEntry[]; colors: string[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const topEntry = data.reduce((best, d) => (d.value > best.value ? d : best), data[0]);
  const pct = total > 0 ? Math.round((topEntry.value / total) * 100) : 0;
  const color = colors[data.indexOf(topEntry)] ?? colors[0];

  if (!cx || !cy) return null;

  return (
    <g>
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={22} fontWeight={700} fill={color}>
        {pct}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="#9CA3AF">
        {topEntry.name}
      </text>
    </g>
  );
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function MonitoringChart({
  data,
  colors = DEFAULT_COLORS,
  title = "Job Success Rate (Last 7 Days)",
}: MonitoringChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const isAnimationActive = !reducedMotion && animated;
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div ref={containerRef} className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={76}
            paddingAngle={3}
            dataKey="value"
            isAnimationActive={isAnimationActive}
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((_entry, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
            <CenterLabel cx={undefined} cy={undefined} data={data} colors={colors} />
          </Pie>
          <Tooltip formatter={(v: number) => [`${v} run${v !== 1 ? "s" : ""}`, ""]} />
          {/* CenterLabel rendered via Customized */}
          <Pie
            data={[]}
            dataKey="value"
            isAnimationActive={false}
          >
            <CenterLabel cx={undefined} cy={undefined} data={data} colors={colors} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* External legend */}
      <div className="flex justify-center gap-4 mt-1 mb-3">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-xs text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>

      {/* Stat row */}
      <div className="flex justify-center gap-6 pt-2 border-t border-gray-100">
        {data.map((entry, i) => (
          <div key={entry.name} className="text-center">
            <p className="text-2xl font-bold" style={{ color: colors[i % colors.length] }}>{entry.value}</p>
            <p className="text-xs text-gray-500">{entry.name}</p>
          </div>
        ))}
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-800">
            {total > 0 ? Math.round((data[0].value / total) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-500">Success Rate</p>
        </div>
      </div>
    </div>
  );
}
