"use client";

import { ProgressState } from "./types";

const STORAGE_KEY = "databricks-learning-progress";

const defaultProgress: ProgressState = {
  visitedDays: [],
  completedSteps: [],
  quizScores: {},
  overallCompletion: 0,
};

export function getProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    return JSON.parse(stored) as ProgressState;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: ProgressState): void {
  if (typeof window === "undefined") return;
  const computed = computeOverallCompletion(progress);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, overallCompletion: computed }));
}

export function markDayVisited(dayId: number): void {
  const progress = getProgress();
  if (!progress.visitedDays.includes(dayId)) {
    progress.visitedDays.push(dayId);
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
  const totalDays = 5;
  const totalSteps = 8; // first 10 minutes steps
  const totalQuizzes = 3;

  const dayWeight = 0.4;
  const stepWeight = 0.35;
  const quizWeight = 0.25;

  const dayScore = Math.min(progress.visitedDays.length / totalDays, 1) * dayWeight;
  const stepScore = Math.min(progress.completedSteps.length / totalSteps, 1) * stepWeight;
  const quizScore = Math.min(Object.keys(progress.quizScores).length / totalQuizzes, 1) * quizWeight;

  return Math.round((dayScore + stepScore + quizScore) * 100);
}

export function getCompletionByDay(dayId: number): boolean {
  const progress = getProgress();
  return progress.visitedDays.includes(dayId);
}
