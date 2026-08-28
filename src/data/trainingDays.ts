import { TrainingDay } from "@/lib/types";

export const trainingDays: TrainingDay[] = [
  {
    id: 1,
    title: "Foundations",
    subtitle: "Meet the Platform",
    outcome: "Understand where everything lives",
    icon: "layout-dashboard",
    color: "#1E40AF",
    topics: [
      "Databricks Workspace overview",
      "Navigation: Catalog, Notebooks, Compute, Jobs",
      "Workspace vs Catalog distinction",
      "Your first 10 minutes checklist",
    ],
  },
  {
    id: 2,
    title: "Data & Catalog",
    subtitle: "Find Your Data",
    outcome: "Navigate Unity Catalog and understand Medallion layers",
    icon: "table",
    color: "#0891B2",
    topics: [
      "Unity Catalog hierarchy: Catalog → Schema → Table",
      "Medallion Architecture: Bronze, Silver, Gold",
      "Data transformation through layers",
      "Finding and understanding tables",
    ],
  },
  {
    id: 3,
    title: "Develop & Query",
    subtitle: "Work With Data",
    outcome: "Write queries and understand compute",
    icon: "code-2",
    color: "#059669",
    topics: [
      "Databricks Notebooks walkthrough",
      "SQL vs Python in notebooks",
      "Compute clusters: All-Purpose vs Job",
      "SQL Warehouse vs Notebook compute",
    ],
  },
  {
    id: 4,
    title: "Automate & Monitor",
    subtitle: "Build Pipelines",
    outcome: "Automate workflows and ensure data quality",
    icon: "workflow",
    color: "#D97706",
    topics: [
      "Databricks Jobs & Workflows",
      "Pipeline DAG visualization",
      "Data Quality with DQX",
      "Monitoring and alerting",
    ],
  },
  {
    id: 5,
    title: "Analyze & Apply",
    subtitle: "Create Value",
    outcome: "Turn trusted data into business decisions",
    icon: "bar-chart-3",
    color: "#7C3AED",
    topics: [
      "Databricks SQL Dashboards",
      "Data Lineage exploration",
      "Genie: Natural Language to SQL",
      "End-to-end platform capstone",
    ],
  },
];
