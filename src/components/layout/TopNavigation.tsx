"use client";

import { useBeginnerMode, ViewLevel } from "@/context/BeginnerModeContext";
import { usePresentationMode } from "@/context/PresentationContext";
import { Presentation, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVELS: { value: ViewLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'standard', label: 'Standard' },
  { value: 'pro', label: 'Pro' },
];

export function TopNavigation() {
  const { viewLevel, setViewLevel } = useBeginnerMode();
  const { presentationMode, togglePresentationMode } = usePresentationMode();

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#1F2144]">Databricks Learning Platform</span>
        <span className="text-gray-300">·</span>
        <span className="text-xs text-[#6B7280]">Pro Re Insurance</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Three-segment view level switcher */}
        <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
          {LEVELS.map(({ value, label }) => {
            const isActive = viewLevel === value;
            return (
              <button
                key={value}
                onClick={() => setViewLevel(value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                  isActive
                    ? value === 'beginner'
                      ? "bg-[#FFF3E8] text-[#F47920] shadow-sm"
                      : value === 'standard'
                        ? "bg-white text-gray-700 shadow-sm"
                        : "bg-[#1F2144] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Present button — navy accent when active */}
        <button
          onClick={togglePresentationMode}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            presentationMode
              ? "bg-[#1F2144] text-white border-[#1F2144]"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
          )}
          title="Toggle presentation mode"
        >
          <Presentation size={12} />
          {presentationMode ? "Exit Present" : "Present"}
        </button>

        {/* Status pill */}
        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
          <Zap size={10} className="text-green-500" />
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      </div>
    </header>
  );
}
