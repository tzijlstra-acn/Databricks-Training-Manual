"use client";

import { useState } from "react";
import { troubleshootingScenarios } from "@/data/troubleshooting";
import { TroubleshootingTree } from "@/components/troubleshooting/TroubleshootingTree";
import { cn } from "@/lib/utils";

const SCENARIO_ICONS = ["💻", "📋", "⚙️", "📊"];

export default function TroubleshootingPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeScenario = troubleshootingScenarios.find(s => s.id === activeId) ?? null;

  function handleCardClick(id: string) {
    setActiveId(prev => (prev === id ? null : id));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Troubleshooting</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select a scenario to follow an interactive decision tree to the solution.
        </p>
      </div>

      {/* Scenario cards */}
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
                  {isActive ? "Active — click to close" : "Click to explore"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Decision tree */}
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
    </div>
  );
}
