export type Difficulty = "beginner" | "standard" | "pro";
export type DayNumber = 1 | 2 | 3 | 4 | 5;

export interface TestQuestion {
  id: string;
  day: DayNumber;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const DAY_LABELS: Record<DayNumber, string> = {
  1: "Day 1 — Platform & Workspace",
  2: "Day 2 — Data & Medallion",
  3: "Day 3 — Develop & Query",
  4: "Day 4 — Automate & Monitor",
  5: "Day 5 — Analyse & Present",
};

export const DAY_SHORT: Record<DayNumber, string> = {
  1: "Platform",
  2: "Data",
  3: "Develop",
  4: "Automate",
  5: "Analyse",
};

export const testQuestions: TestQuestion[] = [
  // ── DAY 1 · BEGINNER ────────────────────────────────────────────
  {
    id: "d1-b1",
    day: 1,
    difficulty: "beginner",
    question: "What is the primary purpose of the Databricks Workspace?",
    options: [
      "Storing and querying data tables",
      "Writing and organising notebooks, code, and files",
      "Managing user access and permissions",
      "Running scheduled pipeline jobs",
    ],
    correctIndex: 1,
    explanation:
      "The Workspace is your development environment — like Google Drive for notebooks and code. Data tables live in the Catalog, not the Workspace.",
  },
  {
    id: "d1-b2",
    day: 1,
    difficulty: "beginner",
    question:
      "Where in Databricks do you find the table enterprise.silver.commissions_clean?",
    options: [
      "SQL Editor → Recent Queries",
      "Workspace → Notebooks",
      "Catalog → Schema → Table",
      "Compute → Cluster details",
    ],
    correctIndex: 2,
    explanation:
      "Unity Catalog uses a three-level hierarchy: Catalog → Schema → Table. 'enterprise' is the catalog, 'silver' is the schema, 'commissions_clean' is the table.",
  },
  {
    id: "d1-b3",
    day: 1,
    difficulty: "beginner",
    question: "What does a Databricks cluster provide?",
    options: [
      "Permanent storage for your notebooks and files",
      "The CPU and memory needed to run your code",
      "Version control for your data tables",
      "User authentication and single sign-on",
    ],
    correctIndex: 1,
    explanation:
      "A cluster is compute — the engine that executes code. Without a running cluster attached to your notebook, no code can execute.",
  },

  // ── DAY 1 · STANDARD ────────────────────────────────────────────
  {
    id: "d1-s1",
    day: 1,
    difficulty: "standard",
    question:
      "A Howden analyst wants to query commission data using SQL without writing Python. Which tool should they use?",
    options: [
      "A notebook with %python cells",
      "The SQL Editor connected to a SQL Warehouse",
      "The Compute panel cluster configuration",
      "Unity Catalog table preview",
    ],
    correctIndex: 1,
    explanation:
      "The SQL Editor with a SQL Warehouse is designed for interactive SQL — autocomplete, result download, inline visualisation. No Python required.",
  },
  {
    id: "d1-s2",
    day: 1,
    difficulty: "standard",
    question:
      "In enterprise.silver.commissions_clean, what does 'enterprise' refer to in the Unity Catalog hierarchy?",
    options: [
      "The schema (middle tier)",
      "The catalog (top tier)",
      "The cluster this table runs on",
      "The deployment environment (production vs dev)",
    ],
    correctIndex: 1,
    explanation:
      "Unity Catalog uses Catalog.Schema.Table. 'enterprise' is the catalog — the outermost governance container that holds all schemas and tables.",
  },
  {
    id: "d1-s3",
    day: 1,
    difficulty: "standard",
    question:
      "What is the key difference between an All-Purpose Cluster and a Job Cluster?",
    options: [
      "All-Purpose clusters support Python only; Job clusters support SQL",
      "All-Purpose clusters stay running for interactive work; Job clusters start for a task and terminate when done",
      "Job clusters use GPUs and run significantly faster",
      "There is no meaningful difference — both types work the same way",
    ],
    correctIndex: 1,
    explanation:
      "Job Clusters are ephemeral — they start, execute the task, and shut down automatically. This prevents state leaking between runs and eliminates idle compute cost.",
  },

  // ── DAY 1 · PRO ─────────────────────────────────────────────────
  {
    id: "d1-p1",
    day: 1,
    difficulty: "pro",
    question:
      "The Howden FINMA pipeline uses a Service Principal rather than a named user account for its automated job. What is the primary reason?",
    options: [
      "Service Principals have elevated Databricks admin permissions by default",
      "Service Principals do not expire when an employee leaves and their tokens can be rotated independently",
      "Named user accounts cannot be used to run scheduled Databricks Jobs",
      "Service Principals execute jobs faster due to reduced authentication overhead",
    ],
    correctIndex: 1,
    explanation:
      "Named accounts are tied to individuals — if they leave, the job breaks. Service Principals are managed identities decoupled from any specific employee, making them correct for production automation.",
  },
  {
    id: "d1-p2",
    day: 1,
    difficulty: "pro",
    question:
      "A cluster has auto-termination set to 30 minutes. A scheduled job runs for 2 hours continuously. What happens?",
    options: [
      "The cluster terminates after 30 minutes and the job fails with a timeout error",
      "Auto-termination tracks inactivity, not elapsed time — the cluster only terminates 30 minutes after the last activity ends",
      "The job completes but all in-memory results are lost on termination",
      "The cluster auto-scales to additional nodes to meet the 2-hour demand",
    ],
    correctIndex: 1,
    explanation:
      "Auto-termination measures inactivity, not run time. An actively executing job resets the idle timer continuously. The cluster only terminates 30 minutes after the job finishes.",
  },

  // ── DAY 2 · BEGINNER ────────────────────────────────────────────
  {
    id: "d2-b1",
    day: 2,
    difficulty: "beginner",
    question:
      "Which Medallion layer stores raw data exactly as it arrives from source systems — no transformations?",
    options: ["Gold", "Silver", "Bronze", "Staging"],
    correctIndex: 2,
    explanation:
      "Bronze is the raw landing zone. Data is stored exactly as delivered — untouched. This means you can always recover the original extract if something goes wrong downstream.",
  },
  {
    id: "d2-b2",
    day: 2,
    difficulty: "beginner",
    question:
      "Howden's executive team needs a dashboard showing total commission by entity for FINMA submission. Which layer should the dashboard query?",
    options: [
      "Bronze — it has all the original deal-level data",
      "Silver — the data is already cleaned and validated",
      "Gold — it has aggregated, FINMA-ready entity totals",
      "The CRM systems directly via live connection",
    ],
    correctIndex: 2,
    explanation:
      "Gold is aggregated and business-ready. In the FINMA pipeline, each entity has its own Gold table containing its FINMA-reportable totals. Each Gold table is only written once the pipeline for that entity completes successfully.",
  },
  {
    id: "d2-b3",
    day: 2,
    difficulty: "beginner",
    question:
      "The BAYO CRM requires special handling in the Howden FINMA pipeline because:",
    options: [
      "It uses a binary file format different from the other four CRMs",
      "Its export contains rows for both Howden Schweiz AG and SWIBRO AG mixed together",
      "It is the only CRM that connects directly and automatically to Databricks",
      "It is the only system that already uses 'commission_chf' as its field name",
    ],
    correctIndex: 1,
    explanation:
      "BAYO is a shared CRM serving two Howden entities. Its raw extract cannot go straight to Silver — first, every row must be attributed to either Howden Schweiz AG or SWIBRO AG based on deal-level identifiers.",
  },

  // ── DAY 2 · STANDARD ────────────────────────────────────────────
  {
    id: "d2-s1",
    day: 2,
    difficulty: "standard",
    question:
      "You run DROP TABLE enterprise.gold.finma_commission_summary on a managed Unity Catalog table. What happens to the underlying data files?",
    options: [
      "Files are moved to the Silver schema automatically",
      "Files are retained in an audit schema for 30 days",
      "The Delta and Parquet files are permanently deleted along with the table",
      "The table is soft-deleted and recoverable for 7 days via Unity Catalog",
    ],
    correctIndex: 2,
    explanation:
      "Managed tables own their storage. Dropping the table deletes both the metadata and the underlying files. Use external tables if data lifecycle must be managed independently of the table definition.",
  },
  {
    id: "d2-s2",
    day: 2,
    difficulty: "standard",
    question:
      "You need to add an 'underwriter' column to enterprise.silver.commissions_clean without breaking downstream jobs. What is the correct approach?",
    options: [
      "DROP the table and recreate it with the new column definition",
      "ALTER TABLE enterprise.silver.commissions_clean ADD COLUMN underwriter STRING",
      "Create a new parallel table and join it at query time",
      "VACUUM the table first, then add the column via OPTIMIZE",
    ],
    correctIndex: 1,
    explanation:
      "Delta tables support schema evolution via ALTER TABLE. Existing rows get NULL for the new column; downstream jobs that don't reference it are completely unaffected.",
  },
  {
    id: "d2-s3",
    day: 2,
    difficulty: "standard",
    question:
      "How is the Gold layer structured in the Howden FINMA pipeline?",
    options: [
      "One shared Gold table with 123,536 rows, one per commission deal",
      "One Gold table per entity, each containing that entity's FINMA-reportable totals",
      "A single Gold table with one grand total across all 5 entities",
      "Gold tables are created in Bronze and promoted to Gold after validation",
    ],
    correctIndex: 1,
    explanation:
      "Each entity runs its own pipeline that writes its own Gold table. The Gold table is only created after all DQX checks pass. This keeps entity data separate and ensures each FINMA submission is independently validated.",
  },

  // ── DAY 2 · PRO ─────────────────────────────────────────────────
  {
    id: "d2-p1",
    day: 2,
    difficulty: "pro",
    question:
      "Delta Lake stores a transaction log (_delta_log/) alongside data files. Which capability does this enable that standard Parquet does not?",
    options: [
      "Column-level encryption of sensitive fields",
      "Automatic cluster auto-scaling during writes",
      "Time Travel — querying the table as it was at any previous version or timestamp",
      "Native streaming data ingestion without a connector",
    ],
    correctIndex: 2,
    explanation:
      "The transaction log records every write operation with a unique version number. SELECT * FROM table VERSION AS OF N replays the log to reconstruct historical table states — impossible with plain Parquet.",
  },
  {
    id: "d2-p2",
    day: 2,
    difficulty: "pro",
    question:
      "A team member runs VACUUM enterprise.bronze.bayo_raw RETAIN 0 HOURS after disabling the safety check. What is the risk?",
    options: [
      "The table schema definition is deleted along with its data",
      "Files no longer in the current version are deleted — any in-flight reader or stream referencing those files will immediately fail",
      "The table is automatically migrated to the Silver schema",
      "Only uncommitted data files are removed; committed data is always safe",
    ],
    correctIndex: 1,
    explanation:
      "VACUUM removes files not referenced by the current table version. With RETAIN 0 HOURS there is no buffer — any job still reading older file versions will encounter missing files and fail. The default 7-day retention exists for exactly this reason.",
  },

  // ── DAY 3 · BEGINNER ────────────────────────────────────────────
  {
    id: "d3-b1",
    day: 3,
    difficulty: "beginner",
    question: "What can you combine in a single Databricks notebook?",
    options: [
      "Python and SQL only",
      "SQL, Python, Scala, R, and formatted markdown",
      "Python code only — one language per notebook",
      "Dashboard widgets and pipeline configuration",
    ],
    correctIndex: 1,
    explanation:
      "Notebooks are polyglot — each cell can use a different language. Switch language per cell using magic commands like %sql, %python, %scala, or %r.",
  },
  {
    id: "d3-b2",
    day: 3,
    difficulty: "beginner",
    question: "What magic command switches a single notebook cell to run SQL?",
    options: ["#SQL", "@sql", "%sql", "USE SQL;"],
    correctIndex: 2,
    explanation:
      "%sql is a Databricks magic command placed at the top of a cell. It overrides the default notebook language for that cell only — all other cells remain unchanged.",
  },
  {
    id: "d3-b3",
    day: 3,
    difficulty: "beginner",
    question:
      "In the FINMA validation notebook, the SQL cell queries enterprise.silver.commissions_clean. What does it produce?",
    options: [
      "The raw BAYO extract before any entity attribution",
      "Commission totals per entity with an Abacus variance calculation",
      "A list of DQX rules that have failed in the current pipeline run",
      "The 5 Gold rows already formatted for FINMA submission",
    ],
    correctIndex: 1,
    explanation:
      "The SQL cell groups by entity_code, sums commission_chf, and computes variance against the Abacus baseline — giving the team a per-entity view before Gold is built.",
  },

  // ── DAY 3 · STANDARD ────────────────────────────────────────────
  {
    id: "d3-s1",
    day: 3,
    difficulty: "standard",
    question:
      "Howden's data team needs to aggregate 120,000 Silver rows using PySpark on a nightly schedule. Which compute should they use?",
    options: [
      "SQL Warehouse — it is optimised for high-volume aggregations",
      "A Databricks Job using a Job Cluster attached to a Python notebook",
      "Genie Space — it handles complex aggregations automatically",
      "No compute is needed — Databricks auto-runs notebooks on a schedule",
    ],
    correctIndex: 1,
    explanation:
      "PySpark workloads run on Spark clusters, not SQL Warehouses. For scheduled automation use a Databricks Job with a Job Cluster — it starts fresh, executes, and terminates, keeping costs low.",
  },
  {
    id: "d3-s2",
    day: 3,
    difficulty: "standard",
    question:
      "The FINMA notebook Python cell flags entities where Abacus variance exceeds CHF 10,000. Which PySpark expression creates this boolean flag?",
    options: [
      'df.filter("abacus_variance_chf > 10000").count()',
      '.withColumn("variance_ok", F.col("abacus_variance_chf") < 10000)',
      'df.where(F.sum("commission_chf") != "abacus_baseline")',
      'df.validate(F.threshold("abacus_variance_chf", 10000))',
    ],
    correctIndex: 1,
    explanation:
      ".withColumn() adds a new column to the DataFrame. The expression F.col('abacus_variance_chf') < 10000 evaluates to True or False for each entity row — creating the variance_ok flag.",
  },
  {
    id: "d3-s3",
    day: 3,
    difficulty: "standard",
    question:
      "A SQL query on enterprise.silver.commissions_clean (123,000 rows) is slow. You only need entity HW-CH-03. What is the most efficient approach with Delta?",
    options: [
      "Load the full table as a Pandas DataFrame and filter in Python",
      "SELECT ... WHERE entity_code = 'HW-CH-03' — Delta data skipping avoids reading unneeded files",
      "VACUUM the table first to remove old file versions",
      "Read from Bronze instead — it stores data in smaller per-entity files",
    ],
    correctIndex: 1,
    explanation:
      "Delta tables store min/max statistics per file per column. A WHERE clause lets Delta skip entire data files that cannot contain HW-CH-03 — reading only the relevant subset.",
  },

  // ── DAY 3 · PRO ─────────────────────────────────────────────────
  {
    id: "d3-p1",
    day: 3,
    difficulty: "pro",
    question:
      "Spark uses lazy evaluation. What does this mean when building a transformation pipeline?",
    options: [
      "Results are cached automatically in memory after the first transformation",
      "Transformations like .filter() and .groupBy() are planned but only executed when an action like .count() or display() is called",
      "Spark waits 30 seconds before starting to batch multiple queries together",
      "Results are approximate until you explicitly call .validate() on the DataFrame",
    ],
    correctIndex: 1,
    explanation:
      "Spark builds a logical query plan from transformations, then optimises and executes the full plan only when triggered by an action. This allows Catalyst to reorder and prune operations before running anything.",
  },
  {
    id: "d3-p2",
    day: 3,
    difficulty: "pro",
    question:
      "A data engineer writes df.groupBy('entity_code').agg(F.sum('commission_chf')). No further code follows. What actually executes?",
    options: [
      "Both groupBy and agg execute immediately and cache the result",
      "Nothing executes — without an action, Spark builds the query plan but runs nothing",
      "Only the agg executes; groupBy is deferred to the next cell",
      "Spark raises a syntax error because there is no output target specified",
    ],
    correctIndex: 1,
    explanation:
      "groupBy() and agg() are transformations, not actions. Without a subsequent .show(), .count(), display(), or .write(), the computation never runs — Spark only holds the plan in memory.",
  },

  // ── DAY 4 · BEGINNER ────────────────────────────────────────────
  {
    id: "d4-b1",
    day: 4,
    difficulty: "beginner",
    question: "What is a Databricks Job?",
    options: [
      "A saved SQL query in the SQL Editor",
      "An automated scheduled workflow that runs notebooks, scripts, or pipelines",
      "A compute cluster configuration profile",
      "A Unity Catalog table with an automatic refresh schedule",
    ],
    correctIndex: 1,
    explanation:
      "A Job is Databricks' orchestration layer — define tasks, set dependencies, schedule runs on a cron, and monitor outcomes. It is the primary tool for production automation.",
  },
  {
    id: "d4-b2",
    day: 4,
    difficulty: "beginner",
    question:
      "In the FINMA pipeline, what causes the Data Quality Gate (Task 3) to fail?",
    options: [
      "The Gold tables are already fully up to date from a previous run",
      "218 BAYO rows that cannot be attributed to either Howden Schweiz AG or SWIBRO AG",
      "The Abacus accounting system is temporarily unreachable",
      "Too many duplicate records detected in the MAX CRM extract",
    ],
    correctIndex: 1,
    explanation:
      "The Entity Attribution DQX rule requires 100% attribution. Even 218 unresolved BAYO rows (0.45%) fails the gate — preventing unattributed data from reaching the FINMA Gold tables.",
  },
  {
    id: "d4-b3",
    day: 4,
    difficulty: "beginner",
    question:
      "When the Data Quality Gate fails, what happens to the downstream tasks (FINMA Report Build and Abacus Reconciliation)?",
    options: [
      "They run with a warning flag attached to their output",
      "They are permanently skipped and must be manually re-enabled",
      "They remain in 'waiting' state — dependent tasks do not run when an upstream task has failed",
      "They retry automatically three times before reporting failure",
    ],
    correctIndex: 2,
    explanation:
      "Databricks Jobs enforce task dependencies strictly. A failed upstream task blocks all tasks that depend on it — the pipeline stops at the failure point, preserving data integrity.",
  },

  // ── DAY 4 · STANDARD ────────────────────────────────────────────
  {
    id: "d4-s1",
    day: 4,
    difficulty: "standard",
    question:
      "SWIBRO AG has a commission variance vs Abacus of CHF 8,500 — representing 6.2% of its category total. Does it pass the FINMA Abacus Variance Gate?",
    options: [
      "Yes — CHF 8,500 is below the CHF 10,000 absolute threshold",
      "No — 6.2% exceeds the 5% percentage threshold, even though the CHF amount is below the limit",
      "Yes — only one of the two thresholds needs to be met",
      "It depends on which reporting period is being checked",
    ],
    correctIndex: 1,
    explanation:
      "The Abacus Variance Gate requires BOTH thresholds to be met: ≤ CHF 10,000 AND ≤ 5%. SWIBRO's 6.2% fails the percentage check — so the entity fails even though CHF 8,500 is below the absolute limit.",
  },
  {
    id: "d4-s2",
    day: 4,
    difficulty: "standard",
    question:
      "You want Howden's data team to receive an immediate email when the FINMA pipeline DQ gate fails. Which Databricks feature handles this?",
    options: [
      "Unity Catalog lineage change notifications",
      "A Databricks Alert on a SQL query that counts dq_rejected_records rows",
      "A Genie Space subscription digest sent on a daily schedule",
      "The Job's built-in auto-retry mechanism with email on final failure",
    ],
    correctIndex: 1,
    explanation:
      "Databricks Alerts run a saved SQL query on a schedule and fire a notification when a condition is met (e.g. COUNT(*) > 0 on dq_rejected_records). They support Email, Slack, PagerDuty, and webhook destinations.",
  },
  {
    id: "d4-s3",
    day: 4,
    difficulty: "standard",
    question:
      "Why does the FINMA pipeline use a Job Cluster rather than an All-Purpose Cluster for production runs?",
    options: [
      "Job Clusters support a wider range of programming languages",
      "Job Clusters start fresh for each run (no state contamination) and terminate automatically to save cost",
      "Job Clusters run 10× faster due to dedicated hardware allocation",
      "All-Purpose Clusters cannot be attached to scheduled Databricks Jobs",
    ],
    correctIndex: 1,
    explanation:
      "Job Clusters are ephemeral — no stale variables, no cached data from previous runs. They terminate automatically after the job completes, so you pay only for actual execution time.",
  },

  // ── DAY 4 · PRO ─────────────────────────────────────────────────
  {
    id: "d4-p1",
    day: 4,
    difficulty: "pro",
    question:
      "The FINMA pipeline must build Gold tables only if all DQX checks pass. How do you enforce this ordering in a Databricks Job?",
    options: [
      "Set all tasks to run in parallel with a shared result aggregator task",
      "Configure 'FINMA Report Build' to depend on 'Data Quality Gate' — it only executes if the DQ Gate task completes successfully",
      "Use a shared All-Purpose Cluster for all tasks so they share execution state",
      "Add a programmatic WAIT statement inside the Gold Build notebook",
    ],
    correctIndex: 1,
    explanation:
      "Databricks Jobs define explicit task dependencies. The 'FINMA Report Build' task lists 'Data Quality Gate' as an upstream — it is skipped entirely if the DQ Gate fails, preventing invalid data from reaching Gold.",
  },
  {
    id: "d4-p2",
    day: 4,
    difficulty: "pro",
    question:
      "The Entity Attribution DQX rule checks every individual row. The Abacus Variance Gate checks a single aggregated total for the entity. What category of DQX rule is the Abacus Variance Gate?",
    options: [
      "null — checks that commission_chf is not null or zero",
      "duplicate — identifies repeated deal_id values within an entity",
      "threshold — validates a computed numeric value against defined limits",
      "schema — verifies that field types match the expected data types",
    ],
    correctIndex: 2,
    explanation:
      "The variance gate compares a computed aggregate (total commission_chf per entity) against fixed numeric limits (CHF 10,000 and 5%). This is a threshold rule — not a row-level null, duplicate, or schema check.",
  },

  // ── DAY 5 · BEGINNER ────────────────────────────────────────────
  {
    id: "d5-b1",
    day: 5,
    difficulty: "beginner",
    question: "What is Databricks Genie?",
    options: [
      "A machine learning model training and serving framework",
      "A natural language interface that converts plain English questions into SQL and returns results",
      "A dashboard scheduling and automated distribution tool",
      "An AI-powered pipeline builder that generates code automatically",
    ],
    correctIndex: 1,
    explanation:
      "Genie lets non-technical users ask questions in plain English. It generates and runs the SQL, then returns a table or chart — no SQL knowledge required.",
  },
  {
    id: "d5-b2",
    day: 5,
    difficulty: "beginner",
    question:
      "On Howden's FINMA dashboard, the KPI reads 'Abacus Variance CHF 4,200 / 0.03%'. What does this tell you?",
    options: [
      "The pipeline has failed and requires immediate manual intervention",
      "The largest gap between Gold commission totals and Abacus cashflows is CHF 4,200 — well within the 5% threshold",
      "4,200 commission records were rejected by DQX rules in the last run",
      "The FINMA submission process is 0.03% complete",
    ],
    correctIndex: 1,
    explanation:
      "This KPI shows the maximum Abacus variance across all 5 entities. CHF 4,200 at 0.03% is far below the CHF 10,000 / 5% gate — all entities reconcile cleanly.",
  },
  {
    id: "d5-b3",
    day: 5,
    difficulty: "beginner",
    question: "What does data lineage tracking in Databricks allow you to do?",
    options: [
      "Automatically fix data quality errors found in Gold tables",
      "Trace any dashboard KPI all the way back to the original source file or CRM export",
      "Schedule FINMA reports for automatic delivery to regulators",
      "Merge two Gold tables together without writing SQL",
    ],
    correctIndex: 1,
    explanation:
      "Lineage shows the full journey of data — Dashboard → Saved Query → Gold → Silver → Bronze → Source CRM. This is essential for audit questions: 'Where does this number come from?'",
  },

  // ── DAY 5 · STANDARD ────────────────────────────────────────────
  {
    id: "d5-s1",
    day: 5,
    difficulty: "standard",
    question:
      "A business user asks: 'Where does the CHF 12.4M total on the FINMA dashboard come from?' You trace the lineage. What is the correct chain?",
    options: [
      "Gold → Bronze → CRM extracts → FINMA submission",
      "Dashboard widget → Saved Query → Gold table → Silver table → Bronze tables → CRM extracts",
      "Dashboard widget → Genie Space → SQL Warehouse → Gold",
      "CRM source → Gold → Silver → Dashboard",
    ],
    correctIndex: 1,
    explanation:
      "Lineage traces from the visible output downward: dashboard widget → saved query → Gold table (built from Silver, built from Bronze, ingested from the 5 CRM extracts).",
  },
  {
    id: "d5-s2",
    day: 5,
    difficulty: "standard",
    question:
      "Genie returns a commission total for SWIBRO AG that is CHF 50,000 higher than the FINMA dashboard shows. What is the most likely cause?",
    options: [
      "Genie queries Bronze data by default; the dashboard queries Gold",
      "Genie's Space is configured to query a different Gold table version or a separate aggregation table",
      "Genie rounds results to the nearest CHF 50,000 for readability",
      "The SQL Warehouse size affects numeric precision on large aggregations",
    ],
    correctIndex: 1,
    explanation:
      "Genie Spaces are configured to reference specific tables. If the Space points to a different table, schema, or version than the dashboard query, totals will diverge — even on the same underlying data.",
  },
  {
    id: "d5-s3",
    day: 5,
    difficulty: "standard",
    question:
      "The FINMA dashboard auto-refreshes every 30 minutes. Which Databricks component actually executes the SQL on each refresh?",
    options: [
      "The Databricks Job that built the Gold table on the nightly schedule",
      "The SQL Warehouse connected to the dashboard",
      "The Spark All-Purpose Cluster running the nightly pipeline notebooks",
      "The Unity Catalog metadata service",
    ],
    correctIndex: 1,
    explanation:
      "Dashboards run their queries through a SQL Warehouse — the dedicated SQL compute layer. The nightly pipeline Job and dashboard refreshes are independent; they do not share compute.",
  },

  // ── DAY 5 · PRO ─────────────────────────────────────────────────
  {
    id: "d5-p1",
    day: 5,
    difficulty: "pro",
    question:
      "A FINMA regulator asks: 'Can you prove that SWIBRO AG's commission_chf total in the Gold table originated from the BAYO extract?' Which capability provides this proof?",
    options: [
      "The DQX audit log — shows rule pass/fail counts but not column-level data origin",
      "Unity Catalog column-level lineage — traces commission_chf in finma_commission_summary through Silver transformations back to bayo_raw",
      "The Job pipeline run log — shows task outcomes and durations but not column provenance",
      "Genie can reconstruct lineage from conversational context and query history",
    ],
    correctIndex: 1,
    explanation:
      "Unity Catalog tracks column-level lineage automatically as data moves through transformations. You can trace any column in any table — including commission_chf in the Gold summary — all the way back to its source table and original file.",
  },
  {
    id: "d5-p2",
    day: 5,
    difficulty: "pro",
    question:
      "Howden wants to enforce that SWIBRO AG's team can only query rows where entity_code = 'HW-CH-03' across all Gold tables — regardless of which SQL tool they use. Which Unity Catalog feature implements this?",
    options: [
      "A Python post-processing script that filters query results before returning them",
      "A Row Filter function registered on each Gold table in Unity Catalog — applied transparently to every query by every user",
      "A separate Gold table created exclusively for each entity's team",
      "Cluster-level firewall rules that block cross-entity SQL patterns",
    ],
    correctIndex: 1,
    explanation:
      "Unity Catalog Row Filters are SQL functions attached to table definitions. They apply automatically to every query — whether from a notebook, SQL Editor, dashboard, or Genie — without requiring any change to the query itself.",
  },
];
