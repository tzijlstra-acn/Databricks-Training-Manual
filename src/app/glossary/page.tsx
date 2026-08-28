"use client";

import { useState, useRef, useEffect } from "react";
import { glossaryTerms } from "@/data/glossary";
import { GlossaryCard } from "@/components/glossary/GlossaryCard";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Core", "Compute", "Catalog", "Pipeline", "Analytics", "Quality"] as const;
type Category = (typeof CATEGORIES)[number];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered = glossaryTerms.filter(term => {
    const matchesSearch =
      !search ||
      term.term.toLowerCase().includes(search.toLowerCase()) ||
      term.simple.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      term.category === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  function handleRelatedClick(id: string) {
    setHighlightedId(id);
    setSearch("");
    setActiveCategory("All");

    setTimeout(() => {
      const el = cardRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 60);
  }

  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => setHighlightedId(null), 2500);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Glossary</h1>
        <p className="text-sm text-gray-500 mt-1">
          {glossaryTerms.length} terms — click any related term chip to jump to it
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
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
          onChange={e => setSearch(e.target.value)}
          placeholder="Search terms or descriptions..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
              activeCategory === cat
                ? "bg-primary-800 text-white border-primary-800"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400">
        Showing {filtered.length} of {glossaryTerms.length} terms
      </p>

      {/* Grid */}
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
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(term => (
            <div
              key={term.id}
              ref={el => {
                cardRefs.current[term.id] = el;
              }}
            >
              <GlossaryCard
                term={term}
                onRelatedClick={handleRelatedClick}
                highlighted={highlightedId === term.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
