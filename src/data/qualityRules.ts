import { QualityRule } from "@/lib/types";

export const qualityRules: QualityRule[] = [
  {
    id: "null-check",
    name: "Null Check",
    type: "null",
    description: "Ensure mandatory fields (commission_amount, customer_id, period_date) are not null.",
    passCount: 451203,
    failCount: 23,
    severity: "critical",
  },
  {
    id: "duplicate-check",
    name: "Duplicate Detection",
    type: "duplicate",
    description: "Identify and flag duplicate commission records by (customer_id, policy_id, period_date).",
    passCount: 451218,
    failCount: 8,
    severity: "critical",
  },
  {
    id: "schema-validation",
    name: "Schema Validation",
    type: "schema",
    description: "Validate that column types match expected schema: amounts are numeric, dates are valid.",
    passCount: 451224,
    failCount: 2,
    severity: "warning",
  },
  {
    id: "threshold-check",
    name: "Threshold Check",
    type: "threshold",
    description: "Commission amounts must be between 0 and 500,000 CHF. Flag outliers for review.",
    passCount: 451221,
    failCount: 5,
    severity: "warning",
  },
  {
    id: "country-validation",
    name: "Country Code Rule",
    type: "business",
    description: "Country codes must map to valid ISO 3166-1 alpha-2 codes in the reference table.",
    passCount: 451226,
    failCount: 0,
    severity: "warning",
  },
];

export const qualityMetrics = {
  totalRecords: 451234,
  passedRecords: 451196,
  failedRecords: 38,
  passRate: 99.99,
  freshnessSLA: 99.2,
  lastRunAt: "2024-01-22 02:09:44",
};

export const qualityTrendData = [
  { date: "Jan 16", passed: 99.8, failed: 0.2 },
  { date: "Jan 17", passed: 99.9, failed: 0.1 },
  { date: "Jan 18", passed: 99.9, failed: 0.1 },
  { date: "Jan 19", passed: 99.7, failed: 0.3 },
  { date: "Jan 20", passed: 95.2, failed: 4.8 },
  { date: "Jan 21", passed: 99.8, failed: 0.2 },
  { date: "Jan 22", passed: 99.99, failed: 0.01 },
];
