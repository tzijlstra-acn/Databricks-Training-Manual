import { Persona } from "@/lib/types";

export const personas: Persona[] = [
  {
    id: "business-user",
    name: "Business User",
    role: "Analyst / Manager",
    description: "Consumes insights from dashboards and uses Genie for self-service questions. No SQL required.",
    primaryTools: ["dashboards", "genie", "alerts"],
    color: "#7C3AED",
    icon: "bar-chart-3",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    role: "SQL / BI Analyst",
    description: "Queries Gold tables with SQL, builds dashboards, and creates saved queries for business users.",
    primaryTools: ["unity-catalog", "sql-editor", "sql-warehouse", "dashboards"],
    color: "#0891B2",
    icon: "search",
  },
  {
    id: "data-engineer",
    name: "Data Engineer",
    role: "Pipeline Developer",
    description: "Builds and maintains pipelines from Bronze to Gold. Owns data quality and job scheduling.",
    primaryTools: ["notebooks", "compute", "jobs", "pipelines", "unity-catalog"],
    color: "#059669",
    icon: "code-2",
  },
  {
    id: "platform-admin",
    name: "Platform Admin",
    role: "Infrastructure / Governance",
    description: "Manages access control, compute resources, and platform governance. Owns Unity Catalog permissions.",
    primaryTools: ["unity-catalog", "compute", "jobs", "alerts"],
    color: "#DC2626",
    icon: "shield",
  },
];
