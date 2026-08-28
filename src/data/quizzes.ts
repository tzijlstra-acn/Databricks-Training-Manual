import { QuizQuestion } from "@/lib/types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Where does raw data from a source system first land in Databricks?",
    options: ["Gold Layer", "Silver Layer", "Bronze Layer", "Unity Catalog"],
    correct: 2,
    explanation: "The Bronze layer is the landing zone — data arrives here exactly as it was sent, with no transformation. Think of it as your inbox.",
  },
  {
    id: "q2",
    question: "What powers a Databricks Notebook?",
    options: ["A Dashboard", "Compute (a cluster)", "Unity Catalog", "A SQL Warehouse"],
    correct: 1,
    explanation: "Compute provides the processing power (CPUs and memory) that runs your notebook code. Without an attached cluster, nothing runs.",
  },
  {
    id: "q3",
    question: "Which layer contains data that is 'business-ready' — aggregated and shaped for reporting?",
    options: ["Bronze", "Silver", "Gold", "Ingestion"],
    correct: 2,
    explanation: "Gold layer data has been cleaned (Silver), then aggregated and enriched specifically for business reporting needs.",
  },
  {
    id: "q4",
    question: "What is Unity Catalog used for?",
    options: [
      "Running SQL queries faster",
      "Organising, governing, and securing all data assets",
      "Scheduling automated jobs",
      "Visualising dashboards",
    ],
    correct: 1,
    explanation: "Unity Catalog is the governance layer — it organises all data assets (tables, views, models), manages permissions, and tracks lineage.",
  },
  {
    id: "q5",
    question: "What does Genie do?",
    options: [
      "Manages compute clusters automatically",
      "Runs data quality checks",
      "Translates natural language questions into SQL and returns results",
      "Builds automated pipelines",
    ],
    correct: 2,
    explanation: "Genie lets business users ask questions in plain English ('What was commission by region last month?') and automatically generates SQL to answer them.",
  },
  {
    id: "q6",
    question: "In the Unity Catalog hierarchy, what is the correct order?",
    options: [
      "Schema → Catalog → Table",
      "Table → Schema → Catalog",
      "Catalog → Schema → Table",
      "Catalog → Table → Schema",
    ],
    correct: 2,
    explanation: "Catalog contains Schemas, which contain Tables. For example: enterprise (catalog) → gold (schema) → customer_summary (table).",
  },
];

export const layerAssignmentQuiz = [
  {
    id: "record-1",
    description: "POL-2024-77821,helvetica ag,PROP,485000,CHF,20240101,,10,ZUR_PORTAL_V2",
    correct: "bronze",
    hint: "Lowercase insured name, LoB code not decoded, date not ISO, expiry missing — this is raw carrier data exactly as received.",
  },
  {
    id: "record-2",
    description: "Policy: POL-2024-77821 | Insured: Helvetica AG | LoB: Property | Premium: CHF 485,000 | Coverage: 2024-01-01 → 2024-12-31 | Status: Active",
    correct: "silver",
    hint: "Name title-cased, LoB decoded, ISO dates, expiry date derived — cleaned and validated but still one row per policy.",
  },
  {
    id: "record-3",
    description: "Q1 2024 | Property | Premium: CHF 12.4M | Commission: CHF 1.24M | Policies: 847 | Renewal Rate: 91.3%",
    correct: "gold",
    hint: "Aggregated across 847 policies, commission calculated, renewal KPI derived — business-ready for board-level reporting.",
  },
];

export const workflowOrderQuiz = [
  { id: "step-source", label: "Source System", correct: 1 },
  { id: "step-bronze", label: "Bronze Ingestion", correct: 2 },
  { id: "step-quality", label: "Data Quality Check", correct: 3 },
  { id: "step-silver", label: "Silver Transformation", correct: 4 },
  { id: "step-gold", label: "Gold Build", correct: 5 },
  { id: "step-dashboard", label: "Dashboard Refresh", correct: 6 },
];
