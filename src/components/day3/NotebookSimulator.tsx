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
} from "recharts";

type CellStatus = "idle" | "running" | "done";

interface Cell {
  id: number;
  language: "SQL" | "Python" | "Markdown";
  content: string;
}

const cells: Cell[] = [
  {
    id: 1,
    language: "Markdown",
    content: `## FINMA 2025 — Entity Attribution Check\nValidating commission totals per entity before FINMA submission.`,
  },
  {
    id: 2,
    language: "SQL",
    content: `SELECT
  entity_code,
  entity_name,
  COUNT(DISTINCT deal_id)      AS deal_count,
  SUM(commission_chf)          AS total_commission_chf,
  SUM(commission_chf) * 0.9   AS abacus_baseline_chf,
  ABS(SUM(commission_chf)
    - SUM(commission_chf) * 0.9)
    / (SUM(commission_chf) * 0.9)
    * 100                      AS variance_pct
FROM enterprise.silver.commissions_clean
GROUP BY entity_code, entity_name
ORDER BY total_commission_chf DESC;`,
  },
  {
    id: 3,
    language: "Python",
    content: `from pyspark.sql import functions as F

df = spark.table("enterprise.silver.commissions_clean")

# Flag entities where variance vs Abacus exceeds threshold
result = (
    df.groupBy("entity_code", "entity_name")
    .agg(F.sum("commission_chf").alias("total_commission_chf"))
    .withColumn(
        "abacus_variance_chf",
        F.abs(F.col("total_commission_chf") * 0.003)
    )
    .withColumn(
        "variance_ok",
        (F.col("abacus_variance_chf") < 10000)
    )
    .orderBy(F.desc("total_commission_chf"))
)

display(result)`,
  },
];

const sqlOutputRows = [
  { customer_name: "Howden Schweiz AG",        segment: "HW-CH-01", commission_amount: "CHF 4,821,300" },
  { customer_name: "Howden Broker Services AG", segment: "HW-CH-02", commission_amount: "CHF 3,190,400" },
  { customer_name: "SWIBRO AG",                 segment: "HW-CH-03", commission_amount: "CHF 2,640,200" },
  { customer_name: "Perennial AG",              segment: "HW-CH-04", commission_amount: "CHF 1,204,800" },
  { customer_name: "Vorsorge Partner AG",       segment: "HW-CH-05", commission_amount: "CHF 543,100" },
];

const chartData = [
  { segment: "HW-CH-01",  commission: 4821300 },
  { segment: "HW-CH-02",  commission: 3190400 },
  { segment: "HW-CH-03",  commission: 2640200 },
  { segment: "HW-CH-04",  commission: 1204800 },
  { segment: "HW-CH-05",  commission: 543100 },
];

const languageColors: Record<string, string> = {
  SQL: "bg-blue-100 text-blue-800 border-blue-200",
  Python: "bg-green-100 text-green-800 border-green-200",
  Markdown: "bg-purple-100 text-purple-800 border-purple-200",
};

const languageSyntax: Record<string, string> = {
  SQL: "text-blue-300",
  Python: "text-green-300",
  Markdown: "text-purple-300",
};

export function NotebookSimulator() {
  const [cellStatuses, setCellStatuses] = useState<Record<number, CellStatus>>({ 1: "idle", 2: "idle", 3: "idle" });
  const [showOutput, setShowOutput] = useState<Record<number, boolean>>({});

  function runCell(id: number) {
    setCellStatuses((prev) => ({ ...prev, [id]: "running" }));
    setShowOutput((prev) => ({ ...prev, [id]: false }));
    setTimeout(() => {
      setCellStatuses((prev) => ({ ...prev, [id]: "done" }));
      setShowOutput((prev) => ({ ...prev, [id]: true }));
    }, 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-gray-200 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono font-semibold">finma_entity_validation.ipynb</span>
          <span className="text-gray-500">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            Connected to: Shared Analytics Cluster
          </span>
        </div>
        <div className="flex gap-3 text-gray-400">
          <span>Python 3.11 | DBR 14.3 LTS</span>
        </div>
      </div>

      {/* Cells */}
      <div className="bg-gray-950 divide-y divide-gray-800">
        {cells.map((cell) => {
          const status = cellStatuses[cell.id];
          const hasOutput = showOutput[cell.id];

          return (
            <div key={cell.id} className="group">
              {/* Cell header */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900">
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded border",
                    languageColors[cell.language]
                  )}
                >
                  {cell.language}
                </span>
                <span className="text-gray-600 text-xs">In [{cell.id}]:</span>
                <div className="flex-1" />

                {/* Status indicator */}
                {status === "idle" && (
                  <span className="text-xs text-gray-600">idle</span>
                )}
                {status === "running" && (
                  <span className="flex items-center gap-1.5 text-xs text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    running…
                  </span>
                )}
                {status === "done" && (
                  <span className="flex items-center gap-1.5 text-xs text-green-400">
                    <span>✓</span> done
                  </span>
                )}

                {/* Run button */}
                <button
                  onClick={() => runCell(cell.id)}
                  disabled={status === "running"}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors",
                    status === "running"
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-primary-800 hover:bg-primary-700 text-white"
                  )}
                >
                  <span>▶</span>
                  {status === "running" ? "Running" : "Run"}
                </button>
              </div>

              {/* Code content */}
              <div className="px-4 py-3">
                {cell.language === "Markdown" ? (
                  <div className="font-mono text-sm text-purple-300 whitespace-pre-wrap leading-relaxed">
                    {cell.content}
                  </div>
                ) : (
                  <pre className={cn("font-mono text-sm leading-relaxed whitespace-pre-wrap", languageSyntax[cell.language])}>
                    {cell.content}
                  </pre>
                )}
              </div>

              {/* Output */}
              {hasOutput && (
                <div className="border-t border-gray-800 bg-gray-900">
                  <div className="px-3 py-1 text-xs text-gray-500">Out [{cell.id}]:</div>
                  <div className="px-4 pb-4">
                    {cell.id === 1 && (
                      <div className="text-gray-300 text-sm">
                        <h2 className="text-lg font-bold text-white">FINMA 2025 — Entity Attribution Check</h2>
                        <p className="text-gray-400 mt-1">Validating commission totals per entity before FINMA submission.</p>
                      </div>
                    )}
                    {cell.id === 2 && (
                      <div className="overflow-x-auto">
                        <table className="text-xs text-gray-300 w-full">
                          <thead>
                            <tr className="border-b border-gray-700 text-gray-400">
                              <th className="text-left py-1.5 pr-4">entity_name</th>
                              <th className="text-left py-1.5 pr-4">entity_code</th>
                              <th className="text-right py-1.5">total_commission_chf</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sqlOutputRows.map((row, i) => (
                              <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="py-1.5 pr-4 font-medium text-blue-300">{row.customer_name}</td>
                                <td className="py-1.5 pr-4">
                                  <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[10px] font-medium",
                                    row.segment === "Enterprise" ? "bg-gold-bg text-gold-text" :
                                    row.segment === "Mid-Market" ? "bg-silver-bg text-silver-text" :
                                    "bg-bronze-bg text-bronze-text"
                                  )}>
                                    {row.segment}
                                  </span>
                                </td>
                                <td className="py-1.5 text-right text-green-300 font-mono">{row.commission_amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="text-gray-500 text-xs mt-2">5 rows × 3 columns — enterprise.silver.commissions_clean — 0.38s</p>
                      </div>
                    )}
                    {cell.id === 3 && (
                      <div>
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={chartData} margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="segment" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                            <YAxis
                              tick={{ fill: "#9CA3AF", fontSize: 11 }}
                              tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
                            />
                            <Tooltip
                              formatter={(v: number) => [`CHF ${v.toLocaleString()}`, "Commission"]}
                              contentStyle={{ background: "#1F2937", border: "1px solid #374151", borderRadius: 8 }}
                              labelStyle={{ color: "#F9FAFB" }}
                            />
                            <Bar dataKey="commission" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                        <p className="text-gray-500 text-xs mt-1">Total commission by entity code — enterprise.silver.commissions_clean — 1.14s</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
