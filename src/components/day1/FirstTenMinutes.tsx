"use client";

import { useState, useEffect } from "react";
import {
  LogIn,
  Layout,
  FolderOpen,
  Database,
  Table2,
  BookOpen,
  Server,
  Briefcase,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { toggleStep, getProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "step-sign-in",
    number: 1,
    label: "Sign In",
    detail: "Go to your Databricks URL and log in with your Accenture credentials.",
    icon: LogIn,
    color: "#1F2144",
  },
  {
    id: "step-find-workspace",
    number: 2,
    label: "Find Workspace",
    detail: "Locate the Workspace section in the left sidebar — this is your home for notebooks and files.",
    icon: Layout,
    color: "#0891B2",
  },
  {
    id: "step-open-workspace",
    number: 3,
    label: "Open Workspace",
    detail: "Click Workspace and browse the folder structure. Look for a shared or personal folder.",
    icon: FolderOpen,
    color: "#059669",
  },
  {
    id: "step-find-catalog",
    number: 4,
    label: "Find Catalog",
    detail: "Click Catalog in the sidebar. This is where all tables and governed data assets live.",
    icon: Database,
    color: "#7C3AED",
  },
  {
    id: "step-locate-table",
    number: 5,
    label: "Locate a Table",
    detail: "Expand enterprise → silver → customers_clean. Click it to see its schema and sample data.",
    icon: Table2,
    color: "#D97706",
  },
  {
    id: "step-find-notebook",
    number: 6,
    label: "Find a Notebook",
    detail: "Return to Workspace, open the training folder, and open any existing notebook.",
    icon: BookOpen,
    color: "#DC2626",
  },
  {
    id: "step-find-compute",
    number: 7,
    label: "Find Compute",
    detail: "Click Compute in the sidebar. Check whether a cluster is running or stopped.",
    icon: Server,
    color: "#0891B2",
  },
  {
    id: "step-locate-jobs",
    number: 8,
    label: "Locate Jobs",
    detail: "Click Jobs & Pipelines. See any scheduled or recent pipeline runs.",
    icon: Briefcase,
    color: "#059669",
  },
];

export function FirstTenMinutes() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  useEffect(() => {
    const progress = getProgress();
    setCompletedSteps(progress.completedSteps);
  }, []);

  function handleToggle(stepId: string) {
    toggleStep(stepId);
    const progress = getProgress();
    setCompletedSteps([...progress.completedSteps]);
  }

  const completedCount = steps.filter((s) => completedSteps.includes(s.id)).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your First 10 Minutes</h3>
          <p className="text-sm text-gray-500 mt-0.5">Complete these steps to orient yourself in the platform</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-800">{completedCount}/{steps.length}</p>
          <p className="text-xs text-gray-400">completed</p>
        </div>
      </div>

      {/* Completion bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs font-semibold text-primary-800">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-primary-800 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {completedCount === steps.length && (
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            All steps complete — you know your way around!
          </p>
        )}
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isComplete = completedSteps.includes(step.id);
          const isExpanded = expandedStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={cn(
                "relative rounded-2xl border p-4 cursor-pointer transition-all duration-200",
                isComplete
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              )}
              onClick={() => setExpandedStep(isExpanded ? null : step.id)}
            >
              {/* Number + check */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 transition-colors",
                    isComplete ? "bg-green-500" : ""
                  )}
                  style={{ backgroundColor: isComplete ? undefined : step.color }}
                >
                  {isComplete ? <CheckCircle2 className="w-4 h-4" /> : step.number}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(step.id);
                  }}
                  className={cn(
                    "transition-colors",
                    isComplete ? "text-green-500" : "text-gray-300 hover:text-gray-500"
                  )}
                  title={isComplete ? "Mark incomplete" : "Mark complete"}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: step.color + "15", color: step.color }}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Label */}
              <p
                className={cn(
                  "text-sm font-semibold",
                  isComplete ? "text-green-700" : "text-gray-800"
                )}
              >
                {step.label}
              </p>

              {/* Expandable detail */}
              {isExpanded && (
                <p className="text-xs text-gray-500 mt-2 leading-relaxed border-t border-gray-100 pt-2">
                  {step.detail}
                </p>
              )}
              {!isExpanded && (
                <p className="text-xs text-gray-400 mt-1">Click for detail</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Horizontal step flow (desktop) */}
      <div className="mt-6 hidden lg:flex items-center gap-1 overflow-x-auto pb-2">
        {steps.map((step, idx) => {
          const isComplete = completedSteps.includes(step.id);
          return (
            <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
              <div
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  isComplete ? "bg-green-500" : "bg-gray-200"
                )}
              />
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 transition-colors",
                    completedSteps.includes(steps[idx + 1]?.id ?? "") && isComplete
                      ? "bg-green-300"
                      : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
        <span className="ml-3 text-xs text-gray-400">{completedCount} of {steps.length} done</span>
      </div>
    </div>
  );
}
