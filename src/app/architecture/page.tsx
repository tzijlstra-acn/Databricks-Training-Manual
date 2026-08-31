"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  NodeMouseHandler,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Link2,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Map,
} from "lucide-react";
import { architectureNodes, architectureEdges } from "@/data/architecture";
import { ArchitectureNode } from "@/lib/types";
import { nodeTypes } from "@/components/architecture/CustomNodes";

// ─── Category config (for legend + side panel) ───────────────────────────────

const categoryConfig: Record<
  string,
  { color: string; bg: string; border: string; label: string }
> = {
  platform: {
    color: "#1F2144",
    bg: "#E8E9F0",
    border: "#D0D2E1",
    label: "Platform",
  },
  governance: {
    color: "#0891B2",
    bg: "#ECFEFF",
    border: "#A5F3FC",
    label: "Governance",
  },
  compute: {
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    label: "Compute",
  },
  analytics: {
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    label: "Analytics",
  },
  orchestration: {
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    label: "Orchestration",
  },
};

// ─── Tour steps ───────────────────────────────────────────────────────────────

const TOUR_STEPS = [
  {
    title: "1. The Workspace — Your Front Door",
    desc: "Every session begins at the Workspace. It is the Databricks web interface that gives you access to every other component — compute, data, jobs, and dashboards all start here.",
    nodeIds: ["workspace"],
    color: "#1F2144",
  },
  {
    title: "2. Compute — The Engine Room",
    desc: "Nothing runs without compute. General-Purpose Clusters power notebooks and jobs. SQL Warehouses are optimised for analytics queries. Both must be running before you can execute any code.",
    nodeIds: ["compute", "sql-warehouse"],
    color: "#059669",
  },
  {
    title: "3. Governance — Unity Catalog",
    desc: "Unity Catalog is the single source of truth for permissions, data discovery, and lineage. Every table, file, and model is registered here. Without it, the Medallion architecture has no foundation.",
    nodeIds: ["unity-catalog"],
    color: "#0891B2",
  },
  {
    title: "4. Where You Work — Notebooks & SQL Editor",
    desc: "Notebooks combine code (Python/SQL/Scala) with inline results — perfect for ETL development and exploration. The SQL Editor is a dedicated interface with auto-complete, query history, and saved queries.",
    nodeIds: ["notebooks", "sql-editor"],
    color: "#7C3AED",
  },
  {
    title: "5. Automation — Jobs, Pipelines & Alerts",
    desc: "Jobs & Workflows schedule and orchestrate runs. DLT Pipelines build the Medallion layers with built-in data quality rules. Alerts fire when thresholds are breached — the FINMA pipeline runs here every night.",
    nodeIds: ["jobs", "pipelines", "alerts"],
    color: "#D97706",
  },
  {
    title: "6. Insights — Dashboards & Genie AI",
    desc: "Dashboards turn Gold data into executive KPIs. Genie AI lets business users ask questions in plain English without writing SQL. Together they power the FINMA commission reporting view.",
    nodeIds: ["dashboards", "genie"],
    color: "#7C3AED",
  },
];

// ─── Initial RF positions ─────────────────────────────────────────────────────

const INITIAL_RF_NODES = architectureNodes.map((n) => ({
  id: n.id,
  type: "customArch" as const,
  position: { x: n.x, y: n.y },
  data: {},
  draggable: true,
}));

// ─── Page component ───────────────────────────────────────────────────────────

export default function ArchitecturePage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);

  // useNodesState just for tracking dragged positions
  const [posNodes, , onNodesChange] = useNodesState(INITIAL_RF_NODES);

  // Highlighted IDs when a node is selected (not in tour)
  const highlightedNodeIds = useMemo(() => {
    if (selectedNodeId === null || tourStep !== null) return new Set<string>();
    const connected = new Set<string>();
    architectureEdges.forEach((e) => {
      if (e.source === selectedNodeId) connected.add(e.target);
      if (e.target === selectedNodeId) connected.add(e.source);
    });
    return connected;
  }, [selectedNodeId, tourStep]);

  // Display nodes: merge position state with visual flags
  const displayNodes = useMemo(() => {
    const posMap = Object.fromEntries(posNodes.map((n) => [n.id, n.position]));
    return architectureNodes.map((n) => {
      const isSelected = tourStep === null && n.id === selectedNodeId;
      const isHighlighted =
        tourStep !== null
          ? TOUR_STEPS[tourStep].nodeIds.includes(n.id)
          : !isSelected && highlightedNodeIds.has(n.id);
      const anyActive = selectedNodeId !== null || tourStep !== null;
      const isDimmed = anyActive && !isSelected && !isHighlighted;

      return {
        id: n.id,
        type: "customArch" as const,
        position: posMap[n.id] ?? { x: n.x, y: n.y },
        data: {
          nodeId: n.id,
          label: n.label,
          category: n.category,
          selected: isSelected,
          highlighted: isHighlighted,
          dimmed: isDimmed,
        },
        draggable: true,
      };
    });
  }, [posNodes, selectedNodeId, highlightedNodeIds, tourStep]);

  // Display edges: highlight edges connected to selected node
  const displayEdges = useMemo(() => {
    return architectureEdges.map((e, i) => {
      const isDirectlyConnected =
        selectedNodeId !== null &&
        (e.source === selectedNodeId || e.target === selectedNodeId);
      const isInTour =
        tourStep !== null &&
        (TOUR_STEPS[tourStep].nodeIds.includes(e.source) ||
          TOUR_STEPS[tourStep].nodeIds.includes(e.target));
      const anyActive = selectedNodeId !== null || tourStep !== null;
      const isActive = !anyActive || isDirectlyConnected || isInTour;

      return {
        id: `edge-${i}`,
        source: e.source,
        target: e.target,
        animated: isDirectlyConnected || isInTour,
        style: {
          stroke: isActive
            ? anyActive
              ? "#4B5563"
              : "#94A3B8"
            : "#E5E7EB",
          strokeWidth: isDirectlyConnected || isInTour ? 2.5 : 1.5,
          opacity: isActive ? 1 : 0.12,
          transition: "all 0.3s ease",
        },
        type: "smoothstep",
      };
    });
  }, [selectedNodeId, tourStep]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (tourStep !== null) setTourStep(null);
      const clickedId = node.id;
      setSelectedNodeId((prev) => (prev === clickedId ? null : clickedId));
    },
    [tourStep]
  );

  function closePanel() {
    setSelectedNodeId(null);
  }

  function startTour() {
    setSelectedNodeId(null);
    setTourStep(0);
  }

  function exitTour() {
    setTourStep(null);
  }

  const selectedNode: ArchitectureNode | null =
    selectedNodeId
      ? (architectureNodes.find((n) => n.id === selectedNodeId) ?? null)
      : null;

  const cfg = selectedNode
    ? (categoryConfig[selectedNode.category] ?? categoryConfig.platform)
    : null;

  const currentTourStep =
    tourStep !== null ? TOUR_STEPS[tourStep] : null;

  function navigateTo(id: string) {
    setSelectedNodeId(id);
    setTourStep(null);
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
              Architecture
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Platform Architecture Explorer
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Click any node to see what it does and which components it
              connects to. Related nodes light up; unrelated nodes dim.
            </p>
          </div>

          {/* Tour button */}
          {tourStep === null ? (
            <button
              onClick={startTour}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-800 hover:bg-primary-700 shadow-sm transition-all shrink-0"
            >
              <PlayCircle className="w-4 h-4" />
              Take the Tour
            </button>
          ) : (
            <button
              onClick={exitTour}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all shrink-0"
            >
              <X className="w-4 h-4" />
              Exit Tour
            </button>
          )}
        </div>

        {/* Tour progress bar */}
        {tourStep !== null && (
          <div className="flex items-center gap-1.5 mb-4">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTourStep(i)}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === tourStep ? 28 : 8,
                  backgroundColor:
                    i === tourStep
                      ? TOUR_STEPS[tourStep].color
                      : i < tourStep
                      ? "#9CA3AF"
                      : "#E5E7EB",
                }}
              />
            ))}
            <span className="text-xs text-gray-400 ml-2 font-medium">
              {tourStep + 1} / {TOUR_STEPS.length}
            </span>
          </div>
        )}

        {/* Category legend */}
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(categoryConfig).map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: val.bg,
                borderColor: val.border,
                color: val.color,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: val.color }}
              />
              {val.label}
            </span>
          ))}
        </div>

        {/* Main layout */}
        <div className="flex gap-6 items-start">
          {/* ReactFlow canvas */}
          <div
            className="flex-1 rounded-2xl border border-gray-200 overflow-hidden bg-white"
            style={{ height: 620 }}
          >
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              onNodesChange={onNodesChange}
              onNodeClick={handleNodeClick}
              onPaneClick={() => {
                setSelectedNodeId(null);
                // Do not exit tour on background click — user must press Exit Tour
              }}
              nodeTypes={nodeTypes}
              nodesConnectable={false}
              deleteKeyCode={null}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.3}
              maxZoom={2}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={22}
                size={1}
                color="#E5E7EB"
              />
              <Controls className="rounded-xl border border-gray-200 overflow-hidden shadow-sm" />
              <MiniMap
                className="rounded-xl border border-gray-200 overflow-hidden"
                nodeColor={(n) => {
                  const arch = architectureNodes.find((a) => a.id === n.id);
                  return arch
                    ? (categoryConfig[arch.category]?.color ?? "#6B7280")
                    : "#6B7280";
                }}
              />
            </ReactFlow>
          </div>

          {/* Right panel */}
          <div className="w-80 flex-shrink-0 space-y-3">
            {/* Tour step panel */}
            {currentTourStep && (
              <div
                className="rounded-2xl border-2 overflow-hidden bg-white"
                style={{ borderColor: currentTourStep.color + "60" }}
              >
                <div
                  className="px-4 py-3"
                  style={{
                    background: `linear-gradient(135deg, ${currentTourStep.color}12 0%, ${currentTourStep.color}06 100%)`,
                    borderBottom: `1px solid ${currentTourStep.color}20`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Map
                      className="w-4 h-4"
                      style={{ color: currentTourStep.color }}
                    />
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: currentTourStep.color }}
                    >
                      Guided Tour
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">
                    {currentTourStep.title}
                  </h3>
                </div>

                <div className="p-4">
                  {/* Highlighted node badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {currentTourStep.nodeIds.map((id) => {
                      const node = architectureNodes.find((n) => n.id === id);
                      const ncfg = node
                        ? (categoryConfig[node.category] ?? categoryConfig.platform)
                        : null;
                      return ncfg && node ? (
                        <span
                          key={id}
                          className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: ncfg.bg,
                            color: ncfg.color,
                            border: `1px solid ${ncfg.border}`,
                          }}
                        >
                          {node.label}
                        </span>
                      ) : null;
                    })}
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {currentTourStep.desc}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        setTourStep((s) => (s !== null && s > 0 ? s - 1 : s))
                      }
                      disabled={tourStep === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>

                    {tourStep! < TOUR_STEPS.length - 1 ? (
                      <button
                        onClick={() => setTourStep((s) => (s !== null ? s + 1 : s))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                        style={{ backgroundColor: currentTourStep.color }}
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={exitTour}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gray-700 hover:bg-gray-800 transition-all"
                      >
                        Done <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Node info panel */}
            {selectedNode && cfg && tourStep === null && (
              <div
                className="rounded-2xl border-2 overflow-hidden bg-white"
                style={{ borderColor: cfg.border }}
              >
                {/* Panel header */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: cfg.color + "20",
                        color: cfg.color,
                      }}
                    >
                      {cfg.label}
                    </span>
                    <h3 className="font-bold text-gray-900">
                      {selectedNode.label}
                    </h3>
                  </div>
                  <button
                    onClick={closePanel}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Description */}
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedNode.description}
                  </p>

                  {/* Used for */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Used for
                    </p>
                    <ul className="space-y-1">
                      {selectedNode.usedFor.map((u) => (
                        <li
                          key={u}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <span className="text-green-500 mt-0.5">•</span>
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Depends on */}
                  {selectedNode.dependsOn.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <ArrowLeft className="w-3.5 h-3.5" /> Depends on
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.dependsOn.map((dep) => {
                          const depNode = architectureNodes.find(
                            (n) => n.id === dep
                          );
                          const depCfg = depNode
                            ? (categoryConfig[depNode.category] ??
                              categoryConfig.platform)
                            : null;
                          return (
                            <span
                              key={dep}
                              className="text-xs px-2.5 py-1 rounded-full border font-medium cursor-pointer hover:opacity-80 transition-opacity"
                              style={
                                depCfg
                                  ? {
                                      backgroundColor: depCfg.bg,
                                      borderColor: depCfg.border,
                                      color: depCfg.color,
                                    }
                                  : {}
                              }
                              onClick={() => depNode && navigateTo(depNode.id)}
                            >
                              {depNode?.label ?? dep}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Outputs to */}
                  {selectedNode.outputsTo.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <ArrowRight className="w-3.5 h-3.5" /> Outputs to
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.outputsTo.map((out) => {
                          const outNode = architectureNodes.find(
                            (n) => n.id === out
                          );
                          const outCfg = outNode
                            ? (categoryConfig[outNode.category] ??
                              categoryConfig.platform)
                            : null;
                          return (
                            <span
                              key={out}
                              className="text-xs px-2.5 py-1 rounded-full border font-medium cursor-pointer hover:opacity-80 transition-opacity"
                              style={
                                outCfg
                                  ? {
                                      backgroundColor: outCfg.bg,
                                      borderColor: outCfg.border,
                                      color: outCfg.color,
                                    }
                                  : {}
                              }
                              onClick={() => outNode && navigateTo(outNode.id)}
                            >
                              {outNode?.label ?? out}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Connections count */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100">
                    <Link2 className="w-3.5 h-3.5" />
                    {selectedNode.dependsOn.length +
                      selectedNode.outputsTo.length}{" "}
                    connections total
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder when nothing selected */}
            {!selectedNode && tourStep === null && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Select a node
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Click any component to see its details and connections
                </p>
                <button
                  onClick={startTour}
                  className="mt-4 text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1 mx-auto transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  Or take the guided tour
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-xs text-gray-400 mt-4 text-center">
          Click any node to explore connections · Drag to rearrange · Scroll to zoom · Click canvas to clear selection
        </p>
      </div>
    </div>
  );
}
