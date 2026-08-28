"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const layers = [
  {
    id: "bronze",
    name: "Bronze",
    subtitle: "Raw Ingestion",
    emoji: "🥉",
    bg: "bg-bronze-bg",
    border: "border-bronze-border",
    text: "text-bronze-text",
    headerBg: "bg-[#CD7F32]",
    record: {
      customer_id: "C-00482",
      first_name: "thomas ",
      last_name: "ZIJLSTRA",
      email: "T.Zijlstra@accenture.com ",
      commission_amount: "1250.50",
      record_date: "20240115",
      source: "CRM_EXPORT_v3",
    },
    issues: ["Trailing whitespace in first_name", "Inconsistent casing (ZIJLSTRA)", "Date not ISO format", "Trailing space in email"],
    description: "Exact copy of source data. No changes. Preserves the original — warts and all.",
  },
  {
    id: "silver",
    name: "Silver",
    subtitle: "Cleaned & Validated",
    emoji: "🥈",
    bg: "bg-silver-bg",
    border: "border-silver-border",
    text: "text-silver-text",
    headerBg: "bg-[#6B7280]",
    record: {
      customer_id: "C-00482",
      first_name: "Thomas",
      last_name: "Zijlstra",
      email: "t.zijlstra@accenture.com",
      commission_amount: 1250.50,
      record_date: "2024-01-15",
      is_valid: true,
    },
    fixes: ["Trimmed whitespace", "Normalised casing", "Parsed ISO date", "Lowercased email", "Cast to decimal"],
    description: "Cleaned, validated, and standardised. Safe to use for analysis. Still one row per source record.",
  },
  {
    id: "gold",
    name: "Gold",
    subtitle: "Business-Ready",
    emoji: "🥇",
    bg: "bg-gold-bg",
    border: "border-gold-border",
    text: "text-gold-text",
    headerBg: "bg-[#D97706]",
    record: {
      customer_id: "C-00482",
      full_name: "Thomas Zijlstra",
      email: "t.zijlstra@accenture.com",
      total_commission_ytd: 18430.00,
      commission_count: 14,
      last_commission_date: "2024-01-15",
      tier: "Senior",
    },
    additions: ["Aggregated 14 commissions into YTD total", "Added derived tier field", "Joined with employee master", "Optimised for dashboard queries"],
    description: "Aggregated and enriched for reporting. One row per business entity. Query this layer for dashboards.",
  },
];

const arrowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.45, ease: "easeOut" },
  }),
};

function RecordField({ label, value }: { label: string; value: string | number | boolean }) {
  const display = typeof value === "boolean" ? (value ? "true" : "false") : String(value);
  const isHighlighted = typeof value === "number" || (typeof value === "string" && value.includes(" "));
  return (
    <div className="flex items-start gap-2 py-1 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400 font-mono w-36 flex-shrink-0">{label}</span>
      <span
        className={cn(
          "text-xs font-mono flex-1",
          isHighlighted ? "text-gray-800 font-semibold" : "text-gray-700"
        )}
      >
        {display}
      </span>
    </div>
  );
}

export function MedallionFlow() {
  const [whyOpen, setWhyOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Flow panels */}
      <div className="flex flex-col lg:flex-row items-stretch gap-0">
        {layers.map((layer, idx) => (
          <div key={layer.id} className="flex flex-col lg:flex-row items-stretch flex-1">
            {/* Layer card */}
            <motion.div
              className={cn(
                "flex-1 rounded-2xl border-2 overflow-hidden",
                layer.border
              )}
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              {/* Header */}
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ backgroundColor: layer.headerBg }}
              >
                <span className="text-xl">{layer.emoji}</span>
                <div>
                  <h3 className="font-bold text-white text-base">{layer.name}</h3>
                  <p className="text-white/70 text-xs">{layer.subtitle}</p>
                </div>
              </div>

              {/* Record preview */}
              <div className={cn("px-4 py-3", layer.bg)}>
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Sample Record</p>
                <div className="bg-white rounded-xl border border-gray-100 px-3 py-2">
                  {Object.entries(layer.record).map(([k, v]) => (
                    <RecordField key={k} label={k} value={v as string | number | boolean} />
                  ))}
                </div>
              </div>

              {/* Issues / Fixes / Additions */}
              <div className={cn("px-4 py-3 border-t", layer.border, layer.bg)}>
                {"issues" in layer && (
                  <>
                    <p className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Issues present
                    </p>
                    <ul className="space-y-1">
                      {layer.issues?.map((issue) => (
                        <li key={issue} className="text-xs text-red-600 flex items-start gap-1.5">
                          <span className="mt-0.5 text-red-400">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {"fixes" in layer && (
                  <>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Transformations applied</p>
                    <ul className="space-y-1">
                      {layer.fixes?.map((fix) => (
                        <li key={fix} className="text-xs text-green-700 flex items-start gap-1.5">
                          <span className="text-green-400">✓</span>
                          {fix}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {"additions" in layer && (
                  <>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Aggregations & enrichment</p>
                    <ul className="space-y-1">
                      {layer.additions?.map((add) => (
                        <li key={add} className="text-xs text-amber-700 flex items-start gap-1.5">
                          <span className="text-amber-500">★</span>
                          {add}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <p className="text-xs text-gray-600 leading-relaxed">{layer.description}</p>
              </div>
            </motion.div>

            {/* Arrow between panels */}
            {idx < layers.length - 1 && (
              <motion.div
                className="flex items-center justify-center px-2 py-4 lg:py-0"
                initial="hidden"
                animate="visible"
                variants={arrowVariants}
                transition={{ delay: (idx + 1) * 0.18 + 0.1 }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <ArrowRight className="w-8 h-8 text-gray-300 animate-[flow_2s_ease-in-out_infinite]" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Transform</span>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Why not report from Bronze section */}
      <motion.div
        className="mt-6 rounded-2xl border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-gray-800">Why not report directly from Bronze?</span>
          </div>
          {whyOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {whyOpen && (
          <div className="px-5 py-5 bg-white border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  emoji: "🐛",
                  title: "Dirty data",
                  body: "Bronze contains exactly what arrived from the source — misspellings, nulls, wrong types, duplicates. Reporting on it means your dashboards will reflect those errors directly.",
                },
                {
                  emoji: "📐",
                  title: "No standards",
                  body: "Column names, date formats, and casing vary between source systems. Without Silver's standardisation, a JOIN between two Bronze tables would silently drop or duplicate rows.",
                },
                {
                  emoji: "🔢",
                  title: "Wrong granularity",
                  body: "Executives want totals, not raw transaction rows. Bronze has one row per event. Gold aggregates those into the single-number KPIs that dashboards need.",
                },
              ].map(({ emoji, title, body }) => (
                <div key={title} className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                  <p className="text-2xl mb-2">{emoji}</p>
                  <p className="text-sm font-semibold text-amber-900 mb-1">{title}</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
              <span className="text-xl">✅</span>
              <p className="text-sm text-green-800 leading-relaxed">
                <strong>Bottom line:</strong> Always query <strong>Gold</strong> for dashboards and reports.
                Query <strong>Silver</strong> for detailed analysis and data science.
                Only query <strong>Bronze</strong> when debugging pipeline issues.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
