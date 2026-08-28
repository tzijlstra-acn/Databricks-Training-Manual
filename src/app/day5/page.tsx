"use client";

import { useEffect } from "react";
import { markDayVisited } from "@/lib/progress";
import { DashboardLineage } from "@/components/day5/DashboardLineage";
import { GenieDemo } from "@/components/day5/GenieDemo";
import { ArrowRight, BarChart3 } from "lucide-react";

const capstoneNodes = [
  { id: "source", label: "Source System", color: "#6B7280", bg: "#F9FAFB", desc: "CRM, Mainframe, APIs" },
  { id: "bronze", label: "Bronze", color: "#CD7F32", bg: "#FDF3E7", desc: "Raw ingested data" },
  { id: "silver", label: "Silver", color: "#9CA3AF", bg: "#F3F4F6", desc: "Cleaned & validated" },
  { id: "gold", label: "Gold", color: "#D97706", bg: "#FFFBEB", desc: "Business-ready" },
  { id: "sql", label: "SQL / Queries", color: "#0891B2", bg: "#EFF8FB", desc: "Saved queries" },
  { id: "dashboard", label: "Dashboard", color: "#7C3AED", bg: "#F5F3FF", desc: "Visual KPIs" },
  { id: "genie", label: "Genie AI", color: "#DC2626", bg: "#FEF2F2", desc: "Natural language" },
  { id: "decision", label: "Business Decision", color: "#1F2144", bg: "#E8E9F0", desc: "Value created" },
];

const supportingCapabilities = [
  "Unity Catalog", "Governance", "Compute", "Jobs", "Pipelines", "Data Quality", "Monitoring", "Alerts",
];

export default function Day5Page() {
  useEffect(() => {
    markDayVisited(5);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#7C3AED" }}>
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7C3AED" }}>Day 5</p>
            <h1 className="text-3xl font-bold text-gray-900">Analyze &amp; Apply</h1>
          </div>
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-2">
          Turn trusted data into business decisions. Dashboards, lineage, and natural language analytics.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 text-purple-800 text-sm font-medium px-4 py-2 rounded-full border border-purple-100">
          <ArrowRight className="w-4 h-4" />
          Outcome: Navigate from dashboard KPI back to source data and ask questions in plain English
        </div>
      </div>

      {/* Dashboard Lineage */}
      <section className="mb-14">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">Dashboard Lineage — Where Does This Number Come From?</h2>
          <p className="text-sm text-gray-500 mt-1">Click any KPI card to trace its origin back to the source.</p>
        </div>
        <DashboardLineage />
      </section>

      {/* Genie Demo */}
      <section className="mb-14">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">Genie — Ask Your Data Anything</h2>
          <p className="text-sm text-gray-500 mt-1">Natural language queries powered by AI. No SQL knowledge required.</p>
        </div>
        <GenieDemo />
      </section>

      {/* End-to-End Capstone */}
      <section className="mb-14">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">End-to-End: The Complete Journey</h2>
          <p className="text-sm text-gray-500 mt-1">Every step from raw data to business value. Click any node to explore.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {/* Main flow */}
          <div className="flex items-center gap-1 overflow-x-auto pb-4">
            {capstoneNodes.map((node, idx) => (
              <div key={node.id} className="flex items-center gap-1 shrink-0">
                <div
                  className="rounded-xl border-2 p-3 cursor-pointer hover:shadow-md transition-all text-center min-w-[90px]"
                  style={{ backgroundColor: node.bg, borderColor: `${node.color}50` }}
                >
                  <p className="text-xs font-bold" style={{ color: node.color }}>{node.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{node.desc}</p>
                </div>
                {idx < capstoneNodes.length - 1 && (
                  <ArrowRight size={14} className="text-gray-300 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Supporting capabilities */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Supporting Capabilities</p>
            <div className="flex flex-wrap gap-2">
              {supportingCapabilities.map((cap) => (
                <span
                  key={cap}
                  className="text-xs font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-3 py-1"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
