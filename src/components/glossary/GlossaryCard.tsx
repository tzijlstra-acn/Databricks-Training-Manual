"use client";

import { GlossaryTerm } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MedallionBadge } from "@/components/shared/MedallionBadge";
import { glossaryTerms } from "@/data/glossary";
import { ChevronDown } from "lucide-react";

interface GlossaryCardProps {
  term: GlossaryTerm;
  isExpanded: boolean;
  viewMode: "compact" | "detailed";
  onToggle: (id: string) => void;
  onRelatedClick: (id: string) => void;
  highlighted?: boolean;
}

const categoryColors: Record<string, string> = {
  core: "bg-[#E8E9F0] text-[#1F2144] border-[#D0D2E1]",
  compute: "bg-purple-50 text-purple-700 border-purple-100",
  catalog: "bg-teal-50 text-teal-700 border-teal-100",
  pipeline: "bg-orange-50 text-orange-700 border-orange-100",
  analytics: "bg-indigo-50 text-indigo-700 border-indigo-100",
  quality: "bg-green-50 text-green-700 border-green-100",
};

export function GlossaryCard({
  term,
  isExpanded,
  viewMode,
  onToggle,
  onRelatedClick,
  highlighted = false,
}: GlossaryCardProps) {
  const relatedTerms = glossaryTerms.filter((t) => term.related.includes(t.id));
  const showDetail = isExpanded || viewMode === "detailed";

  return (
    <div
      id={term.id}
      className={cn(
        "bg-white rounded-2xl border-2 transition-all duration-200",
        highlighted
          ? "border-primary-500 ring-2 ring-primary-200 shadow-md"
          : isExpanded
          ? "border-primary-300 shadow-sm"
          : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
      )}
    >
      {/* Header — always visible, acts as accordion trigger */}
      <button
        onClick={() => onToggle(term.id)}
        aria-expanded={isExpanded}
        aria-controls={`glossary-body-${term.id}`}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-gray-900 leading-tight">{term.term}</h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {term.layer && <MedallionBadge layer={term.layer} size="sm" />}
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full border font-medium",
                  categoryColors[term.category] ?? "bg-gray-50 text-gray-600 border-gray-100"
                )}
              >
                {term.category}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{term.simple}</p>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 mt-0.5 text-gray-400 transition-transform duration-200",
            isExpanded && "rotate-180 text-primary-500"
          )}
        />
      </button>

      {/* Expandable detail body */}
      {showDetail && (
        <div
          id={`glossary-body-${term.id}`}
          className="px-5 pb-4 flex flex-col gap-3 border-t border-gray-50"
        >
          {/* Analogy */}
          <p className="text-sm text-gray-400 italic leading-relaxed mt-3">
            &ldquo;{term.analogy}&rdquo;
          </p>

          {/* Example */}
          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
              Example
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">{term.example}</p>
          </div>

          {/* Related chips */}
          {relatedTerms.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-50">
              <span className="text-xs text-gray-400 font-medium">Related:</span>
              {relatedTerms.map((related) => (
                <button
                  key={related.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRelatedClick(related.id);
                  }}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 hover:border-primary-300 transition-colors"
                >
                  {related.term}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
