export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "platform" | "data" | "pipeline" | "finma" | "analytics";
}

export const faqItems: FaqItem[] = [
  // ── Platform ─────────────────────────────────────────────────────
  {
    id: "faq-1",
    category: "platform",
    question: "What is the difference between the Workspace and the Catalog?",
    answer:
      "The Workspace is where you write code — notebooks, folders, scripts. The Catalog (Unity Catalog) is where data lives — tables, schemas, views. Think of Workspace as your office desk and Catalog as the filing room. You write code at your desk that reads files from the filing room.",
  },
  {
    id: "faq-2",
    category: "platform",
    question: "When should I use a SQL Warehouse vs an All-Purpose Cluster?",
    answer:
      "Use a SQL Warehouse for anything SQL-only: the SQL Editor, dashboards, Genie, ad-hoc queries. Use an All-Purpose Cluster when you need Python or PySpark in a notebook. A SQL Warehouse is cheaper and faster to start for SQL — but it cannot run Python notebooks.",
  },
  {
    id: "faq-3",
    category: "platform",
    question: "My cluster auto-terminated. How do I start it again?",
    answer:
      "Go to Compute in the left sidebar, find your cluster, and click Start. It typically takes 2–5 minutes. To avoid interruptions during long runs, set auto-termination to a longer period (e.g. 120 minutes) or use a Job Cluster which starts automatically for scheduled runs.",
  },
  {
    id: "faq-4",
    category: "platform",
    question: "What is a Service Principal and why should automated jobs use one?",
    answer:
      "A Service Principal is a non-human identity (like a system account) used for machine-to-machine authentication. Automated pipelines should use one instead of a named user account because Service Principals don't expire when someone leaves the company, and their credentials can be rotated independently. The FINMA pipeline uses sp-finma-pipeline for exactly this reason.",
  },
  {
    id: "faq-5",
    category: "platform",
    question: "How do I find the table I need in Unity Catalog?",
    answer:
      "Click the Catalog icon in the left sidebar. Expand the 'enterprise' catalog, then the schema (bronze / silver / gold / audit), then find your table. You can also search by name at the top of the Catalog browser. All Howden production tables live under enterprise → their respective schema.",
  },

  // ── Data / Medallion ─────────────────────────────────────────────
  {
    id: "faq-6",
    category: "data",
    question: "Why do we have three layers (Bronze/Silver/Gold) instead of just one?",
    answer:
      "Each layer serves a different purpose. Bronze preserves the original source data forever — you can always recover from it. Silver applies cleaning and validation without destroying the original. Gold is shaped for specific business reporting needs. Separating these means a bad transformation never corrupts your raw data.",
  },
  {
    id: "faq-7",
    category: "data",
    question: "If I drop a managed Gold table, does the data disappear?",
    answer:
      "Yes. Managed tables own their storage — DROP TABLE deletes both the table definition and the underlying Delta files. If you need to preserve data independently of the table lifecycle, use an external table instead. For Gold production tables, always confirm with the data engineering team before dropping.",
  },
  {
    id: "faq-8",
    category: "data",
    question: "What is Delta Lake and how is it different from a regular CSV or Parquet file?",
    answer:
      "Delta Lake adds three key capabilities on top of Parquet: (1) ACID transactions — writes are atomic, so partial failures don't corrupt the table; (2) Time Travel — query any historical version via VERSION AS OF; (3) schema enforcement — Delta rejects writes that don't match the table schema. All Databricks tables use Delta by default.",
  },
  {
    id: "faq-9",
    category: "data",
    question: "Why does the BAYO CRM export require special handling compared to the other four CRMs?",
    answer:
      "BAYO is a shared system used by both Howden Schweiz AG (HW-CH-01) and SWIBRO AG (HW-CH-03). Its export contains rows for both entities mixed together. Every BAYO row must be attributed to exactly one entity before it can enter Silver — otherwise the FINMA commission totals would be wrong. The other four CRMs each serve a single entity, so attribution is straightforward.",
  },
  {
    id: "faq-10",
    category: "data",
    question: "Can I query a table as it existed last week?",
    answer:
      "Yes — Delta Lake Time Travel lets you query historical versions. Use: SELECT * FROM enterprise.bronze.bayo_raw TIMESTAMP AS OF '2025-03-15' or VERSION AS OF 5 to see the table at a specific point. This is especially useful for audits and debugging pipeline issues.",
  },

  // ── Pipeline / Jobs ──────────────────────────────────────────────
  {
    id: "faq-11",
    category: "pipeline",
    question: "What happens downstream if the DQ Gate fails?",
    answer:
      "All tasks that depend on the Data Quality Gate — specifically FINMA Report Build (Task 4) and Abacus Reconciliation (Task 5) — remain in 'waiting' state and do not run. Databricks Jobs enforce task dependencies strictly. The pipeline stops at the failure point, protecting the Gold tables from receiving invalid data.",
  },
  {
    id: "faq-12",
    category: "pipeline",
    question: "How do I re-run just one failed task without restarting the whole pipeline?",
    answer:
      "In the Job Run view, click the failed task. Use 'Repair Run' to re-run only the failed task (and any downstream tasks that depend on it) without repeating the tasks that already succeeded. This saves time and avoids re-ingesting Bronze data unnecessarily.",
  },
  {
    id: "faq-13",
    category: "pipeline",
    question: "What is the difference between a Job Cluster and an All-Purpose Cluster for production pipelines?",
    answer:
      "Job Clusters are created specifically for a pipeline run and terminated when it finishes — no idle cost and no stale state from previous runs. All-Purpose Clusters stay running and can be reused, but they accumulate state between runs (cached data, loaded variables) which can cause subtle bugs. Use Job Clusters for production pipelines.",
  },
  {
    id: "faq-14",
    category: "pipeline",
    question: "How do I get notified when the FINMA pipeline fails?",
    answer:
      "Set up a Databricks Alert: go to SQL Editor → write SELECT COUNT(*) FROM enterprise.silver.dq_rejected_records WHERE run_date = current_date() → save as a query → create an Alert on it with condition 'value > 0' and destination Email or Slack. Alerts fire within minutes of the condition being met.",
  },
  {
    id: "faq-15",
    category: "pipeline",
    question: "What does VACUUM do and is it safe to run on production tables?",
    answer:
      "VACUUM removes old Delta file versions that are no longer needed by the current table. It is safe with the default RETAIN 168 HOURS (7 days) setting, which preserves 7 days of Time Travel history. Never run VACUUM RETAIN 0 HOURS on production tables — it removes all history immediately and will break any in-flight readers.",
  },

  // ── FINMA ────────────────────────────────────────────────────────
  {
    id: "faq-16",
    category: "finma",
    question: "What does the Abacus Variance Gate actually check?",
    answer:
      "It compares each entity's total commission_chf in the Gold table against the corresponding cashflow figure in Abacus (Howden's central accounting system). The rule fails if the gap exceeds CHF 10,000 OR 5% of the entity's category total — whichever is a tighter threshold. Both conditions must be met to pass. Entity HW-CH-05 (Vorsorge Partner AG, CHF 543k total) effectively has a 5% limit of CHF 27k, which is tighter than the absolute CHF 10k for most entities.",
  },
  {
    id: "faq-17",
    category: "finma",
    question: "What are the five Howden entities and their entity codes?",
    answer:
      "HW-CH-01 — Howden Schweiz AG (primary broker entity, also uses BAYO and IBS Alabus CRM) · HW-CH-02 — Howden Broker Services AG (uses MAX CRM) · HW-CH-03 — SWIBRO AG (shares BAYO with HW-CH-01) · HW-CH-04 — Perennial AG (uses KETL CRM) · HW-CH-05 — Vorsorge Partner AG (uses Vorsorge Partner CRM). Each entity requires a separate FINMA submission.",
  },
  {
    id: "faq-18",
    category: "finma",
    question: "What is the FINMA submission deadline and what happens if we miss it?",
    answer:
      "Article 190b of the Insurance Supervision Ordinance (ISO) sets a 31 May deadline for annual intermediary commission reporting. The Databricks pipeline is designed to have all 5 Gold reports validated and reconciled against Abacus well before that date, so the compliance team has time to review before submitting to FINMA.",
  },

  // ── Analytics ─────────────────────────────────────────────────────
  {
    id: "faq-19",
    category: "analytics",
    question: "Genie returned an answer but I'm not sure it's correct. How do I verify it?",
    answer:
      "In Genie, click 'Show SQL' on any result — this displays the exact query Genie generated. Copy it into the SQL Editor and run it yourself. Check: (1) which tables it queried, (2) any WHERE or date filters it applied, (3) whether aggregations match what you expected. If the SQL looks right but the number differs from the dashboard, check whether the dashboard uses a different table or refresh time.",
  },
  {
    id: "faq-20",
    category: "analytics",
    question: "How do I prove to a FINMA auditor where a Gold table number comes from?",
    answer:
      "Use Unity Catalog column-level lineage. Go to Catalog → enterprise.gold.finma_commission_summary → Lineage tab. This shows the full data journey: which upstream tables contributed to each column, through which transformations, all the way back to the original Bronze tables and CRM extracts. For commission_chf on SWIBRO AG's row, you can trace it through Silver (commissions_clean) → Bronze (bayo_raw) → the original BAYO CSV export.",
  },
];
