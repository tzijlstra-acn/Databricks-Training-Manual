"use client";

import { useBeginnerMode } from "@/context/BeginnerModeContext";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeginnerExplanationProps {
  analogy?: string;
  whyItMatters?: string;
  simple?: string;
  className?: string;
}

export function BeginnerExplanation({ analogy, whyItMatters, simple, className }: BeginnerExplanationProps) {
  const { beginnerMode } = useBeginnerMode();

  if (!beginnerMode) return null;

  return (
    <div className={cn("rounded-xl bg-[#FFF3E8] border border-[#F47920]/20 p-4", className)}>
      <div className="flex gap-3">
        <Lightbulb size={16} className="text-[#F47920] shrink-0 mt-0.5" />
        <div className="space-y-1">
          {simple && <p className="text-sm text-[#1F2144]">{simple}</p>}
          {analogy && (
            <p className="text-sm text-[#6B7280] italic">
              <span className="font-medium not-italic text-[#F47920]">Think of it as:</span> {analogy}
            </p>
          )}
          {whyItMatters && (
            <p className="text-xs text-[#6B7280]">
              <span className="font-medium text-[#1F2144]">Why this matters:</span> {whyItMatters}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface TrainerTipProps {
  tip: string;
  className?: string;
}

export function TrainerTip({ tip, className }: TrainerTipProps) {
  const { beginnerMode } = useBeginnerMode();
  if (!beginnerMode) return null;

  return (
    <div className={cn("rounded-xl bg-amber-50 border border-amber-100 p-3", className)}>
      <div className="flex gap-2">
        <span className="text-amber-500 shrink-0">💡</span>
        <p className="text-sm text-amber-800">{tip}</p>
      </div>
    </div>
  );
}
