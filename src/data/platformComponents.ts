export type NavSection = {
  section: string;
  items: NavItem[];
};

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  description: string;
  whenToUse: string;
  whoUses: string;
  color: string;
};

export const workspaceSidebarSections: NavSection[] = [
  {
    section: "main",
    items: [
      {
        id: "workspace",
        label: "Workspace",
        icon: "folder",
        description: "Your personal and shared development space — notebooks, folders, and files. Think of it as Google Drive for your code and notebooks.",
        whenToUse: "When you need to find, create, or organise notebooks and files.",
        whoUses: "Everyone",
        color: "#1E40AF",
      },
      {
        id: "catalog",
        label: "Catalog",
        icon: "database",
        description: "The Unity Catalog — all governed data assets (tables, views, volumes, models) in one place. Three-level hierarchy: Catalog → Schema → Table.",
        whenToUse: "When you need to find a table, check permissions, or explore data schemas.",
        whoUses: "Analysts, Data Engineers, Business Users",
        color: "#0891B2",
      },
      {
        id: "jobs",
        label: "Jobs & Pipelines",
        icon: "workflow",
        description: "Schedule and orchestrate notebooks, scripts, and Delta Live Tables pipelines. Define task dependencies, set retries, and monitor run history. In the Howden FINMA project, each reporting unit has its own job (e.g. VorsorgePartnerCommission_nondlt, VP_kundenliste_nondlt, VP_nondlt), with tasks following Bronze → Silver → Gold order.",
        whenToUse: "When you want to automate a workflow or run something on a schedule.",
        whoUses: "Data Engineers, Ops Teams",
        color: "#D97706",
      },
      {
        id: "compute",
        label: "Compute",
        icon: "cpu",
        description: "Create and manage clusters. All-purpose clusters for interactive notebooks, Job clusters for automated runs, SQL Warehouses for SQL queries. The FINMA project cluster is adb-cluster-howden-switzerland-groupdatapoc-we (Runtime 17.3). ⚠ Jobs currently run as a personal account — recommended practice is to set 'Run as' to a dedicated service principal so pipelines are not blocked if an account is disabled or MFA changes.",
        whenToUse: "When you need to start or configure your compute engine.",
        whoUses: "Data Engineers, Admins",
        color: "#059669",
      },
      {
        id: "marketplace",
        label: "Marketplace",
        icon: "store",
        description: "Browse and access data products, datasets, models, and solution accelerators from Databricks and partners. No procurement needed for free listings.",
        whenToUse: "When you want to find pre-built data or a solution accelerator.",
        whoUses: "Everyone",
        color: "#7C3AED",
      },
    ],
  },
  {
    section: "SQL",
    items: [
      {
        id: "sql",
        label: "SQL Editor",
        icon: "terminal",
        description: "Write and execute SQL queries interactively against a SQL Warehouse. Autocomplete, query history, result download, and inline visualisation.",
        whenToUse: "When you want to explore data or validate a result with SQL — no notebook needed.",
        whoUses: "Analysts, Business Users",
        color: "#1E40AF",
      },
      {
        id: "queries",
        label: "Queries",
        icon: "search",
        description: "Saved SQL queries that can be reused, scheduled, and shared with the team. The foundation for dashboards and alerts.",
        whenToUse: "When you want to save a query you will use repeatedly or share with the team.",
        whoUses: "Analysts",
        color: "#0891B2",
      },
      {
        id: "dashboards",
        label: "Dashboards",
        icon: "layout-dashboard",
        description: "AI/BI Dashboards (Lakeview) — visual dashboards built on top of saved queries. Counter, table, bar, line, scatter, map widgets. Auto-refresh supported. In the Howden FINMA project: DQX_Dashboard_v1 monitors data quality (pass/fail counts, error rows, freshness) and Howden VP Dashboard shows business-ready commission KPIs from the Gold layer.",
        whenToUse: "When you want to visualise KPIs or share a report with business stakeholders.",
        whoUses: "Analysts, Business Users, Executives",
        color: "#7C3AED",
      },
      {
        id: "genie",
        label: "Genie Spaces",
        icon: "sparkles",
        description: "AI-powered conversational analytics — ask questions about data in natural language instead of writing SQL queries. Genie automatically understands the question, converts it to SQL, runs it on Databricks, and returns results, charts, or insights. In the Howden project: VP_Space (commission data), IBS_Space (IBS insurance policies), Max_Genie (MAX CRM data), Perennial_KETL_Space (Perennial & KETL data).",
        whenToUse: "When you do not want to write SQL — just ask a question in plain English.",
        whoUses: "Business Users, Executives",
        color: "#DC2626",
      },
      {
        id: "alerts",
        label: "Alerts",
        icon: "bell",
        description: "Automated notifications triggered when a query result meets a condition (e.g. failure count > 10). Destinations: Email, Slack, PagerDuty, webhook. How to create an alert — 6 steps: (1) Create Query, (2) Save Query, (3) Create Alert, (4) Define condition, (5) Configure Notification, (6) Schedule Evaluation.",
        whenToUse: "When you want to be notified when data quality drops or a threshold is breached — instead of manually checking dashboards every day.",
        whoUses: "Analysts, Data Engineers, Ops Teams",
        color: "#D97706",
      },
      {
        id: "query-history",
        label: "Query History",
        icon: "history",
        description: "Full history of SQL queries run across the workspace — who ran what, when, how long it took, which warehouse was used.",
        whenToUse: "When you need to debug a slow query, find a query someone else ran, or audit usage.",
        whoUses: "Analysts, Admins",
        color: "#6B7280",
      },
      {
        id: "sql-warehouses",
        label: "SQL Warehouses",
        icon: "server",
        description: "Manage the SQL compute endpoints (serverless or classic) that power the SQL Editor, queries, dashboards, and Genie. Configure size and auto-suspend.",
        whenToUse: "When you need to configure or size your SQL compute, or check warehouse health.",
        whoUses: "Admins, Data Engineers",
        color: "#059669",
      },
    ],
  },
  {
    section: "Data Engineering",
    items: [
      {
        id: "de-runs",
        label: "Runs",
        icon: "activity",
        description: "View run history for jobs and Delta Live Tables pipelines in the data engineering context. See status, duration, logs, and re-run failed tasks.",
        whenToUse: "When you want to check if a pipeline succeeded or failed, or investigate an error.",
        whoUses: "Data Engineers",
        color: "#D97706",
      },
      {
        id: "ingestion",
        label: "Data Ingestion",
        icon: "upload",
        description: "Tools to bring data in: file upload UI, Auto Loader configuration wizard, partner connectors (Fivetran, Airbyte, etc.).",
        whenToUse: "When you need to get new data into Databricks from an external source.",
        whoUses: "Data Engineers",
        color: "#0891B2",
      },
    ],
  },
  {
    section: "AI & ML",
    items: [
      {
        id: "aiml",
        label: "AI/ML",
        icon: "brain",
        description: "MLflow experiments, registered models, feature store, and model serving endpoints. The full ML lifecycle in one place.",
        whenToUse: "When you are building, tracking, or deploying a machine learning model.",
        whoUses: "Data Scientists, ML Engineers",
        color: "#7C3AED",
      },
      {
        id: "playground",
        label: "Playground / Agents",
        icon: "bot",
        description: "AI Playground for testing LLMs and prompts interactively. AI Agents for building agentic workflows with tools, memory, and multi-step reasoning.",
        whenToUse: "When you want to experiment with AI models or build an LLM-powered agent.",
        whoUses: "AI Engineers, Explorers",
        color: "#DC2626",
      },
    ],
  },
];

// Flat list for backwards compatibility with components that expect a flat array
export const workspaceSidebarItems: NavItem[] = workspaceSidebarSections.flatMap((s) => s.items);

export const catalogTree = {
  name: "howden",
  type: "catalog" as const,
  description: "Main Howden data catalog — all production data assets for the FINMA project",
  children: [
    {
      name: "bronze",
      type: "schema" as const,
      description: "Raw ingested data from source systems",
      children: [
        { name: "bayo_raw",       type: "table" as const, rows: "48,234",  description: "Raw BAYO export — contains deals for Howden Schweiz AG and SWIBRO AG combined. Entity attribution happens in Silver.", layer: "bronze" as const },
        { name: "ibs_raw",        type: "table" as const, rows: "31,102",  description: "Raw IBS Alabus export for Howden Schweiz AG. Commission field: commission_chf.", layer: "bronze" as const },
        { name: "max_raw",        type: "table" as const, rows: "22,780",  description: "Raw MAX CRM export for Howden Broker Services AG. Commission field: brokerage_fee.", layer: "bronze" as const },
        { name: "ketl_raw",       type: "table" as const, rows: "12,506",  description: "Raw KETL export for Perennial AG. Commission field: comm_amt.", layer: "bronze" as const },
        { name: "vp_raw",         type: "table" as const, rows: "8,914",   description: "Raw Vorsorge Partner CRM export. Commission field: fee_earned.", layer: "bronze" as const },
      ],
    },
    {
      name: "silver",
      type: "schema" as const,
      description: "Cleaned and validated data",
      children: [
        { name: "commissions_clean",     type: "table" as const, rows: "123,536", description: "All 5 CRM extracts merged with unified field names. commission_chf is the single canonical amount field.", layer: "silver" as const },
        { name: "entity_attribution",    type: "table" as const, rows: "48,234",  description: "BAYO rows resolved to Howden Schweiz AG or SWIBRO AG based on deal-level entity identifier. Unresolved rows quarantined.", layer: "silver" as const },
        { name: "dq_rejected_records",   type: "table" as const, rows: "142",     description: "Rows that failed DQX rules — null commission, unresolvable entity, or Abacus variance breach. Reviewed before each submission.", layer: "silver" as const },
      ],
    },
    {
      name: "gold",
      type: "schema" as const,
      description: "Business-ready reporting tables",
      children: [
        { name: "howden_schweiz_commission", type: "table" as const, rows: "1", description: "FINMA-reportable commission totals for Howden Schweiz AG (Art. 190b ISO). Written by the Howden Schweiz pipeline after all DQX checks pass. Deadline: 31 May.", layer: "gold" as const },
        { name: "swibro_commission",         type: "table" as const, rows: "1", description: "FINMA-reportable commission totals for SWIBRO AG. Written by the SWIBRO pipeline after all DQX checks pass. Deadline: 31 May.", layer: "gold" as const },
        { name: "abacus_reconciliation",     type: "table" as const, rows: "5", description: "Commission totals vs Abacus cashflows by entity. Variance flagged if > CHF 10,000 or > 5% of category total.", layer: "gold" as const },
        { name: "commission_by_period",      type: "table" as const, rows: "1,248", description: "Monthly commission aggregated by entity and line of business for internal management reporting.", layer: "gold" as const },
      ],
    },
    {
      name: "audit",
      type: "schema" as const,
      description: "Data quality and pipeline audit logs",
      children: [
        { name: "dqx_run_log",    type: "table" as const, rows: "3,614",  description: "Each DQX rule execution: rule name, records checked, pass/fail counts, timestamp.", layer: "bronze" as const },
        { name: "pipeline_runs",  type: "table" as const, rows: "1,204",  description: "Historical pipeline run metadata — status, duration, task-level detail.", layer: "bronze" as const },
      ],
    },
  ],
};
