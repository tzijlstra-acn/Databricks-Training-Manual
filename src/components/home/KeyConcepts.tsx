"use client";

import { useState } from "react";
import { glossaryTerms } from "@/data/glossary";
import { X } from "lucide-react";
import { MedallionBadge } from "@/components/shared/MedallionBadge";

const keyConceptIds = ["bronze-layer", "silver-layer", "gold-layer", "compute", "catalog", "job"];

export function KeyConcepts() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const concepts = glossaryTerms.filter((t) => keyConceptIds.includes(t.id));
  const selected = glossaryTerms.find((t) => t.id === selectedId);

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-[#1F2144] mb-2">Key Concepts</h2>
      <p className="text-gray-500 mb-6">Click any concept to see the definition.</p>

      <div className="flex flex-wrap gap-2">
        {concepts.map((concept) => (
          <button
            key={concept.id}
            onClick={() => setSelectedId(concept.id === selectedId ? null : concept.id)}
            className="px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-150 hover:shadow-sm"
            style={
              concept.layer
                ? selectedId === concept.id
                  ? {
                      backgroundColor:
                        concept.layer === "bronze" ? "#CD7F32" : concept.layer === "silver" ? "#9CA3AF" : "#D97706",
                      color: "white",
                      borderColor:
                        concept.layer === "bronze" ? "#CD7F32" : concept.layer === "silver" ? "#9CA3AF" : "#D97706",
                    }
                  : {
                      backgroundColor:
                        concept.layer === "bronze" ? "#FDF3E7" : concept.layer === "silver" ? "#F3F4F6" : "#FFFBEB",
                      color:
                        concept.layer === "bronze" ? "#92400E" : concept.layer === "silver" ? "#374151" : "#92400E",
                      borderColor:
                        concept.layer === "bronze" ? "#E8B86D" : concept.layer === "silver" ? "#D1D5DB" : "#FCD34D",
                    }
                : {
                    backgroundColor: selectedId === concept.id ? "#F47920" : "#FFF3E8",
                    color: selectedId === concept.id ? "white" : "#F47920",
                    borderColor: selectedId === concept.id ? "#F47920" : "#F47920" + "40",
                  }
            }
          >
            {concept.term}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedId(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selected.term}</h3>
                {selected.layer && (
                  <div className="mt-1">
                    <MedallionBadge layer={selected.layer} size="sm" />
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-700 mb-3">{selected.simple}</p>

            <div className="bg-[#FFF3E8] border border-[#F47920]/20 rounded-xl p-3 mb-3">
              <p className="text-sm text-[#1F2144] italic">
                <span className="font-semibold not-italic text-[#F47920]">Think of it as: </span>
                {selected.analogy}
              </p>
            </div>

            <p className="text-sm text-gray-500 border-t border-gray-100 pt-3">
              <span className="font-medium text-gray-700">Example: </span>
              {selected.example}
            </p>

            {selected.related.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-xs text-gray-400 mr-1">Related:</span>
                {selected.related.slice(0, 4).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedId(r)}
                    className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                  >
                    {r.replace(/-/g, " ")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
