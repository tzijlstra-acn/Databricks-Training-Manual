"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { qualityRules, qualityMetrics } from "@/data/qualityRules";
import { MetricCard } from "@/components/shared/MetricCard";
import { ShieldCheck, AlertCircle, Copy, FileWarning, Clock, Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { useTimers } from "@/lib/useTimers";

// ─── Static sample records (deterministic, same every replay) ─────────────────

interface SampleRecord {
  id: string;
  entity: string;
  amount: string;
  currency: string;
  pass: boolean;
  failReason: string | null;
}

const SAMPLE_RECORDS: SampleRecord[] = [
  { id: "REC-001", entity: "Swiss Re",    amount: "12,450.00", currency: "CHF", pass: true,  failReason: null },
  { id: "REC-002", entity: "Munich Re",   amount: "null",      currency: "CHF", pass: false, failReason: "Null: commission_amount" },
  { id: "REC-003", entity: "AXA XL",      amount: "8,320.50",  currency: "CHF", pass: true,  failReason: null },
  { id: "REC-004", entity: "Swiss Re",    amount: "12,450.00", currency: "CHF", pass: false, failReason: "Duplicate: REC-001" },
  { id: "REC-005", entity: "Lloyd's",     amount: "5,100.00",  currency: "USD", pass: false, failReason: "Schema: currency must be CHF" },
  { id: "REC-006", entity: "Zurich Re",   amount: "19,800.00", currency: "CHF", pass: true,  failReason: null },
  { id: "REC-007", entity: "Hannover Re", amount: "3,250.75",  currency: "CHF", pass: true,  failReason: null },
  { id: "REC-008", entity: "SCOR",        amount: "7,640.00",  currency: "CHF", pass: true,  failReason: null },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const severityColors: Record<string, string> = {
  critical: "border-red-300 bg-red-50 text-red-800",
  warning: "border-amber-300 bg-amber-50 text-amber-800",
  info: "border-blue-300 bg-blue-50 text-blue-800",
};

const typeIcons: Record<string, string> = {
  null: "∅",
  duplicate: "⊕",
  schema: "≠",
  threshold: "⚠",
  business: "✦",
};

function FlowNode({ label, layer, icon }: { label: string; layer?: string; icon: string }) {
  const layerColors: Record<string, string> = {
    bronze: "bg-bronze-bg border-bronze-border text-bronze-text",
    silver: "bg-silver-bg border-silver-border text-silver-text",
    gold: "bg-gold-bg border-gold-border text-gold-text",
    source: "bg-blue-50 border-blue-200 text-blue-800",
    audit: "bg-purple-50 border-purple-200 text-purple-800",
    dashboard: "bg-green-50 border-green-200 text-green-800",
  };
  const colorClass = layer ? layerColors[layer] ?? "bg-gray-50 border-gray-200 text-gray-800" : "bg-gray-50 border-gray-200 text-gray-800";

  return (
    <div className={cn("rounded-2xl border-2 px-4 py-3 text-center min-w-[110px] transition-all hover:shadow-md", colorClass)}>
      <div className="text-xl mb-1">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center text-gray-300 flex-shrink-0">
      <div className="w-6 h-0.5 bg-gray-300" />
      <span className="text-gray-400 text-sm">▶</span>
    </div>
  );
}

function GateFilter({ rule }: { rule: (typeof qualityRules)[0] }) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center px-3 py-2 rounded-xl border text-center min-w-[90px]",
        severityColors[rule.severity]
      )}
      style={{
        clipPath: "polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)",
      }}
    >
      <span className="text-lg font-bold">{typeIcons[rule.type]}</span>
      <span className="text-[10px] font-semibold leading-tight mt-0.5 px-1">{rule.name}</span>
    </div>
  );
}

// ─── Record row ───────────────────────────────────────────────────────────────

function RecordRow({ rec, index }: { rec: SampleRecord; index: number }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2 text-[11px]",
        rec.pass ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      )}
    >
      <span className="font-mono font-semibold text-gray-500 w-6 flex-shrink-0 text-right">{index + 1}</span>
      <span className="font-mono font-bold text-gray-700 w-16 flex-shrink-0">{rec.id}</span>
      <span className="flex-1 text-gray-700 truncate">{rec.entity}</span>
      <span className="font-mono text-gray-600 w-20 text-right flex-shrink-0">
        {rec.amount === "null" ? <span className="text-red-500">null</span> : `${rec.currency} ${rec.amount}`}
      </span>
      {rec.pass ? (
        <span className="flex items-center gap-1 text-green-700 font-semibold flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          Silver
        </span>
      ) : (
        <span className="flex items-center gap-1 text-red-700 font-semibold flex-shrink-0 truncate max-w-[120px]" title={rec.failReason ?? ""}>
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          {rec.failReason}
        </span>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function DQXFlow() {
  const reducedMotion = useReducedMotion();

  const [processedCount, setProcessedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { addInterval, clearAll } = useTimers();

  const passCount = SAMPLE_RECORDS.slice(0, processedCount).filter((r) => r.pass).length;
  const failCount = processedCount - passCount;

  const startBatch = useCallback((fromIndex = 0) => {
    clearAll();
    setProcessedCount(fromIndex);
    setIsPlaying(true);
    setIsComplete(false);

    let idx = fromIndex;
    addInterval(() => {
      idx += 1;
      setProcessedCount(idx);
      if (idx >= SAMPLE_RECORDS.length) {
        clearAll();
        setIsPlaying(false);
        setIsComplete(true);
      }
    }, 600);
  }, [clearAll, addInterval]);

  const handlePlay = useCallback(() => {
    if (isComplete) return;
    startBatch(processedCount);
  }, [isComplete, processedCount, startBatch]);

  const handlePause = useCallback(() => {
    clearAll();
    setIsPlaying(false);
  }, [clearAll]);

  const handleReplay = useCallback(() => {
    clearAll();
    setIsComplete(false);
    setIsPlaying(false);
    setProcessedCount(0);
    // small delay so state resets before re-starting
    setTimeout(() => startBatch(0), 50);
  }, [clearAll, startBatch]);

  const handleReset = useCallback(() => {
    clearAll();
    setProcessedCount(0);
    setIsPlaying(false);
    setIsComplete(false);
  }, [clearAll]);

  const passRate = qualityMetrics.passRate;
  const nullFails = qualityRules.find((r) => r.type === "null")?.failCount ?? 0;
  const dupFails = qualityRules.find((r) => r.type === "duplicate")?.failCount ?? 0;
  const schemaFails = qualityRules.find((r) => r.type === "schema")?.failCount ?? 0;

  // When reduced-motion is preferred, skip animation and show all records statically
  const displayedRecords = reducedMotion ? SAMPLE_RECORDS : SAMPLE_RECORDS.slice(0, processedCount);

  return (
    <div className="space-y-5">
      {/* Architecture Flow */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900">DQX Data Quality Flow</h3>

          {reducedMotion ? (
            <span className="text-[11px] text-gray-400 italic">Animation disabled (reduced-motion)</span>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlay}
                disabled={isPlaying || isComplete}
                aria-label="Play batch"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 disabled:opacity-40 transition-all"
              >
                <Play className="w-3 h-3" /> Play
              </button>
              <button
                onClick={handlePause}
                disabled={!isPlaying}
                aria-label="Pause batch"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-all"
              >
                <Pause className="w-3 h-3" /> Pause
              </button>
              <button
                onClick={handleReplay}
                aria-label="Replay batch from start"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all"
              >
                <SkipForward className="w-3 h-3" /> Replay
              </button>
              <button
                onClick={handleReset}
                aria-label="Reset batch"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          )}
        </div>

        {/* Flow row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 relative">
          <FlowNode label="Source Data" layer="source" icon="🗄️" />
          <Arrow />
          <FlowNode label="Bronze" layer="bronze" icon="🥉" />
          <Arrow />

          {/* Quality gates section */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Quality Gates</span>
            <div className="flex items-center gap-1">
              {qualityRules.map((rule) => (
                <GateFilter key={rule.id} rule={rule} />
              ))}
            </div>
          </div>

          <Arrow />
          <FlowNode label="Silver" layer="silver" icon="🥈" />
          <Arrow />
          <FlowNode label="Audit Table" layer="audit" icon="📋" />
          <Arrow />
          <FlowNode label="DQX Dashboard" layer="dashboard" icon="📊" />
        </div>

        {/* Progress bar */}
        {!reducedMotion && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-gray-500 font-medium">
                {isComplete ? "Batch complete" : isPlaying ? "Processing…" : processedCount === 0 ? "Ready" : "Paused"}
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                {processedCount} / {SAMPLE_RECORDS.length} records
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-600 transition-all duration-300"
                style={{ width: `${(processedCount / SAMPLE_RECORDS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Batch record list */}
        {(reducedMotion || displayedRecords.length > 0) && (
          <div className="mt-4 space-y-1.5">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
              {reducedMotion ? "All 8 records" : "Records processed"}
            </h4>
            {displayedRecords.map((rec, i) => (
              <RecordRow key={rec.id} rec={rec} index={i} />
            ))}
          </div>
        )}

        {/* Completion summary */}
        {(reducedMotion || isComplete) && (
          <div className="mt-4 flex items-center gap-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
            <div className="flex items-center gap-1.5 text-sm font-bold text-green-700">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              {reducedMotion ? SAMPLE_RECORDS.filter((r) => r.pass).length : passCount} passed
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-red-700">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              {reducedMotion ? SAMPLE_RECORDS.filter((r) => !r.pass).length : failCount} quarantined
            </div>
            <div className="text-sm text-gray-500">
              of {SAMPLE_RECORDS.length} total records
            </div>
          </div>
        )}

        {/* Rules detail */}
        <div className="mt-5 space-y-2">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Active Quality Rules</h4>
          {qualityRules.map((rule) => {
            const total = rule.passCount + rule.failCount;
            const pct = ((rule.passCount / total) * 100).toFixed(2);
            return (
              <div
                key={rule.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3",
                  severityColors[rule.severity]
                )}
              >
                <span className="text-lg font-bold w-6 text-center flex-shrink-0">{typeIcons[rule.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold">{rule.name}</p>
                  <p className="text-[11px] opacity-75 truncate">{rule.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold">{pct}%</p>
                  <p className="text-[10px] opacity-60">{rule.failCount} fails</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard
          title="Pass Rate"
          value={`${passRate}%`}
          subtitle={`${qualityMetrics.passedRecords.toLocaleString()} records`}
          icon={ShieldCheck}
          color="green"
        />
        <MetricCard
          title="Null Failures"
          value={nullFails}
          subtitle="commission_amount"
          icon={AlertCircle}
          color="red"
        />
        <MetricCard
          title="Duplicate Failures"
          value={dupFails}
          subtitle="duplicate records"
          icon={Copy}
          color="red"
        />
        <MetricCard
          title="Schema Issues"
          value={schemaFails}
          subtitle="type mismatches"
          icon={FileWarning}
          color={schemaFails > 0 ? "red" : "default"}
        />
        <MetricCard
          title="Data Freshness"
          value={`${qualityMetrics.freshnessSLA}%`}
          subtitle="last 30 days"
          icon={Clock}
          color="green"
        />
      </div>
    </div>
  );
}
