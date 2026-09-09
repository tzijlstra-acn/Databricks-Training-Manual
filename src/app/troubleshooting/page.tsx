"use client";

import { useState, useEffect } from "react";
import { troubleshootingScenarios } from "@/data/troubleshooting";
import { faqItems } from "@/data/faq";
import { TroubleshootingTree } from "@/components/troubleshooting/TroubleshootingTree";
import { FaqAccordion } from "@/components/troubleshooting/FaqAccordion";
import { searchTroubleshooting } from "@/lib/search";
import { cn } from "@/lib/utils";

const SCENARIO_ICONS = ["💻", "📋", "🏷️", "⚖️", "🤖", "📊", "⚙️", "🔐", "🗄️", "🔄", "🌐", "📈"];

type PageTab = "scenarios" | "faq";

export default function TroubleshootingPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pageTab, setPageTab] = useState<PageTab>("scenarios");
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchTroubleshooting(searchQuery, troubleshootingScenarios, faqItems);
  const isSearching = searchQuery.trim().length > 0;

  const activeScenario =
    troubleshootingScenarios.find((s) => s.id === activeId) ?? null;

  // Support ?q= and ?scenario= deep links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const scenario = params.get("scenario");
    if (q) setSearchQuery(q);
    if (scenario) {
      const found = troubleshootingScenarios.find((s) => s.id === scenario);
      if (found) {
        setPageTab("scenarios");
        setActiveId(scenario);
      }
    }
  }, []);

  function handleCardClick(id: string) {
    setActiveId((prev) => (prev === id ? null : id));
  }

  function handleSearchResultClick(id: string, type: "scenario" | "faq") {
    setSearchQuery("");
    if (type === "scenario") {
      setPageTab("scenarios");
      setActiveId(id);
    } else {
      setPageTab("faq");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Troubleshooting & FAQ</h1>
        <p className="text-sm text-gray-500 mt-1">
          Interactive decision trees for common problems, plus a 20-question FAQ
          covering the Howden FINMA scenario.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search decision trees and FAQ..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
        />
        {isSearching && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search results */}
      {isSearching && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            {searchResults.scenarios.length + searchResults.faqs.length} results for &ldquo;{searchQuery}&rdquo;
          </p>

          {searchResults.scenarios.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Decision Trees</p>
              <div className="space-y-2">
                {searchResults.scenarios.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => handleSearchResultClick(s.id, "scenario")}
                    className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <span className="mr-2">{SCENARIO_ICONS[troubleshootingScenarios.indexOf(s) % SCENARIO_ICONS.length]}</span>
                    <span className="text-sm font-medium text-gray-900">{s.title}</span>
                    <p className="text-xs text-gray-500 mt-0.5 ml-6">{s.symptom}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.faqs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">FAQ</p>
              <div className="space-y-2">
                {searchResults.faqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleSearchResultClick(faq.id, "faq")}
                    className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.scenarios.length === 0 && searchResults.faqs.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-base">No results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {/* Tabs + content (hidden while searching) */}
      {!isSearching && (
        <>
          {/* Page tab */}
          <div className="bg-gray-100 rounded-2xl p-1 flex gap-1 max-w-sm">
            {(["scenarios", "faq"] as PageTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setPageTab(tab)}
                className={cn(
                  "flex-1 rounded-xl py-2 text-sm font-medium transition-all",
                  pageTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab === "scenarios"
                  ? `Decision Trees (${troubleshootingScenarios.length})`
                  : "FAQ: 20 Questions"}
              </button>
            ))}
          </div>

          {/* Decision Trees tab */}
          {pageTab === "scenarios" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {troubleshootingScenarios.map((scenario, i) => {
                  const isActive = activeId === scenario.id;
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => handleCardClick(scenario.id)}
                      className={cn(
                        "text-left rounded-2xl border-2 p-4 transition-all hover:shadow-md",
                        isActive
                          ? "border-primary-500 bg-primary-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-primary-200"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl leading-none mt-0.5">
                          {SCENARIO_ICONS[i % SCENARIO_ICONS.length]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm leading-snug">
                            {scenario.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {scenario.symptom}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        <span
                          className={cn(
                            "text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors",
                            isActive
                              ? "bg-primary-100 text-primary-700"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {isActive ? "Active. Click to close." : "Click to explore"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {activeScenario ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <h2 className="text-base font-semibold text-gray-700 whitespace-nowrap">
                      {activeScenario.title}
                    </h2>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <TroubleshootingTree scenario={activeScenario} />
                </div>
              ) : (
                <div className="text-center py-14 text-gray-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-gray-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <p className="text-base">Select a scenario above to begin</p>
                  <p className="text-sm mt-1">Answer YES/NO questions to reach a solution</p>
                </div>
              )}
            </>
          )}

          {/* FAQ tab */}
          {pageTab === "faq" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                20 frequently asked questions covering platform basics, the
                Medallion architecture, the FINMA pipeline, and analytics tools.
                Filter by topic using the chips below.
              </p>
              <FaqAccordion />
            </div>
          )}
        </>
      )}
    </div>
  );
}
