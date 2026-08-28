import { QualityRule } from "@/lib/types";

export const qualityRules: QualityRule[] = [
  {
    id: "entity-attribution",
    name: "Entity Attribution",
    type: "business",
    description: "Every row must be attributed to exactly one of the 5 entity codes (HW-CH-01 to HW-CH-05). BAYO rows with no matching deal-level identifier are quarantined.",
    passCount: 123394,
    failCount: 142,
    severity: "critical",
  },
  {
    id: "commission-null",
    name: "Commission Null Check",
    type: "null",
    description: "commission_chf must be non-null and positive. Catches rows where the CRM exported a blank or zero value for the remuneration field.",
    passCount: 123518,
    failCount: 18,
    severity: "critical",
  },
  {
    id: "duplicate-deal",
    name: "Duplicate Deal Detection",
    type: "duplicate",
    description: "Flag duplicate deal_id values within the same entity. Prevents double-counting in the FINMA commission totals.",
    passCount: 123524,
    failCount: 12,
    severity: "critical",
  },
  {
    id: "abacus-variance",
    name: "Abacus Variance Gate",
    type: "threshold",
    description: "Total commission_chf per entity must not deviate from Abacus 2025 cashflows by more than CHF 10,000 or 5% of category total — whichever is larger.",
    passCount: 5,
    failCount: 0,
    severity: "warning",
  },
  {
    id: "field-standardisation",
    name: "Field Standardisation",
    type: "schema",
    description: "Validate that all commission field variants (brokerage_fee, comm_amt, fee_earned, remuneration) have been renamed to commission_chf and cast to DECIMAL(18,2).",
    passCount: 123536,
    failCount: 0,
    severity: "warning",
  },
];

export const qualityMetrics = {
  totalRecords: 123536,
  passedRecords: 123394,
  failedRecords: 142,
  passRate: 99.88,
  freshnessSLA: 99.2,
  lastRunAt: "2025-03-22 02:09:44",
};

export const qualityTrendData = [
  { date: "Mar 16", passed: 99.9, failed: 0.1 },
  { date: "Mar 17", passed: 99.8, failed: 0.2 },
  { date: "Mar 18", passed: 99.9, failed: 0.1 },
  { date: "Mar 19", passed: 99.7, failed: 0.3 },
  { date: "Mar 20", passed: 96.1, failed: 3.9 },
  { date: "Mar 21", passed: 99.8, failed: 0.2 },
  { date: "Mar 22", passed: 99.88, failed: 0.12 },
];
