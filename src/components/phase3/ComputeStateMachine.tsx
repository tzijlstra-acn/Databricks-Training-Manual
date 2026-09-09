"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Zap, AlertTriangle, CheckCircle, Link, Unlink, RotateCcw } from "lucide-react";
import { useTimers } from "@/lib/useTimers";

// ─── Types ────────────────────────────────────────────────────────────────────

type ClusterState = "stopped" | "starting" | "running" | "executing" | "success" | "idle" | "terminating";

interface RunResult { status: "success" | "error"; message: string; }

// ─── Constants ────────────────────────────────────────────────────────────────

const STATE_CONFIG: Record<ClusterState, { label: string; color: string; bg: string; border: string; pulse: boolean }> = {
  stopped:     { label: "Stopped",      color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB", pulse: false },
  starting:    { label: "Starting…",    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", pulse: true  },
  running:     { label: "Running",      color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", pulse: true  },
  executing:   { label: "Executing…",   color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", pulse: true  },
  success:     { label: "Job Complete", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", pulse: false },
  idle:        { label: "Idle",         color: "#B45309", bg: "#FEF3C7", border: "#FDE68A", pulse: false },
  terminating: { label: "Terminating…", color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", pulse: true  },
};

const STEP_HINTS: Partial<Record<ClusterState, string>> = {
  stopped:   "Click Start Cluster to provision compute resources.",
  starting:  "Cluster is provisioning — workers are being allocated…",
  running:   "Cluster is ready. Click Attach Notebook to connect your notebook.",
  executing: "Spark job running across 2 workers…",
  success:   "Job complete. Results written to the Gold layer. Click Reset to run again.",
};

const NOTEBOOK_CODE = [
  'spark.read.table("enterprise.silver.commission_validated")',
  '    .filter(col("entity").isin(ENTITIES))',
  '    .groupBy("entity").agg(sum("commission_chf"))',
];

// ─── Node dot ─────────────────────────────────────────────────────────────────

function NodeDot({ role, active }: { role: "driver" | "worker"; active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold border-2"
        animate={active ? { scale: [1, 1.06, 1], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } } : { scale: 1 }}
        style={{
          backgroundColor: active ? (role === "driver" ? "#DBEAFE" : "#D1FAE5") : "#F3F4F6",
          borderColor: active ? (role === "driver" ? "#93C5FD" : "#6EE7B7") : "#E5E7EB",
          color: active ? (role === "driver" ? "#1D4ED8" : "#065F46") : "#9CA3AF",
        }}
      >
        {role === "driver" ? "D" : "W"}
      </motion.div>
      <span className="text-[8px] text-gray-400 uppercase">{role}</span>
    </div>
  );
}

// ─── Idle demo section (educational, separate from main flow) ─────────────────

function IdleDemo() {
  const [demoState, setDemoState] = useState<"ready" | "idle" | "terminating" | "done">("ready");
  const [countdown, setCountdown] = useState<number | null>(null);
  const { addTimeout, addInterval, clearAll } = useTimers();

  const playDemo = useCallback(() => {
    if (demoState !== "ready") return;
    setDemoState("idle");
    let secs = 5;
    setCountdown(secs);
    const iv = addInterval(() => {
      secs -= 1;
      setCountdown(secs);
      if (secs <= 0) {
        clearAll();
        setCountdown(null);
        setDemoState("terminating");
        addTimeout(() => setDemoState("done"), 1500);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [demoState, addTimeout, addInterval, clearAll]);

  const resetDemo = useCallback(() => {
    clearAll();
    setCountdown(null);
    setDemoState("ready");
  }, [clearAll]);

  return (
    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-xs font-semibold text-amber-800 mb-1">What happens when you step away?</p>
      <p className="text-[11px] text-amber-700 mb-3">
        Active clusters auto-terminate after a configurable idle period (default: 120 minutes). See the lifecycle below.
      </p>

      <div className="flex items-center gap-3">
        {demoState === "ready" && (
          <button
            onClick={playDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            <Play className="w-3 h-3" /> Simulate inactivity
          </button>
        )}
        {demoState !== "ready" && demoState !== "done" && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span className="text-[11px] text-amber-700 font-medium">
              {demoState === "idle"
                ? `Idle — auto-terminating in ${countdown}s`
                : "Terminating cluster…"}
            </span>
          </div>
        )}
        {demoState === "done" && (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200">
              <Square className="w-3 h-3 text-gray-500" />
              <span className="text-[11px] text-gray-600 font-medium">Cluster stopped</span>
            </div>
            <button
              onClick={resetDemo}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset demo
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ComputeStateMachineProps {
  onReset?: () => void;
}

export function ComputeStateMachine({ onReset }: ComputeStateMachineProps) {
  const [clusterState, setClusterState] = useState<ClusterState>("stopped");
  const [attached, setAttached] = useState(false);
  const [dbu, setDbu] = useState(0);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const { addTimeout, addInterval, clearAll } = useTimers();

  const isActive = clusterState === "running" || clusterState === "executing" || clusterState === "success";
  const canStart = clusterState === "stopped";
  const canTerminate = clusterState === "running" || clusterState === "executing";
  const canAttach = clusterState === "running";
  const canRun = clusterState === "running" && attached;

  const handleStart = useCallback(() => {
    if (!canStart) return;
    clearAll();
    setDbu(0);
    setRunResult(null);
    setAttached(false);
    setClusterState("starting");
    addTimeout(() => {
      setClusterState("running");
      addInterval(() => setDbu((d) => Math.round((d + 0.04) * 100) / 100), 1000);
    }, 3000);
  }, [canStart, clearAll, addTimeout, addInterval]);

  const handleTerminate = useCallback(() => {
    if (!canTerminate) return;
    clearAll();
    setClusterState("terminating");
    addTimeout(() => {
      setClusterState("stopped");
      setAttached(false);
    }, 1500);
  }, [canTerminate, clearAll, addTimeout]);

  const handleToggleAttach = useCallback(() => {
    if (clusterState !== "running") return;
    setAttached((a) => !a);
  }, [clusterState]);

  const handleRun = useCallback(() => {
    if (!canRun) return;
    setRunResult(null);
    setClusterState("executing");

    addTimeout(() => {
      clearAll();
      setClusterState("success");
      setRunResult({
        status: "success",
        message: "3 valid records. CHF 58,900 aggregated to enterprise.gold.commission_by_entity",
      });
    }, 2800);
  }, [canRun, addTimeout, clearAll]);

  const sc = STATE_CONFIG[clusterState];
  const hint = STEP_HINTS[clusterState];

  return (
    <div className="space-y-3">
      {/* Label badge */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          Interactive Simulation
        </span>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Simulator card */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Cluster State Simulator</h3>
          <span className="text-[10px] text-gray-400">Click through the lifecycle to understand compute</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* ── Left: Cluster panel ── */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">All-Purpose Cluster</p>
              <motion.div
                key={clusterState}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
                style={{ color: sc.color, backgroundColor: sc.bg, borderColor: sc.border }}
              >
                {sc.pulse && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: sc.color }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: sc.color }} />
                  </span>
                )}
                {sc.label}
              </motion.div>
            </div>

            {/* Node visualization */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-end justify-center gap-4">
                <NodeDot role="driver" active={isActive} />
                <div className="flex gap-3 pb-1">
                  <NodeDot role="worker" active={isActive} />
                  <NodeDot role="worker" active={isActive} />
                </div>
              </div>
              <p className="text-[9px] text-center text-gray-400 mt-2 uppercase tracking-wide">
                1 Driver · 2 Workers · Standard_DS3_v2
              </p>
            </div>

            {/* DBU counter */}
            <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
              <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" /> DBUs consumed
              </span>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-amber-800 block">
                  {dbu.toFixed(2)}
                </span>
                <span className="text-[8px] text-amber-600 font-mono">
                  ≈ CHF {(dbu * 0.55).toFixed(2)} at Enterprise tier
                </span>
              </div>
            </div>

            {/* Step hint */}
            <AnimatePresence mode="wait">
              {hint && (
                <motion.p
                  key={clusterState}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-[10px] text-gray-500 leading-relaxed"
                >
                  {hint}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleStart}
                disabled={!canStart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: canStart ? "#059669" : "#9CA3AF" }}
              >
                <Play className="w-3 h-3" /> Start Cluster
              </button>
              <button
                onClick={handleTerminate}
                disabled={!canTerminate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: canTerminate ? "#DC2626" : "#9CA3AF" }}
              >
                <Square className="w-3 h-3" /> Terminate
              </button>
              <button
                onClick={handleToggleAttach}
                disabled={!canAttach}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
                style={
                  attached
                    ? { background: "#EFF6FF", color: "#1D4ED8", borderColor: "#BFDBFE" }
                    : { background: "#F9FAFB", color: "#374151", borderColor: "#E5E7EB" }
                }
              >
                {attached ? <Link className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                {attached ? "Detach" : "Attach Notebook"}
              </button>
            </div>
          </div>

          {/* ── Right: Notebook panel ── */}
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">BAYO-validation.ipynb</p>
              <AnimatePresence mode="wait">
                <motion.span
                  key={attached ? "attached" : "detached"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                  style={
                    attached
                      ? { color: "#059669", background: "#ECFDF5", borderColor: "#A7F3D0" }
                      : { color: "#9CA3AF", background: "#F9FAFB", borderColor: "#E5E7EB" }
                  }
                >
                  {attached ? "Attached" : "Detached"}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Code cell */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-[#1F2144] px-3 py-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono">Cell 1: Aggregate by entity</span>
                <motion.button
                  onClick={handleRun}
                  disabled={!canRun}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all disabled:opacity-40"
                  style={{
                    background: canRun ? "#059669" : "#374151",
                    color: "#fff",
                  }}
                >
                  <Play className="w-2.5 h-2.5" />
                  {clusterState === "executing" ? "Running…" : "Run Cell"}
                </motion.button>
              </div>
              <div className="bg-[#0F1729] px-4 py-3">
                {NOTEBOOK_CODE.map((line, i) => (
                  <p key={i} className="text-[10px] font-mono text-green-400 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Run result */}
            <AnimatePresence mode="wait">
              {clusterState === "executing" && (
                <motion.div
                  key="executing"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 flex items-center gap-2"
                >
                  <span className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin flex-shrink-0" />
                  <span className="text-[10px] text-blue-700 font-medium">
                    Sending to cluster… Spark job executing on 2 workers
                  </span>
                </motion.div>
              )}
              {runResult && clusterState !== "executing" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border px-3 py-2.5 flex items-start gap-2"
                  style={{ background: "#ECFDF5", borderColor: "#A7F3D0" }}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[10px] font-mono leading-relaxed text-green-800">
                    {runResult.message}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error states (before cluster is ready) */}
            <AnimatePresence>
              {clusterState === "stopped" && (
                <motion.div
                  key="no-cluster"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5"
                >
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    <strong className="text-gray-700">Try the sequence:</strong>{" "}
                    Start Cluster, wait for it to be Running, Attach the notebook, then Run Cell.
                  </p>
                </motion.div>
              )}
              {clusterState === "running" && !attached && (
                <motion.div
                  key="not-attached"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2.5"
                >
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    Cluster is ready. Attach this notebook to enable running cells.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Educational idle demo — only visible after a successful run */}
      <AnimatePresence>
        {clusterState === "success" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <IdleDemo />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
