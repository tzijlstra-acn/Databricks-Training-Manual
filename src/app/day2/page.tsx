"use client";

import { useEffect } from "react";
import { ArrowRight, Database } from "lucide-react";
import { markDayVisited } from "@/lib/progress";
import { CatalogTree } from "@/components/day2/CatalogTree";
import { MedallionFlow } from "@/components/day2/MedallionFlow";

export default function Day2Page() {
  useEffect(() => {
    markDayVisited(2);
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#0891B2" }}>
              <span className="text-white font-bold text-sm">D2</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#0891B2" }}>Day 2</p>
              <h1 className="text-3xl font-bold text-gray-900">Data & Catalog — Find Your Data</h1>
            </div>
          </div>
          <p className="text-lg text-gray-500 max-w-2xl mt-2">
            Navigate Unity Catalog, understand the Medallion Architecture, and know exactly which layer to use for each purpose.
          </p>
          <div
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border"
            style={{ backgroundColor: "#E0F2FE", color: "#0C4A6E", borderColor: "#BAE6FD" }}
          >
            <ArrowRight className="w-4 h-4" />
            Outcome: Navigate Unity Catalog and understand Medallion layers
          </div>
        </div>

        {/* Catalog Tree */}
        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Unity Catalog Explorer</h2>
            <p className="text-sm text-gray-500 mt-1">
              Browse the catalog hierarchy: Catalog → Schema → Table. Click any table to see its details.
              Toggle between technical naming and an everyday building analogy.
            </p>
          </div>
          <CatalogTree />
        </section>

        {/* Medallion flow */}
        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Medallion Architecture — Data in Motion</h2>
            <p className="text-sm text-gray-500 mt-1">
              Follow a single customer record through Bronze ingestion, Silver cleaning, and Gold aggregation.
              See exactly what changes at each stage.
            </p>
          </div>
          <MedallionFlow />
        </section>

        {/* Layer quick-reference table */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Layer Quick Reference</h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Layer</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">State of data</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Who queries it</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Use for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    layer: "Bronze",
                    color: "#CD7F32",
                    bg: "#FDF3E7",
                    state: "Raw, unmodified source data",
                    who: "Data Engineers only",
                    use: "Debugging, re-processing, audit trail",
                  },
                  {
                    layer: "Silver",
                    color: "#6B7280",
                    bg: "#F3F4F6",
                    state: "Cleaned, validated, standardised",
                    who: "Data Engineers, Data Scientists",
                    use: "ML features, detailed analysis, joins",
                  },
                  {
                    layer: "Gold",
                    color: "#D97706",
                    bg: "#FFFBEB",
                    state: "Aggregated, business-ready",
                    who: "Analysts, Business Users, Executives",
                    use: "Dashboards, KPIs, reports",
                  },
                ].map(({ layer, color, bg, state, who, use }) => (
                  <tr key={layer} style={{ backgroundColor: bg }}>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-full text-xs"
                        style={{ color, backgroundColor: color + "20", border: `1px solid ${color}40` }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {layer}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{state}</td>
                    <td className="px-5 py-3 text-gray-700">{who}</td>
                    <td className="px-5 py-3 text-gray-700">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
