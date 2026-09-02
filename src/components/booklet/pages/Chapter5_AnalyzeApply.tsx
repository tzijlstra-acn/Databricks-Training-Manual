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

const GENIE_SPACES = [
  [
    "VP_Space",
    "Mansi Mansi",
    "howden.gold.howden_schweiz_commission",
    "Commission by LOB, period, segment — ask in plain English",
  ],
  [
    "IBS_Space",
    "Rajneesh X Sharma",
    "IBS insurance tables",
    "Renewals, premiums, cashflow analysis across Howden Schweiz AG",
  ],
  [
    "Max_Genie",
    "Rohitha Vemula",
    "MAX CRM Gold tables",
    "Top clients by premium volume, broker performance in DACH",
  ],
  [
    "Perennial_KETL_Space",
    "Pankaj Ghatak",
    "Perennial + KETL Gold tables",
    "Claims ratio, property risks, year-to-date analytics",
  ],
];

const DASHBOARDS = [
  [
    "DQX_Dashboard_v1",
    "Rajneesh X Sharma",
    "Data quality KPIs — Input Rows, Error Rows, Warn Rows, Valid Rows per Silver table; DQX run history; freshness indicators",
  ],
  [
    "Howden VP Dashboard",
    "Mansi Mansi",
    "Business VP KPIs from Gold — total commission CHF, breakdown by line of business, trend over time; auto-refreshes on pipeline run",
  ],
];

const END_TO_END = [
  { label: "Source CRM\n(5 systems)", color: "#374151" },
  { label: "Bronze\n(raw, immutable)", color: "#A0522D" },
  { label: "DQX\nValidation", color: "#D97706" },
  { label: "Silver\n(clean + validated)", color: "#4B5563" },
  { label: "Gold\n(FINMA-ready)", color: "#B45309" },
  { label: "Dashboard\n/ Genie AI", color: "#7C3AED" },
  { label: "FINMA\nSubmission", color: "#1E40AF" },
];

const GENIE_STEPS = [
  { label: "User\nQuestion", color: COLORS.day5 },
  { label: "Genie\nSpace", color: "#DC2626" },
  { label: "LLM\n(Genie AI)", color: COLORS.day5 },
  { label: "SQL\nGenerated", color: COLORS.gray500 },
  { label: "SQL\nWarehouse", color: COLORS.day4 },
  { label: "Gold\nTables", color: "#B45309" },
  { label: "Answer\n/ Chart", color: COLORS.day3 },
];

export function Chapter5_AnalyzeApply({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── PAGE 1 ── ChapterHeader + dashboards + Genie overview */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 5: Analyze & Apply" />
        <PageFooter />

        <ChapterHeader
          number="05"
          title="Analyze & Apply"
          subtitle="Outcome: Ask questions in plain English and trace every number back to source"
          color={COLORS.day5}
        />

        <CalloutBox title="Howden Context">
          {"Before this platform, analysts manually pivoted commission data in Excel — different pivot tables, different filters, sometimes different numbers. Now the Gold table drives both the Howden VP Dashboard (for KPI tracking) and Genie AI Spaces (for ad-hoc questions). A business user can ask 'What is total Vorsorge Partner commission by line of business this quarter?' in plain English and receive an instant, auditable answer backed by the same Gold data that feeds FINMA."}
        </CalloutBox>

        <SectionTitle color={COLORS.day5}>Databricks AI/BI Dashboards (Lakeview)</SectionTitle>
        <Body>
          {"Lakeview dashboards are visual reports built on saved SQL queries. They auto-refresh, support counter/bar/line/table/map widgets, and can be shared with stakeholders without requiring any SQL knowledge."}
        </Body>
        <SimpleTable
          headers={["Dashboard", "Owner", "What It Shows"]}
          rows={DASHBOARDS}
          colWidths={[1.3, 1.1, 2.6]}
        />

        <ScreenshotBlock
          src={screenshots["dashboard-dqx"]}
          caption="DQX_Dashboard_v1 — data quality overview showing Input Rows, Error Rows, Warn Rows, and Valid Rows per Silver table"
        />

        <SectionTitle color={COLORS.day5}>Genie AI Spaces: Natural Language Analytics</SectionTitle>
        <Body>
          {"Each Genie Space is connected to specific Gold tables and a SQL Warehouse. The user types a question; Genie converts it to SQL, runs it, and returns the result as a table or chart — without needing to know the table schema."}
        </Body>

        <ScreenshotBlock
          src={screenshots["genie"]}
          caption="Genie Spaces list — VP_Space, IBS_Space, Max_Genie, Perennial_KETL_Space, IBS Data Quality Monitoring, Customer Overview Analytics"
        />
      </Page>

      {/* ── PAGE 2 ── Genie spaces table + end-to-end flow + lineage callout + Genie process flow */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 5: Analyze & Apply" />
        <PageFooter />

        <SectionTitle color={COLORS.day5}>The Four Howden Genie Spaces</SectionTitle>
        <SimpleTable
          headers={["Space", "Owner", "Gold Table", "Questions It Answers"]}
          rows={GENIE_SPACES}
          colWidths={[1.1, 1.1, 1.4, 2.4]}
        />

        <SectionTitle color={COLORS.day5}>End-to-End: The Complete FINMA Data Journey</SectionTitle>
        <Body>
          {"Every number in a dashboard or Genie answer traces back through this chain — from the original CRM export to the FINMA regulatory submission."}
        </Body>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 4,
            backgroundColor: COLORS.surface,
            borderRadius: 5,
            padding: 12,
            marginBottom: 12,
          }}
        >
          {END_TO_END.map((step, i) => (
            <View key={step.label} style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: step.color,
                  borderRadius: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 7,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Helvetica-Bold",
                    fontSize: 7.5,
                    color: COLORS.white,
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  {step.label}
                </Text>
              </View>
              {i < END_TO_END.length - 1 && (
                <Text style={{ fontSize: 11, color: COLORS.gray400, paddingHorizontal: 2 }}>›</Text>
              )}
            </View>
          ))}
        </View>

        <CalloutBox title="Data Lineage — The Audit Trail">
          {"Unity Catalog tracks lineage automatically at the column level. Any commission figure in howden.gold.howden_schweiz_commission can be traced back through howden.silver.commissions_clean → howden.bronze.bayo_raw (or the relevant CRM Bronze table) → the original CRM export file. FINMA inspectors can follow this trail entirely within the Unity Catalog lineage view."}
        </CalloutBox>

        <SectionTitle color={COLORS.day5}>How Genie Processes a Question</SectionTitle>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 4,
            backgroundColor: COLORS.surface,
            borderRadius: 5,
            padding: 12,
            marginBottom: 12,
          }}
        >
          {GENIE_STEPS.map((step, i) => (
            <View key={step.label} style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: step.color,
                  borderRadius: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 7,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Helvetica-Bold",
                    fontSize: 7.5,
                    color: COLORS.white,
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  {step.label}
                </Text>
              </View>
              {i < GENIE_STEPS.length - 1 && (
                <Text style={{ fontSize: 11, color: COLORS.gray400, paddingHorizontal: 2 }}>›</Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </>
  );
}
