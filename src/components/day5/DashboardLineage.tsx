"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/shared/MetricCard";
import { Users, DollarSign, ShieldCheck, Workflow } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const kpis = [
  {
    id: "commission",
    title: "FINMA Commission",
    value: "CHF 12.4M",
    subtitle: "2025 YTD · All 5 entities",
    icon: DollarSign,
    color: "gold" as const,
    description: "SUM(commission_chf) from enterprise.gold.finma_commission_summary — total FINMA-reportable commission across all 5 Howden Swiss entities for the 2025 reporting cycle.",
    highlightNode: "gold",
  },
  {
    id: "attribution",
    title: "Attribution Rate",
    value: "99.88%",
    subtitle: "Rows attributed to entity",
    icon: ShieldCheck,
    color: "green" as const,
    description: "Percentage of Silver rows with a confirmed entity attribution (HW-CH-01 to HW-CH-05). Unattributed rows are quarantined in dq_rejected_records and reviewed before submission.",
    highlightNode: "silver",
  },
  {
    id: "abacus",
    title: "Abacus Variance",
    value: "CHF 4,200",
    subtitle: "Max variance · 0.03%",
    icon: Users,
    color: "blue" as const,
    description: "Largest commission variance vs Abacus cashflows across all 5 entities. Well within the CHF 10,000 / 5% threshold defined in the FINMA reporting process documentation.",
    highlightNode: "gold",
  },
  {
    id: "pipelines",
    title: "Reports Ready",
    value: "5 / 5",
    subtitle: "Submission by 31 May",
    icon: Workflow,
    color: "default" as const,
    description: "All 5 entity-level FINMA reports validated in Gold and cleared for submission. Submission deadline: 31 May per Article 190b of the Insurance Supervision Ordinance (ISO).",
    highlightNode: "dashboard",
  },
];

const lineageNodes = [
  {
    id: "source",
    label: "Source Systems",
    table: "BAYO · IBS · MAX · KETL · VP",
    icon: "🗄️",
    color: "#6B7280",
    bg: "#F9FAFB",
    border: "#E5E7EB",
    description: "5 CRM extracts: BAYO (Howden Schweiz AG + SWIBRO AG), IBS Alabus (Howden Schweiz AG), MAX (Howden Broker Services AG), KETL (Perennial AG), Vorsorge Partner CRM. Delivered as Excel exports by data stewards.",
  },
  {
    id: "bronze",
    label: "Bronze Tables",
    table: "enterprise.bronze.*_raw",
    icon: "🥉",
    color: "#92400E",
    bg: "#FEF3C7",
    border: "#FDE68A",
    description: "enterprise.bronze.bayo_raw, ibs_raw, max_raw, ketl_raw, vp_raw — raw CRM extracts stored exactly as delivered by the data stewards. No transformations. Always recoverable.",
  },
  {
    id: "silver",
    label: "Silver Table",
    table: "enterprise.silver.commissions_clean",
    icon: "🥈",
    color: "#475569",
    bg: "#F1F5F9",
    border: "#CBD5E1",
    description: "enterprise.silver.commissions_clean — all 5 CRM extracts merged, commission field standardised to commission_chf, every row attributed to exactly one entity code. DQX rules applied.",
  },
  {
    id: "gold",
    label: "Gold Table",
    table: "enterprise.gold.finma_commission_summary",
    icon: "🥇",
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
    description: "enterprise.gold.finma_commission_summary — 5 rows, one per entity, with FINMA-reportable totals. Built by aggregating all validated Silver records and reconciling against Abacus.",
  },
  {
    id: "query",
    label: "SQL Query",
    table: "finma_dashboard_metrics",
    icon: "📝",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    description: "A named SQL query stored in the SQL Editor, attached to this dashboard widget. Version-controlled and shareable. Runs on SQL Warehouse at dashboard load or scheduled refresh.",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    table: "FINMA Reporting · 2025",
    icon: "📊",
    color: "#6D28D9",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    description: "A chart or KPI tile on the Databricks SQL Dashboard. Queries run on every page load or scheduled refresh. Every number is traceable back through Silver and Bronze to the original CRM extract.",
  },
];

// ─── Animated flow edge ───────────────────────────────────────────────────────

function FlowEdge({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center w-10 flex-shrink-0">
      <svg width="40" height="16" viewBox="0 0 40 16" className="overflow-visible">
        <line x1="0" y1="8" x2="32" y2="8" stroke={active ? "#6D28D9" : "#D1D5DB"} strokeWidth="1.5" strokeDasharray="4 2" />
        <polygon points="28,4 36,8 28,12" fill={active ? "#6D28D9" : "#D1D5DB"} />
        {active && (
          <motion.circle
            r="2.5"
            fill="#6D28D9"
            initial={{ cx: 0 }}
            animate={{ cx: 36 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            cy="8"
          />
        )}
      </svg>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardLineage() {
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const activeKpi = kpis.find((k) => k.id === selectedKpi);
  const highlightNode = activeKpi?.highlightNode ?? null;
  const isActive = selectedKpi !== null;

  const selectedNodeData = lineageNodes.find((n) => n.id === selectedNode);

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
                selectedKpi === kpi.id ? "ring-2 ring-violet-500 ring-offset-2 scale-[1.02]" : "hover:scale-[1.01]"
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

      {/* Lineage graph — always visible, activates when KPI selected */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Lineage</span>
          {isActive ? (
            <span className="text-xs text-violet-600 font-medium">
              Tracing: <strong>{activeKpi?.title}</strong> ← click any node for details
            </span>
          ) : (
            <span className="text-xs text-gray-400">Select a KPI above to activate the flow</span>
          )}
        </div>

        {/* Horizontal chain */}
        <div className="p-5 overflow-x-auto">
          <div className="flex items-center min-w-max mx-auto" style={{ width: "fit-content" }}>
            {lineageNodes.map((node, i) => {
              const isHighlight = highlightNode === node.id;
              const isSelected = selectedNode === node.id;
              return (
                <div key={node.id} className="flex items-center">
                  <motion.button
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-2xl border-2 px-3 py-2.5 w-36 text-left transition-all"
                    style={{
                      backgroundColor: isActive ? node.bg : "#F9FAFB",
                      borderColor: isSelected
                        ? "#6D28D9"
                        : isHighlight && isActive
                        ? node.border
                        : isActive
                        ? `${node.border}`
                        : "#E5E7EB",
                      boxShadow: isSelected
                        ? `0 0 0 3px #6D28D960, 0 4px 16px ${node.color}30`
                        : isHighlight && isActive
                        ? `0 4px 16px ${node.color}30`
                        : "none",
                      opacity: isActive ? 1 : 0.65,
                    }}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="text-lg">{node.icon}</span>
                      {isHighlight && isActive && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: node.color, color: "#fff" }}
                        >
                          KEY
                        </motion.span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold leading-tight" style={{ color: isActive ? node.color : "#6B7280" }}>
                      {node.label}
                    </p>
                    <p className="text-[9px] font-mono text-gray-400 mt-0.5 leading-tight truncate">
                      {node.table}
                    </p>
                  </motion.button>

                  {i < lineageNodes.length - 1 && (
                    <FlowEdge active={isActive} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected KPI description */}
        <AnimatePresence>
          {isActive && activeKpi && !selectedNode && (
            <motion.div
              key={activeKpi.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100"
            >
              <div className="px-5 py-4 bg-violet-50">
                <p className="text-xs font-bold text-violet-800 mb-1">
                  {activeKpi.title} — where does &ldquo;{activeKpi.value}&rdquo; come from?
                </p>
                <p className="text-xs text-violet-700 leading-relaxed">{activeKpi.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected node description */}
        <AnimatePresence>
          {selectedNodeData && (
            <motion.div
              key={selectedNodeData.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100"
            >
              <div className="px-5 py-4" style={{ backgroundColor: selectedNodeData.bg }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{selectedNodeData.icon}</span>
                  <p className="text-xs font-bold" style={{ color: selectedNodeData.color }}>
                    {selectedNodeData.label}
                  </p>
                  <span className="text-[9px] font-mono text-gray-400 ml-2">{selectedNodeData.table}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{selectedNodeData.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle prompt */}
        {!isActive && (
          <div className="border-t border-gray-100 px-5 py-3 text-center">
            <p className="text-xs text-gray-400">
              Click a KPI card above — the lineage chain activates and shows the data flow from source to dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
