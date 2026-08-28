"use client";

import { GlossaryTerm } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MedallionBadge } from "@/components/shared/MedallionBadge";
import { glossaryTerms } from "@/data/glossary";

interface GlossaryCardProps {
  term: GlossaryTerm;
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

export function GlossaryCard({ term, onRelatedClick, highlighted = false }: GlossaryCardProps) {
  const relatedTerms = glossaryTerms.filter(t => term.related.includes(t.id));

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border-2 p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200",
        highlighted
          ? "border-primary-500 ring-2 ring-primary-200 shadow-md"
          : "border-gray-100"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{term.term}</h3>
        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
          {term.layer && <MedallionBadge layer={term.layer} size="sm" />}
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full border font-medium",
              categoryColors[term.category] ?? "bg-gray-50 text-gray-600 border-gray-100"
            )}
          >
            {term.category}
          </span>
        </div>
      </div>

      {/* Simple explanation */}
      <p className="text-sm text-gray-700 leading-relaxed">{term.simple}</p>

      {/* Think of it as */}
      <p className="text-sm text-gray-400 italic leading-relaxed">
        &ldquo;{term.analogy}&rdquo;
      </p>

      {/* Example */}
      <div className="bg-gray-50 rounded-xl px-3 py-2.5">
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Example</p>
        <p className="text-xs text-gray-600 leading-relaxed">{term.example}</p>
      </div>

      {/* Related chips */}
      {relatedTerms.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-medium">Related:</span>
          {relatedTerms.map(related => (
            <button
              key={related.id}
              onClick={() => onRelatedClick(related.id)}
              className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 hover:border-primary-300 transition-colors"
            >
              {related.term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
