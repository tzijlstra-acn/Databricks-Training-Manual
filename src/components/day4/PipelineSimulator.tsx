"use client";

import { useState, useMemo, useCallback, memo } from "react";
import {
  ReactFlow,
  Background,
  NodeMouseHandler,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Play, X, Lock, RotateCcw } from "lucide-react";

// ─── Base task definitions ────────────────────────────────────────────────────

const BASE_TASKS = [
  {
    id: "task-1",
    name: "CRM Ingestion",
    fullName: "CRM Extract Ingestion",
    description:
      "Load raw extracts from BAYO, IBS Alabus, MAX, KETL, and Vorsorge Partner CRM into Bronze tables — untouched, exactly as delivered.",
    type: "ingestion" as const,
    emoji: "📥",
    typeColor: "#3B82F6",
    typeBg: "#EFF6FF",
    typeLabel: "Ingest",
  },
  {
    id: "task-2",
    name: "Entity Attribution",
    fullName: "Entity Attribution & Standardisation",
    description:
      "Resolve BAYO rows to Howden Schweiz AG or SWIBRO AG using deal-level identifiers. Rename all commission field variants to canonical commission_chf.",
    type: "transform" as const,
    emoji: "🔄",
    typeColor: "#64748B",
    typeBg: "#F1F5F9",
    typeLabel: "Transform",
  },
  {
    id: "task-3",
    name: "DQ Gate",
    fullName: "Data Quality Gate",
    description:
      "Run DQX rules: entity attribution completeness, commission null check, duplicate detection, and Abacus variance check (CHF 10,000 / 5% threshold).",
    type: "quality" as const,
    emoji: "🛡️",
    typeColor: "#D97706",
    typeBg: "#FFFBEB",
    typeLabel: "Quality",
  },
  {
    id: "task-4",
    name: "Report Build",
    fullName: "FINMA Report Build",
    description:
      "Aggregate validated Silver data into 5 entity-level Gold datasets — one per entity — ready for FINMA intermediary submission by 31 May.",
    type: "build" as const,
    emoji: "🏗️",
    typeColor: "#B45309",
    typeBg: "#FFFBEB",
    typeLabel: "Build",
  },
  {
    id: "task-5",
    name: "Abacus Recon",
    fullName: "Abacus Reconciliation",
    description:
      "Compare Gold commission totals against Abacus 2025 cashflows by entity. Flag variance exceeding CHF 10,000 or 5% of category total.",
    type: "refresh" as const,
    emoji: "📊",
    typeColor: "#059669",
    typeBg: "#ECFDF5",
    typeLabel: "Reconcile",
  },
];

// ─── Scenario types ───────────────────────────────────────────────────────────

type TaskState = "waiting" | "running" | "success" | "failed" | "blocked";

interface TaskScenarioState {
  state: TaskState;
  duration?: string;
  errorMessage?: string;
  blockReason?: string;
  successNote?: string;
}

interface Scenario {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  summary: string;
  tasks: TaskScenarioState[];
}

// ─── Scenario data ────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: "success",
    label: "Successful Run",
    icon: "✅",
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    summary:
      "All 5 tasks completed. 48,421 records attributed across 5 entities. CHF 12.4M reconciled — Abacus variance CHF 4,200 (within threshold).",
    tasks: [
      {
        state: "success",
        duration: "2m 14s",
        successNote: "48,421 records loaded from 5 source systems",
      },
      {
        state: "success",
        duration: "3m 48s",
        successNote: "100% attribution — all BAYO rows assigned",
      },
      {
        state: "success",
        duration: "1m 05s",
        successNote: "All DQX rules passed — 0 records quarantined",
      },
      {
        state: "success",
        duration: "4m 22s",
        successNote: "5 entity Gold tables built and registered in Unity Catalog",
      },
      {
        state: "success",
        duration: "1m 43s",
        successNote: "Variance CHF 4,200 (0.03%) — within CHF 10,000 threshold",
      },
    ],
  },
  {
    id: "dq-failure",
    label: "DQ Gate Failure",
    icon: "🛡️",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    summary:
      "218 BAYO rows could not be attributed. Attribution rate 99.55% — below the 100% threshold. Tasks 4 and 5 are blocked to protect Gold.",
    tasks: [
      { state: "success", duration: "2m 14s", successNote: "48,421 records loaded" },
      { state: "success", duration: "3m 48s", successNote: "Standardisation complete" },
      {
        state: "failed",
        duration: "0m 22s",
        errorMessage:
          "DQX rule failed: 218 BAYO rows could not be attributed to a single entity (neither Howden Schweiz AG nor SWIBRO AG deal-level identifier matched). Attribution rate: 99.55% — below the required 100% threshold. Pipeline stopped to prevent unattributed records reaching FINMA Gold tables.",
      },
      {
        state: "blocked",
        blockReason:
          "Blocked — DQ Gate (task 3) failed. Cannot build Gold tables from unvalidated Silver data.",
      },
      {
        state: "blocked",
        blockReason:
          "Blocked — FINMA Report Build (task 4) did not complete. No Gold tables to reconcile.",
      },
    ],
  },
  {
    id: "compute-unavailable",
    label: "Compute Unavailable",
    icon: "🖥️",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    summary:
      "Job cluster failed to start after 3 retries. All tasks blocked — check cluster configuration or select an alternative instance type.",
    tasks: [
      {
        state: "failed",
        duration: "8m 00s",
        errorMessage:
          "Job cluster 'finma-pipeline-cluster' failed to start after 3 retries. Azure instance type Standard_DS3_v2 is currently unavailable in the Switzerland North region. Fix: select an alternative instance type, or switch to on-demand pricing in the cluster policy.",
      },
      { state: "blocked", blockReason: "Blocked — no cluster available for transformation." },
      { state: "blocked", blockReason: "Blocked — no cluster available for DQX checks." },
      { state: "blocked", blockReason: "Blocked — no cluster available." },
      { state: "blocked", blockReason: "Blocked — no cluster available." },
    ],
  },
  {
    id: "permission-error",
    label: "Permission Error",
    icon: "🔒",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    summary:
      "Service principal 'finma-pipeline-sp' lacks READ on the Bronze source table. Grant access via Unity Catalog → Catalog Explorer → Permissions.",
    tasks: [
      {
        state: "failed",
        duration: "0m 03s",
        errorMessage:
          "ACCESS_DENIED: Service principal 'finma-pipeline-sp' (ID: sp-8844) does not have SELECT privilege on enterprise.bronze.bayo_crm_extract. Fix: Catalog → enterprise → bronze → bayo_crm_extract → Permissions → Add → READ.",
      },
      { state: "blocked", blockReason: "Blocked — Bronze data was not ingested." },
      { state: "blocked", blockReason: "Blocked — no Silver data to validate." },
      { state: "blocked", blockReason: "Blocked — no validated Silver data." },
      { state: "blocked", blockReason: "Blocked — no Gold tables to reconcile." },
    ],
  },
  {
    id: "missing-source",
    label: "Missing Source File",
    icon: "📂",
    color: "#6B7280",
    bg: "#F9FAFB",
    border: "#E5E7EB",
    summary:
      "BAYO CRM extract not delivered. Contact the BAYO data steward — file should arrive by 01:00 UTC. Pipeline will retry on next schedule.",
    tasks: [
      {
        state: "failed",
        duration: "0m 04s",
        errorMessage:
          "FileNotFoundException: /mnt/bayo/crm_extract_20250323.csv was not found. Expected delivery by 01:00 UTC. Contact bayo-data-team@howden.com to request manual upload or a re-run.",
      },
      { state: "blocked", blockReason: "Blocked — source file not available." },
      { state: "blocked", blockReason: "Blocked — no Bronze data to validate." },
      { state: "blocked", blockReason: "Blocked — no Silver data." },
      { state: "blocked", blockReason: "Blocked — no Gold tables." },
    ],
  },
];

// ─── Pipeline node custom type ────────────────────────────────────────────────

interface PipelineNodeData {
  taskIdx: number;
  displayState: TaskState;
  isSelected: boolean;
}

const STATUS_STYLE: Record<
  TaskState,
  { border: string; bg: string; badge: string; badgeBg: string }
> = {
  waiting: {
    border: "#E5E7EB",
    bg: "#FFFFFF",
    badge: "#6B7280",
    badgeBg: "#F3F4F6",
  },
  running: {
    border: "#3B82F6",
    bg: "#EFF6FF",
    badge: "#1D4ED8",
    badgeBg: "#DBEAFE",
  },
  success: {
    border: "#34D399",
    bg: "#ECFDF5",
    badge: "#059669",
    badgeBg: "#D1FAE5",
  },
  failed: {
    border: "#F87171",
    bg: "#FEF2F2",
    badge: "#DC2626",
    badgeBg: "#FEE2E2",
  },
  blocked: {
    border: "#D1D5DB",
    bg: "#F9FAFB",
    badge: "#6B7280",
    badgeBg: "#E5E7EB",
  },
};

const STATUS_LABEL: Record<TaskState, string> = {
  waiting: "Waiting",
  running: "Running…",
  success: "Success",
  failed: "Failed",
  blocked: "Blocked",
};

const PipelineTaskNode = memo(function PipelineTaskNode({
  data,
}: {
  data: PipelineNodeData;
}) {
  const { taskIdx, displayState, isSelected } = data;
  const task = BASE_TASKS[taskIdx];
  const ss = STATUS_STYLE[displayState];
  const isDimmed = displayState === "blocked";

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "transparent", border: "none", width: 8, height: 8 }}
      />
      <div
        style={{
          background: ss.bg,
          border: `2px solid ${isSelected ? task.typeColor : displayState === "failed" ? ss.border : ss.border}`,
          borderRadius: 12,
          width: 160,
          opacity: isDimmed ? 0.45 : 1,
          transition: "all 0.3s ease",
          boxShadow: isSelected
            ? `0 0 0 3px ${task.typeColor}50, 0 4px 16px ${task.typeColor}30`
            : displayState === "failed"
            ? `0 0 0 2px #F8717160, 0 4px 12px #DC262620`
            : displayState === "running"
            ? `0 0 0 2px #3B82F660`
            : "0 1px 4px rgba(0,0,0,0.07)",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {/* Type stripe */}
        <div
          style={{
            height: 3,
            background: task.typeColor,
            opacity: isDimmed ? 0.4 : 0.9,
          }}
        />

        <div style={{ padding: "9px 12px" }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 18 }}>{task.emoji}</span>
            {/* Status badge */}
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                color: ss.badge,
                background: ss.badgeBg,
                padding: "2px 6px",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              {displayState === "running" && (
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3B82F6",
                    animation: "pulse 1s infinite",
                  }}
                />
              )}
              {displayState === "blocked" && <Lock size={8} />}
              {STATUS_LABEL[displayState]}
            </span>
          </div>

          {/* Task name */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isDimmed ? "#9CA3AF" : "#111827",
              lineHeight: 1.3,
              marginBottom: 3,
            }}
          >
            {task.name}
          </div>

          {/* Type label */}
          <div
            style={{
              fontSize: 9,
              color: isDimmed ? "#D1D5DB" : task.typeColor,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: "0.06em",
            }}
          >
            {task.typeLabel}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "transparent", border: "none", width: 8, height: 8 }}
      />
    </>
  );
});

const pipelineNodeTypes = { pipelineTask: PipelineTaskNode };

// ─── Static initial node positions ───────────────────────────────────────────

const INITIAL_POSITIONS = BASE_TASKS.map((_, i) => ({
  id: `task-${i + 1}`,
  type: "pipelineTask" as const,
  position: { x: i * 210, y: 0 },
  data: {},
  draggable: false,
}));

const PIPELINE_EDGES_BASE = BASE_TASKS.slice(0, -1).map((task, i) => ({
  source: task.id,
  target: BASE_TASKS[i + 1].id,
}));

// ─── Main component ───────────────────────────────────────────────────────────

export function PipelineSimulator() {
  const [scenarioId, setScenarioId] = useState("dq-failure");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [animStep, setAnimStep] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const currentScenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId]
  );

  // Derive per-task display state
  const getDisplayState = useCallback(
    (taskIdx: number): TaskState => {
      if (phase === "idle") return "waiting";
      if (phase === "done") return currentScenario.tasks[taskIdx].state;

      const finalState = currentScenario.tasks[taskIdx].state;

      // Find if any upstream task failed and has been revealed
      const failIdx = currentScenario.tasks.findIndex((t) => t.state === "failed");
      const failRevealed = failIdx >= 0 && animStep > failIdx + 1;

      if (failRevealed && taskIdx > failIdx) {
        return finalState === "blocked" ? "blocked" : "waiting";
      }

      if (animStep > taskIdx + 1) return finalState;
      if (animStep === taskIdx + 1) return "running";
      return "waiting";
    },
    [phase, currentScenario, animStep]
  );

  // Build RF nodes (positions are static — dragging disabled)
  const displayNodes = useMemo(() => {
    return INITIAL_POSITIONS.map((n, i) => ({
      ...n,
      data: {
        taskIdx: i,
        displayState: getDisplayState(i),
        isSelected: n.id === selectedTaskId,
      },
    }));
  }, [getDisplayState, selectedTaskId]);

  // Build RF edges
  const displayEdges = useMemo(() => {
    return PIPELINE_EDGES_BASE.map((e, i) => {
      const srcIdx = i;
      const tgtIdx = i + 1;
      const srcState = getDisplayState(srcIdx);
      const tgtState = getDisplayState(tgtIdx);

      const isFlowing = srcState === "success" && tgtState === "success";
      const srcFailed = srcState === "failed";
      const tgtFailed = tgtState === "failed";
      const isCascade = srcFailed && tgtState === "blocked"; // failure propagating to blocked
      const isBlocked = !isCascade && tgtState === "blocked"; // blocked→blocked chain
      const isActive = srcState !== "waiting" && tgtState !== "waiting";

      const stroke = srcFailed || tgtFailed || isCascade
        ? "#F87171"
        : isBlocked
        ? "#D1D5DB"
        : isFlowing
        ? "#34D399"
        : srcState === "running"
        ? "#93C5FD"
        : "#E5E7EB";

      const isDashed = isBlocked || isCascade || srcFailed;

      return {
        id: `pipeline-edge-${i}`,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        animated: isFlowing || srcState === "running",
        style: {
          stroke,
          strokeWidth: isActive ? 2.5 : 1.5,
          strokeDasharray: isDashed ? "5 3" : "none",
          opacity: phase === "idle" ? 0.4 : 1,
          transition: "all 0.3s ease",
        },
      };
    });
  }, [getDisplayState, phase]);

  // Animation runner
  function startAnimation() {
    if (phase === "running") return;
    setPhase("running");
    setAnimStep(0);
    setSelectedTaskId(null);

    const failIdx = currentScenario.tasks.findIndex((t) => t.state === "failed");
    const revealSteps =
      failIdx >= 0 ? failIdx + 2 : currentScenario.tasks.length + 1;

    for (let step = 1; step <= revealSteps; step++) {
      setTimeout(() => {
        setAnimStep(step);
        if (step === revealSteps) {
          setTimeout(() => {
            setAnimStep(currentScenario.tasks.length + 1);
            setPhase("done");
          }, 400);
        }
      }, (step - 1) * 1500);
    }
  }

  function reset() {
    setPhase("idle");
    setAnimStep(0);
    setSelectedTaskId(null);
  }

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setSelectedTaskId((prev) => (prev === node.id ? null : node.id));
    },
    []
  );

  // Selected task info
  const selectedIdx = selectedTaskId
    ? BASE_TASKS.findIndex((t) => t.id === selectedTaskId)
    : -1;
  const selectedTask = selectedIdx >= 0 ? BASE_TASKS[selectedIdx] : null;
  const selectedState =
    selectedIdx >= 0 ? getDisplayState(selectedIdx) : null;
  const selectedScenarioState =
    selectedIdx >= 0 ? currentScenario.tasks[selectedIdx] : null;

  function changeScenario(id: string) {
    setScenarioId(id);
    setPhase("idle");
    setAnimStep(0);
    setSelectedTaskId(null);
  }

  return (
    <div className="space-y-4">
      {/* Scenario selector */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Select scenario
        </p>
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => changeScenario(s.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
              style={
                scenarioId === s.id
                  ? {
                      background: s.color,
                      borderColor: s.color,
                      color: "#fff",
                    }
                  : {
                      background: s.bg,
                      borderColor: s.border,
                      color: s.color,
                    }
              }
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main canvas + panel */}
      <div className="flex gap-4 items-start">
        {/* React Flow dependency graph */}
        <div
          className="flex-1 rounded-2xl border border-gray-200 overflow-hidden"
          style={{ height: 200, background: "#FAFAFA" }}
        >
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
            onNodeClick={handleNodeClick}
            onPaneClick={() => setSelectedTaskId(null)}
            nodeTypes={pipelineNodeTypes}
            nodesConnectable={false}
            nodesDraggable={false}
            deleteKeyCode={null}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            minZoom={0.4}
            maxZoom={1.5}
            panOnDrag={false}
            zoomOnScroll={false}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={18}
              size={1}
              color="#E5E7EB"
            />
          </ReactFlow>
        </div>

        {/* Task detail panel */}
        <div className="w-64 flex-shrink-0">
          {selectedTask && selectedScenarioState && selectedState ? (
            <div
              className="rounded-2xl border-2 overflow-hidden bg-white"
              style={{ borderColor: selectedTask.typeColor + "50" }}
            >
              <div
                className="px-3 py-2.5 flex items-center justify-between"
                style={{ background: selectedTask.typeBg }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{selectedTask.emoji}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: selectedTask.typeColor }}
                  >
                    {selectedTask.fullName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTaskId(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 space-y-3">
                {/* Status badge */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                    style={{
                      background: STATUS_STYLE[selectedState].badgeBg,
                      color: STATUS_STYLE[selectedState].badge,
                    }}
                  >
                    {STATUS_LABEL[selectedState]}
                  </span>
                  {selectedScenarioState.duration && phase !== "idle" && (
                    <span className="text-[10px] text-gray-400 font-mono">
                      ⏱ {selectedScenarioState.duration}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {selectedTask.description}
                </p>

                {/* Success note */}
                {selectedScenarioState.successNote &&
                  selectedState === "success" && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-2.5">
                      <p className="text-xs text-green-800 font-medium">
                        ✓ {selectedScenarioState.successNote}
                      </p>
                    </div>
                  )}

                {/* Error message */}
                {selectedScenarioState.errorMessage &&
                  selectedState === "failed" && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-2.5">
                      <p className="text-[10px] text-red-700 font-mono leading-relaxed">
                        {selectedScenarioState.errorMessage}
                      </p>
                    </div>
                  )}

                {/* Block reason */}
                {selectedScenarioState.blockReason &&
                  selectedState === "blocked" && (
                    <div className="rounded-lg bg-gray-100 border border-gray-200 p-2.5 flex items-start gap-1.5">
                      <Lock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500">
                        {selectedScenarioState.blockReason}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-500">Click a task node</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                to see its description and status
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Outcome banner (shows after animation completes) */}
      {phase === "done" && (
        <div
          className="rounded-2xl border-2 p-4 flex items-start gap-3"
          style={{
            background: currentScenario.bg,
            borderColor: currentScenario.border,
          }}
        >
          <span className="text-xl flex-shrink-0">{currentScenario.icon}</span>
          <div className="flex-1">
            <p
              className="text-sm font-bold mb-0.5"
              style={{ color: currentScenario.color }}
            >
              {currentScenario.label}
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {currentScenario.summary}
            </p>
          </div>
        </div>
      )}

      {/* Run / Reset controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={startAnimation}
          disabled={phase === "running"}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={
            phase === "running"
              ? { background: "#F3F4F6", color: "#9CA3AF", cursor: "not-allowed" }
              : {
                  background: currentScenario.color,
                  color: "#fff",
                  boxShadow: `0 2px 8px ${currentScenario.color}40`,
                }
          }
        >
          {phase === "running" ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
              Running…
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Run Scenario
            </>
          )}
        </button>

        {phase !== "idle" && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}

        <p className="text-xs text-gray-400">
          {phase === "idle"
            ? "Select a scenario then click Run"
            : phase === "running"
            ? "Tasks executing in sequence…"
            : "Run complete — click a task for details"}
        </p>
      </div>
    </div>
  );
}
