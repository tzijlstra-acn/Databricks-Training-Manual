import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader,
  PageFooter,
  ChapterHeader,
  SectionTitle,
  Body,
  CalloutBox,
  ScreenshotBlock,
  SimpleTable,
} from "../shared";

const COMPUTE_TYPES = [
  [
    "All-Purpose Cluster",
    "Interactive notebooks and exploration — stays running, pay-per-hour",
    "adb-cluster-howden-switzerland-groupdatapoc-we (Runtime 17.3 / Spark 3.5.2)",
  ],
  [
    "Job Cluster",
    "Automated pipeline runs — spins up fresh per job run, then terminates",
    "Created automatically by VorsorgePartnerCommission_nondlt and other Jobs",
  ],
  [
    "SQL Warehouse",
    "Optimised for SQL queries, dashboards, and Genie AI — serverless billing",
    "serverless-starter (shared across the Howden team)",
  ],
];

const MAGIC_COMMANDS = [
  ["%sql", "Run a SQL cell inside a Python notebook — most common for ad-hoc table queries"],
  ["%python", "Switch a cell to Python inside a SQL notebook"],
  ["%md", "Write Markdown documentation in a notebook cell"],
  ["%run", "Execute another notebook from the current one — used for modular pipelines"],
  ["%fs", "File system operations: ls, cp, mv, rm on DBFS or Volume paths"],
  ["%sh", "Run shell commands — useful for inspecting the cluster OS environment"],
];

const NOTEBOOK_VS_SQL = [
  ["Multi-step logic or pipeline development", "Notebook", "Chain cells, define functions, use %run"],
  ["Quick table lookup or ad-hoc query", "SQL Editor", "Auto-complete, saved queries, result export"],
  ["Building a dashboard widget", "SQL Editor", "Saved query → Dashboard tile"],
  ["DQX rule development", "Notebook (Python)", "DQX library requires Python cells"],
  ["Exploring a Silver table structure", "Either", "DESCRIBE TABLE howden.silver.commissions_clean"],
];

const SQL_CODE = `-- Total commission by entity for the current FINMA year
SELECT  entity_name,
        SUM(commission_chf)   AS total_commission_chf,
        COUNT(*)              AS transaction_count
FROM    howden.gold.howden_schweiz_commission
WHERE   submission_year = 2026
GROUP BY entity_name
ORDER BY total_commission_chf DESC;

-- Check for DQX-rejected records before writing Gold
SELECT COUNT(*) AS rejection_count,
       rejection_reason
FROM   howden.silver.dq_rejected_records
GROUP BY rejection_reason;`;

export function Chapter3_DevelopQuery({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── PAGE 1 ── ChapterHeader + decision table + compute screenshot + compute table */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 3: Develop & Query" />
        <PageFooter />

        <ChapterHeader
          number="03"
          title="Develop & Query"
          subtitle="Outcome: Write and run SQL and Python code against Howden Gold and Silver tables"
          color={COLORS.day3}
        />

        <CalloutBox title="Howden Context">
          {"The primary development surfaces are: (1) Notebooks — for pipeline code (Bronze → Silver → Gold transformation logic); (2) SQL Editor — for ad-hoc queries against Gold tables and building saved queries that power dashboards. The cluster is adb-cluster-howden-switzerland-groupdatapoc-we running Databricks Runtime 17.3. Always start this cluster before running a notebook — attaching to a terminated cluster is a common source of confusion."}
        </CalloutBox>

        <SectionTitle color={COLORS.day3}>Notebook vs SQL Editor: When to Use Which</SectionTitle>
        <SimpleTable
          headers={["Task", "Use", "Why"]}
          rows={NOTEBOOK_VS_SQL}
          colWidths={[2, 0.9, 2.1]}
        />

        <ScreenshotBlock
          src={screenshots["compute"]}
          caption="Compute page — All-Purpose Cluster (adb-cluster-howden-switzerland-groupdatapoc-we), Job Clusters created by runs, and SQL Warehouse"
        />

        <SectionTitle color={COLORS.day3}>The Three Compute Types</SectionTitle>
        <SimpleTable
          headers={["Type", "Billing Model & Behaviour", "Howden Instance"]}
          rows={COMPUTE_TYPES}
          colWidths={[1.1, 2, 2]}
        />
      </Page>

      {/* ── PAGE 2 ── Magic commands + Gold table SQL example + screenshot + warning */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 3: Develop & Query" />
        <PageFooter />

        <SectionTitle color={COLORS.day3}>Magic Commands</SectionTitle>
        <Body>
          {"Magic commands change the language or behaviour of a single cell. They are essential for mixing SQL queries into Python notebooks — the pattern used throughout the FINMA pipeline."}
        </Body>
        <SimpleTable
          headers={["Command", "What It Does"]}
          rows={MAGIC_COMMANDS}
          colWidths={[0.7, 4.3]}
        />

        <SectionTitle color={COLORS.day3}>Example: Query the Howden Gold Table</SectionTitle>

        <View
          style={{
            backgroundColor: COLORS.navy,
            borderRadius: 4,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Courier",
              fontSize: 8.5,
              color: "#86EFAC",
              lineHeight: 1.65,
            }}
          >
            {SQL_CODE}
          </Text>
        </View>

        <ScreenshotBlock
          src={screenshots["workspace"]}
          caption="Notebook view — SQL cell running against howden.gold table with results panel below"
        />

        <CalloutBox title="Cluster Attachment Warning">
          {"If you open a notebook and the cluster dropdown shows 'Detached', click it and select adb-cluster-howden-switzerland-groupdatapoc-we. If the cluster is terminated, start it first — it takes ~4 minutes to spin up. Never run a job attached to a personal All-Purpose cluster; use Job Clusters for automation."}
        </CalloutBox>
      </Page>
    </>
  );
}
