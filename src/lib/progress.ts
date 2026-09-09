"use client";

import { ProgressState } from "./types";

const STORAGE_KEY = "databricks-learning-progress";

const defaultProgress: ProgressState = {
  visitedPhases: [],
  completedSteps: [],
  quizScores: {},
  overallCompletion: 0,
};

export function getProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    const parsed = JSON.parse(stored);
    // Migrate legacy visitedDays → visitedPhases
    if (Array.isArray(parsed.visitedDays) && !parsed.visitedPhases) {
      parsed.visitedPhases = parsed.visitedDays;
      delete parsed.visitedDays;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed as ProgressState;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: ProgressState): void {
  if (typeof window === "undefined") return;
  const computed = computeOverallCompletion(progress);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, overallCompletion: computed }));
}

export function markPhaseVisited(phaseId: number): void {
  const progress = getProgress();
  if (!progress.visitedPhases.includes(phaseId)) {
    progress.visitedPhases.push(phaseId);
    saveProgress(progress);
  }
}

export function toggleStep(stepId: string): void {
  const progress = getProgress();
  const idx = progress.completedSteps.indexOf(stepId);
  if (idx === -1) {
    progress.completedSteps.push(stepId);
  } else {
    progress.completedSteps.splice(idx, 1);
  }
  saveProgress(progress);
}

export function saveQuizScore(quizId: string, score: number): void {
  const progress = getProgress();
  progress.quizScores[quizId] = score;
  saveProgress(progress);
}

function computeOverallCompletion(progress: ProgressState): number {
  const TOTAL_PHASES = 5;
  const totalSteps = 8; // first 10 minutes steps
  const totalQuizzes = 3;

  const dayWeight = 0.4;
  const stepWeight = 0.35;
  const quizWeight = 0.25;

  const dayScore = Math.min(progress.visitedPhases.length / TOTAL_PHASES, 1) * dayWeight;
  const stepScore = Math.min(progress.completedSteps.length / totalSteps, 1) * stepWeight;
  const quizScore = Math.min(Object.keys(progress.quizScores).length / totalQuizzes, 1) * quizWeight;

  return Math.round((dayScore + stepScore + quizScore) * 100);
}

export function getCompletionByPhase(phaseId: number): boolean {
  const progress = getProgress();
  return progress.visitedPhases.includes(phaseId);
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
