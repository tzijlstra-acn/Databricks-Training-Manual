import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";

const TOC_ENTRIES = [
  { num: "—", title: "Introduction", sub: "Platform overview, FINMA context", color: COLORS.navy, page: 3 },
  { num: "01", title: "Foundations: Meet the Platform", sub: "Workspace UI, navigation, Workspace vs Catalog", color: COLORS.day1, page: 4 },
  { num: "02", title: "Data & Catalog", sub: "Medallion Architecture, Unity Catalog, Howden data structure", color: COLORS.day2, page: 7 },
  { num: "03", title: "Develop & Query", sub: "Notebooks, SQL Editor, Compute types", color: COLORS.day3, page: 11 },
  { num: "04", title: "Automate & Monitor", sub: "Jobs, DQX pipeline, Alerts, monitoring", color: COLORS.day4, page: 14 },
  { num: "05", title: "Analyze & Apply", sub: "Dashboards, Genie AI Spaces, end-to-end flow", color: COLORS.day5, page: 18 },
  { num: "A", title: "Appendix A: Glossary", sub: "32 key terms with plain-English definitions and analogies", color: COLORS.gray500, page: 21 },
  { num: "B", title: "Appendix B: Platform Quick Reference", sub: "All 16 workspace components — when to use & who uses them", color: COLORS.gray500, page: 27 },
  { num: "C", title: "Appendix C: Architecture Reference", sub: "11 platform components and their connections", color: COLORS.gray500, page: 30 },
];

export function TocPage() {
  return (
    <Page size="A4" style={[styles.page, { paddingTop: 48 }]}>
      {/* Header */}
      <View
        style={{
          backgroundColor: COLORS.navy,
          marginLeft: -48,
          marginRight: -48,
          paddingHorizontal: 48,
          paddingVertical: 16,
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 18,
            color: COLORS.white,
          }}
        >
          Contents
        </Text>
        <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
          Databricks Training Booklet · Howden FINMA Platform
        </Text>
      </View>

      {/* Entries */}
      <View style={{ gap: 4 }}>
        {TOC_ENTRIES.map((entry) => (
          <View
            key={entry.num}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 9,
              paddingHorizontal: 10,
              borderRadius: 4,
              backgroundColor: COLORS.surface,
              borderLeftWidth: 3,
              borderLeftColor: entry.color,
              gap: 12,
            }}
          >
            {/* Number circle */}
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: entry.color,
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontSize: entry.num === "—" ? 12 : 9,
                  color: COLORS.white,
                }}
              >
                {entry.num}
              </Text>
            </View>

            {/* Title and subtitle */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontSize: 10.5,
                  color: COLORS.navy,
                }}
              >
                {entry.title}
              </Text>
              <Text style={{ fontSize: 8.5, color: COLORS.gray500, marginTop: 1 }}>
                {entry.sub}
              </Text>
            </View>

            {/* Dots + page number */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 8, color: COLORS.gray200, letterSpacing: 1 }}>
                ............
              </Text>
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontSize: 10,
                  color: entry.color,
                  minWidth: 20,
                  textAlign: "right",
                }}
              >
                {entry.page}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Note */}
      <View
        style={{
          marginTop: 24,
          padding: 12,
          backgroundColor: COLORS.orangeLight,
          borderRadius: 4,
          borderLeftWidth: 3,
          borderLeftColor: COLORS.orange,
        }}
      >
        <Text style={{ fontSize: 8.5, color: "#78350F", lineHeight: 1.5 }}>
          This booklet summarises the 5-day Databricks training delivered on the Howden FINMA Commission Reporting project. Page numbers are approximate — actual positions may vary slightly based on content flow. All Howden-specific details (job names, catalog structure, Genie Spaces) reflect the live Azure Databricks environment.
        </Text>
      </View>
    </Page>
  );
}
