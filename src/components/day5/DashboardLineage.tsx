"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/shared/MetricCard";
import { Users, DollarSign, ShieldCheck, Workflow } from "lucide-react";

const kpis = [
  {
    id: "customers",
    title: "Total Customers",
    value: "8,234",
    subtitle: "Active this period",
    icon: Users,
    color: "blue" as const,
    description: "Aggregated from enterprise.gold.customer_summary, counting distinct customer_id where status = ACTIVE.",
  },
  {
    id: "commission",
    title: "Total Commission",
    value: "CHF 12.4M",
    subtitle: "YTD · All regions",
    icon: DollarSign,
    color: "gold" as const,
    description: "SUM(commission_amount) from enterprise.gold.commission_summary grouped by reporting period.",
  },
  {
    id: "quality",
    title: "Data Quality",
    value: "97.8%",
    subtitle: "DQX pass rate",
    icon: ShieldCheck,
    color: "green" as const,
    description: "Weighted average pass rate across all active DQX rules in the Silver → Gold transformation layer.",
  },
  {
    id: "pipelines",
    title: "Active Pipelines",
    value: "12/14",
    subtitle: "2 paused for review",
    icon: Workflow,
    color: "default" as const,
    description: "Count of Databricks Jobs with status RUNNING or SCHEDULED out of 14 total registered pipeline jobs.",
  },
];

const lineageNodes = [
  {
    id: "widget",
    label: "Dashboard Widget",
    description: "A chart or KPI tile on the Databricks SQL Dashboard. Queries run on every page load or scheduled refresh.",
    icon: "📊",
    color: "bg-purple-100 border-purple-300 text-purple-900",
  },
  {
    id: "query",
    label: "Saved Query",
    description: "A named SQL query stored in the SQL Editor, attached to this dashboard widget. Version-controlled and shareable.",
    icon: "📝",
    color: "bg-blue-100 border-blue-300 text-blue-900",
  },
  {
    id: "gold",
    label: "Gold Table",
    description: "enterprise.gold.customer_summary — aggregated, cleansed, business-ready data. The trusted source for reporting.",
    icon: "🥇",
    color: "bg-gold-bg border-gold-border text-gold-text",
  },
  {
    id: "silver",
    label: "Silver Table",
    description: "enterprise.silver.commissions — cleaned and validated records with standardised schema. One row per commission event.",
    icon: "🥈",
    color: "bg-silver-bg border-silver-border text-silver-text",
  },
  {
    id: "bronze",
    label: "Bronze Table",
    description: "enterprise.bronze.raw_commissions — raw ingested data, exact copy from source. No transformations applied.",
    icon: "🥉",
    color: "bg-bronze-bg border-bronze-border text-bronze-text",
  },
  {
    id: "source",
    label: "Source System",
    description: "Policy Management System (PMS) — upstream application that generates commission events. Loaded nightly via JDBC connector.",
    icon: "🗄️",
    color: "bg-gray-100 border-gray-300 text-gray-800",
  },
];

export function DashboardLineage() {
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const activeKpi = kpis.find((k) => k.id === selectedKpi);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Executive Dashboard KPIs — click to trace lineage
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <button
              key={kpi.id}
              onClick={() => {
                setSelectedKpi(selectedKpi === kpi.id ? null : kpi.id);
                setSelectedNode(null);
              }}
              className={cn(
                "text-left transition-all rounded-2xl",
                selectedKpi === kpi.id ? "ring-2 ring-primary-500 ring-offset-2 scale-[1.02]" : "hover:scale-[1.01]"
              )}
            >
              <MetricCard
                title={kpi.title}
                value={kpi.value}
                subtitle={kpi.subtitle}
                icon={kpi.icon}
                color={kpi.color}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lineage tree */}
      {selectedKpi && activeKpi && (
        <div className="rounded-2xl border border-primary-200 bg-primary-50 p-6 animate-in slide-in-from-top-2 duration-300">
          <div className="mb-4">
            <h3 className="font-bold text-primary-900 text-base">
              Where does &ldquo;{activeKpi.value}&rdquo; come from?
            </h3>
            <p className="text-xs text-primary-700 mt-1">{activeKpi.description}</p>
          </div>

          {/* Lineage tree top-down */}
          <div className="flex flex-col items-center gap-0">
            {lineageNodes.map((node, i) => (
              <div key={node.id} className="flex flex-col items-center w-full max-w-sm">
                <button
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  className={cn(
                    "w-full rounded-2xl border-2 px-4 py-3 text-left transition-all hover:shadow-md",
                    node.color,
                    selectedNode === node.id ? "ring-2 ring-primary-500 ring-offset-1 shadow-md" : ""
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{node.icon}</span>
                    <span className="font-semibold text-sm">{node.label}</span>
                    <span className="ml-auto text-xs opacity-50">
                      {selectedNode === node.id ? "▲" : "▼"}
                    </span>
                  </div>
                  {selectedNode === node.id && (
                    <p className="text-xs mt-2 opacity-80 leading-relaxed">{node.description}</p>
                  )}
                </button>

                {/* Animated connector line */}
                {i < lineageNodes.length - 1 && (
                  <div className="flex flex-col items-center">
                    <svg width="20" height="32" viewBox="0 0 20 32" className="overflow-visible">
                      <line
                        x1="10"
                        y1="0"
                        x2="10"
                        y2="24"
                        stroke="#93C5FD"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <polygon points="5,22 15,22 10,30" fill="#93C5FD" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-primary-600 mt-4">
            Click any node to see its description. Every number has a traceable origin.
          </p>
        </div>
      )}

      {!selectedKpi && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-gray-400 text-sm">
            Click a KPI card above to trace its full data lineage
          </p>
        </div>
      )}
    </div>
  );
}
