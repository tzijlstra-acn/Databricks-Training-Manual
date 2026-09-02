import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader, PageFooter, ChapterHeader, SectionTitle,
  Body, CalloutBox, ScreenshotBlock, TwoColumn, Column, SimpleTable,
} from "../shared";

const GENIE_SPACES = [
  ["VP_Space", "Mansi Mansi", "Vorsorge Partner commission data — total commission by line of business, period, and segment"],
  ["IBS_Space", "Rajneesh X Sharma", "IBS insurance policies — renewals, premiums, cashflow analysis across Howden Schweiz AG"],
  ["Max_Genie", "Rohitha Vemula", "MAX CRM data — top clients by premium volume, broker performance in the DACH region"],
  ["Perennial_KETL_Space", "Pankaj Ghatak", "Perennial and KETL combined — claims ratio, property risks, year-to-date analytics"],
];

const DASHBOARDS = [
  ["DQX_Dashboard_v1", "Rajneesh X Sharma", "Data quality monitoring — input vs error vs valid row counts, DQX run history, freshness indicators per Silver table"],
  ["Howden VP Dashboard", "Mansi Mansi", "Business-ready Vorsorge Partner KPIs from the Gold layer — total commission, breakdown by line of business, trend over time"],
];

const END_TO_END = [
  "Source System (CRM exports)", "Bronze Layer (raw, immutable)", "Silver Layer (clean + validated)", "Gold Layer (FINMA-ready)", "Power BI Report", "Dashboard (Lakeview)", "Genie AI Query", "Business Decision",
];

export function Chapter5_AnalyzeApply({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Chapter 5: Analyze & Apply" />
      <PageFooter />

      <ChapterHeader
        number="05"
        title="Analyze & Apply"
        subtitle="Outcome: Navigate from dashboard KPI back to source data; ask questions in plain English"
        color={COLORS.day5}
      />

      <CalloutBox title="Howden Context">
        {"Before this platform, analysts manually pivoted commission data in Excel to produce the loss ratio report — different pivot tables, different filters, different numbers. Now, the Gold table drives both the Howden VP Dashboard (for KPI tracking) and Genie AI Spaces (for ad-hoc questions). A business user can ask 'What is total Vorsorge Partner commission by line of business this quarter?' in plain English and receive an instant answer backed by the same audited Gold data that feeds the FINMA submission."}
      </CalloutBox>

      {/* Dashboards */}
      <SectionTitle color={COLORS.day5}>Databricks Dashboards (Lakeview)</SectionTitle>
      <Body>
        {"Databricks AI/BI Dashboards — also called Lakeview dashboards — are visual reports built on top of saved SQL queries. They support counter, table, bar, line, scatter, and map widgets, with auto-refresh to keep numbers current. Business users and executives access them without writing any SQL."}
      </Body>

      <SimpleTable
        headers={["Dashboard", "Owner", "What It Shows"]}
        rows={DASHBOARDS}
        colWidths={[1.3, 1.1, 3]}
      />

      {/* DQX dashboard screenshot */}
      <ScreenshotBlock
        src={screenshots["dashboard-dqx"]}
        caption="DQX_Dashboard_v1 — data quality overview. Bars show Input Rows (teal), Error Rows (red), and Warn Rows (yellow) per Silver table"
        height={140}
      />

      {/* Genie */}
      <SectionTitle color={COLORS.day5}>Genie AI Spaces: Natural Language Analytics</SectionTitle>
      <Body>
        {"Genie Spaces are AI-powered conversational analytics environments. Each space is connected to specific Gold tables and a SQL Warehouse. A user types a question in plain English; Genie converts it to SQL, runs it, and returns results as a table or chart — without the user needing to know SQL or the table schema."}
      </Body>

      {/* Genie screenshot */}
      <ScreenshotBlock
        src={screenshots["genie"]}
        caption="Genie Spaces list — Max_Genie, IBS_Space, Perennial_KETL_Space, VP_Space, IBS Data Quality Monitoring, Customer Overview Analytics"
        height={130}
      />

      <SectionTitle color={COLORS.day5}>The Four Howden Genie Spaces</SectionTitle>
      <SimpleTable
        headers={["Space", "Owner", "Data Covered"]}
        rows={GENIE_SPACES}
        colWidths={[1.2, 1.1, 3]}
      />

      {/* How Genie works */}
      <SectionTitle color={COLORS.day5}>How Genie Works: Processing Flow</SectionTitle>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          backgroundColor: COLORS.surface,
          borderRadius: 4,
          padding: 10,
          marginBottom: 10,
          gap: 4,
        }}
      >
        {[
          { label: "Natural Language\nQuestion", color: "#7C3AED" },
          { label: "Genie\nSpace", color: "#DC2626" },
          { label: "Genie\nAI", color: COLORS.day5 },
          { label: "SQL\nQuery", color: COLORS.gray500 },
          { label: "SQL\nWarehouse", color: COLORS.day4 },
          { label: "Gold\nTables", color: "#B45309" },
          { label: "Answer /\nChart", color: COLORS.day3 },
        ].map((step, i) => (
          <View key={step.label} style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                backgroundColor: step.color,
                borderRadius: 3,
                padding: 5,
                alignItems: "center",
                minWidth: 54,
              }}
            >
              <Text style={{ fontSize: 7, color: COLORS.white, fontFamily: "Helvetica-Bold", textAlign: "center", lineHeight: 1.4 }}>
                {step.label}
              </Text>
            </View>
            {i < 6 && (
              <Text style={{ fontSize: 9, color: COLORS.gray400, paddingHorizontal: 2 }}>›</Text>
            )}
          </View>
        ))}
      </View>

      {/* End-to-end capstone */}
      <SectionTitle color={COLORS.day5}>End-to-End: The Complete FINMA Data Journey</SectionTitle>
      <Body>
        {"Every number a business user sees in a dashboard or Genie answer traces back through this full chain — from the original CRM export to the regulatory submission."}
      </Body>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, alignItems: "center", marginBottom: 10 }}>
        {END_TO_END.map((step, i) => (
          <View key={step} style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                backgroundColor: [COLORS.gray500, "#A0522D", "#4B5563", "#B45309", "#1D4ED8", COLORS.day5, "#DC2626", COLORS.day3][i],
                borderRadius: 3,
                paddingHorizontal: 7,
                paddingVertical: 5,
              }}
            >
              <Text style={{ fontSize: 7.5, color: COLORS.white, fontFamily: "Helvetica-Bold", textAlign: "center" }}>
                {step}
              </Text>
            </View>
            {i < END_TO_END.length - 1 && (
              <Text style={{ fontSize: 10, color: COLORS.gray400, paddingHorizontal: 3 }}>›</Text>
            )}
          </View>
        ))}
      </View>

      <CalloutBox title="Data Lineage">
        {"Unity Catalog tracks lineage automatically at the column level. Any number in howden.gold.howden_schweiz_commission can be traced back through Silver (commissions_clean) to Bronze (bayo_raw or ibs_raw) to the original CRM export — giving Howden a complete audit trail for FINMA inspectors."}
      </CalloutBox>
    </Page>
  );
}
