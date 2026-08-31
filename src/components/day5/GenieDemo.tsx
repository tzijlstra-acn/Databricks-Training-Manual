"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const suggestedQuestions = [
  "What is our total commission by line of business this quarter?",
  "Which clients are due for renewal in Q2 with premium over CHF 100k?",
  "What is our claims ratio for Swiss property risks year-to-date?",
  "Show the top 10 clients by premium volume in the DACH region",
];

const generatedSQL = `SELECT
  line_of_business,
  SUM(commission_earned_chf)  AS total_commission_chf,
  SUM(total_premium_chf)      AS total_premium_chf,
  COUNT(*)                    AS policy_count
FROM enterprise.gold.commission_summary
WHERE period = DATE_TRUNC('quarter', CURRENT_DATE)
GROUP BY line_of_business
ORDER BY total_commission_chf DESC;`;

const chartData = [
  { unit: "Property & Casualty", commission: 4820000 },
  { unit: "D&O & Prof. Liability", commission: 3190000 },
  { unit: "Marine & Cargo", commission: 2640000 },
  { unit: "Specialty Risk", commission: 1530000 },
  { unit: "Health & Benefits", commission: 820000 },
];

const COLORS = ["#1E40AF", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"];

const flowSteps = [
  { label: "Natural Language", icon: "💬", color: "bg-purple-100 border-purple-300 text-purple-800" },
  { label: "Genie AI", icon: "✨", color: "bg-primary-50 border-primary-200 text-primary-800" },
  { label: "SQL Query", icon: "⌨️", color: "bg-gray-100 border-gray-300 text-gray-800" },
  { label: "SQL Warehouse", icon: "⚡", color: "bg-amber-50 border-amber-200 text-amber-800" },
  { label: "Gold Tables", icon: "🥇", color: "bg-gold-bg border-gold-border text-gold-text" },
  { label: "Answer", icon: "📊", color: "bg-green-50 border-green-200 text-green-800" },
];

export function GenieDemo() {
  const [inputValue, setInputValue] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(-1);
  const [showSQL, setShowSQL] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function askQuestion(question: string) {
    setInputValue(question);
    setActiveQuestion(question);
    setAnimationStep(-1);
    setShowSQL(false);
    setShowResult(false);

    // Animate flow steps
    flowSteps.forEach((_, i) => {
      setTimeout(() => {
        setAnimationStep(i);
        if (i === flowSteps.length - 1) {
          setTimeout(() => {
            setShowSQL(true);
            setShowResult(true);
          }, 400);
        }
      }, i * 500);
    });
  }

  function handleSubmit() {
    if (inputValue.trim()) {
      const q = suggestedQuestions.find((q) => q === inputValue.trim()) ?? inputValue.trim();
      askQuestion(q);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Genie header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <span className="text-2xl">✨</span>
        <div>
          <p className="font-bold text-sm">Genie (Databricks AI/BI)</p>
          <p className="text-xs text-blue-200">Ask your data questions in plain English</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-blue-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Connected to Gold Catalog
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Input bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ask your data a question…"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2.5 bg-primary-800 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            Ask ✨
          </button>
        </div>

        {/* Suggested chips */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => askQuestion(q)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-all hover:shadow-sm",
                  activeQuestion === q
                    ? "bg-primary-800 border-primary-700 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700"
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Animation flow */}
        {animationStep >= 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-semibold">Processing pipeline</p>
            <div className="flex items-center gap-1 overflow-x-auto">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center flex-shrink-0">
                  <div
                    className={cn(
                      "rounded-xl border px-3 py-2 text-center transition-all duration-300 min-w-[80px]",
                      step.color,
                      animationStep >= i ? "opacity-100 scale-100" : "opacity-30 scale-95"
                    )}
                  >
                    <div className="text-lg">{step.icon}</div>
                    <p className="text-[10px] font-semibold mt-0.5 leading-tight">{step.label}</p>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className="flex items-center px-1">
                      <div
                        className={cn(
                          "w-4 h-0.5 transition-all duration-300",
                          animationStep > i ? "bg-primary-400" : "bg-gray-200"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs transition-all duration-300",
                          animationStep > i ? "text-primary-400" : "text-gray-300"
                        )}
                      >
                        ▶
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated SQL */}
        {showSQL && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={() => setShowSQL((v) => !v)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 mb-2 group"
            >
              <span className="group-hover:text-primary-700">⌨️ Generated SQL</span>
              <span className="text-gray-400">— click to {showSQL ? "collapse" : "expand"}</span>
            </button>
            {showSQL && (
              <pre className="bg-gray-950 text-green-300 text-xs font-mono p-4 rounded-xl overflow-x-auto leading-relaxed">
                {generatedSQL}
              </pre>
            )}
          </div>
        )}

        {/* Result chart */}
        {showResult && activeQuestion === suggestedQuestions[0] && (
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            <p className="text-xs font-semibold text-gray-600 mb-3">
              Commission by Line of Business, Current Quarter (CHF)
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="unit" tick={{ fontSize: 10, fill: "#6B7280" }} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(v: number) => [`CHF ${v.toLocaleString()}`, "Commission"]}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="commission" radius={[6, 6, 0, 0]}>
                  {chartData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 mt-2 text-center">
              5 rows · Queried from enterprise.gold.commission_summary · 0.38s
            </p>
          </div>
        )}

        {showResult && activeQuestion !== suggestedQuestions[0] && (
          <div className="animate-in slide-in-from-bottom-2 duration-500 rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">
              Genie would generate SQL and display results for this query. Try the first suggested question to see the full demo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
