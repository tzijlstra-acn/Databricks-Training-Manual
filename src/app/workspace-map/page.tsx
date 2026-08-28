"use client";

import { Layout, MousePointerClick, Lightbulb } from "lucide-react";
import { WorkspaceExplorer } from "@/components/day1/WorkspaceExplorer";

export default function WorkspaceMapPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-800 flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Reference</p>
              <h1 className="text-3xl font-bold text-gray-900">Workspace Map</h1>
            </div>
          </div>
          <p className="text-lg text-gray-500 max-w-2xl mt-2">
            An interactive map of the Databricks workspace interface. Use this as a reference whenever you need
            to remember what a sidebar section does.
          </p>
        </div>

        {/* Quick tips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              Icon: MousePointerClick,
              color: "#1F2144",
              title: "Click any sidebar item",
              desc: "Opens a detail panel explaining what it does, when to use it, and who typically uses it.",
            },
            {
              Icon: Lightbulb,
              color: "#D97706",
              title: "Look for the pulsing dot",
              desc: "Each sidebar item has a coloured pulsing indicator — a visual hotspot showing it is interactive.",
            },
            {
              Icon: Layout,
              color: "#059669",
              title: "Hover for quick preview",
              desc: "Hover over a sidebar item without clicking to see a brief tooltip before opening the full panel.",
            },
          ].map(({ Icon, color, title, desc }) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: color + "15" }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* FINMA scenario context */}
        <div className="mb-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-xs font-bold text-[#F47920] uppercase tracking-wider mb-3">
            Where does each section appear in the FINMA pipeline?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: "📂", section: "Workspace", role: "Notebooks live here — finma_entity_validation.ipynb, Silver transformation logic, and ad-hoc analysis scripts." },
              { icon: "🗄️", section: "Catalog", role: "All production tables: enterprise.bronze.bayo_raw → enterprise.silver.commissions_clean → enterprise.gold.finma_commission_summary." },
              { icon: "⚙️", section: "Jobs & Pipelines", role: "The nightly FINMA pipeline runs here: CRM Ingest → Entity Attribution → DQ Gate → Gold Build → Abacus Reconciliation." },
              { icon: "🖥️", section: "Compute", role: "Job Cluster for the nightly pipeline; SQL Warehouse for the dashboard and Genie queries; All-Purpose Cluster for notebook development." },
              { icon: "📊", section: "Dashboards", role: "The FINMA executive dashboard: Commission CHF 12.4M · Attribution Rate 99.88% · Abacus Variance CHF 4,200 · Reports 5/5." },
              { icon: "✨", section: "Genie Spaces", role: "Business users ask: 'What is total commission for SWIBRO AG this year?' — Genie queries enterprise.gold.finma_commission_summary and returns the answer." },
              { icon: "🔔", section: "Alerts", role: "An alert fires if enterprise.silver.dq_rejected_records contains any new rows after the nightly pipeline — immediate email to the data team." },
              { icon: "📜", section: "Query History", role: "Every SQL query run against the FINMA tables is logged here — useful for auditing who ran what before a submission." },
            ].map(({ icon, section, role }) => (
              <div key={section} className="bg-white rounded-xl border border-orange-100 px-4 py-3">
                <p className="text-xs font-bold text-gray-700 mb-1">
                  <span className="mr-1.5">{icon}</span>{section}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full-page workspace explorer */}
        <WorkspaceExplorer />

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          This is a visual simulation of the Databricks interface — not the live system.
          Open the real workspace at your organisation&apos;s Databricks URL.
        </p>
      </div>
    </div>
  );
}
