import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import { PageHeader, PageFooter, SectionTitle, Body, ScreenshotBlock } from "../shared";

const ACCESS_STEPS = [
  {
    num: "1",
    title: "Open the workspace URL",
    detail: "Navigate to: https://adb-2530764091964059.19.azuredatabricks.net/",
  },
  {
    num: "2",
    title: "Click 'Continue with Microsoft Entra ID'",
    detail: "The Azure Databricks login page opens with a single sign-on button.",
  },
  {
    num: "3",
    title: "Select '+ Use another account'",
    detail: "If you are not already signed in with your corporate account, choose this option.",
  },
  {
    num: "4",
    title: "Enter your corporate email and password",
    detail: "Use your Howden Group email address and complete any MFA prompts.",
  },
  {
    num: "5",
    title: "Verify successful login",
    detail: "The Databricks home page loads. Confirm the workspace name (ADB-GDL-GROUPDATA-POC-WE) in the top-right and your user icon showing the correct account.",
  },
];

const ORIENTATION_ITEMS = [
  "Workspace name 'ADB-GDL-GROUPDATA-POC-WE' visible in the top-right selector",
  "User profile icon (top-right) shows your Howden email address",
  "Left navigation shows: Workspace, Recents, Catalog, Jobs & Pipelines, Compute",
  "Catalog tree (left panel) expands to show the 'howden' catalog",
  "Recents panel on the home page lists recently accessed assets",
];

export function AppendixGettingStarted({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Appendix D: Getting Started" />
      <PageFooter />

      {/* Appendix header banner */}
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
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: COLORS.orange }}>D</Text>
        </View>
        <View>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 15, color: COLORS.white }}>
            Appendix D: Getting Started
          </Text>
          <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
            Workspace access, login steps, and orientation checklist
          </Text>
        </View>
      </View>

      <SectionTitle color={COLORS.gray500}>How to Access the Databricks Workspace</SectionTitle>

      <View style={{ marginBottom: 12 }}>
        {ACCESS_STEPS.map((step) => (
          <View
            key={step.num}
            wrap={false}
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 7, marginBottom: 6 }}
          >
            <View
              style={{
                backgroundColor: COLORS.orange,
                width: 20,
                height: 20,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, color: COLORS.white, lineHeight: 1 }}>
                {step.num}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: COLORS.navy, marginBottom: 1 }}>
                {step.title}
              </Text>
              <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.45 }}>
                {step.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <ScreenshotBlock
        src={screenshots["home"]}
        caption="Databricks home after login, left nav, Recents panel, and workspace name (ADB-GDL-GROUPDATA-POC-WE) confirm successful access"
      />

      <SectionTitle color={COLORS.gray500}>Workspace Orientation Checklist</SectionTitle>

      <Body>
        {"Confirm each item after logging in before proceeding to any training exercise or pipeline task."}
      </Body>

      <View
        wrap={false}
        style={{
          backgroundColor: COLORS.navy,
          borderLeftWidth: 4,
          borderLeftColor: COLORS.orange,
          borderRadius: 4,
          paddingHorizontal: 14,
          paddingVertical: 10,
          marginBottom: 10,
        }}
      >
        {ORIENTATION_ITEMS.map((item, i) => (
          <Text key={i} style={{ fontSize: 8.5, color: COLORS.codeGreen, lineHeight: 1.6, marginBottom: 1 }}>
            {"✓  " + item}
          </Text>
        ))}
      </View>
    </Page>
  );
}
