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

const HOWDEN_JOBS = [
  [
    "VorsorgePartnerCommission_nondlt",
    "Mansi Mansi",
    "VP_Commission_Bronze → VP_Commission_Silver → VP_Commission_Gold",
    "1m 28s",
  ],
  [
    "VP_kundenliste_nondlt",
    "Mansi Mansi",
    "Vorsorge Partner Kundenliste pipeline — customer list Bronze → Silver → Gold",
    "~45s",
  ],
  [
    "VP_nondlt",
    "Mansi Mansi",
    "Core Vorsorge Partner orchestration job — full commission run",
    "~2m",
  ],
];

const PIPELINE_TASKS = [
  ["1", "Ingest Bronze", "notebook", "Load raw CRM export to howden.bronze.* — schema validation, deduplication, timestamp"],
  ["2", "Entity Attribution", "notebook", "Resolve BAYO rows to Howden Schweiz AG or SWIBRO AG using deal-level identifiers"],
  ["3", "DQX Validation", "notebook", "Apply DQX rule set — null checks, threshold checks, schema validation, business rules"],
  ["4", "Write Silver", "notebook", "Merge all 5 CRM streams into howden.silver.commissions_clean — only if DQX passes"],
  ["5", "Write Gold", "notebook", "Aggregate to entity-level totals in howden.gold.* — triggers Abacus reconciliation check"],
];

const ALERT_STEPS = [
  ["1 — Create Query", "SQL: SELECT COUNT(*) AS failure_count FROM howden.silver.dq_rejected_records WHERE run_date = current_date()"],
  ["2 — Save Query", "Give it a descriptive name: 'DQX Rejection Count — Daily' so the team can find it in Alerts"],
  ["3 — Create Alert", "Open Alerts from the SQL sidebar → New Alert → attach to your saved query"],
  ["4 — Define Condition", "Set threshold: failure_count > 0. Databricks evaluates on every scheduled run."],
  ["5 — Configure Notification", "Email (individual or group), Slack channel, PagerDuty, or a custom webhook URL"],
  ["6 — Schedule Evaluation", "Match the pipeline schedule: e.g. daily at 07:00 after VorsorgePartnerCommission_nondlt completes"],
];

export function Chapter4_AutomateMonitor({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── PAGE 1 ── ChapterHeader + context + Jobs overview + jobs table */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 4: Automate & Monitor" />
        <PageFooter />

        <ChapterHeader
          number="04"
          title="Automate & Monitor"
          subtitle="Outcome: Build automated pipelines and catch data quality failures before they reach FINMA"
          color={COLORS.day4}
        />

        <CalloutBox title="Howden Context">
          {"Before this platform, a data steward manually checked each CRM export, pivoted in Excel, and sent the file. If a BAYO row was attributed to the wrong entity, nobody found out until the FINMA report totals didn't reconcile with Abacus — sometimes days before the 31 May deadline. With Databricks Jobs, each entity runs its own pipeline. The moment a CRM file lands, automated DQX checks fire. If any check fails, an alert fires immediately — nothing slips through to submission."}
        </CalloutBox>

        <SectionTitle color={COLORS.day4}>Databricks Jobs: Scheduled Automation</SectionTitle>
        <Body>
          {"A Job is a DAG of tasks (notebooks, SQL, Python scripts) that run in sequence or parallel, on a schedule or trigger. If task N fails, all downstream tasks are blocked — the Gold table is never written with incomplete data."}
        </Body>

        <ScreenshotBlock
          src={screenshots["jobs"]}
          caption="Jobs & Pipelines list — VorsorgePartnerCommission_nondlt, VP_kundenliste_nondlt, VP_nondlt — all owned by Mansi Mansi"
        />

        <SectionTitle color={COLORS.day4}>The Three Howden VP Jobs</SectionTitle>
        <SimpleTable
          headers={["Job Name", "Owner", "Task Chain", "Duration"]}
          rows={HOWDEN_JOBS}
          colWidths={[1.8, 0.8, 2.2, 0.7]}
        />
      </Page>

      {/* ── PAGE 2 ── Job detail + pipeline tasks + alert steps + DQX dashboard + warning */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 4: Automate & Monitor" />
        <PageFooter />

        <ScreenshotBlock
          src={screenshots["job-detail"]}
          caption="VorsorgePartnerCommission_nondlt detail — three tasks (Bronze, Silver, Gold) all succeeded in 1m 28s with Run now button"
        />

        <SectionTitle color={COLORS.day4}>The FINMA Pipeline: 5 Tasks in Sequence</SectionTitle>
        <Body>
          {"Every Howden entity runs this pattern. The pipeline only writes Gold if every upstream task passes — protecting submission integrity."}
        </Body>

        <View style={{ marginBottom: 10 }}>
          {PIPELINE_TASKS.map((task) => (
            <View
              key={task[0]}
              style={{ flexDirection: "row", gap: 8, marginBottom: 5 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: COLORS.day4,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{ fontFamily: "Helvetica-Bold", fontSize: 8, color: COLORS.white }}
                >
                  {task[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Helvetica-Bold",
                    fontSize: 9,
                    color: COLORS.navy,
                    marginBottom: 1,
                  }}
                >
                  {task[1]}
                </Text>
                <Text style={{ fontSize: 7.5, color: COLORS.gray500, marginBottom: 1 }}>
                  {task[2]}
                </Text>
                <Text
                  style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.4 }}
                >
                  {task[3]}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <SectionTitle color={COLORS.day4}>Setting Up Alerts: 6-Step Process</SectionTitle>
        <SimpleTable
          headers={["Step", "Action / SQL / Configuration"]}
          rows={ALERT_STEPS}
          colWidths={[1.4, 3.6]}
        />

        <ScreenshotBlock
          src={screenshots["dashboard-dqx"]}
          caption="DQX_Dashboard_v1 — Input Rows (teal), Error Rows (red), Warn Rows (yellow) per Silver table with run history"
        />

        <CalloutBox title="Service Principal Warning">
          {"The three Howden VP jobs run under a Service Principal, not a personal user account. Never attach your personal PAT token to a production job — if your account is offboarded, the job breaks and the FINMA pipeline stops. Contact the platform admin to configure the job credential correctly."}
        </CalloutBox>
      </Page>
    </>
  );
}
