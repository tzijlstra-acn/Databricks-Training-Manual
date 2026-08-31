"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Zap, AlertTriangle, CheckCircle, Link, Unlink } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ClusterState = "stopped" | "starting" | "running" | "idle" | "terminating";

interface RunResult { status: "success" | "error"; message: string; }

// ─── Constants ────────────────────────────────────────────────────────────────

const STATE_CONFIG: Record<ClusterState, { label: string; color: string; bg: string; border: string; pulse: boolean }> = {
  stopped:     { label: "Stopped",      color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB", pulse: false },
  starting:    { label: "Starting…",    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", pulse: true  },
  running:     { label: "Running",      color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", pulse: true  },
  idle:        { label: "Idle",         color: "#B45309", bg: "#FEF3C7", border: "#FDE68A", pulse: false },
  terminating: { label: "Terminating…", color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", pulse: true  },
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

// ─── Main component ───────────────────────────────────────────────────────────

export function ComputeStateMachine() {
  const [clusterState, setClusterState] = useState<ClusterState>("stopped");
  const [attached, setAttached] = useState(false);
  const [dbu, setDbu] = useState(0);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [idleCountdown, setIdleCountdown] = useState<number | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dbuTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCountdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (dbuTimer.current) clearInterval(dbuTimer.current);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (idleCountdownTimer.current) clearInterval(idleCountdownTimer.current);
    setIdleCountdown(null);
  }, []);

  const startIdleCountdown = useCallback(() => {
    idleTimer.current = setTimeout(() => {
      setClusterState("idle");
      let secs = 5;
      setIdleCountdown(secs);
      idleCountdownTimer.current = setInterval(() => {
        secs -= 1;
        setIdleCountdown(secs);
        if (secs <= 0) {
          clearInterval(idleCountdownTimer.current!);
          setIdleCountdown(null);
          setClusterState("terminating");
          setTimeout(() => {
            setClusterState("stopped");
            setAttached(false);
            if (dbuTimer.current) clearInterval(dbuTimer.current);
          }, 1500);
        }
      }, 1000);
    }, 6000);
  }, []);

  const startDbu = useCallback(() => {
    dbuTimer.current = setInterval(() => {
      setDbu((d) => Math.round((d + 0.04) * 100) / 100);
    }, 1000);
  }, []);

  const handleStart = useCallback(() => {
    if (clusterState !== "stopped") return;
    clearAll();
    setDbu(0);
    setRunResult(null);
    setClusterState("starting");
    transitionTimer.current = setTimeout(() => {
      setClusterState("running");
      startDbu();
      startIdleCountdown();
    }, 3000);
  }, [clusterState, clearAll, startDbu, startIdleCountdown]);

  const handleTerminate = useCallback(() => {
    if (clusterState !== "running" && clusterState !== "idle") return;
    clearAll();
    if (dbuTimer.current) clearInterval(dbuTimer.current);
    setClusterState("terminating");
    transitionTimer.current = setTimeout(() => {
      setClusterState("stopped");
      setAttached(false);
    }, 1500);
  }, [clusterState, clearAll]);

  const handleToggleAttach = useCallback(() => {
    if (clusterState !== "running" && clusterState !== "idle") return;
    setAttached((a) => !a);
  }, [clusterState]);

  const handleRun = useCallback(async () => {
    if (running) return;
    setRunResult(null);

    if (clusterState !== "running" && clusterState !== "idle") {
      setRunResult({ status: "error", message: "No active compute. Start the cluster first." });
      return;
    }
    if (!attached) {
      setRunResult({ status: "error", message: "Notebook not attached to a cluster. Click Attach." });
      return;
    }

    // Reset idle countdown on activity
    clearAll();
    if (dbuTimer.current) clearInterval(dbuTimer.current);
    startDbu();
    setClusterState("running");
    setRunning(true);

    await new Promise((r) => setTimeout(r, 2800));
    setRunResult({ status: "success", message: "✓ 3 valid records — CHF 58,900 aggregated to enterprise.gold.commission_by_entity" });
    setRunning(false);
    startIdleCountdown();
  }, [running, clusterState, attached, clearAll, startDbu, startIdleCountdown]);

  useEffect(() => () => clearAll(), [clearAll]);

  const sc = STATE_CONFIG[clusterState];
  const isActive = clusterState === "running" || clusterState === "idle";
  const canStart = clusterState === "stopped";
  const canTerminate = clusterState === "running" || clusterState === "idle";
  const canAttach = isActive;

  return (
    <div className="space-y-5">
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

            {/* Idle countdown */}
            <AnimatePresence>
              {idleCountdown !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <p className="text-[10px] text-orange-700">
                    Idle — auto-terminating in <strong>{idleCountdown}s</strong>. Run a cell to reset.
                  </p>
                </motion.div>
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
                  {attached ? "⚡ Attached" : "○ Detached"}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Code cell */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-[#1F2144] px-3 py-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono">Cell 1 — Aggregate by entity</span>
                <motion.button
                  onClick={handleRun}
                  disabled={running}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all"
                  style={{
                    background: running ? "#374151" : isActive && attached ? "#059669" : "#374151",
                    color: "#fff",
                  }}
                >
                  <Play className="w-2.5 h-2.5" />
                  {running ? "Running…" : "Run Cell"}
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
              {running && (
                <motion.div
                  key="running"
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
              {!running && runResult && (
                <motion.div
                  key={runResult.status}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border px-3 py-2.5 flex items-start gap-2"
                  style={
                    runResult.status === "success"
                      ? { background: "#ECFDF5", borderColor: "#A7F3D0" }
                      : { background: "#FEF2F2", borderColor: "#FCA5A5" }
                  }
                >
                  {runResult.status === "success"
                    ? <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  }
                  <span
                    className="text-[10px] font-mono leading-relaxed"
                    style={{ color: runResult.status === "success" ? "#065F46" : "#991B1B" }}
                  >
                    {runResult.message}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation callout */}
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                <strong className="text-gray-700">Try the sequence:</strong>{" "}
                Click Run without a cluster → see the error. Then Start → wait → Attach → Run → watch the job execute. Leave it idle to see auto-termination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
