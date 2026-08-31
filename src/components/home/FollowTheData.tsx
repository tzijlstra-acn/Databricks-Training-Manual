"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

interface DataStage {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  tableName: string;
  record: Record<string, string | null>;
  changedFields: string[];
  fieldNotes?: Record<string, string>;
  tags: string[];
  description: string;
}

const stages: DataStage[] = [
  {
    id: "bronze",
    label: "Bronze",
    color: "#B45309",
    bgColor: "#FEF3C7",
    borderColor: "#FDE68A",
    textColor: "#92400E",
    tableName: "enterprise.bronze.bayo_commission_raw",
    record: {
      deal_id:       "BAYO-2025-441",
      entity_ref:    "HW-01",
      insured:       "helvetica ag",
      brokerage_fee: '"18500.00"',
      ccy:           "CHF",
      inception:     "20250101",
    },
    changedFields: [],
    tags: ["Raw", "Source-aligned", "Unvalidated"],
    description:
      "Extracted from BAYO CRM. Amounts arrive as strings, insured is lowercase, inception is YYYYMMDD. Not yet typed, normalised, or attributed.",
  },
  {
    id: "silver",
    label: "Silver",
    color: "#475569",
    bgColor: "#F1F5F9",
    borderColor: "#CBD5E1",
    textColor: "#334155",
    tableName: "enterprise.silver.commission_validated",
    record: {
      deal_id:        "BAYO-2025-441",
      entity:         "Howden Schweiz AG",
      insured_name:   "Helvetica AG",
      commission_chf: "18500.00",
      currency:       "CHF",
      coverage_start: "2025-01-01",
      coverage_end:   "2025-12-31",
      is_valid:       "true",
    },
    changedFields: ["entity", "insured_name", "commission_chf", "currency", "coverage_start", "coverage_end", "is_valid"],
    fieldNotes: {
      entity:         "← entity_ref (resolved)",
      insured_name:   "← insured (title-cased)",
      commission_chf: "← brokerage_fee (cast to DOUBLE)",
      currency:       "← ccy (normalised)",
      coverage_start: "← inception (ISO 8601)",
      coverage_end:   "derived from coverage_start + 364d",
      is_valid:       "DQX rule result",
    },
    tags: ["Validated", "Typed", "Standardised"],
    description:
      "Entity resolved via lookup table, string amount cast to DOUBLE, date normalised to ISO 8601, insured title-cased, DQX rules applied.",
  },
  {
    id: "gold",
    label: "Gold",
    color: "#D97706",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
    textColor: "#92400E",
    tableName: "enterprise.gold.commission_by_entity",
    record: {
      entity:         "Howden Schweiz AG",
      period:         "2025-H1",
      commission_chf: "CHF 52,700.00",
      deal_count:     "2",
      finma_ready:    "true",
    },
    changedFields: ["period", "commission_chf", "deal_count", "finma_ready"],
    fieldNotes: {
      commission_chf: "aggregated (2 deals)",
      deal_count:     "COUNT(deal_id) per entity",
      finma_ready:    "Abacus delta < CHF 10k / 5%",
    },
    tags: ["Aggregated", "FINMA-ready", "Reporting"],
    description:
      "Aggregated by entity for the FINMA Article 190b submission. This is the table reconciled against Abacus cashflows before the 31 May deadline.",
  },
];

export function FollowTheData() {
  const [playing, setPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [dotPosition, setDotPosition] = useState(0);
  const [completed, setCompleted] = useState(false);

  const play = async () => {
    if (playing) return;
    setPlaying(true);
    setCompleted(false);

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i);
      setDotPosition(i);
      await new Promise((r) => setTimeout(r, 2000));
    }

    setCompleted(true);
    setPlaying(false);
  };

  const reset = () => {
    setPlaying(false);
    setCurrentStage(0);
    setDotPosition(0);
    setCompleted(false);
  };

  const activeStage = stages[currentStage];

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2144]">Follow The Record</h2>
          <p className="text-gray-500 mt-1">
            Watch deal <span className="font-mono font-semibold text-gray-700">BAYO-2025-441</span> transform through all three layers, field by field.
          </p>
        </div>
        <div className="flex gap-2">
          {(completed || currentStage > 0) && (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
          <button
            onClick={play}
            disabled={playing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#F47920] text-white hover:bg-[#E06810] disabled:opacity-60 transition-colors text-sm font-medium shadow-sm"
          >
            <Play size={14} />
            {playing ? "Playing..." : currentStage === 0 ? "Play Animation" : "Replay"}
          </button>
        </div>
      </div>

      {/* Stage progress */}
      <div className="relative mb-8">
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        <motion.div
          className="absolute top-6 left-0 h-0.5 bg-[#F47920] z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${(dotPosition / (stages.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <div className="flex justify-between relative z-10">
          {stages.map((stage, idx) => {
            const isActive = idx <= currentStage;
            const isCurrent = idx === currentStage;
            return (
              <div key={stage.id} className="flex flex-col items-center gap-2">
                <motion.div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: isActive ? stage.bgColor : "#F9FAFB",
                    borderColor: isCurrent ? stage.color : isActive ? `${stage.color}60` : "#E5E7EB",
                    boxShadow: isCurrent ? `0 0 16px ${stage.color}50` : "none",
                  }}
                  animate={isCurrent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: isCurrent && playing ? Infinity : 0 }}
                >
                  <span className="text-lg font-bold" style={{ color: isActive ? stage.color : "#D1D5DB" }}>
                    {stage.label[0]}
                  </span>
                </motion.div>
                <span className="text-xs font-bold" style={{ color: isActive ? stage.color : "#9CA3AF" }}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border-2 p-6"
          style={{ backgroundColor: activeStage.bgColor, borderColor: activeStage.borderColor }}
        >
          {/* Stage header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeStage.color }}>
                {activeStage.label} Layer
              </span>
              <p className="text-sm text-gray-600 mt-1 max-w-lg">{activeStage.description}</p>
            </div>
            <div className="flex gap-1 ml-4 flex-wrap justify-end">
              {activeStage.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full border font-medium"
                  style={{
                    color: activeStage.textColor,
                    borderColor: activeStage.borderColor,
                    backgroundColor: `${activeStage.color}15`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Record card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Faux titlebar */}
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
              </div>
              <span className="text-xs text-gray-400 font-mono">{activeStage.tableName}</span>
            </div>

            {/* Fields — compact single-line rows: KEY | value  ← note */}
            <div className="divide-y divide-gray-50">
              {Object.entries(activeStage.record).map(([key, value]) => {
                const isChanged = activeStage.changedFields.includes(key);
                const note = activeStage.fieldNotes?.[key];
                return (
                  <motion.div
                    key={activeStage.id + key}
                    initial={{ backgroundColor: isChanged ? "#D1FAE5" : "transparent" }}
                    animate={{ backgroundColor: "transparent" }}
                    transition={{ duration: 1.6, ease: "easeOut", delay: 0.1 }}
                    className="flex items-baseline gap-3 px-4 py-2"
                  >
                    <span
                      className="text-[10px] font-mono uppercase tracking-wide font-semibold w-32 flex-shrink-0"
                      style={{ color: isChanged ? "#059669" : "#9CA3AF" }}
                    >
                      {key}
                      {isChanged && (
                        <span className="ml-0.5 text-[9px] normal-case font-normal text-emerald-400">✱</span>
                      )}
                    </span>
                    <span
                      className={`text-xs font-mono font-medium flex-shrink-0 ${
                        value === null ? "text-red-400 italic" : "text-gray-900"
                      }`}
                    >
                      {value === null ? "NULL" : value}
                    </span>
                    {note && (
                      <span className="text-[9px] text-gray-400 font-mono ml-auto truncate">
                        {note}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Legend for this stage */}
          {activeStage.changedFields.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300" />
                Fields transformed this stage
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800"
        >
          <strong>BAYO-2025-441 journey complete.</strong> Raw string amount cast to{" "}
          <span className="font-mono">DOUBLE</span>, entity attributed, dates normalised. Now
          aggregated into the Gold table ready for the FINMA Article 190b submission.
        </motion.div>
      )}
    </section>
  );
}
