import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import { PageHeader, PageFooter, ScreenshotBlock, MedallionDiagram } from "../shared";

const AGENDA = [
  {
    day: "01",
    title: "Foundations",
    color: COLORS.day1,
    bg: "#EFF6FF",
    items: ["Platform orientation", "7 workspace UI areas", "Workspace vs Catalog"],
  },
  {
    day: "02",
    title: "Data & Catalog",
    color: COLORS.day2,
    bg: "#ECFEFF",
    items: ["Medallion Architecture", "Unity Catalog", "5 source CRMs"],
  },
  {
    day: "03",
    title: "Develop & Query",
    color: COLORS.day3,
    bg: "#ECFDF5",
    items: ["Notebooks & SQL Editor", "Compute types", "Query Gold tables"],
  },
  {
    day: "04",
    title: "Automate & Monitor",
    color: COLORS.day4,
    bg: "#FFFBEB",
    items: ["Databricks Jobs", "DQX data quality", "6-step Alerts"],
  },
  {
    day: "05",
    title: "Analyze & Apply",
    color: COLORS.day5,
    bg: "#F5F3FF",
    items: ["Genie AI Spaces", "Lakeview Dashboards", "End-to-end FINMA flow"],
  },
];

const ENTITIES = [
  { name: "Howden Schweiz AG", crm: "BAYO + IBS Alabus" },
  { name: "SWIBRO AG", crm: "BAYO (split in Silver)" },
  { name: "Howden Broker Services AG", crm: "MAX CRM" },
  { name: "Perennial AG", crm: "KETL" },
  { name: "KETL AG", crm: "Vorsorge Partner CRM" },
];

export function IntroPage({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Introduction" />
      <PageFooter />

      {/* Title */}
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 22, color: COLORS.navy, marginBottom: 3 }}>
          Introduction
        </Text>
        <Text style={{ fontSize: 9.5, color: COLORS.gray500 }}>
          Platform overview · FINMA context · 5-day agenda
        </Text>
      </View>

      {/* Home screenshot */}
      <ScreenshotBlock
        src={screenshots["home"]}
        caption="The Databricks home page — recently accessed objects, suggested items, and navigation"
      />

      {/* What + why — very brief */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
        <View style={{ flex: 1, backgroundColor: COLORS.surface, borderRadius: 4, padding: 10, borderWidth: 1, borderColor: COLORS.gray200 }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: COLORS.navy, marginBottom: 4 }}>What is Databricks?</Text>
          <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5 }}>
            A unified data + AI platform on Azure. Brings storage, compute, governance, and analytics into one workspace.
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#FFF3E8", borderRadius: 4, padding: 10, borderWidth: 1, borderColor: "#F47920" }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: "#78350F", marginBottom: 4 }}>Why Howden uses it</Text>
          <Text style={{ fontSize: 8.5, color: "#78350F", lineHeight: 1.5 }}>
            FINMA Art. 190b ISO requires annual commission reports per entity by 31 May. Databricks automates the full pipeline — from raw CRM export to validated FINMA submission.
          </Text>
        </View>
      </View>

      {/* The 5 entities */}
      <View style={{ backgroundColor: COLORS.navy, borderRadius: 5, padding: 12, marginBottom: 14 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: COLORS.orange, marginBottom: 8 }}>
          5 Howden Entities — 5 FINMA Submissions
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {ENTITIES.map((e) => (
            <View
              key={e.name}
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 5,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.15)",
                flex: 1,
                minWidth: 130,
              }}
            >
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, color: COLORS.white, marginBottom: 2 }}>{e.name}</Text>
              <Text style={{ fontSize: 7.5, color: "rgba(255,255,255,0.55)" }}>{e.crm}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Medallion */}
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10.5, color: COLORS.navy, marginBottom: 6 }}>
        The Medallion Architecture
      </Text>
      <MedallionDiagram />

      {/* 5-Day Agenda */}
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10.5, color: COLORS.navy, marginBottom: 8 }}>
        5-Day Training Agenda
      </Text>
      <View style={{ flexDirection: "row", gap: 5 }}>
        {AGENDA.map((day) => (
          <View
            key={day.day}
            style={{
              flex: 1,
              backgroundColor: day.bg,
              borderRadius: 5,
              borderTopWidth: 3,
              borderTopColor: day.color,
              padding: 8,
            }}
          >
            <View
              style={{
                backgroundColor: day.color,
                borderRadius: 10,
                width: 22,
                height: 22,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, color: COLORS.white }}>{day.day}</Text>
            </View>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: COLORS.navy, marginBottom: 4 }}>{day.title}</Text>
            {day.items.map((item) => (
              <Text key={item} style={{ fontSize: 7.5, color: COLORS.gray700, marginBottom: 2 }}>
                · {item}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  );
}
