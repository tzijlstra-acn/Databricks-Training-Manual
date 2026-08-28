"use client";

import React from "react";
import { useBeginnerMode } from "@/context/BeginnerModeContext";
import { Building2 } from "lucide-react";

interface HowdenContextProps {
  children: React.ReactNode;
  title?: string;
}

export function HowdenContext({ children, title = "In Howden's world…" }: HowdenContextProps) {
  const { viewLevel } = useBeginnerMode();
  if (viewLevel !== "beginner") return null;

  return (
    <div className="flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 my-6">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F47920] flex items-center justify-center">
        <Building2 className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#F47920] uppercase tracking-wider mb-1.5">{title}</p>
        <div className="text-sm text-orange-900 leading-relaxed space-y-1">{children}</div>
      </div>
    </div>
  );
}
