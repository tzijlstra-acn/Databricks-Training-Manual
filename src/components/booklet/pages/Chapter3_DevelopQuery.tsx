import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader, PageFooter, ChapterHeader, SectionTitle,
  Body, CalloutBox, ScreenshotBlock, TwoColumn, Column, SimpleTable, CodeBlock, InfoCard,
} from "../shared";

const COMPUTE_TYPES = [
  ["All-Purpose Cluster", "Interactive notebooks and exploratory development", "Data Engineers, Scientists", "Running notebooks interactively against the FINMA Silver tables"],
  ["Job Cluster", "Automated scheduled runs — spins up fresh, shuts down when done", "Data Engineers", "The VorsorgePartnerCommission_nondlt job uses a Job Cluster at 2am"],
  ["SQL Warehouse", "Optimised for SQL queries, dashboards, Genie AI. Shared, always-on.", "Analysts, Business Users", "DQX_Dashboard_v1 and Howden VP Dashboard both use the Serverless Starter Warehouse"],
];

const DECISION_ROWS = [
  ["Writing Python/Scala code?", "YES → Notebook + All-Purpose Cluster", "NO → Continue below"],
  ["Scheduled or automated?", "YES → Notebook in a Job with Job Cluster", "NO → Continue below"],
  ["Building a dashboard or report?", "YES → SQL Editor + SQL Warehouse", "NO → Notebook for exploration"],
];

export function Chapter3_DevelopQuery({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Chapter 3: Develop & Query" />
      <PageFooter />

      <ChapterHeader
        number="03"
        title="Develop & Query"
        subtitle="Outcome: Write queries and understand compute"
        color={COLORS.day3}
      />

      <CalloutBox title="Howden Context">
        {"Before Databricks, analysts ran loss ratio calculations in Excel on their laptops — different team members using different versions, no audit trail, no shared access. With a Databricks notebook connected to howden.silver.commissions_clean, the same calculation runs on the full dataset, is reproducible, and can be shared with the entire team immediately."}
      </CalloutBox>

      {/* Notebooks section */}
      <SectionTitle color={COLORS.day3}>Databricks Notebooks</SectionTitle>
      <Body>
        {"A notebook is an interactive document where you write and run code in cells — SQL, Python, or Scala — with results appearing inline immediately below each cell. Unlike a script file, a notebook lets you develop iteratively: run one cell, inspect the result, then write the next step."}
      </Body>

      <TwoColumn>
        <Column>
          <View style={{ backgroundColor: COLORS.surface, borderRadius: 4, padding: 9, borderWidth: 1, borderColor: COLORS.gray200 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: COLORS.navy, marginBottom: 5 }}>Key Notebook Concepts</Text>
            {[
              "Code cells — write and run SQL, Python, or Scala",
              "Magic commands — %sql, %python, %sh, %md to switch language per cell",
              "Results inline — tables, charts, maps appear below each cell",
              "Attach to compute — every notebook needs a cluster attached to run",
              "Share — notebooks live in the Workspace and can be shared like files",
            ].map((item) => (
              <Text key={item} style={{ fontSize: 8.5, color: COLORS.gray700, marginBottom: 3, lineHeight: 1.4 }}>
                · {item}
              </Text>
            ))}
          </View>
        </Column>
        <Column>
          <CodeBlock
            code={`-- SQL cell: query Silver table
SELECT
  line_of_business,
  SUM(commission_chf) AS total_chf,
  COUNT(*) AS policy_count
FROM howden.silver.commissions_clean
WHERE entity_code = 'HW-CH-01'
GROUP BY line_of_business
ORDER BY total_chf DESC;

# Python cell: load with Spark
df = spark.table(
  "howden.silver.commissions_clean"
)
display(df.filter(
  df.entity_code == "HW-CH-01"
))`}
          />
        </Column>
      </TwoColumn>

      {/* Compute */}
      <SectionTitle color={COLORS.day3}>Compute: The Engine Behind Everything</SectionTitle>
      <Body>
        {"Nothing runs in Databricks without compute — it is the processing power (CPUs and memory) that executes your code. Choosing the right compute type is the single most impactful decision for cost and performance."}
      </Body>

      {/* Compute screenshot */}
      <ScreenshotBlock
        src={screenshots["compute"]}
        caption="Compute page showing adb-cluster-howden-switzerland-groupdatapoc-we (Runtime 17.3) — the FINMA project's all-purpose cluster"
        height={100}
      />

      <SimpleTable
        headers={["Type", "Best For", "Who Uses It", "Howden Example"]}
        rows={COMPUTE_TYPES}
        colWidths={[1.2, 1.5, 1, 1.8]}
      />

      <CalloutBox title="Service Principal Warning">
        {"The Howden FINMA jobs currently run as Mansi Mansi (personal account). This means if that account is disabled or MFA settings change, the nightly pipeline stops. Best practice: change 'Run as' to a dedicated Service Principal (a non-human identity) so pipelines are not tied to any individual's account."}
      </CalloutBox>

      {/* SQL Editor vs Notebook */}
      <SectionTitle color={COLORS.day3}>SQL Editor vs Notebook: When to Use Which</SectionTitle>

      <SimpleTable
        headers={["Question", "YES", "NO"]}
        rows={DECISION_ROWS}
        colWidths={[1.5, 1.5, 1.5]}
      />

      <View
        style={{
          backgroundColor: COLORS.day3 + "15",
          borderRadius: 4,
          padding: 10,
          borderWidth: 1,
          borderColor: COLORS.day3 + "40",
          marginTop: 6,
        }}
      >
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: COLORS.day3, marginBottom: 3 }}>
          RULE OF THUMB
        </Text>
        <Text style={{ fontSize: 9, color: COLORS.gray700, lineHeight: 1.5 }}>
          {"Notebooks for development and Python. SQL Editor for analytics and dashboards. Jobs for automation."}
        </Text>
      </View>

      {/* Magic commands reference */}
      <SectionTitle color={COLORS.day3}>Notebook Magic Commands</SectionTitle>
      <SimpleTable
        headers={["Command", "Language / Function"]}
        rows={[
          ["%sql", "Write and run SQL in this cell"],
          ["%python", "Switch cell to Python (Spark)"],
          ["%scala", "Switch cell to Scala"],
          ["%sh", "Run a shell command on the driver node"],
          ["%run ./other_notebook", "Execute another notebook inline (imports its variables)"],
          ["%fs ls /mnt/", "Browse the ADLS file system via dbutils.fs"],
          ["%md", "Markdown — documentation cell, no code runs"],
        ]}
        colWidths={[1.2, 3]}
      />
    </Page>
  );
}
