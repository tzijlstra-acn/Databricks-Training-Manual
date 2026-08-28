"use client";

import { useEffect, useState } from "react";
import { getProgress } from "@/lib/progress";

export function HomeHeader() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const p = getProgress();
    setCompletion(p.overallCompletion);
  }, []);

  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (completion / 100) * circumference;

  return (
    <div className="flex items-center justify-between py-8 border-b border-gray-100 mb-2">
      <div>
        {/* Eyebrow label */}
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F47920] mb-2">
          Howden · Databricks Enablement Programme
        </p>
        <h1 className="text-4xl font-bold text-[#1F2144] leading-tight">
          Your Databricks
          <br />
          <span className="text-[#F47920]">Learning Journey</span>
        </h1>
        <p className="text-lg text-[#6B7280] mt-3 max-w-xl">
          From raw data to trusted business insight — in 5 days.
        </p>
        <div className="flex gap-3 mt-4">
          {[
            { label: "5 Days", desc: "Structured learning" },
            { label: "100+", desc: "Interactive diagrams" },
            { label: "3", desc: "Knowledge checks" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#FFF3E8] border border-[#F47920]/20 rounded-xl px-4 py-2.5"
            >
              <p className="font-bold text-[#F47920] text-xl">{stat.label}</p>
              <p className="text-xs text-[#6B7280]">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress ring — Howden orange */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="36" fill="none" stroke="#E8E9F0" strokeWidth="8" />
            <circle
              cx="48"
              cy="48"
              r="36"
              fill="none"
              stroke="#F47920"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 48 48)"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#F47920]">{completion}%</span>
            <span className="text-xs text-[#9CA3AF]">complete</span>
          </div>
        </div>
        <p className="text-sm font-medium text-[#1F2144]">Overall Progress</p>
      </div>
    </div>
  );
}
