"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronUp } from "lucide-react";
import { useBeginnerMode } from "@/context/BeginnerModeContext";
import { ProBadge } from "./ProBadge";

interface AdvancedSectionProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
}

const BADGE_COLORS: Record<string, string> = {
  Architecture: "bg-blue-100 text-blue-800 border-blue-200",
  Engineering: "bg-green-100 text-green-800 border-green-200",
  Administration: "bg-purple-100 text-purple-800 border-purple-200",
  Governance: "bg-orange-100 text-orange-800 border-orange-200",
  Development: "bg-teal-100 text-teal-800 border-teal-200",
  Operations: "bg-gray-100 text-gray-800 border-gray-200",
};

export function AdvancedSection({ title, badge, children }: AdvancedSectionProps) {
  const { viewLevel } = useBeginnerMode();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Hidden in beginner mode
  if (viewLevel === 'beginner') return null;

  const isProMode = viewLevel === 'pro';
  const isOpen = isProMode || expanded;

  const badgeClass = badge ? (BADGE_COLORS[badge] ?? "bg-gray-100 text-gray-700 border-gray-200") : "";

  return (
    <div className="mt-5 rounded-2xl border-l-4 border-l-[#1F2144] border border-[#E2E3EA] bg-[#F0F1F5]">
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
        onClick={() => !isProMode && setExpanded((e) => !e)}
        role={isProMode ? undefined : "button"}
        aria-expanded={isOpen}
      >
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-[#1F2144]">{title}</span>
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}>
              {badge}
            </span>
          )}
          {isProMode && <ProBadge />}
        </div>
        {!isProMode && (
          <div className="flex items-center gap-1 text-xs font-medium text-[#1F2144]/70 shrink-0">
            {isOpen ? (
              <>
                <span>Collapse</span>
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                <span>Go deeper</span>
                <ChevronRight size={14} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Animated content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div ref={contentRef} className="px-5 pb-5 border-t border-[#E2E3EA] pt-4">
              {children}
              {!isProMode && (
                <button
                  onClick={() => setExpanded(false)}
                  className="mt-4 text-xs text-[#1F2144]/60 hover:text-[#1F2144] underline underline-offset-2"
                >
                  Collapse
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
