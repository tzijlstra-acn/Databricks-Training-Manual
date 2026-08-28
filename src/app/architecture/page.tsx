"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeMouseHandler,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { X, ArrowRight, ArrowLeft, Link2 } from "lucide-react";
import { architectureNodes, architectureEdges } from "@/data/architecture";
import { ArchitectureNode } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  platform: { color: "#1F2144", bg: "#E8E9F0", border: "#D0D2E1", label: "Platform" },
  governance: { color: "#0891B2", bg: "#E0F7FA", border: "#67E8F9", label: "Governance" },
  compute: { color: "#059669", bg: "#ECFDF5", border: "#6EE7B7", label: "Compute" },
  analytics: { color: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD", label: "Analytics" },
  orchestration: { color: "#D97706", bg: "#FFFBEB", border: "#FCD34D", label: "Orchestration" },
  storage: { color: "#6B7280", bg: "#F9FAFB", border: "#D1D5DB", label: "Storage" },
};

// Custom node component
function ArchNode({ data }: { data: { node: ArchitectureNode; selected: boolean } }) {
  const { node, selected } = data;
  const cfg = categoryConfig[node.category] ?? categoryConfig.platform;
  return (
    <div
      style={{
        background: cfg.bg,
        border: `2px solid ${selected ? cfg.color : cfg.border}`,
        borderRadius: 14,
        padding: "10px 14px",
        minWidth: 130,
        boxShadow: selected ? `0 0 0 3px ${cfg.color}30` : "0 1px 4px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.15s, border-color 0.15s",
        cursor: "pointer",
      }}
    >
      <div
        className="text-xs font-semibold mb-0.5"
        style={{ color: cfg.color }}
      >
        {cfg.label}
      </div>
      <div className="text-sm font-bold text-gray-900">{node.label}</div>
    </div>
  );
}

const nodeTypes = { arch: ArchNode };

// Build ReactFlow nodes
function buildRfNodes(selectedId: string | null): Node[] {
  return architectureNodes.map((n) => ({
    id: n.id,
    type: "arch",
    position: { x: n.x, y: n.y },
    data: { node: n, selected: n.id === selectedId },
    draggable: true,
  }));
}

// Build ReactFlow edges
const rfEdges: Edge[] = architectureEdges.map((e, i) => ({
  id: `edge-${i}`,
  source: e.source,
  target: e.target,
  animated: true,
  style: { stroke: "#94A3B8", strokeWidth: 1.5 },
  type: "smoothstep",
}));

export default function ArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(buildRfNodes(null));
  const [edges, , onEdgesChange] = useEdgesState(rfEdges);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const archNode = architectureNodes.find((n) => n.id === node.id) ?? null;
      setSelectedNode(archNode);
      // Update selected state on all nodes
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          data: { ...n.data, selected: n.id === node.id },
        }))
      );
    },
    [setNodes]
  );

  function closePanel() {
    setSelectedNode(null);
    setNodes((prev) =>
      prev.map((n) => ({ ...n, data: { ...n.data, selected: false } }))
    );
  }

  const cfg = selectedNode ? (categoryConfig[selectedNode.category] ?? categoryConfig.platform) : null;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">Architecture</p>
          <h1 className="text-3xl font-bold text-gray-900">Platform Architecture Explorer</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">
            Click any node to learn what it does, what it depends on, and what it feeds into.
            Drag nodes to rearrange. Scroll to zoom.
          </p>
        </div>

        {/* Category legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(categoryConfig).map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{ backgroundColor: val.bg, borderColor: val.border, color: val.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: val.color }} />
              {val.label}
            </span>
          ))}
        </div>

        {/* Flow + panel layout */}
        <div className="flex gap-6 items-start">
          {/* ReactFlow canvas */}
          <div
            className="flex-1 rounded-2xl border border-gray-200 overflow-hidden bg-white"
            style={{ height: 600 }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.3}
              maxZoom={2}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E2E8F0" />
              <Controls className="rounded-xl border border-gray-200 overflow-hidden shadow-sm" />
              <MiniMap
                className="rounded-xl border border-gray-200 overflow-hidden"
                nodeColor={(n) => {
                  const archNode = architectureNodes.find((a) => a.id === n.id);
                  return archNode ? (categoryConfig[archNode.category]?.color ?? "#6B7280") : "#6B7280";
                }}
              />
            </ReactFlow>
          </div>

          {/* Side panel */}
          {selectedNode && cfg && (
            <div className="w-80 flex-shrink-0">
              <div className="rounded-2xl border-2 overflow-hidden bg-white" style={{ borderColor: cfg.border }}>
                {/* Panel header */}
                <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: cfg.bg }}>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: cfg.color + "20", color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    <h3 className="font-bold text-gray-900">{selectedNode.label}</h3>
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
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedNode.description}</p>

                  {/* Used for */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Used for</p>
                    <ul className="space-y-1">
                      {selectedNode.usedFor.map((u) => (
                        <li key={u} className="flex items-start gap-2 text-sm text-gray-700">
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
                          const depNode = architectureNodes.find((n) => n.id === dep);
                          const depCfg = depNode ? (categoryConfig[depNode.category] ?? categoryConfig.platform) : null;
                          return (
                            <span
                              key={dep}
                              className="text-xs px-2.5 py-1 rounded-full border font-medium cursor-pointer"
                              style={depCfg ? { backgroundColor: depCfg.bg, borderColor: depCfg.border, color: depCfg.color } : {}}
                              onClick={() => {
                                if (depNode) {
                                  setSelectedNode(depNode);
                                  setNodes((prev) =>
                                    prev.map((n) => ({ ...n, data: { ...n.data, selected: n.id === depNode.id } }))
                                  );
                                }
                              }}
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
                          const outNode = architectureNodes.find((n) => n.id === out);
                          const outCfg = outNode ? (categoryConfig[outNode.category] ?? categoryConfig.platform) : null;
                          return (
                            <span
                              key={out}
                              className="text-xs px-2.5 py-1 rounded-full border font-medium cursor-pointer"
                              style={outCfg ? { backgroundColor: outCfg.bg, borderColor: outCfg.border, color: outCfg.color } : {}}
                              onClick={() => {
                                if (outNode) {
                                  setSelectedNode(outNode);
                                  setNodes((prev) =>
                                    prev.map((n) => ({ ...n, data: { ...n.data, selected: n.id === outNode.id } }))
                                  );
                                }
                              }}
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
                    {selectedNode.dependsOn.length + selectedNode.outputsTo.length} connections total
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Click a dependency or output to navigate to it
              </p>
            </div>
          )}

          {!selectedNode && (
            <div className="w-80 flex-shrink-0">
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">Select a node</p>
                <p className="text-xs text-gray-400 mt-1">Click any component in the diagram to see its details here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
