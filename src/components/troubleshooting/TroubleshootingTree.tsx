"use client";

import { useState } from "react";
import { TroubleshootingScenario, TroubleshootingNode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TroubleshootingTreeProps {
  scenario: TroubleshootingScenario;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getActivePath(
  node: TroubleshootingNode,
  choices: Record<string, boolean>
): string[] {
  const path = [node.id];
  if (node.type === "solution") return path;

  const choice = choices[node.id];
  if (choice === undefined) return path;

  const next = choice ? node.yes : node.no;
  if (!next) return path;

  return [...path, ...getActivePath(next, choices)];
}

function getActiveNode(
  node: TroubleshootingNode,
  choices: Record<string, boolean>
): TroubleshootingNode {
  if (node.type === "solution") return node;
  const choice = choices[node.id];
  if (choice === undefined) return node;
  const next = choice ? node.yes : node.no;
  if (!next) return node;
  return getActiveNode(next, choices);
}

// ── visual tree node ─────────────────────────────────────────────────────────

interface TreeNodeViewProps {
  node: TroubleshootingNode;
  activePath: string[];
}

function TreeNodeView({ node, activePath }: TreeNodeViewProps) {
  const isOnPath = activePath.includes(node.id);
  const isLeafActive = activePath[activePath.length - 1] === node.id;
  const hasChildren = Boolean(node.yes || node.no);

  return (
    <div className="flex flex-col items-center">
      {/* Box */}
      <div
        className={cn(
          "rounded-xl border-2 px-3 py-2.5 text-center transition-all duration-300",
          "min-w-[148px] max-w-[180px]",
          node.type === "question"
            ? isOnPath
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-blue-200 bg-white"
            : isOnPath
            ? "border-green-500 bg-green-500 shadow-sm"
            : "border-green-300 bg-green-50",
          isLeafActive && !isOnPath && "ring-2 ring-amber-400 ring-offset-1"
        )}
      >
        <p
          className={cn(
            "text-[11px] font-medium leading-snug",
            node.type === "question"
              ? isOnPath
                ? "text-blue-900"
                : "text-gray-600"
              : isOnPath
              ? "text-white"
              : "text-green-800"
          )}
        >
          {node.question}
        </p>
        {node.type === "solution" && (
          <span
            className={cn(
              "inline-block mt-1 text-[9px] font-bold uppercase tracking-widest",
              isOnPath ? "text-green-100" : "text-green-600"
            )}
          >
            Solution
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && (
        <>
          {/* Vertical connector */}
          <div
            className={cn(
              "w-px h-5 transition-colors duration-300",
              isOnPath ? "bg-blue-300" : "bg-gray-200"
            )}
          />

          {/* Branch row */}
          <div className="flex items-start gap-6">
            {/* NO branch */}
            {node.no && (
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <div
                    className={cn(
                      "h-px w-8 transition-colors duration-300",
                      activePath.includes(node.no.id) ? "bg-red-400" : "bg-gray-200"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded mx-0.5",
                      activePath.includes(node.no.id)
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    NO
                  </span>
                  <div
                    className={cn(
                      "h-px w-8 transition-colors duration-300",
                      activePath.includes(node.no.id) ? "bg-red-400" : "bg-gray-200"
                    )}
                  />
                </div>
                <TreeNodeView node={node.no} activePath={activePath} />
              </div>
            )}

            {/* YES branch */}
            {node.yes && (
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <div
                    className={cn(
                      "h-px w-8 transition-colors duration-300",
                      activePath.includes(node.yes.id) ? "bg-green-400" : "bg-gray-200"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded mx-0.5",
                      activePath.includes(node.yes.id)
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    YES
                  </span>
                  <div
                    className={cn(
                      "h-px w-8 transition-colors duration-300",
                      activePath.includes(node.yes.id) ? "bg-green-400" : "bg-gray-200"
                    )}
                  />
                </div>
                <TreeNodeView node={node.yes} activePath={activePath} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function TroubleshootingTree({ scenario }: TroubleshootingTreeProps) {
  const [choices, setChoices] = useState<Record<string, boolean>>({});

  const activePath = getActivePath(scenario.tree, choices);
  const currentNode = getActiveNode(scenario.tree, choices);
  const isResolved = currentNode.type === "solution";
  const stepCount = Object.keys(choices).length;

  function handleChoice(nodeId: string, answer: boolean) {
    setChoices(prev => ({ ...prev, [nodeId]: answer }));
  }

  function handleReset() {
    setChoices({});
  }

  return (
    <div className="space-y-5">
      {/* ── Interactive navigator ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Follow the path</h3>
          {stepCount > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          )}
        </div>

        {/* Path breadcrumb */}
        {stepCount > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
            <span className="text-gray-400">Path:</span>
            {activePath.slice(0, -1).map((id, i) => {
              const wasYes = choices[id] === true;
              return (
                <span key={id} className="flex items-center gap-1">
                  {i > 0 && <span className="text-gray-300">›</span>}
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full font-semibold",
                      wasYes
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                    )}
                  >
                    {wasYes ? "YES" : "NO"}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* Current node */}
        {!isResolved ? (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-blue-900">{currentNode.question}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleChoice(currentNode.id, false)}
                className="py-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 hover:border-red-300 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => handleChoice(currentNode.id, true)}
                className="py-3 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 hover:border-green-300 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-300 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-green-900 mb-2">{currentNode.question}</p>
                <p className="text-sm text-green-800 leading-relaxed">{currentNode.resolution}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 text-xs text-green-700 hover:text-green-900 underline transition-colors"
            >
              Start over
            </button>
          </div>
        )}
      </div>

      {/* ── Visual flowchart ── */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">
          Full decision tree. Highlighted nodes show your current path.
        </p>
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex justify-center min-w-full py-2">
            <TreeNodeView node={scenario.tree} activePath={activePath} />
          </div>
        </div>
      </div>
    </div>
  );
}
