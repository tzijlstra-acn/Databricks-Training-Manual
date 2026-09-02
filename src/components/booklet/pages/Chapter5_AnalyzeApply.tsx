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

const GENIE_SPACES = [
  ["VP_Space", "Mansi Mansi", "Vorsorge Partner commission — by line of business, period, segment"],
  ["IBS_Space", "Rajneesh X Sharma", "IBS insurance policies — renewals, premiums, cashflow"],
  ["Max_Genie", "Rohitha Vemula", "MAX CRM — top clients by premium, broker performance"],
  ["Perennial_KETL_Space", "Pankaj Ghatak", "Perennial + KETL — claims ratio, property risks, YTD analytics"],
];

const DASHBOARDS = [
  ["DQX_Dashboard_v1", "Rajneesh X Sharma", "Data quality KPIs — input vs error vs valid rows per Silver table"],
  ["Howden VP Dashboard", "Mansi Mansi", "Business VP KPIs from Gold — total commission, LOB breakdown, trend"],
];

const FLOW_STEPS = [
  { label: "Source\nCRM", color: COLORS.gray500 },
  { label: "Bronze\nLayer", color: "#A0522D" },
  { label: "DQ\nValidation", color: COLORS.day4 },
  { label: "Silver\nLayer", color: "#4B5563" },
  { label: "Gold\nTables", color: "#B45309" },
  { label: "Dashboard\n/ Genie", color: COLORS.day5 },
  { label: "FINMA\nSubmission", color: COLORS.day1 },
];

export function Chapter5_AnalyzeApply({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── Page 1 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 5: Analyze & Apply" />
        <PageFooter />

        <ChapterHeader
          number="05"
          title="Analyze & Apply"
          subtitle="Ask questions in plain English, trace every number to its source"
          color={COLORS.day5}
        />

        <ScreenshotBlock
          src={screenshots["genie"]}
          caption="Genie Spaces — VP_Space, IBS_Space, Max_Genie, Perennial_KETL_Space, and more"
          height={210}
        />

        {/* Key insight cards */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#F5F3FF",
              borderWidth: 1,
              borderColor: "#7C3AED",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#4C1D95", marginBottom: 3 }}>
              Genie AI
            </Text>
            <Text style={{ fontSize: 8.5, color: "#3B0764", lineHeight: 1.5 }}>
              Genie AI = natural language SQL — type a question, get a table or chart instantly
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#ECFEFF",
              borderWidth: 1,
              borderColor: "#0891B2",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#164E63", marginBottom: 3 }}>
              Dashboards
            </Text>
            <Text style={{ fontSize: 8.5, color: "#0E7490", lineHeight: 1.5 }}>
              Dashboards show Gold table KPIs — auto-refresh, no SQL needed for business users
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#F0FDF4",
              borderWidth: 1,
              borderColor: "#059669",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#064E3B", marginBottom: 3 }}>
              Data Lineage
            </Text>
            <Text style={{ fontSize: 8.5, color: "#065F46", lineHeight: 1.5 }}>
              Data lineage — every Gold number traces back to Bronze via Unity Catalog
            </Text>
          </View>
        </View>
      </Page>

      {/* ── Page 2 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 5: Analyze & Apply" />
        <PageFooter />

        <SectionTitle color={COLORS.day5}>The Four Howden Genie Spaces</SectionTitle>
        <SimpleTable
          headers={["Space", "Owner", "Data Covered"]}
          rows={GENIE_SPACES}
          colWidths={[1.2, 1.1, 2.7]}
        />

        <SectionTitle color={COLORS.day5}>Databricks Dashboards</SectionTitle>
        <SimpleTable
          headers={["Dashboard", "Owner", "What It Shows"]}
          rows={DASHBOARDS}
          colWidths={[1.3, 1.1, 2.6]}
        />

        <ScreenshotBlock
          src={screenshots["dashboard-dqx"]}
          caption="DQX_Dashboard_v1 — overview of data quality across all Howden Silver tables"
          height={150}
        />

        <SectionTitle color={COLORS.day5}>End-to-End: The FINMA Data Journey</SectionTitle>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 4,
            backgroundColor: COLORS.surface,
            borderRadius: 4,
            padding: 10,
            marginBottom: 10,
          }}
        >
          {FLOW_STEPS.map((step, i) => (
            <View key={step.label} style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: step.color,
                  borderRadius: 3,
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 7.5,
                    color: COLORS.white,
                    fontFamily: "Helvetica-Bold",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  {step.label}
                </Text>
              </View>
              {i < FLOW_STEPS.length - 1 && (
                <Text style={{ fontSize: 10, color: COLORS.gray400, marginHorizontal: 2 }}>
                  {"›"}
                </Text>
              )}
            </View>
          ))}
        </View>

        <CalloutBox title="Audit Trail">
          {"Unity Catalog tracks data lineage at the column level. Any commission figure in a Gold table can be traced back through Silver to Bronze to the original CRM export — giving FINMA inspectors a complete audit trail."}
        </CalloutBox>
      </Page>
    </>
  );
}
