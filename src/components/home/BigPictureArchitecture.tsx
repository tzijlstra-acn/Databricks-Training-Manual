"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayerInfo {
  id: string;
  label: string;
  sublabel: string;
  description: string;
  who: string;
  what: string;
  analogy: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  height: string;
}

const layers: LayerInfo[] = [
  {
    id: "source",
    label: "Source Systems",
    sublabel: "CRM · Mainframe · APIs · Files",
    description: "External systems where data originates — your CRM, mainframe, ERP, or flat files.",
    who: "Source system owners, IT",
    what: "Data is extracted from these systems and loaded into Databricks",
    analogy: "Raw ingredients arriving from suppliers",
    color: "#6B7280",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    textColor: "#374151",
    height: "h-16",
  },
  {
    id: "bronze",
    label: "Bronze Layer",
    sublabel: "Raw ingested data · enterprise.bronze.*",
    description: "The landing zone — data arrives here exactly as it came from source, no transformation.",
    who: "Data Engineers",
    what: "Ingestion jobs load raw data here. Nothing is changed — only appended.",
    analogy: "Your inbox — everything arrives here first, exactly as sent",
    color: "#CD7F32",
    bgColor: "#FDF3E7",
    borderColor: "#E8B86D",
    textColor: "#92400E",
    height: "h-20",
  },
  {
    id: "silver",
    label: "Silver Layer",
    sublabel: "Cleaned · Validated · Standardised · enterprise.silver.*",
    description: "Data is cleaned, validated, and standardised — nulls filled, types corrected, duplicates removed.",
    who: "Data Engineers, Senior Analysts",
    what: "Transformation jobs run DQX checks and produce validated, schema-consistent records.",
    analogy: "Processed mail — sorted, readable, but not yet filed",
    color: "#9CA3AF",
    bgColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    textColor: "#374151",
    height: "h-20",
  },
  {
    id: "gold",
    label: "Gold Layer",
    sublabel: "Business-ready · Aggregated · Trusted · enterprise.gold.*",
    description: "Data shaped for specific business needs — aggregated by period, region, and segment.",
    who: "Analysts, Business Users",
    what: "Gold tables are the source of truth for dashboards, reports, and Genie queries.",
    analogy: "Filed, summarised reports — ready to hand to a business user",
    color: "#D97706",
    bgColor: "#FFFBEB",
    borderColor: "#FCD34D",
    textColor: "#92400E",
    height: "h-20",
  },
  {
    id: "consumption",
    label: "Consumption Layer",
    sublabel: "SQL Queries · Dashboards · Genie AI",
    description: "Where business users interact with data — through SQL, dashboards, or natural language.",
    who: "Business Users, Analysts, Executives",
    what: "All Gold data is accessible here — query it, visualise it, or ask questions in plain English.",
    analogy: "The customer-facing storefront built from everything upstream",
    color: "#F47920",
    bgColor: "#FFF3E8",
    borderColor: "#F4792040",
    textColor: "#1F2144",
    height: "h-24",
  },
  {
    id: "decisions",
    label: "Business Decisions",
    sublabel: "Trusted · Governed · Timely insights",
    description: "The ultimate purpose — trusted data driving better business decisions.",
    who: "Executives, Managers, the entire organisation",
    what: "Every layer above exists to make this layer reliable and fast.",
    analogy: "The final destination — where data becomes value",
    color: "#1F2144",
    bgColor: "#E8E9F0",
    borderColor: "#D0D2E1",
    textColor: "#1F2144",
    height: "h-16",
  },
];

// Capabilities displayed in the diagram sidebar panels

export function BigPictureArchitecture() {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  const active = layers.find((l) => l.id === hoveredLayer);

  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1F2144]">The Big Picture</h2>
        <p className="text-gray-500 mt-1">How data flows from source systems to business decisions. Hover any layer to explore.</p>
      </div>

      <div className="flex gap-6">
        {/* Main diagram */}
        <div className="flex-1 relative">
          {/* Capability chips — left */}
          <div className="absolute -left-32 top-0 bottom-0 flex flex-col justify-around py-8 gap-3 w-28">
            {["Unity Catalog", "Governance", "Data Quality"].map((cap) => (
              <div
                key={cap}
                className="text-xs font-medium text-[#1F2144] bg-[#E8E9F0] border border-[#D0D2E1] rounded-full px-2 py-1 text-center shadow-sm"
              >
                {cap}
              </div>
            ))}
          </div>

          {/* Capability chips — right */}
          <div className="absolute -right-32 top-0 bottom-0 flex flex-col justify-around py-8 gap-3 w-28">
            {["Compute", "Jobs & Pipelines", "Monitoring"].map((cap) => (
              <div
                key={cap}
                className="text-xs font-medium text-[#1F2144] bg-[#E8E9F0] border border-[#D0D2E1] rounded-full px-2 py-1 text-center shadow-sm"
              >
                {cap}
              </div>
            ))}
          </div>

          {/* SVG animated arrows between layers */}
          <div className="relative ml-8 mr-8 space-y-0">
            {layers.map((layer, idx) => (
              <div key={layer.id}>
                {/* Layer band */}
                <div
                  className={cn(
                    "relative rounded-2xl border-2 px-6 py-4 cursor-pointer transition-all duration-300",
                    layer.height,
                    "flex items-center",
                    hoveredLayer === layer.id ? "shadow-xl scale-[1.01]" : "shadow-sm hover:shadow-md"
                  )}
                  style={{
                    backgroundColor: layer.bgColor,
                    borderColor: hoveredLayer === layer.id ? layer.color : layer.borderColor,
                    boxShadow: hoveredLayer === layer.id ? `0 0 0 3px ${layer.color}30` : undefined,
                  }}
                  onMouseEnter={() => setHoveredLayer(layer.id)}
                  onMouseLeave={() => setHoveredLayer(null)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {/* Color indicator */}
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                      <div>
                        <span className="font-bold text-sm" style={{ color: layer.textColor }}>
                          {layer.label}
                        </span>
                        <span className="text-xs ml-2" style={{ color: `${layer.color}80` }}>
                          {layer.sublabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Consumption layer sub-columns */}
                  {layer.id === "consumption" && (
                    <div className="flex gap-3 ml-4">
                      {["SQL / Queries", "Dashboards", "Genie AI"].map((col) => (
                        <div
                          key={col}
                          className="bg-white rounded-xl border border-[#F47920]/30 px-3 py-2 text-xs font-medium text-[#F47920] shadow-sm"
                        >
                          {col}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Animated SVG arrow between layers */}
                {idx < layers.length - 1 && (
                  <div className="flex justify-center my-1 h-8 items-center">
                    <svg width="24" height="32" viewBox="0 0 24 32" className="overflow-visible">
                      <defs>
                        <marker id={`arrow-${idx}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <path d="M0,0 L6,3 L0,6 Z" fill={layers[idx + 1].color} opacity="0.7" />
                        </marker>
                      </defs>
                      <line
                        x1="12" y1="0" x2="12" y2="26"
                        stroke={layers[idx + 1].color}
                        strokeWidth="2.5"
                        strokeOpacity="0.6"
                        markerEnd={`url(#arrow-${idx})`}
                        strokeDasharray="6 3"
                        className="flow-path"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="w-72 shrink-0">
          {active ? (
            <div
              className="rounded-2xl border-2 p-5 h-full transition-all duration-200"
              style={{ backgroundColor: active.bgColor, borderColor: active.borderColor }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: active.color }}
                />
                <h3 className="font-bold text-base" style={{ color: active.textColor }}>
                  {active.label}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">What it is</p>
                  <p className="text-sm text-gray-700">{active.description}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Who uses it</p>
                  <p className="text-sm text-gray-700">{active.who}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">What happens here</p>
                  <p className="text-sm text-gray-700">{active.what}</p>
                </div>
                <div
                  className="rounded-xl p-3 border"
                  style={{ backgroundColor: `${active.color}10`, borderColor: `${active.color}30` }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: active.color }}>
                    Think of it as...
                  </p>
                  <p className="text-sm italic text-gray-700">&ldquo;{active.analogy}&rdquo;</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-5 h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <span className="text-2xl">👆</span>
              </div>
              <p className="text-sm font-medium text-gray-600">Hover any layer</p>
              <p className="text-xs text-gray-400 mt-1">to see what happens there</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
