import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader, PageFooter, ChapterHeader, SectionTitle,
  Body, CalloutBox, ScreenshotBlock, TwoColumn, Column, PipelineFlow, SimpleTable, StepList,
} from "../shared";
import { pipelineTasks } from "@/data/pipeline";

const ALERT_STEPS = [
  { title: "Create Query", body: "Write a SQL query that returns the metric you want to monitor — e.g. SELECT COUNT(*) AS failure_count FROM howden.silver.dq_rejected_records" },
  { title: "Save Query", body: "Give the query a descriptive name so the team can find it later (e.g. 'DQX Rejection Count — Daily')" },
  { title: "Create Alert", body: "Open Alerts from the SQL sidebar and click New Alert. Attach it to your saved query." },
  { title: "Define Condition", body: "Set the threshold — e.g. failure_count > 0. Databricks will compare the query result against this value on every evaluation." },
  { title: "Configure Notification", body: "Choose a destination: Email (individual or group), Slack channel, PagerDuty, or a custom webhook URL." },
  { title: "Schedule Evaluation", body: "Choose how often Databricks evaluates the query — e.g. every 15 minutes, hourly, or once a day after the pipeline run completes." },
];

const HOWDEN_JOBS = [
  ["VorsorgePartnerCommission_nondlt", "Mansi Mansi", "VP_Commission_Bronze_table → VP_Commission_Silver_table → VP_Commission_Gold_table", "1m 28s"],
  ["VP_kundenliste_nondlt", "Mansi Mansi", "Vorsorge Partner customer list (Kundenliste) pipeline", "~45s"],
  ["VP_nondlt", "Mansi Mansi", "Core Vorsorge Partner orchestration job", "~2m"],
];

export function Chapter4_AutomateMonitor({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Chapter 4: Automate & Monitor" />
      <PageFooter />

      <ChapterHeader
        number="04"
        title="Automate & Monitor"
        subtitle="Outcome: Build automated pipelines and ensure data quality"
        color={COLORS.day4}
      />

      <CalloutBox title="Howden Context">
        {"Today a data steward manually extracts from each CRM, checks the file looks roughly right, and sends it to the team. If a BAYO row is attributed to the wrong entity, nobody finds out until the FINMA report totals don't reconcile against Abacus. With Databricks Jobs, each entity runs its own dedicated pipeline. The moment a CRM file lands, automated DQ checks fire — and if anything fails, an alert fires immediately so nothing slips through to the 31 May submission."}
      </CalloutBox>

      {/* Jobs overview */}
      <SectionTitle color={COLORS.day4}>Databricks Jobs: The Orchestrator</SectionTitle>
      <Body>
        {"A Databricks Job is a scheduled or triggered automation that runs notebooks, scripts, or pipelines without manual intervention. Each task in a Job depends on the previous one — if task 2 fails, tasks 3 and 4 are blocked automatically, protecting the Gold table from receiving incomplete data."}
      </Body>

      {/* Jobs screenshot */}
      <ScreenshotBlock
        src={screenshots["jobs"]}
        caption="Jobs & Pipelines list — VorsorgePartnerCommission_nondlt, Vp_kundenliste_nondlt, and Vp_nondlt, all owned by Mansi Mansi"
        height={110}
      />

      <SectionTitle color={COLORS.day4}>The Three Howden VP Jobs</SectionTitle>
      <SimpleTable
        headers={["Job Name", "Owner", "Tasks / Description", "Typical Duration"]}
        rows={HOWDEN_JOBS}
        colWidths={[1.6, 0.8, 2.2, 0.8]}
      />

      {/* Job detail screenshot */}
      <ScreenshotBlock
        src={screenshots["job-detail"]}
        caption="VorsorgePartnerCommission_nondlt detail — three tasks (Bronze, Silver, Gold) all succeeded, with Run now button and Job ID visible"
        height={125}
      />

      {/* FINMA pipeline */}
      <SectionTitle color={COLORS.day4}>The FINMA Pipeline: 5 Tasks in Sequence</SectionTitle>
      <Body>
        {"Each of the five Howden entities runs this pattern. The pipeline only writes the Gold table if every upstream task passes — protecting FINMA submission from incomplete data."}
      </Body>

      <PipelineFlow
        tasks={pipelineTasks.map((t) => ({ name: t.name, description: t.description, type: t.type }))}
        color={COLORS.day4}
      />

      {/* DQX */}
      <SectionTitle color={COLORS.day4}>Data Quality with DQX</SectionTitle>
      <Body>
        {"DQX (Databricks Data Quality Extension) runs rule-based checks on every record before it can advance to Silver or Gold. Records that fail are quarantined in howden.silver.dq_rejected_records — they do not stop the pipeline unless a critical rule is breached."}
      </Body>

      {/* DQX flow */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.surface,
          borderRadius: 4,
          padding: 10,
          marginBottom: 8,
          gap: 4,
        }}
      >
        {[
          { label: "Source\nData", color: COLORS.gray500 },
          { label: "Bronze\nTable", color: "#A0522D" },
          { label: "DQ Rules\nApplied", color: COLORS.day4 },
          { label: "Silver\nTables", color: "#4B5563" },
          { label: "DQX\nDashboard", color: COLORS.day2 },
        ].map((step, i) => (
          <View key={step.label} style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: step.color,
                borderRadius: 3,
                padding: 6,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 7.5, color: COLORS.white, fontFamily: "Helvetica-Bold", textAlign: "center", lineHeight: 1.4 }}>
                {step.label}
              </Text>
            </View>
            {i < 4 && (
              <Text style={{ fontSize: 10, color: COLORS.gray400, paddingHorizontal: 2 }}>›</Text>
            )}
          </View>
        ))}
      </View>

      <Body>
        {"DQX rule types used in the Howden project: null checks (commission_chf must not be null), duplicate checks (no duplicate deal IDs), threshold checks (Abacus variance must be within CHF 10,000 or 5% per entity), schema validation (all required columns present), and business rule validation (entity code must be a recognised Howden entity)."}
      </Body>

      {/* DQX dashboard screenshot */}
      <ScreenshotBlock
        src={screenshots["dashboard-dqx"]}
        caption="DQX_Dashboard_v1 — data quality summary showing Input Rows, Error Rows, Warn Rows, and Valid Rows across all Howden Silver tables"
        height={130}
      />

      {/* Alerts */}
      <SectionTitle color={COLORS.day4}>Setting Up Alerts: 6-Step Process</SectionTitle>
      <Body>
        {"Databricks Alerts send notifications when a query result meets a condition — without anyone needing to check dashboards manually. For the FINMA pipeline, the recommended alert is: DQX rejection count > 0, notifying the data steward immediately."}
      </Body>

      <StepList steps={ALERT_STEPS} color={COLORS.day4} />
    </Page>
  );
}
