"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertTriangle, Lock, Layers } from "lucide-react";

// ─── Record data ─────────────────────────────────────────────────────────────

const BRONZE_RECORDS = [
  {
    id: "r1",
    fields: {
      deal_id: "BAYO-2025-441",
      entity_ref: "HW-01",
      insured: "helvetica ag",
      brokerage_fee: '"18500.00"',
      ccy: "CHF",
      inception: "20250101",
    },
    issueFields: ["insured", "brokerage_fee", "inception"],
    issues: ["string not float", "lowercase insured", "YYYYMMDD date"],
  },
  {
    id: "r2",
    fields: {
      deal_id: "BAYO-2025-442",
      entity_ref: "SW-02",
      insured: "ZURICH AIRPORT SERVICES GMBH",
      brokerage_fee: '"6200"',
      ccy: "chf",
      inception: "20250201",
    },
    issueFields: ["insured", "brokerage_fee", "ccy"],
    issues: ["string not float", "ALL CAPS insured", "ccy not uppercase"],
  },
  {
    id: "r3",
    fields: {
      deal_id: "BAYO-2025-449",
      entity_ref: "???",
      insured: "GLOBAL RE HOLDINGS",
      brokerage_fee: '"92000"',
      ccy: "USD",
      inception: "20250115",
    },
    issueFields: ["entity_ref", "brokerage_fee", "ccy"],
    issues: ["entity unresolvable", "string not float", "non-CHF currency"],
    willFail: true,
  },
  {
    id: "r4",
    fields: {
      deal_id: "BAYO-2025-455",
      entity_ref: "HW-03",
      insured: "SWISS RE MANAGEMENT AG",
      comm_amt: '"34200"',
      ccy: "CHF",
      inception: "20250301",
    },
    issueFields: ["comm_amt"],
    issues: ["comm_amt ≠ brokerage_fee", "string not float"],
  },
];

const SILVER_RECORDS = [
  {
    id: "r1",
    fields: {
      deal_id: "BAYO-2025-441",
      entity: "Howden Schweiz AG",
      insured_name: "Helvetica AG",
      commission_chf: "18500.00",
      currency: "CHF",
      coverage_start: "2025-01-01",
      coverage_end: "2025-12-31",
      is_valid: "true",
    },
    changed: ["entity", "insured_name", "commission_chf", "currency", "coverage_start", "coverage_end", "is_valid"],
  },
  {
    id: "r2",
    fields: {
      deal_id: "BAYO-2025-442",
      entity: "SWIBRO AG",
      insured_name: "Zurich Airport Services GmbH",
      commission_chf: "6200.00",
      currency: "CHF",
      coverage_start: "2025-02-01",
      coverage_end: "2026-01-31",
      is_valid: "true",
    },
    changed: ["entity", "insured_name", "commission_chf", "currency", "coverage_start", "coverage_end", "is_valid"],
  },
  {
    id: "r4",
    fields: {
      deal_id: "BAYO-2025-455",
      entity: "Howden Schweiz AG",
      insured_name: "Swiss Re Management AG",
      commission_chf: "34200.00",
      currency: "CHF",
      coverage_start: "2025-03-01",
      coverage_end: "2026-02-28",
      is_valid: "true",
    },
    changed: ["entity", "insured_name", "commission_chf", "currency", "coverage_start", "coverage_end", "is_valid"],
  },
];

const GOLD_ROWS = [
  {
    id: "g1",
    entity: "Howden Schweiz AG",
    commission_chf: "52,700.00",
    deal_count: 2,
    source: ["BAYO-2025-441", "BAYO-2025-455"],
  },
  {
    id: "g2",
    entity: "SWIBRO AG",
    commission_chf: "6,200.00",
    deal_count: 1,
    source: ["BAYO-2025-442"],
  },
];

type Stage = "bronze" | "silver" | "gold";

// ─── Animated field cell ──────────────────────────────────────────────────────

function FieldCell({
  fieldKey,
  value,
  stageKey,
  isChanged,
  isIssue,
}: {
  fieldKey: string;
  value: string;
  stageKey: string;
  isChanged: boolean;
  isIssue: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <span
        className="text-[10px] font-mono flex-shrink-0 w-28"
        style={{ color: isChanged ? "#7C3AED" : isIssue ? "#DC2626" : "#9CA3AF" }}
      >
        {fieldKey}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={stageKey + fieldKey + value}
          initial={{
            backgroundColor: isChanged ? "#D1FAE5" : "transparent",
            color: isChanged ? "#059669" : isIssue ? "#DC2626" : "#1F2937",
            fontWeight: isChanged ? 700 : 400,
          }}
          animate={{
            backgroundColor: "transparent",
            color: isIssue && !isChanged ? "#DC2626" : "#1F2937",
            fontWeight: 400,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-[11px] font-mono flex-1 min-w-0 truncate"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ─── Field rename label ───────────────────────────────────────────────────────

const RENAMES: Record<string, string> = {
  entity: "← entity_ref",
  insured_name: "← insured",
  commission_chf: "← brokerage_fee / comm_amt",
  currency: "← ccy",
  coverage_start: "← inception",
  coverage_end: "new (derived)",
  is_valid: "new (DQX result)",
};

// ─── Main component ───────────────────────────────────────────────────────────

export function MedallionPlayground() {
  const [stage, setStage] = useState<Stage>("bronze");
  const [transitioning, setTransitioning] = useState(false);

  function advance() {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setStage((s) => (s === "bronze" ? "silver" : "gold"));
      setTransitioning(false);
    }, 150);
  }

  function reset() {
    setStage("bronze");
  }

  const isBronze = stage === "bronze";
  const isSilver = stage === "silver";
  const isGold = stage === "gold";

  const stageConfig = {
    bronze: { color: "#92400E", bg: "#FEF3C7", border: "#FDE68A", label: "Bronze", emoji: "🥉", header: "#B45309" },
    silver: { color: "#374151", bg: "#F1F5F9", border: "#CBD5E1", label: "Silver", emoji: "🥈", header: "#4B5563" },
    gold: { color: "#78350F", bg: "#FFFBEB", border: "#FDE68A", label: "Gold", emoji: "🥇", header: "#D97706" },
  };
  const sc = stageConfig[stage];

  return (
    <div className="space-y-5">
      {/* Stage progress header */}
      <div className="flex items-center gap-2">
        {(["bronze", "silver", "gold"] as Stage[]).map((s, i) => {
          const cfg = stageConfig[s];
          const isActive = stage === s;
          const isPast = (s === "bronze" && (isSilver || isGold)) || (s === "silver" && isGold);
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                style={
                  isActive
                    ? { background: cfg.header, color: "#fff", borderColor: cfg.header }
                    : isPast
                    ? { background: cfg.bg, color: cfg.color, borderColor: cfg.border, opacity: 0.8 }
                    : { background: "#F9FAFB", color: "#9CA3AF", borderColor: "#E5E7EB" }
                }
              >
                {cfg.emoji} {cfg.label}
                {isPast && <span className="ml-1 opacity-60">✓</span>}
              </div>
              {i < 2 && <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
            </div>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          {stage !== "bronze" && (
            <button
              onClick={reset}
              className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
            >
              ↺ Reset
            </button>
          )}
        </div>
      </div>

      {/* Subheading */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <Layers className="w-3.5 h-3.5" />
        {isBronze &&
          "Raw BAYO extracts, exactly as delivered. Notice the mixed field names, string amounts, and lowercase values."}
        {isSilver &&
          "After Silver transformation: entity resolved, fields renamed, amounts cast to float, dates normalised. One record quarantined."}
        {isGold &&
          "Gold layer: 3 valid records aggregated into 2 entity rows. Ready for FINMA submission and the Abacus reconciliation."}
      </div>

      {/* Record grid */}
      <AnimatePresence mode="wait">
        {!isGold ? (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Valid records */}
            <div className={`grid gap-3 ${isSilver ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}>
              {isBronze
                ? BRONZE_RECORDS.map((rec) => (
                    <div
                      key={rec.id}
                      className="rounded-xl border bg-white overflow-hidden"
                      style={{
                        borderColor: rec.willFail ? "#FCA5A5" : sc.border,
                        borderWidth: rec.willFail ? 2 : 1.5,
                      }}
                    >
                      {/* Record header */}
                      <div
                        className="px-3 py-2 flex items-center justify-between"
                        style={{
                          background: rec.willFail ? "#FEF2F2" : sc.bg,
                        }}
                      >
                        <span className="text-[10px] font-mono font-bold" style={{ color: rec.willFail ? "#DC2626" : sc.color }}>
                          {rec.fields.deal_id}
                        </span>
                        {rec.willFail && <AlertTriangle className="w-3 h-3 text-red-500" />}
                      </div>

                      {/* Fields */}
                      <div className="px-3 py-2">
                        {Object.entries(rec.fields)
                          .filter(([k]) => k !== "deal_id")
                          .map(([k, v]) => (
                            <FieldCell
                              key={k}
                              fieldKey={k}
                              value={String(v)}
                              stageKey={stage}
                              isChanged={false}
                              isIssue={rec.issueFields.includes(k)}
                            />
                          ))}
                      </div>

                      {/* Issues */}
                      <div className="px-3 pb-2.5">
                        <div className="rounded-lg bg-red-50 border border-red-100 px-2 py-1.5">
                          {rec.issues.map((issue) => (
                            <div key={issue} className="text-[9px] text-red-600 flex items-start gap-1">
                              <span className="text-red-400">!</span>
                              {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                : SILVER_RECORDS.map((rec) => (
                    <div
                      key={rec.id}
                      className="rounded-xl border bg-white overflow-hidden"
                      style={{ borderColor: sc.border, borderWidth: 1.5 }}
                    >
                      <div className="px-3 py-2" style={{ background: sc.bg }}>
                        <span className="text-[10px] font-mono font-bold" style={{ color: sc.color }}>
                          {rec.fields.deal_id}
                        </span>
                      </div>
                      <div className="px-3 py-2">
                        {Object.entries(rec.fields)
                          .filter(([k]) => k !== "deal_id")
                          .map(([k, v]) => (
                            <FieldCell
                              key={k}
                              fieldKey={k}
                              value={String(v)}
                              stageKey={stage}
                              isChanged={rec.changed.includes(k)}
                              isIssue={false}
                            />
                          ))}
                      </div>
                      <div className="px-3 pb-2.5">
                        <div className="rounded-lg bg-green-50 border border-green-100 px-2 py-1.5">
                          <div className="text-[9px] text-green-700 font-semibold">
                            ✓ Passed all DQX rules
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Quarantine section (silver only) */}
            {isSilver && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="rounded-xl border-2 border-dashed border-red-300 bg-red-50 overflow-hidden"
              >
                <div className="px-4 py-3 flex items-center gap-3">
                  <Lock className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-red-700">
                        BAYO-2025-449
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-200 text-red-800 uppercase tracking-wide">
                        Quarantined
                      </span>
                    </div>
                    <p className="text-[10px] text-red-700 font-mono leading-relaxed">
                      DQX rule failed: entity_ref &apos;???&apos; could not be resolved to a registered entity.
                      Record written to enterprise.bronze.quarantine. Not promoted to Silver.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Field rename legend (silver only) */}
            {isSilver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3"
              >
                <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-2">
                  Fields renamed this transformation
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {Object.entries(RENAMES).map(([newKey, note]) => (
                    <div key={newKey} className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-purple-800">
                        {newKey}
                      </span>
                      <span className="text-[9px] text-purple-500">{note}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Gold view — aggregated */
          <motion.div
            key="gold"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              {GOLD_ROWS.map((row) => (
                <motion.div
                  key={row.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: row.id === "g1" ? 0 : 0.15, duration: 0.35 }}
                  className="rounded-xl border-2 bg-white overflow-hidden"
                  style={{ borderColor: "#FDE68A" }}
                >
                  <div className="px-4 py-3" style={{ background: "#FFFBEB" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800">{row.entity}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        {row.deal_count} deal{row.deal_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                      commission_chf
                    </p>
                    <motion.p
                      className="text-2xl font-bold text-amber-700 font-mono"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {row.commission_chf}
                    </motion.p>
                    <div className="mt-3 space-y-1">
                      {row.source.map((s) => (
                        <div key={s} className="text-[9px] text-gray-400 font-mono flex items-center gap-1">
                          <span className="text-amber-400">+</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quarantine note in gold */}
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 flex items-center gap-3">
              <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <p className="text-[10px] text-gray-500">
                <span className="font-semibold">BAYO-2025-449 excluded from Gold.</span> Quarantined
                in enterprise.bronze.quarantine, awaiting entity attribution fix from the BAYO data steward.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action button */}
      <div className="flex items-center gap-3 pt-1">
        {!isGold && (
          <button
            onClick={advance}
            disabled={transitioning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: transitioning
                ? "#9CA3AF"
                : isBronze
                ? "#B45309"
                : "#D97706",
              boxShadow: transitioning
                ? "none"
                : isBronze
                ? "0 2px 8px #B4530940"
                : "0 2px 8px #D9770640",
            }}
          >
            <ArrowRight className="w-4 h-4" />
            {isBronze ? "→ Clean & Validate" : "→ Build Gold"}
          </button>
        )}

        {isGold && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
            <span>🥇</span>
            <span className="font-semibold">
              Gold layer complete. CHF 58,900 total, ready for Abacus reconciliation.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
