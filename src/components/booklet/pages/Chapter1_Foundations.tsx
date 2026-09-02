import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader, PageFooter, ChapterHeader, SectionTitle,
  ScreenshotBlock, TwoColumn, Column, SimpleTable,
} from "../shared";

const UI_AREA_ROWS = [
  ["I – Top Nav", "Workspace name, global search (Ctrl+P), account switcher"],
  ["II – Left Panel", "Primary menu: Workspace, Catalog, Jobs, Compute, SQL tools"],
  ["III – SQL Section", "SQL Editor, Queries, Dashboards, Genie Spaces, Alerts"],
  ["IV – Workspace Explorer", "Notebook/folder file-tree: Home, Shared, Favorites, Trash"],
  ["V – Main Content", "Active notebook, query, dashboard — changes with selection"],
  ["VI – Search & Filter", "Cross-workspace search for tables, notebooks, queries, jobs"],
  ["VII – Action Controls", "Share, schedule, run — context-sensitive per asset type"],
];

export function Chapter1_Foundations({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── PAGE 1 ── ChapterHeader + hero screenshot + 3 key insight cards */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 1: Foundations" />
        <PageFooter />

        <ChapterHeader
          number="01"
          title="Foundations: Meet the Platform"
          subtitle="Navigate the workspace with confidence"
          color={COLORS.day1}
        />

        <ScreenshotBlock
          src={screenshots["home"]}
          caption="Databricks home page — recently opened objects and navigation panel"
          height={220}
        />

        {/* 3 key insight cards in a row */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#EFF6FF",
              borderWidth: 1,
              borderColor: "#1E40AF",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#1E40AF", marginBottom: 4 }}>
              7 UI Areas
            </Text>
            <Text style={{ fontSize: 8, color: "#1E3A8A", lineHeight: 1.45 }}>
              Everything in the workspace maps to one of seven fixed zones.
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
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#059669", marginBottom: 4 }}>
              Workspace = code, Catalog = data
            </Text>
            <Text style={{ fontSize: 8, color: "#064E3B", lineHeight: 1.45 }}>
              Never confuse the two — one is where you write, the other is where you find data.
            </Text>
          </View>

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
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#D97706", marginBottom: 4 }}>
              Unity Catalog
            </Text>
            <Text style={{ fontSize: 8, color: "#78350F", lineHeight: 1.45 }}>
              Governs all tables, permissions, and lineage in one place.
            </Text>
          </View>
        </View>
      </Page>

      {/* ── PAGE 2 ── Tables, diagrams, smaller screenshot, golden rule */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 1: Foundations" />
        <PageFooter />

        <SectionTitle color={COLORS.day1}>The 7 Workspace UI Areas</SectionTitle>
        <SimpleTable
          headers={["Area", "What It Is"]}
          rows={UI_AREA_ROWS}
          colWidths={[1.2, 3]}
        />

        <ScreenshotBlock
          src={screenshots["workspace"]}
          caption="Workspace UI — left panel (II) gives access to all platform tools"
          height={160}
        />

        <SectionTitle color={COLORS.day1}>Workspace vs Unity Catalog</SectionTitle>
        <TwoColumn>
          <Column>
            <View style={{ backgroundColor: "#EFF6FF", borderRadius: 4, padding: 10, borderWidth: 1, borderColor: "#BFDBFE" }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: "#1E40AF", marginBottom: 5 }}>Workspace</Text>
              <Text style={{ fontSize: 8, color: COLORS.gray500, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>WHERE YOU WRITE CODE</Text>
              {["Notebooks — code cells (SQL/Python/Scala)", "Folders — organise by project or team", "Dashboards — visual displays from queries"].map((item) => (
                <Text key={item} style={{ fontSize: 8.5, color: "#1E3A8A", marginBottom: 2 }}>· {item}</Text>
              ))}
            </View>
          </Column>
          <Column>
            <View style={{ backgroundColor: "#F0FDF4", borderRadius: 4, padding: 10, borderWidth: 1, borderColor: "#BBF7D0" }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: "#065F46", marginBottom: 5 }}>Catalog</Text>
              <Text style={{ fontSize: 8, color: COLORS.gray500, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>WHERE YOU FIND DATA</Text>
              {["Catalogs — top-level namespace (howden)", "Schemas — bronze, silver, gold layers", "Tables — actual data rows and columns"].map((item) => (
                <Text key={item} style={{ fontSize: 8.5, color: "#064E3B", marginBottom: 2 }}>· {item}</Text>
              ))}
            </View>
          </Column>
        </TwoColumn>

        <ScreenshotBlock
          src={screenshots["catalog"]}
          caption="Unity Catalog — howden catalog with bronze, gold, silver schemas"
          height={140}
        />

        {/* Golden rule */}
        <View
          style={{
            backgroundColor: COLORS.navy,
            borderRadius: 4,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View style={{ width: 3, height: 30, backgroundColor: COLORS.orange, borderRadius: 2 }} />
          <Text style={{ fontSize: 9.5, color: COLORS.white, flex: 1, lineHeight: 1.5 }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>The golden rule: </Text>
            {"Workspace = where you write code. Catalog = where you find data."}
          </Text>
        </View>
      </Page>
    </>
  );
}
