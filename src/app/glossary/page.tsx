"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { glossaryTerms } from "@/data/glossary";
import { GlossaryCard } from "@/components/glossary/GlossaryCard";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Core", "Compute", "Catalog", "Pipeline", "Analytics", "Quality"] as const;
type Category = (typeof CATEGORIES)[number];

const AZ_LETTERS = Array.from(
  new Set(glossaryTerms.map((t) => t.term[0].toUpperCase()))
).sort();

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered = glossaryTerms.filter((term) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      term.term.toLowerCase().includes(q) ||
      term.simple.toLowerCase().includes(q) ||
      term.analogy.toLowerCase().includes(q) ||
      term.example.toLowerCase().includes(q);
    const matchesCategory =
      activeCategory === "All" || term.category === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const isFiltered = search !== "" || activeCategory !== "All";

  const expandTerm = useCallback((id: string, scroll = true) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (typeof window !== "undefined") {
      history.replaceState(null, "", id ? `#${id}` : " ");
    }
    if (scroll) {
      setTimeout(() => {
        cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    }
  }, []);

  // Auto-expand from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && glossaryTerms.some((t) => t.id === hash)) {
      setExpandedId(hash);
      setTimeout(() => {
        cardRefs.current[hash]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, []);

  function handleRelatedClick(id: string) {
    setSearch("");
    setActiveCategory("All");
    expandTerm(id, true);
  }

  function scrollToLetter(letter: string) {
    const term = glossaryTerms.find((t) => t.term[0].toUpperCase() === letter);
    if (term) {
      cardRefs.current[term.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function clearFilters() {
    setSearch("");
    setActiveCategory("All");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Glossary</h1>
        <p className="text-sm text-gray-500 mt-1">
          {glossaryTerms.length} terms. Click any term to expand its full definition.
        </p>
      </div>

      {/* A-Z navigation */}
      <div className="flex flex-wrap gap-1">
        {AZ_LETTERS.map((letter) => (
          <button
            key={letter}
            onClick={() => scrollToLetter(letter)}
            className="w-7 h-7 rounded-lg text-xs font-bold text-gray-500 hover:bg-primary-50 hover:text-primary-700 transition-colors border border-transparent hover:border-primary-100"
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Sticky controls bar */}
      <div className="sticky top-0 z-10 bg-gray-50 -mx-4 px-4 py-3 border-b border-gray-100 space-y-3">
        {/* Search + view toggle row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms, definitions, examples..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Compact / Detailed toggle */}
          <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("compact")}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-colors",
                viewMode === "compact"
                  ? "bg-primary-800 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              Compact
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-colors",
                viewMode === "detailed"
                  ? "bg-primary-800 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              Detailed
            </button>
          </div>
        </div>

        {/* Category filters + results count */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  activeCategory === cat
                    ? "bg-primary-800 text-white border-primary-800"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400">
              {filtered.length} / {glossaryTerms.length} terms
            </span>
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:text-primary-800 font-medium underline underline-offset-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Term list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg
            className="w-10 h-10 mx-auto mb-3 text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-base">No terms found</p>
          <p className="text-sm mt-1">Try a different search term or category</p>
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-primary-600 hover:text-primary-800 font-medium underline underline-offset-2"
            >
              Clear search and filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((term) => (
            <div
              key={term.id}
              ref={(el) => {
                cardRefs.current[term.id] = el;
              }}
            >
              <GlossaryCard
                term={term}
                isExpanded={expandedId === term.id}
                viewMode={viewMode}
                onToggle={(id) => expandTerm(id, false)}
                onRelatedClick={handleRelatedClick}
                highlighted={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
