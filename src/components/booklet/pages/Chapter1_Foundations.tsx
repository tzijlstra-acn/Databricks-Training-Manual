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
  TwoColumn,
  Column,
} from "../shared";

const UI_AREAS = [
  {
    numeral: "I",
    name: "Top Navigation Bar",
    description:
      "Workspace name (ADB-GDL-GROUPDATA-POC-WE), account switcher, global search (Ctrl+P), notifications, user profile",
  },
  {
    numeral: "II",
    name: "Left Navigation Panel",
    description:
      "Primary menu: Workspace, Recents, Catalog, Jobs & Pipelines, Compute, Marketplace",
  },
  {
    numeral: "III",
    name: "SQL Section",
    description:
      "SQL Editor, saved Queries, Dashboards, Genie Spaces, Alerts, Query History, SQL Warehouses",
  },
  {
    numeral: "IV",
    name: "Workspace Explorer",
    description:
      "File-tree view: Home, Shared with me, Workspace folder, Favorites, Trash — your notebooks and files",
  },
  {
    numeral: "V",
    name: "Main Content Area",
    description:
      "Active notebook, query editor, dashboard, or catalog browser — changes based on left panel selection",
  },
  {
    numeral: "VI",
    name: "Search & Filtering",
    description:
      "Global search (Ctrl+P) for tables, notebooks, queries, and jobs; filter controls within list views",
  },
  {
    numeral: "VII",
    name: "Collaboration Controls",
    description:
      "Share, comment, schedule, run, and version controls — context-sensitive to the currently open asset",
  },
];

export function Chapter1_Foundations({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── Page 1 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 1: Foundations" />
        <PageFooter />

        <ChapterHeader
          number="01"
          title="Foundations: Meet the Platform"
          subtitle="Outcome: Navigate the workspace with confidence from day one"
          color={COLORS.day1}
        />

        <CalloutBox title="Howden Context">
          {"Three data types feed the FINMA pipeline: (1) commission exports from five CRMs — BAYO, IBS Alabus, MAX, KETL, and Vorsorge Partner — uploaded by data stewards; (2) a product type mapping table linking CRM codes to FINMA intermediary categories; (3) an insurer name mapping resolving CRM names to FINMA-registered entities. Databricks is the shared engine that processes all three consistently and on time for the 31 May FINMA deadline."}
        </CalloutBox>

        <SectionTitle color={COLORS.day1}>The 7 Areas of the Databricks Workspace UI</SectionTitle>

        <Body>
          {"The UI is consistently structured across all screens. Knowing these 7 zones eliminates the most common confusion for new users."}
        </Body>

        <View style={{ marginBottom: 10 }}>
          {UI_AREAS.map((area) => (
            <View
              key={area.numeral}
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 7, marginBottom: 5 }}
            >
              <View
                style={{
                  backgroundColor: COLORS.day1,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Helvetica-Bold",
                    fontSize: 8,
                    color: COLORS.white,
                    lineHeight: 1,
                  }}
                >
                  {area.numeral}
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
                  {area.name}
                </Text>
                <Text
                  style={{
                    fontSize: 8.5,
                    color: COLORS.gray700,
                    lineHeight: 1.45,
                  }}
                >
                  {area.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <ScreenshotBlock
          src={screenshots["home"]}
          caption="Databricks home page — recently accessed objects (DQX_Dashboard_v1, VorsorgePartnerCommission_nondlt, bronze schema) and left navigation panel"
        />
      </Page>

      {/* ── Page 2 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 1: Foundations" />
        <PageFooter />

        <ScreenshotBlock
          src={screenshots["workspace"]}
          caption="Workspace UI — left panel (area II) gives access to all platform tools; SQL section below the separator"
        />

        <SectionTitle color={COLORS.day1}>Workspace vs Unity Catalog: The Essential Distinction</SectionTitle>

        <TwoColumn>
          <Column>
            <View
              style={{
                backgroundColor: "#EFF6FF",
                borderWidth: 1,
                borderColor: "#BFDBFE",
                borderRadius: 4,
                padding: 10,
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontSize: 11,
                  color: "#1E40AF",
                  marginBottom: 2,
                }}
              >
                Workspace
              </Text>
              <Text
                style={{
                  fontSize: 7.5,
                  color: COLORS.gray500,
                  marginBottom: 7,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                WHERE YOU WRITE CODE
              </Text>
              {[
                "Notebooks — SQL/Python/Scala code cells",
                "Folders — organise by project or team",
                "Dashboards — visual displays from saved queries",
                "Repos — Git-connected version control",
                "Files — uploaded reference data and configs",
              ].map((b) => (
                <Text
                  key={b}
                  style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5, marginBottom: 2 }}
                >
                  · {b}
                </Text>
              ))}
            </View>
          </Column>
          <Column>
            <View
              style={{
                backgroundColor: "#F0FDF4",
                borderWidth: 1,
                borderColor: "#BBF7D0",
                borderRadius: 4,
                padding: 10,
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontSize: 11,
                  color: "#065F46",
                  marginBottom: 2,
                }}
              >
                Unity Catalog
              </Text>
              <Text
                style={{
                  fontSize: 7.5,
                  color: COLORS.gray500,
                  marginBottom: 7,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                WHERE YOU FIND DATA
              </Text>
              {[
                "Catalogs — top-level namespace: howden",
                "Schemas — bronze, silver, gold, audit",
                "Tables — actual data rows and columns",
                "Volumes — unstructured file storage",
                "Permissions — who can access what, audited",
              ].map((b) => (
                <Text
                  key={b}
                  style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5, marginBottom: 2 }}
                >
                  · {b}
                </Text>
              ))}
            </View>
          </Column>
        </TwoColumn>

        <View
          style={{
            backgroundColor: COLORS.navy,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.orange,
            borderRadius: 4,
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 9.5,
              color: COLORS.white,
              lineHeight: 1.55,
            }}
          >
            {"The golden rule: Workspace is where you write code. Catalog is where you find data. Notebooks in Workspace query tables from the Catalog."}
          </Text>
        </View>

        <SectionTitle color={COLORS.day1}>Recents & Quick Navigation</SectionTitle>

        <Body>
          {"The Recents section on the home page and in the left panel shows your most recently accessed notebooks, tables, dashboards, and queries. Ctrl+P opens global search from anywhere — the fastest way to jump to any asset."}
        </Body>

        <ScreenshotBlock
          src={screenshots["catalog"]}
          caption="Unity Catalog — suggested tables from howden.gold, left tree showing howden catalog with bronze, gold, silver schemas"
        />
      </Page>
    </>
  );
}
