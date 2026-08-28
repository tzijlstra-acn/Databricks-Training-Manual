import { PipelineTask } from "@/lib/types";

export const pipelineTasks: PipelineTask[] = [
  {
    id: "task-1",
    name: "Bronze Ingestion",
    description: "Load raw commission and customer records from source systems into Bronze tables.",
    status: "success",
    duration: "2m 14s",
    type: "ingestion",
  },
  {
    id: "task-2",
    name: "Silver Transformation",
    description: "Clean, standardise, and validate records. Normalise country codes, fix nulls, parse dates.",
    status: "running",
    duration: "1m 32s",
    type: "transform",
  },
  {
    id: "task-3",
    name: "Data Quality Gate",
    description: "Run DQX rules: null checks, duplicate detection, schema validation, and business rules.",
    status: "waiting",
    type: "quality",
  },
  {
    id: "task-4",
    name: "Gold Build",
    description: "Aggregate and enrich Silver data into Gold reporting tables by region, segment, and period.",
    status: "waiting",
    type: "build",
  },
  {
    id: "task-5",
    name: "Dashboard Refresh",
    description: "Trigger refresh of the Executive Commission Dashboard with latest Gold data.",
    status: "waiting",
    type: "refresh",
  },
];

export const failedPipelineTasks: PipelineTask[] = [
  {
    id: "task-1",
    name: "Bronze Ingestion",
    description: "Load raw commission and customer records from source systems into Bronze tables.",
    status: "success",
    duration: "2m 14s",
    type: "ingestion",
  },
  {
    id: "task-2",
    name: "Silver Transformation",
    description: "Clean, standardise, and validate records. Normalise country codes, fix nulls, parse dates.",
    status: "success",
    duration: "3m 48s",
    type: "transform",
  },
  {
    id: "task-3",
    name: "Data Quality Gate",
    description: "Run DQX rules: null checks, duplicate detection, schema validation, and business rules.",
    status: "failed",
    duration: "0m 22s",
    errorMessage: "DQX threshold exceeded: 4.8% null rate in commission_amount (threshold: 2%). 218 records failed null check. Pipeline stopped to prevent bad data reaching Gold.",
    type: "quality",
  },
  {
    id: "task-4",
    name: "Gold Build",
    description: "Aggregate and enrich Silver data into Gold reporting tables by region, segment, and period.",
    status: "waiting",
    type: "build",
  },
  {
    id: "task-5",
    name: "Dashboard Refresh",
    description: "Trigger refresh of the Executive Commission Dashboard with latest Gold data.",
    status: "waiting",
    type: "refresh",
  },
];

export const recentRuns = [
  { id: "run-1", date: "2024-01-22 02:00", status: "success", duration: "9m 12s" },
  { id: "run-2", date: "2024-01-21 02:00", status: "success", duration: "8m 47s" },
  { id: "run-3", date: "2024-01-20 02:00", status: "failed", duration: "3m 02s" },
  { id: "run-4", date: "2024-01-19 02:00", status: "success", duration: "9m 31s" },
  { id: "run-5", date: "2024-01-18 02:00", status: "success", duration: "8m 55s" },
  { id: "run-6", date: "2024-01-17 02:00", status: "success", duration: "10m 01s" },
  { id: "run-7", date: "2024-01-16 02:00", status: "success", duration: "9m 08s" },
];
