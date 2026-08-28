"use client";

import { useEffect } from "react";
import { markDayVisited } from "@/lib/progress";
import { PipelineVisualizer } from "@/components/day4/PipelineVisualizer";
import { DQXFlow } from "@/components/day4/DQXFlow";
import { recentRuns } from "@/data/pipeline";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const successCount = recentRuns.filter((r) => r.status === "success").length;
const failCount = recentRuns.filter((r) => r.status === "failed").length;

const donutData = [
  { name: "Success", value: successCount },
  { name: "Failed", value: failCount },
];

const DONUT_COLORS = ["#22C55E", "#EF4444"];

export default function Day4Page() {
  useEffect(() => {
    markDayVisited(4);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide bg-amber-100 px-2 py-0.5 rounded-full">
                Day 4
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Automate &amp; Monitor</h1>
            <p className="text-gray-600 mt-1">
              Build automated pipelines, enforce data quality gates, and monitor your workflows — so bad data never reaches your stakeholders.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Databricks Jobs", "Pipeline DAG", "Data Quality (DQX)", "Monitoring & Alerting"].map((topic) => (
                <span key={topic} className="text-xs bg-white border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Visualizer */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Pipeline Visualizer</h2>
        <p className="text-sm text-gray-500 mb-4">
          Click <strong>Run Now</strong> to simulate the pipeline. Watch tasks activate in sequence — and see what happens when a quality gate fails.
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <PipelineVisualizer />
        </div>
      </div>

      {/* DQX Flow */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Data Quality with DQX</h2>
        <p className="text-sm text-gray-500 mb-4">
          DQX (Databricks Quality Extension) applies rule-based gates before data reaches Gold. Only records passing all rules flow through.
        </p>
        <DQXFlow />
      </div>

      {/* Monitoring section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Monitoring &amp; Observability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Donut chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Job Success Rate (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((_entry, index) => (
                    <Cell key={index} fill={DONUT_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} run${Number(v) !== 1 ? "s" : ""}`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
                <p className="text-xs text-gray-500">Successful</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{failCount}</p>
                <p className="text-xs text-gray-500">Failed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-800">
                  {Math.round((successCount / recentRuns.length) * 100)}%
                </p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Recent runs timeline */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Runs Timeline</h3>
            <div className="relative pl-5">
              {/* Timeline line */}
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-3">
                {recentRuns.map((run) => (
                  <div key={run.id} className="relative flex items-start gap-3">
                    <div
                      className={cn(
                        "absolute -left-3.5 w-3 h-3 rounded-full border-2 border-white",
                        run.status === "success" ? "bg-green-500" : "bg-red-500"
                      )}
                    />
                    <div
                      className={cn(
                        "flex-1 rounded-xl border p-2.5",
                        run.status === "success"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-600">{run.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-400">{run.duration}</span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                              run.status === "success"
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            )}
                          >
                            {run.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
