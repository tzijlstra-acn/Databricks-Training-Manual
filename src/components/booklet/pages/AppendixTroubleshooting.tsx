import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import { PageHeader, PageFooter, SectionTitle, Body, CalloutBox } from "../shared";

const FAQS = [
  {
    q: "I cannot access the workspace",
    a: "Verify you are using the correct URL: https://adb-2530764091964059.19.azuredatabricks.net/. Use your corporate Howden email address and complete any SSO or MFA prompts. If login fails, try an incognito or private browser window to rule out cached credential issues. Contact your Workspace Admin if access is still not granted.",
  },
  {
    q: "Where can I find the data?",
    a: "Open Catalog in the left sidebar and browse the howden catalog. Data is organised into bronze (raw), silver (cleansed), and gold (aggregated) schemas. Use Ctrl+P from anywhere in the workspace to search for a specific table name without browsing the full catalog tree.",
  },
  {
    q: "Why is my notebook not running?",
    a: "Check that the notebook is attached to a cluster using the dropdown in the top-left toolbar. Verify the cluster is in Running state — a cluster that was idle may take up to 4 minutes to restart. Also check for a red error indicator in a previous cell: Databricks stops execution at the first cell that errors unless you explicitly skip it.",
  },
  {
    q: "Who should I contact for access or technical issues?",
    a: "Reach out to your Workspace Admin. They manage user provisioning, workspace entitlements, cluster permissions, and access control lists (ACLs). For training or process questions, contact the FINMA pipeline team.",
  },
];

const RESOURCES = [
  {
    title: "Databricks Official Documentation",
    label: "docs.databricks.com",
    body: "Comprehensive reference for all platform features: Unity Catalog, notebooks, Lakeflow pipelines, SQL Editor, AI/BI dashboards, Genie, and data engineering. Use the search function — most questions are answered here.",
  },
  {
    title: "Databricks Academy — Free Training",
    label: "customer-academy.databricks.com",
    body: "Structured courses and recorded webinars available free of charge for Databricks customers. Recommended starting point: 'Get Started with Data Engineering on Databricks' and 'Databricks SQL for Data Analysts'.",
  },
  {
    title: "Databricks Free Edition — Hands-on Practice",
    label: "databricks.com/try-databricks",
    body: "A no-cost personal environment for experimenting with notebooks, SQL, data exploration, Genie, and Lakeflow. Safe to practise in without affecting the production workspace or FINMA data.",
  },
  {
    title: "Recommended Video: Codebasics — End-to-End Databricks Tutorial",
    label: "YouTube · Codebasics channel",
    body: "Beginner-friendly practical walkthrough covering Databricks, Delta Lake, Unity Catalog, Spark, and Genie in a single end-to-end project. Ideal for building a mental model of how the components fit together before working with live data.",
  },
];

const AppendixHeader = ({ letter, title, subtitle }: { letter: string; title: string; subtitle: string }) => (
  <View
    style={{
      backgroundColor: COLORS.navy,
      marginLeft: -48,
      marginRight: -48,
      paddingHorizontal: 48,
      paddingVertical: 14,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    }}
  >
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 3,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: COLORS.orange }}>{letter}</Text>
    </View>
    <View>
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 15, color: COLORS.white }}>{title}</Text>
      <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{subtitle}</Text>
    </View>
  </View>
);

export function AppendixTroubleshooting() {
  return (
    <>
      {/* ── Page 1 ── FAQ */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Appendix G: Troubleshooting & Further Learning" />
        <PageFooter />

        <AppendixHeader
          letter="G"
          title="Appendix G: Troubleshooting & Further Learning"
          subtitle="Common issues and where to go next"
        />

        <SectionTitle color={COLORS.gray500}>Frequently Asked Questions</SectionTitle>

        <View style={{ marginBottom: 8 }}>
          {FAQS.map((faq, i) => (
            <View
              key={i}
              wrap={false}
              style={{
                backgroundColor: COLORS.orangeLight,
                borderLeftWidth: 3,
                borderLeftColor: COLORS.orange,
                borderRadius: 4,
                paddingHorizontal: 12,
                paddingVertical: 9,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: COLORS.navy, marginBottom: 4 }}>
                {"Q: " + faq.q}
              </Text>
              <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5 }}>
                {faq.a}
              </Text>
            </View>
          ))}
        </View>
      </Page>

      {/* ── Page 2 ── Further learning */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Appendix G: Troubleshooting & Further Learning" />
        <PageFooter />

        <SectionTitle color={COLORS.gray500}>Next Steps & Further Learning</SectionTitle>

        <Body>
          {"The resources below are all free and maintained by Databricks. Start with the official documentation for any feature-specific question, and use the Academy or the free environment for structured or hands-on learning."}
        </Body>

        <View style={{ marginBottom: 8 }}>
          {RESOURCES.map((res, i) => (
            <View
              key={i}
              wrap={false}
              style={{
                borderWidth: 1,
                borderColor: COLORS.gray200,
                borderRadius: 4,
                paddingHorizontal: 12,
                paddingVertical: 9,
                marginBottom: 8,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: COLORS.navy, flex: 1 }}>
                  {res.title}
                </Text>
                <Text style={{ fontSize: 7.5, color: COLORS.orange, fontFamily: "Helvetica-Oblique" }}>
                  {res.label}
                </Text>
              </View>
              <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.45 }}>
                {res.body}
              </Text>
            </View>
          ))}
        </View>

        <CalloutBox title="Support">
          {"For workspace access, data permission issues, or pipeline errors: contact your Workspace Admin. For questions about FINMA reporting requirements or source data: contact the FINMA pipeline team. For platform features and usage: start with docs.databricks.com — the search is comprehensive."}
        </CalloutBox>
      </Page>
    </>
  );
}
