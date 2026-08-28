"use client";

import { useBeginnerMode } from "@/context/BeginnerModeContext";
import { usePresentationMode } from "@/context/PresentationContext";
import { Presentation, BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopNavigation() {
  const { beginnerMode, toggleBeginnerMode } = useBeginnerMode();
  const { presentationMode, togglePresentationMode } = usePresentationMode();

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#1F2144]">Databricks Learning Platform</span>
        <span className="text-gray-300">·</span>
        <span className="text-xs text-[#6B7280]">Pro Re Insurance</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Beginner Mode Toggle — orange when ON */}
        <button
          onClick={toggleBeginnerMode}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            beginnerMode
              ? "bg-[#FFF3E8] text-[#F47920] border-[#F47920]/40"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
          )}
          title={beginnerMode ? "Beginner mode ON — click to show technical details" : "Technical mode — click for beginner mode"}
        >
          <BookOpen size={12} />
          {beginnerMode ? "Beginner Mode" : "Technical Mode"}
        </button>

        {/* Present button — orange accent when active */}
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
