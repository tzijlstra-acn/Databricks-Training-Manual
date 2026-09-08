"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { pipelineTasks, failedPipelineTasks, recentRuns } from "@/data/pipeline";
import type { PipelineTask } from "@/lib/types";

const taskIcons: Record<string, string> = {
  ingestion: "📥",
  transform: "🔄",
  quality: "🛡️",
  build: "🏗️",
  refresh: "📊",
};

const taskColors: Record<string, string> = {
  ingestion: "border-blue-200 bg-blue-50",
  transform: "border-silver-border bg-silver-bg",
  quality: "border-amber-200 bg-amber-50",
  build: "border-gold-border bg-gold-bg",
  refresh: "border-green-200 bg-green-50",
};

function StatusDot({ status }: { status: PipelineTask["status"] }) {
  if (status === "success") {
    return (
      <span className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white">✓</span>
        <span className="text-xs font-medium text-green-700">Success</span>
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs font-medium text-blue-700">Running</span>
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white font-bold">✕</span>
        <span className="text-xs font-medium text-red-700">Failed</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white" />
      <span className="text-xs font-medium text-gray-500">Waiting</span>
    </span>
  );
}

function TaskCard({
  task,
  onClick,
  isSelected,
  animationPhase,
  index,
}: {
  task: PipelineTask;
  onClick: () => void;
  isSelected: boolean;
  animationPhase: number;
  index: number;
}) {
  const isActive = animationPhase > index;
  const displayStatus = isActive ? task.status : index === 0 && animationPhase === 0 ? task.status : "waiting";

  const borderColor =
    displayStatus === "success"
      ? "border-green-300"
      : displayStatus === "failed"
      ? "border-red-300"
      : displayStatus === "running"
      ? "border-blue-300"
      : "border-gray-200";

  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-4 transition-all duration-300 cursor-pointer hover:shadow-md",
        displayStatus === "failed" ? "bg-red-50" : displayStatus === "success" ? "bg-green-50" : "bg-white",
        borderColor,
        isSelected && "ring-2 ring-primary-500 ring-offset-1"
      )}
      onClick={task.status === "failed" ? onClick : undefined}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{taskIcons[task.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm text-gray-900 truncate">{task.name}</p>
            <StatusDot status={isActive ? task.status : "waiting"} />
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{task.description}</p>
          {task.duration && isActive && (
            <p className="text-xs text-gray-400 mt-1.5 font-mono">⏱ {task.duration}</p>
          )}
          {task.status === "failed" && isActive && (
            <button
              onClick={onClick}
              className="mt-2 text-xs font-medium text-red-600 hover:text-red-700 underline"
            >
              View error details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PipelineVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [tasks, setTasks] = useState<PipelineTask[]>(pipelineTasks);
  const [selectedFailedTask, setSelectedFailedTask] = useState<PipelineTask | null>(null);
  const [hasRun, setHasRun] = useState(false);

  function runPipeline() {
    if (isRunning) return;
    setIsRunning(true);
    setHasRun(true);
    setSelectedFailedTask(null);
    setAnimationPhase(0);
    setTasks(pipelineTasks);

    const delays = [0, 1500, 3000, 4500, 6000];
    delays.forEach((delay, i) => {
      setTimeout(() => {
        setAnimationPhase(i + 1);
        if (i === delays.length - 1) {
          // Simulate failure on task 3 after a short time
          setTimeout(() => {
            setTasks(failedPipelineTasks);
            setIsRunning(false);
          }, 800);
        }
      }, delay);
    });
  }

  const displayTasks = hasRun ? failedPipelineTasks : pipelineTasks;

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Commission Pipeline: Daily Run</h3>
          <p className="text-xs text-gray-500 mt-0.5">Scheduled: 02:00 UTC · Last run: 2024-01-22 02:09</p>
        </div>
        <button
          onClick={runPipeline}
          disabled={isRunning}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
            isRunning
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary-800 text-white hover:bg-primary-700 shadow-sm hover:shadow-md"
          )}
        >
          {isRunning ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
              Running…
            </>
          ) : (
            <>▶ Run Now</>
          )}
        </button>
      </div>

      {/* Pipeline tasks */}
      <div className="space-y-2">
        {displayTasks.map((task, i) => (
          <div key={task.id}>
            <TaskCard
              task={task}
              index={i}
              animationPhase={hasRun ? displayTasks.length : animationPhase}
              isSelected={selectedFailedTask?.id === task.id}
              onClick={() =>
                task.status === "failed"
                  ? setSelectedFailedTask(selectedFailedTask?.id === task.id ? null : task)
                  : undefined
              }
            />
            {i < displayTasks.length - 1 && (
              <div className="flex justify-center my-1">
                <div className="w-0.5 h-4 bg-gray-200" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Error panel */}
      {selectedFailedTask && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-5 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🚨</span>
            <div className="flex-1">
              <p className="font-bold text-red-800 text-sm">{selectedFailedTask.name}: Error Details</p>
              <p className="text-sm text-red-700 mt-2 font-mono leading-relaxed bg-red-100 rounded-xl p-3">
                {selectedFailedTask.errorMessage}
              </p>

              <div className="mt-4">
                <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-2">Troubleshooting Steps</p>
                <ol className="space-y-1.5">
                  {[
                    "Query Silver table for null commission_amount records: SELECT COUNT(*) FROM enterprise.silver.commissions WHERE commission_amount IS NULL",
                    "Investigate the source system for the batch that loaded today. Check for data loading errors upstream.",
                    "If data is expected to be partially null, adjust the DQX threshold rule from 2% to 5%",
                    "Re-run the pipeline from task 3 after resolving. Use 'Repair run' in the Jobs UI.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                      <span className="font-bold text-red-500 flex-shrink-0">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() => setSelectedFailedTask(null)}
                className="mt-4 text-xs font-medium text-red-600 hover:text-red-700"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent runs timeline */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Recent Runs</h4>
        <div className="space-y-2">
          {recentRuns.map((run) => (
            <div key={run.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full flex-shrink-0",
                  run.status === "success" ? "bg-green-500" : "bg-red-500"
                )}
              />
              <span className="text-xs text-gray-500 font-mono w-36 flex-shrink-0">{run.date}</span>
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    run.status === "success" ? "bg-green-400" : "bg-red-400"
                  )}
                  style={{ width: run.status === "success" ? "100%" : "35%" }}
                />
              </div>
              <span className="text-xs text-gray-400 font-mono w-16 text-right">{run.duration}</span>
              <span
                className={cn(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                  run.status === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                {run.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
