"use client";

import { useEffect } from "react";
import { markDayVisited } from "@/lib/progress";
import { NotebookSimulator } from "@/components/day3/NotebookSimulator";
import { ComputeExplainer } from "@/components/day3/ComputeExplainer";
import { cn } from "@/lib/utils";

const decisionTree = [
  {
    question: "Do you need to write Python?",
    yesPath: "Use a Notebook + All-Purpose Cluster",
    noPath: "Can be done in SQL Editor",
    yesIcon: "📓",
    noIcon: "⚡",
  },
  {
    question: "Is this a scheduled/automated job?",
    yesPath: "Use a Notebook in a Job with Job Cluster",
    noPath: "Use SQL Editor / Interactive Notebook",
    yesIcon: "🔄",
    noIcon: "🖱️",
  },
  {
    question: "Are you building a dashboard or reporting query?",
    yesPath: "Use SQL Editor with SQL Warehouse",
    noPath: "Use a Notebook for exploration",
    yesIcon: "📊",
    noIcon: "🔬",
  },
];

export default function Day3Page() {
  useEffect(() => {
    markDayVisited(3);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">
            💻
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wide bg-green-100 px-2 py-0.5 rounded-full">
                Day 3
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Develop &amp; Query</h1>
            <p className="text-gray-600 mt-1">
              Learn how notebooks work, write your first SQL query on real data, and understand how compute powers your work.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Databricks Notebooks", "SQL vs Python", "All-Purpose Clusters", "SQL Warehouses"].map((topic) => (
                <span key={topic} className="text-xs bg-white border border-green-200 text-green-700 px-2.5 py-1 rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notebook Simulator */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Interactive Notebook</h2>
        <p className="text-sm text-gray-500 mb-4">
          Click <strong>▶ Run</strong> on each cell to execute it and see the output — just like a real Databricks notebook.
        </p>
        <NotebookSimulator />
      </div>

      {/* Compute Explainer */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Understanding Compute</h2>
        <ComputeExplainer />
      </div>

      {/* SQL Editor vs Notebook Decision Tree */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">SQL Editor vs Notebook — When to Use Which?</h2>
        <p className="text-sm text-gray-500 mb-5">Use this decision tree to pick the right tool for your task.</p>

        <div className="space-y-4">
          {decisionTree.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{item.question}</p>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className={cn("rounded-xl border p-3", "bg-green-50 border-green-200")}>
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">✅ YES</p>
                      <p className="text-sm text-green-800 font-medium">
                        <span className="mr-1">{item.yesIcon}</span>
                        {item.yesPath}
                      </p>
                    </div>
                    <div className={cn("rounded-xl border p-3", "bg-blue-50 border-blue-200")}>
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">❌ NO</p>
                      <p className="text-sm text-blue-800 font-medium">
                        <span className="mr-1">{item.noIcon}</span>
                        {item.noPath}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-primary-50 border border-primary-100 p-4 flex gap-3">
          <span className="text-lg">💡</span>
          <p className="text-sm text-primary-800">
            <strong>Rule of thumb:</strong> Notebooks for development and Python. SQL Editor for analytics and dashboards. Jobs for automation.
          </p>
        </div>
      </div>
    </div>
  );
}
