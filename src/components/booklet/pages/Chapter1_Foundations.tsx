import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader, PageFooter, ChapterHeader, SectionTitle, SubTitle,
  Body, CalloutBox, ScreenshotBlock, TwoColumn, Column, SimpleTable, StepList,
} from "../shared";

const UI_AREAS = [
  { num: "I", name: "Top Navigation Bar", desc: "Workspace name (ADB-GDL-GROUPDATA-POC-WE), account switcher, global search (Ctrl+P), notifications, and your user profile icon." },
  { num: "II", name: "Left Navigation Panel", desc: "Primary menu — Workspace, Recents, Catalog, Jobs & Pipelines, Compute, Marketplace, and the SQL section below." },
  { num: "III", name: "SQL Section", desc: "SQL Editor, saved Queries, Dashboards, Genie Spaces, Alerts, Query History, and SQL Warehouses — all SQL-related tools in one group." },
  { num: "IV", name: "Workspace Explorer Panel", desc: "File-tree view of notebooks, folders, repos, and files within your Workspace (Home, Shared with me, Workspace folder, Favorites, Trash)." },
  { num: "V", name: "Main Content Area", desc: "The active notebook, query editor, dashboard, catalog browser — wherever all work happens. This changes depending on what you clicked in the left panel." },
  { num: "VI", name: "Search & Filtering", desc: "Global search bar for finding tables, notebooks, queries, and jobs across the workspace. Also includes filter controls within list views." },
  { num: "VII", name: "Collaboration & Action Controls", desc: "Share, comment, schedule, run, and version controls relevant to the currently open asset. Context-sensitive — different for notebooks vs dashboards." },
];

export function Chapter1_Foundations({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Chapter 1: Foundations" />
      <PageFooter />

      <ChapterHeader
        number="01"
        title="Foundations: Meet the Platform"
        subtitle="Outcome: Navigate the Databricks workspace with confidence"
        color={COLORS.day1}
      />

      <CalloutBox title="Howden Context">
        {"Three types of source data feed the FINMA pipeline: (1) commission exports from five CRMs — BAYO, IBS Alabus, MAX, KETL, and the Vorsorge Partner CRM — uploaded by data stewards; (2) a product type mapping table linking CRM codes to FINMA intermediary product categories; and (3) an insurer name mapping table resolving CRM names to FINMA-registered entity names. Databricks is the shared engine that brings all three together consistently."}
      </CalloutBox>

      {/* Home screenshot */}
      <ScreenshotBlock
        src={screenshots["home"]}
        caption="Welcome to Databricks — the home page shows recently accessed objects (DQX_Dashboard_v1, VorsorgePartnerCommission_nondlt, bronze schema) and suggested items"
        height={148}
      />

      <SectionTitle color={COLORS.day1}>The 7 Areas of the Databricks Workspace UI</SectionTitle>
      <Body>
        {"The Databricks workspace UI is consistently structured across all screens. Understanding where things live eliminates the most common source of confusion for new users."}
      </Body>

      {/* Workspace screenshot */}
      <ScreenshotBlock
        src={screenshots["workspace"]}
        caption="The Databricks Workspace — UI areas I–VII labelled. The left panel (II) and SQL section (II lower) give access to everything."
        height={155}
      />

      {/* 7 areas */}
      <View style={{ gap: 5, marginBottom: 12 }}>
        {UI_AREAS.map((area) => (
          <View
            key={area.num}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 8,
              backgroundColor: COLORS.surface,
              borderRadius: 3,
              padding: 7,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: COLORS.day1,
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, color: COLORS.white }}>
                {area.num}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: COLORS.navy, marginBottom: 1 }}>
                {area.name}
              </Text>
              <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.4 }}>
                {area.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Workspace vs Catalog */}
      <SectionTitle color={COLORS.day1}>Workspace vs Catalog: The Essential Distinction</SectionTitle>
      <TwoColumn>
        <Column>
          <View style={{ backgroundColor: "#EFF6FF", borderRadius: 4, padding: 10, borderWidth: 1, borderColor: "#BFDBFE" }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: "#1E40AF", marginBottom: 5 }}>Workspace</Text>
            <Text style={{ fontSize: 8, color: COLORS.gray500, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>WHERE YOU WRITE CODE</Text>
            <Text style={{ fontSize: 9, color: "#1E3A8A", lineHeight: 1.5, marginBottom: 6 }}>
              {"Your personal and shared development space — notebooks, folders, and files. Think of it as Google Drive for your code and notebooks."}
            </Text>
            {["Notebooks — code cells (SQL/Python/Scala)", "Folders — organise by project or team", "Dashboards — visual displays from queries"].map((item) => (
              <Text key={item} style={{ fontSize: 8.5, color: "#1E3A8A", marginBottom: 2 }}>· {item}</Text>
            ))}
          </View>
        </Column>
        <Column>
          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 4, padding: 10, borderWidth: 1, borderColor: "#BBF7D0" }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: "#065F46", marginBottom: 5 }}>Catalog</Text>
            <Text style={{ fontSize: 8, color: COLORS.gray500, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>WHERE YOU FIND DATA</Text>
            <Text style={{ fontSize: 9, color: "#064E3B", lineHeight: 1.5, marginBottom: 6 }}>
              {"The Unity Catalog — all governed data assets (tables, views, volumes, models) in one place. Three-level hierarchy: Catalog → Schema → Table."}
            </Text>
            {["Catalogs — top-level namespace (howden)", "Schemas — bronze, silver, gold layers", "Tables — actual data rows and columns", "Permissions — who can access what"].map((item) => (
              <Text key={item} style={{ fontSize: 8.5, color: "#064E3B", marginBottom: 2 }}>· {item}</Text>
            ))}
          </View>
        </Column>
      </TwoColumn>

      {/* Catalog screenshot */}
      <ScreenshotBlock
        src={screenshots["catalog"]}
        caption="The Databricks Catalog — suggested tables from howden.gold, with the left tree showing howden catalog containing bronze, gold, silver schemas"
        height={145}
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
          {"Workspace is where you write code. Catalog is where you find data. Your notebooks in Workspace query tables from the Catalog."}
        </Text>
      </View>
    </Page>
  );
}
