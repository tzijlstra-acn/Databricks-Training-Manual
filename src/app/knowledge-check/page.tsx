"use client";

import { useState, useEffect } from "react";
import { QuizComponent } from "@/components/knowledge-check/QuizComponent";
import { FullTest } from "@/components/knowledge-check/FullTest";
import { getProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type TabId = 1 | 2 | 3;

const QUICK_TABS: { id: TabId; label: string; subtitle: string; quizKey: string }[] = [
  { id: 1, label: "Quiz 1", subtitle: "Layer Assignment", quizKey: "layer-assignment" },
  { id: 2, label: "Quiz 2", subtitle: "Workflow Order", quizKey: "workflow-order" },
  { id: 3, label: "Quiz 3", subtitle: "Multiple Choice", quizKey: "multiple-choice" },
];

export default function KnowledgeCheckPage() {
  const [activeTab, setActiveTab] = useState<TabId>(1);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const progress = getProgress();
    setScores(progress.quizScores ?? {});
  }, [activeTab]);

  const currentTab = QUICK_TABS.find((t) => t.id === activeTab)!;
  const previousScore = scores[currentTab.quizKey];
  const attemptedCount = QUICK_TABS.filter(
    (t) => scores[t.quizKey] !== undefined
  ).length;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* ── Full Assessment ──────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Full Assessment</h1>
          <p className="text-sm text-gray-500 mt-1">
            40 questions across all 5 days and 3 difficulty levels — grounded
            in the Howden FINMA scenario. Pick a level, optionally filter to a
            single day, and submit at the end to see your score with
            explanations.
          </p>
        </div>
        <FullTest />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Quick Practice
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ── Quick Quizzes ─────────────────────────────────────────── */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Quick Quizzes</h2>
          <p className="text-sm text-gray-500 mt-1">
            Three interactive exercises for rapid practice: drag-and-drop layer
            assignment, pipeline ordering, and multiple-choice.
          </p>
        </div>

        {/* Score summary row */}
        <div className="grid grid-cols-3 gap-3">
          {QUICK_TABS.map((tab) => {
            const score = scores[tab.quizKey];
            const done = score !== undefined;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-2xl border p-3 text-center cursor-pointer transition-all hover:shadow-sm",
                  activeTab === tab.id
                    ? "border-primary-300 bg-primary-50"
                    : done
                    ? "border-green-200 bg-green-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                )}
              >
                <p className="text-xs font-semibold text-gray-600">
                  {tab.label}
                </p>
                <p className="text-xs text-gray-400">{tab.subtitle}</p>
                {done ? (
                  <p
                    className={cn(
                      "text-xl font-bold mt-1.5",
                      score === 100
                        ? "text-green-600"
                        : score >= 75
                        ? "text-yellow-600"
                        : "text-red-500"
                    )}
                  >
                    {score}%
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1.5 italic">
                    Not attempted
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall progress */}
        {attemptedCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F47920] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(
                    (attemptedCount / QUICK_TABS.length) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
              {attemptedCount}/{QUICK_TABS.length} quizzes completed
            </span>
          </div>
        )}

        {/* Tab switcher */}
        <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
          {QUICK_TABS.map((tab) => {
            const done = scores[tab.quizKey] !== undefined;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 rounded-xl py-2.5 text-sm font-medium transition-all relative",
                  activeTab === tab.id
                    ? "bg-white text-primary-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <span className="block leading-snug">{tab.label}</span>
                <span className="block text-xs font-normal opacity-70 leading-tight">
                  {tab.subtitle}
                </span>
                {done && (
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-green-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Previous score banner */}
        {previousScore !== undefined && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
            <svg
              className="w-4 h-4 text-blue-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-blue-700">
              Your previous score on {currentTab.label}:{" "}
              <strong className="font-semibold">{previousScore}%</strong>
            </p>
          </div>
        )}

        {/* Quiz content */}
        <QuizComponent activeQuiz={activeTab} />
      </div>
    </div>
  );
}
