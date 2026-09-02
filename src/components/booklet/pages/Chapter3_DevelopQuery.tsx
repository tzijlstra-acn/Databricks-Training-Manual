import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader,
  PageFooter,
  ChapterHeader,
  SectionTitle,
  CalloutBox,
  ScreenshotBlock,
  SimpleTable,
} from "../shared";

const COMPUTE_TYPES = [
  ["All-Purpose Cluster", "Interactive notebooks, exploration, ad-hoc work", "adb-cluster-howden-switzerland-groupdatapoc-we (Runtime 17.3)"],
  ["Job Cluster", "Automated pipeline runs — spins up, runs, terminates", "Used by VorsorgePartnerCommission_nondlt and other Jobs"],
  ["SQL Warehouse", "SQL Editor, Dashboards, Genie AI — optimised for BI", "serverless-starter (shared across team)"],
];

const MAGIC_COMMANDS = [
  ["%sql", "Run a SQL cell in a Python notebook"],
  ["%python", "Switch a cell to Python"],
  ["%md", "Write Markdown documentation in a cell"],
  ["%run", "Execute another notebook from the current one"],
  ["%fs", "File system operations (list, copy, move files)"],
];

export function Chapter3_DevelopQuery({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── Page 1 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 3: Develop & Query" />
        <PageFooter />

        <ChapterHeader
          number="03"
          title="Develop & Query"
          subtitle="Write SQL and Python to query Howden Gold tables"
          color={COLORS.day3}
        />

        <ScreenshotBlock
          src={screenshots["compute"]}
          caption="Compute page — All-Purpose Cluster, Job Cluster, and SQL Warehouse types listed"
          height={200}
        />

        {/* Key insight cards */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#ECFDF5",
              borderWidth: 1,
              borderColor: "#059669",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#065F46", marginBottom: 3 }}>
              Notebooks
            </Text>
            <Text style={{ fontSize: 8.5, color: "#064E3B", lineHeight: 1.5 }}>
              Notebooks = interactive code — SQL, Python, and Scala side by side
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#EFF6FF",
              borderWidth: 1,
              borderColor: "#1E40AF",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#1E3A8A", marginBottom: 3 }}>
              SQL Editor
            </Text>
            <Text style={{ fontSize: 8.5, color: "#1E3A8A", lineHeight: 1.5 }}>
              SQL Editor = queries + saved results — use for ad-hoc Gold table lookups
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFBEB",
              borderWidth: 1,
              borderColor: "#D97706",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#92400E", marginBottom: 3 }}>
              Magic Commands
            </Text>
            <Text style={{ fontSize: 8.5, color: "#78350F", lineHeight: 1.5 }}>
              Magic commands switch language per cell — %sql in a Python notebook
            </Text>
          </View>
        </View>
      </Page>

      {/* ── Page 2 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 3: Develop & Query" />
        <PageFooter />

        <SectionTitle color={COLORS.day3}>Three Compute Types</SectionTitle>
        <SimpleTable
          headers={["Type", "Use Case", "Howden Instance"]}
          rows={COMPUTE_TYPES}
          colWidths={[1.2, 1.5, 2.3]}
        />

        <SectionTitle color={COLORS.day3}>Magic Commands</SectionTitle>
        <SimpleTable
          headers={["Command", "What It Does"]}
          rows={MAGIC_COMMANDS}
          colWidths={[0.8, 3.2]}
        />

        <SectionTitle color={COLORS.day3}>Example: Query Gold Table</SectionTitle>
        <View
          style={{
            backgroundColor: COLORS.navy,
            borderRadius: 4,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontFamily: "Courier", fontSize: 8.5, color: "#4ADE80", lineHeight: 1.6 }}>
            {"-- Total commission by entity, current year\nSELECT entity_name,\n       SUM(commission_chf) AS total_chf\nFROM howden.gold.howden_schweiz_commission\nWHERE submission_year = 2026\nGROUP BY entity_name\nORDER BY total_chf DESC"}
          </Text>
        </View>

        <ScreenshotBlock
          src={screenshots["workspace"]}
          caption="Workspace notebook — SQL cell running against the Gold table"
          height={150}
        />

        <CalloutBox title="Notebook vs SQL Editor">
          {"Use Notebooks for pipeline development and multi-step logic. Use SQL Editor for quick table lookups and building saved queries that power dashboards."}
        </CalloutBox>
      </Page>
    </>
  );
}
