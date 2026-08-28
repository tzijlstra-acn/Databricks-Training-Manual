import { PipelineTask } from "@/lib/types";

export const pipelineTasks: PipelineTask[] = [
  {
    id: "task-1",
    name: "CRM Extract Ingestion",
    description: "Load raw extracts from BAYO, IBS Alabus, MAX, KETL, and Vorsorge Partner CRM into Bronze tables — untouched, exactly as delivered by the data stewards.",
    status: "success",
    duration: "2m 14s",
    type: "ingestion",
  },
  {
    id: "task-2",
    name: "Entity Attribution & Standardisation",
    description: "Resolve BAYO rows to Howden Schweiz AG or SWIBRO AG using deal-level identifiers. Rename all commission field variants (brokerage_fee, comm_amt, fee_earned…) to a single canonical commission_chf field.",
    status: "running",
    duration: "1m 32s",
    type: "transform",
  },
  {
    id: "task-3",
    name: "Data Quality Gate",
    description: "Run DQX rules: entity attribution completeness, commission null check, duplicate deal detection, and Abacus variance check (threshold: CHF 10,000 or 5% per entity).",
    status: "waiting",
    type: "quality",
  },
  {
    id: "task-4",
    name: "FINMA Report Build",
    description: "Aggregate validated Silver data into 5 entity-level Gold datasets — one per entity — ready for FINMA intermediary submission by 31 May.",
    status: "waiting",
    type: "build",
  },
  {
    id: "task-5",
    name: "Abacus Reconciliation",
    description: "Compare Gold commission totals against Abacus 2025 cashflows by entity. Flag any variance exceeding CHF 10,000 or 5% of category total for manual review.",
    status: "waiting",
    type: "refresh",
  },
];

export const failedPipelineTasks: PipelineTask[] = [
  {
    id: "task-1",
    name: "CRM Extract Ingestion",
    description: "Load raw extracts from BAYO, IBS Alabus, MAX, KETL, and Vorsorge Partner CRM into Bronze tables — untouched, exactly as delivered by the data stewards.",
    status: "success",
    duration: "2m 14s",
    type: "ingestion",
  },
  {
    id: "task-2",
    name: "Entity Attribution & Standardisation",
    description: "Resolve BAYO rows to Howden Schweiz AG or SWIBRO AG using deal-level identifiers. Rename all commission field variants to a single canonical commission_chf field.",
    status: "success",
    duration: "3m 48s",
    type: "transform",
  },
  {
    id: "task-3",
    name: "Data Quality Gate",
    description: "Run DQX rules: entity attribution completeness, commission null check, duplicate deal detection, and Abacus variance check.",
    status: "failed",
    duration: "0m 22s",
    errorMessage: "DQX rule failed: 218 BAYO rows could not be attributed to a single entity (neither Howden Schweiz AG nor SWIBRO AG deal-level identifier matched). Attribution rate: 99.55% — below the required 100% threshold. Pipeline stopped to prevent unattributed records reaching the FINMA Gold tables.",
    type: "quality",
  },
  {
    id: "task-4",
    name: "FINMA Report Build",
    description: "Aggregate validated Silver data into 5 entity-level Gold datasets for FINMA submission.",
    status: "waiting",
    type: "build",
  },
  {
    id: "task-5",
    name: "Abacus Reconciliation",
    description: "Compare Gold commission totals against Abacus 2025 cashflows by entity.",
    status: "waiting",
    type: "refresh",
  },
];

export const recentRuns = [
  { id: "run-1", date: "2025-03-22 02:00", status: "success", duration: "9m 12s" },
  { id: "run-2", date: "2025-03-21 02:00", status: "success", duration: "8m 47s" },
  { id: "run-3", date: "2025-03-20 02:00", status: "failed",  duration: "3m 02s" },
  { id: "run-4", date: "2025-03-19 02:00", status: "success", duration: "9m 31s" },
  { id: "run-5", date: "2025-03-18 02:00", status: "success", duration: "8m 55s" },
  { id: "run-6", date: "2025-03-17 02:00", status: "success", duration: "10m 01s" },
  { id: "run-7", date: "2025-03-16 02:00", status: "success", duration: "9m 08s" },
];
