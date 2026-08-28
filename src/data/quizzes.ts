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
    description: "Raw CSV: john smith,CH,NULL,2450,2024-01-15T09:23:11Z",
    correct: "bronze",
    hint: "Notice: lowercase, null values, timestamp format — this is raw, unprocessed data.",
  },
  {
    id: "record-2",
    description: "Customer: John Smith | Country: Switzerland | Status: Active | Commission: 2,450.00",
    correct: "silver",
    hint: "Names capitalised, country expanded, nulls filled, number formatted — cleaned but not yet aggregated.",
  },
  {
    id: "record-3",
    description: "Region: DACH | Total Commission: CHF 12.4M | Active Customers: 8,234 | Period: Q1 2024",
    correct: "gold",
    hint: "Aggregated by region, CHF currency formatted, quarter summary — this is business-ready reporting data.",
  },
];

export const workflowOrderQuiz = [
  { id: "step-source", label: "Source System", correct: 1 },
  { id: "step-bronze", label: "Bronze Ingestion", correct: 2 },
  { id: "step-silver", label: "Silver Transformation", correct: 3 },
  { id: "step-quality", label: "Data Quality Check", correct: 4 },
  { id: "step-gold", label: "Gold Build", correct: 5 },
  { id: "step-dashboard", label: "Dashboard Refresh", correct: 6 },
];
