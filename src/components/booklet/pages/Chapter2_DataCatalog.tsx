import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader, PageFooter, ChapterHeader, SectionTitle,
  CalloutBox, ScreenshotBlock, MedallionDiagram, SimpleTable,
} from "../shared";

const CRM_SOURCES = [
  ["BAYO", "Howden Schweiz AG + SWIBRO AG", "Mixed — split in Silver", "48,234"],
  ["IBS Alabus", "Howden Schweiz AG", "commission_chf", "31,102"],
  ["MAX CRM", "Howden Broker Services AG", "brokerage_fee", "22,780"],
  ["KETL", "Perennial AG", "comm_amt", "12,506"],
  ["Vorsorge Partner", "Howden Schweiz AG", "fee_earned", "8,914"],
];

const CATALOG_TABLES = [
  ["howden.bronze.bayo_raw", "Raw BAYO export — both entities mixed", "48,234"],
  ["howden.silver.commissions_clean", "All 5 CRMs merged, unified fields", "123,536"],
  ["howden.silver.dq_rejected_records", "Rows failing DQX rules", "142"],
  ["howden.gold.howden_schweiz_commission", "FINMA-ready totals, Howden Schweiz AG", "1"],
  ["howden.gold.abacus_reconciliation", "Commission vs Abacus cashflows", "5"],
];

export function Chapter2_DataCatalog({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── PAGE 1 ── ChapterHeader + hero screenshot + 3 key insight cards */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 2: Data & Catalog" />
        <PageFooter />

        <ChapterHeader
          number="02"
          title="Data & Catalog"
          subtitle="Navigate Unity Catalog and understand Medallion layers"
          color={COLORS.day2}
        />

        <ScreenshotBlock
          src={screenshots["catalog-tree"]}
          caption="Unity Catalog tree — howden › bronze, silver, gold schemas with all key tables"
          height={200}
        />

        {/* 3 key insight cards in a row */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
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
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#0891B2", marginBottom: 4 }}>
              3 Medallion Layers
            </Text>
            <Text style={{ fontSize: 8, color: "#164E63", lineHeight: 1.45 }}>
              Bronze (raw), Silver (clean), Gold (FINMA-ready) — data gets better with each layer.
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#FDF3E7",
              borderWidth: 1,
              borderColor: "#D97706",
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#D97706", marginBottom: 4 }}>
              5 CRM Sources
            </Text>
            <Text style={{ fontSize: 8, color: "#78350F", lineHeight: 1.45 }}>
              Each source uses a different commission field name — Silver unifies them all.
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
              BAYO is Split in Silver
            </Text>
            <Text style={{ fontSize: 8, color: "#064E3B", lineHeight: 1.45 }}>
              It contains rows for 2 entities mixed together — Silver resolves each row.
            </Text>
          </View>
        </View>
      </Page>

      {/* ── PAGE 2 ── Medallion diagram, CRM table, catalog tables, callout */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 2: Data & Catalog" />
        <PageFooter />

        <MedallionDiagram />

        <SectionTitle color={COLORS.day2}>Five Source CRMs</SectionTitle>
        <SimpleTable
          headers={["CRM", "Entity", "Commission Field", "Bronze Rows"]}
          rows={CRM_SOURCES}
          colWidths={[1.2, 1.8, 1.2, 0.8]}
        />

        <SectionTitle color={COLORS.day2}>Key Tables in the Howden Catalog</SectionTitle>
        <SimpleTable
          headers={["Table", "What It Contains", "Rows"]}
          rows={CATALOG_TABLES}
          colWidths={[2.2, 2, 0.8]}
        />

        <ScreenshotBlock
          src={screenshots["catalog"]}
          caption="Unity Catalog — howden catalog with bronze, gold, silver schemas"
          height={140}
        />

        <CalloutBox title="BAYO Split">
          {"BAYO contains rows for both Howden Schweiz AG and SWIBRO AG. The Silver pipeline resolves each row to its entity — rows that cannot be attributed go to dq_rejected_records."}
        </CalloutBox>
      </Page>
    </>
  );
}
