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

const HOWDEN_JOBS = [
  ["VorsorgePartnerCommission_nondlt", "Mansi Mansi", "Bronze → Silver → Gold, 3 tasks", "1m 28s"],
  ["VP_kundenliste_nondlt", "Mansi Mansi", "Vorsorge Partner Kundenliste pipeline", "~45s"],
  ["VP_nondlt", "Mansi Mansi", "Core Vorsorge Partner orchestration", "~2m"],
];

const ALERT_STEPS = [
  ["Create Query", "Write SQL that returns the metric to monitor"],
  ["Save Query", "Name it so the team can find it later"],
  ["Create Alert", "New Alert → attach to your saved query"],
  ["Define Condition", "Set threshold (e.g. failure_count > 0)"],
  ["Configure Notification", "Email, Slack, PagerDuty, or webhook"],
  ["Schedule Evaluation", "Choose frequency: 15 min, hourly, or daily"],
];

export function Chapter4_AutomateMonitor({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── Page 1 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 4: Automate & Monitor" />
        <PageFooter />

        <ChapterHeader
          number="04"
          title="Automate & Monitor"
          subtitle="Schedule pipelines and catch data quality failures automatically"
          color={COLORS.day4}
        />

        <ScreenshotBlock
          src={screenshots["jobs"]}
          caption="Jobs & Pipelines list — the three Vorsorge Partner jobs owned by Mansi Mansi"
          height={200}
        />

        {/* Key insight cards */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
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
              Jobs
            </Text>
            <Text style={{ fontSize: 8.5, color: "#78350F", lineHeight: 1.5 }}>
              Jobs = scheduled automation — tasks run in sequence, each depends on the previous
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#FEF2F2",
              borderWidth: 1,
              borderColor: "#DC2626",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#991B1B", marginBottom: 3 }}>
              DQX Validation
            </Text>
            <Text style={{ fontSize: 8.5, color: "#7F1D1D", lineHeight: 1.5 }}>
              DQX validates every record — failures go to dq_rejected_records, not Gold
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
              Alerts
            </Text>
            <Text style={{ fontSize: 8.5, color: "#0E7490", lineHeight: 1.5 }}>
              Alerts fire immediately — no need to check dashboards manually
            </Text>
          </View>
        </View>
      </Page>

      {/* ── Page 2 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 4: Automate & Monitor" />
        <PageFooter />

        <SectionTitle color={COLORS.day4}>The Three Howden VP Jobs</SectionTitle>
        <SimpleTable
          headers={["Job Name", "Owner", "Tasks", "Duration"]}
          rows={HOWDEN_JOBS}
          colWidths={[2, 0.9, 1.5, 0.6]}
        />

        <ScreenshotBlock
          src={screenshots["job-detail"]}
          caption="VorsorgePartnerCommission_nondlt — Bronze, Silver, Gold tasks all succeeded"
          height={130}
        />

        <SectionTitle color={COLORS.day4}>6 Steps to Set Up an Alert</SectionTitle>
        <SimpleTable
          headers={["Step", "Action"]}
          rows={ALERT_STEPS}
          colWidths={[1.2, 2.8]}
        />

        <SectionTitle color={COLORS.day4}>DQX Data Quality Dashboard</SectionTitle>
        <ScreenshotBlock
          src={screenshots["dashboard-dqx"]}
          caption="DQX_Dashboard_v1 — Input Rows, Error Rows, Warn Rows per Silver table"
          height={140}
        />

        <CalloutBox title="Service Principal Warning">
          {"The jobs run under a Service Principal, not a personal user account. Do not attach your personal PAT to a production job — if you leave the project, the job breaks."}
        </CalloutBox>
      </Page>
    </>
  );
}
