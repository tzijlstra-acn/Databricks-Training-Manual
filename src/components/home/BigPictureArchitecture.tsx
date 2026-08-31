"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
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
    description: "External systems where data originates: your CRM, mainframe, ERP, or flat files.",
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
    description: "The landing zone: data arrives here exactly as it came from the source, with no transformation.",
    who: "Data Engineers",
    what: "Ingestion jobs load raw data here. Nothing is changed, only appended.",
    analogy: "Your inbox: everything arrives here first, exactly as sent",
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
    description: "Data is cleaned, validated, and standardised: nulls filled, types corrected, duplicates removed.",
    who: "Data Engineers, Senior Analysts",
    what: "Transformation jobs run DQX checks and produce validated, schema-consistent records.",
    analogy: "Processed mail: sorted and readable, but not yet filed",
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
    description: "Data shaped for specific business needs, aggregated by period, region, and segment.",
    who: "Analysts, Business Users",
    what: "Gold tables are the source of truth for dashboards, reports, and Genie queries.",
    analogy: "Filed, summarised reports, ready to hand to a business user",
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

const TOUR_DELAY = 1800; // ms per layer

export function BigPictureArchitecture() {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [touring, setTouring] = useState(false);
  const [userTookControl, setUserTookControl] = useState(false);
  const tourRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stopTour = useCallback(() => {
    if (tourRef.current) clearTimeout(tourRef.current);
    setTouring(false);
  }, []);

  // Auto-tour when section enters viewport for the first time
  useEffect(() => {
    if (!inView || userTookControl) return;

    setTouring(true);
    let step = 0;

    const advance = () => {
      if (step >= layers.length) {
        setHoveredLayer(null);
        setTouring(false);
        return;
      }
      setHoveredLayer(layers[step].id);
      step++;
      tourRef.current = setTimeout(advance, TOUR_DELAY);
    };

    // Small initial delay so the section has finished animating in
    tourRef.current = setTimeout(advance, 400);

    return () => {
      if (tourRef.current) clearTimeout(tourRef.current);
    };
  }, [inView, userTookControl]);

  const handleMouseEnter = (id: string) => {
    if (touring) stopTour();
    setUserTookControl(true);
    setHoveredLayer(id);
  };

  const handleMouseLeave = () => {
    setHoveredLayer(null);
  };

  const active = layers.find((l) => l.id === hoveredLayer);

  return (
    <section ref={sectionRef} className="py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2144]">The Big Picture</h2>
          <p className="text-gray-500 mt-1">How data flows from source systems to business decisions. Hover any layer to explore.</p>
        </div>
        {touring && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F2144]/8 border border-[#1F2144]/20 text-xs text-[#1F2144]/70 font-medium flex-shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F47920] animate-pulse" />
            Auto-touring
          </motion.div>
        )}
        {!touring && userTookControl && (
          <span className="text-xs text-gray-400 flex-shrink-0 mt-1">Hover any layer</span>
        )}
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

          {/* Layer bands */}
          <div className="relative ml-8 mr-8 space-y-0">
            {layers.map((layer, idx) => {
              const isActive = hoveredLayer === layer.id;
              return (
                <div key={layer.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                  >
                    <div
                      className={cn(
                        "relative rounded-2xl border-2 px-6 py-4 cursor-pointer transition-all duration-300",
                        layer.height,
                        "flex items-center",
                        isActive ? "shadow-xl scale-[1.01]" : "shadow-sm hover:shadow-md"
                      )}
                      style={{
                        backgroundColor: layer.bgColor,
                        borderColor: isActive ? layer.color : layer.borderColor,
                        boxShadow: isActive ? `0 0 0 3px ${layer.color}30` : undefined,
                      }}
                      onMouseEnter={() => handleMouseEnter(layer.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
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

                      {/* Consumption sub-columns */}
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
                  </motion.div>

                  {/* Arrow between layers */}
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
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info panel */}
        <div className="w-72 shrink-0">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border-2 p-5 h-full"
              style={{ backgroundColor: active.bgColor, borderColor: active.borderColor }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: active.color }} />
                <h3 className="font-bold text-base" style={{ color: active.textColor }}>{active.label}</h3>
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
                  <p className="text-xs font-semibold mb-1" style={{ color: active.color }}>Think of it as...</p>
                  <p className="text-sm italic text-gray-700">&ldquo;{active.analogy}&rdquo;</p>
                </div>
              </div>
            </motion.div>
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
