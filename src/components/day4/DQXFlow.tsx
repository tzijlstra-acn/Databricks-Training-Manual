"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { qualityRules, qualityMetrics } from "@/data/qualityRules";
import { MetricCard } from "@/components/shared/MetricCard";
import { ShieldCheck, AlertCircle, Copy, FileWarning, Clock } from "lucide-react";

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
  const colorClass = layer ? layerColors[layer] || "bg-gray-50 border-gray-200 text-gray-800" : "bg-gray-50 border-gray-200 text-gray-800";

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

export function DQXFlow() {
  const [animate, setAnimate] = useState(false);
  const [dots, setDots] = useState<{ id: number; pass: boolean; pos: number }[]>([]);

  useEffect(() => {
    if (!animate) return;
    let counter = 0;
    const interval = setInterval(() => {
      const pass = Math.random() > 0.05;
      setDots((prev) => [
        ...prev.filter((d) => d.pos < 100),
        { id: counter++, pass, pos: 0 },
      ]);
    }, 400);

    const moveInterval = setInterval(() => {
      setDots((prev) =>
        prev
          .map((d) => ({ ...d, pos: d.pos + 8 }))
          .filter((d) => d.pos <= 100)
      );
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(moveInterval);
    };
  }, [animate]);

  const passRate = qualityMetrics.passRate;
  const nullFails = qualityRules.find((r) => r.type === "null")?.failCount ?? 0;
  const dupFails = qualityRules.find((r) => r.type === "duplicate")?.failCount ?? 0;
  const schemaFails = qualityRules.find((r) => r.type === "schema")?.failCount ?? 0;

  return (
    <div className="space-y-5">
      {/* Architecture Flow */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900">DQX Data Quality Flow</h3>
          <button
            onClick={() => setAnimate((a) => !a)}
            className={cn(
              "text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all",
              animate
                ? "bg-green-100 border-green-300 text-green-700"
                : "bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100"
            )}
          >
            {animate ? "⏸ Pause Animation" : "▶ Animate Flow"}
          </button>
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

        {/* Animated dots */}
        {animate && (
          <div className="relative h-6 mt-3 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <div className="absolute inset-0 flex items-center px-2">
              {dots.map((dot) => (
                <div
                  key={dot.id}
                  className={cn(
                    "absolute w-3 h-3 rounded-full transition-all duration-100",
                    dot.pass ? "bg-green-500" : "bg-red-500"
                  )}
                  style={{ left: `${dot.pos}%`, transform: "translateX(-50%)" }}
                />
              ))}
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />Pass</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />Reject</span>
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
          subtitle="by composite key"
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
          title="Freshness SLA"
          value={`${qualityMetrics.freshnessSLA}%`}
          subtitle="last 30 days"
          icon={Clock}
          color="green"
        />
      </div>
    </div>
  );
}
