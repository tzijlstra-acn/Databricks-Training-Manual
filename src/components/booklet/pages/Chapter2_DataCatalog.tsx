import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader, PageFooter, ChapterHeader, SectionTitle,
  Body, CalloutBox, ScreenshotBlock, TwoColumn, Column, MedallionDiagram, SimpleTable,
} from "../shared";

const CRM_SOURCES = [
  ["BAYO", "Howden Schweiz AG + SWIBRO AG", "Mixed — must split in Silver", "48,234"],
  ["IBS Alabus", "Howden Schweiz AG", "commission_chf", "31,102"],
  ["MAX CRM", "Howden Broker Services AG", "brokerage_fee", "22,780"],
  ["KETL", "Perennial AG", "comm_amt", "12,506"],
  ["Vorsorge Partner CRM", "Howden Schweiz AG", "fee_earned", "8,914"],
];

const CATALOG_TABLES = [
  ["howden.bronze.bayo_raw", "Raw BAYO export — both entities mixed", "48,234"],
  ["howden.bronze.vp_raw", "Raw Vorsorge Partner CRM export", "8,914"],
  ["howden.silver.commissions_clean", "All 5 CRMs merged, unified field names", "123,536"],
  ["howden.silver.entity_attribution", "BAYO rows resolved to entity", "48,234"],
  ["howden.silver.dq_rejected_records", "Rows failing DQX rules", "142"],
  ["howden.gold.howden_schweiz_commission", "FINMA-ready totals for Howden Schweiz AG", "1"],
  ["howden.gold.swibro_commission", "FINMA-ready totals for SWIBRO AG", "1"],
  ["howden.gold.abacus_reconciliation", "Commission vs Abacus cashflows by entity", "5"],
];

export function Chapter2_DataCatalog({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Chapter 2: Data & Catalog" />
      <PageFooter />

      <ChapterHeader
        number="02"
        title="Data & Catalog"
        subtitle="Outcome: Navigate Unity Catalog and understand Medallion layers"
        color={COLORS.day2}
      />

      <CalloutBox title="Howden Context">
        {"Five CRM systems feed the pipeline — BAYO, IBS Alabus, MAX, KETL, and Vorsorge Partner — each with a different commission field name. BAYO is particularly complex: it contains rows for both Howden Schweiz AG and SWIBRO AG mixed together and must be split before Silver. A product type mapping table and insurer name mapping table also feed in as reference data. All five streams merge into one unified Silver table before reaching five separate FINMA Gold tables — one per legal entity."}
      </CalloutBox>

      <SectionTitle color={COLORS.day2}>The Medallion Architecture</SectionTitle>
      <Body>
        {"Medallion Architecture is the data design pattern underpinning the entire Howden FINMA platform. Data flows through three progressively refined layers before reaching reporting and regulatory submission."}
      </Body>

      <MedallionDiagram />

      <TwoColumn>
        <Column>
          <View style={{ backgroundColor: "#FDF3E7", borderRadius: 4, padding: 9, borderWidth: 1, borderColor: "#E8B86D" }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: "#92400E", marginBottom: 3 }}>BRONZE — Raw / Ingested</Text>
            <Text style={{ fontSize: 8.5, color: "#78350F", lineHeight: 1.45 }}>
              {"Data lands exactly as received from source systems — no modifications. Immutable. Full history preserved. Engineers only. Used for debugging and audit trails."}
            </Text>
          </View>
        </Column>
        <Column>
          <View style={{ backgroundColor: COLORS.gray100, borderRadius: 4, padding: 9, borderWidth: 1, borderColor: COLORS.gray200 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: COLORS.gray700, marginBottom: 3 }}>SILVER — Clean + Transform</Text>
            <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.45 }}>
              {"Cleansed, standardised, and integrated. commission_chf is the single canonical amount field. Entity attribution resolves BAYO rows. DQX rules applied. Analysts and data scientists work here for ML and joins."}
            </Text>
          </View>
        </Column>
      </TwoColumn>
      <View style={{ backgroundColor: COLORS.goldBg, borderRadius: 4, padding: 9, borderWidth: 1, borderColor: "#FCD34D", marginBottom: 10 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: "#92400E", marginBottom: 3 }}>GOLD — FINMA Ready</Text>
        <Text style={{ fontSize: 8.5, color: "#78350F", lineHeight: 1.45 }}>
          {"Aggregated, enriched, and trusted. One Gold table per legal entity, written only after all DQX checks pass. Deadline: 31 May. Powers dashboards, KPIs, and the FINMA intermediary submission. Business users and executives consume Gold directly."}
        </Text>
      </View>

      {/* Source CRMs table */}
      <SectionTitle color={COLORS.day2}>Five Source CRM Systems</SectionTitle>
      <SimpleTable
        headers={["CRM", "Entity", "Commission Field", "Bronze Rows"]}
        rows={CRM_SOURCES}
        colWidths={[1.4, 1.8, 1.2, 0.8]}
      />

      {/* Catalog tree screenshot */}
      <ScreenshotBlock
        src={screenshots["catalog-tree"]}
        caption="Catalog tree view — howden catalog with bronze, gold, and silver schemas highlighted. The gold schema contains the FINMA-ready reporting tables."
        height={145}
      />

      {/* Unity Catalog hierarchy */}
      <SectionTitle color={COLORS.day2}>Unity Catalog: The Howden Data Hierarchy</SectionTitle>
      <Body>
        {"Unity Catalog organises all data assets in a three-level hierarchy: Catalog → Schema → Table. Every table is registered here with permissions, lineage tracking, and governance rules applied automatically."}
      </Body>

      {/* Hierarchy visual */}
      <View style={{ backgroundColor: COLORS.navy, borderRadius: 4, padding: 12, marginBottom: 10 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: COLORS.orange, marginBottom: 8 }}>
          howden  ·  (Catalog)
        </Text>
        {[
          { schema: "bronze", color: "#A0522D", desc: "Raw ingested data from source systems" },
          { schema: "silver", color: "#4B5563", desc: "Cleaned, validated, and standardised data" },
          { schema: "gold", color: "#B45309", desc: "FINMA-ready reporting tables" },
          { schema: "audit", color: "#1E40AF", desc: "DQX run logs and pipeline run metadata" },
        ].map((s) => (
          <View key={s.schema} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
            <View style={{ width: 16, alignItems: "center", paddingTop: 2 }}>
              <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>└</Text>
            </View>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: s.color,
                borderRadius: 3,
                marginRight: 6,
              }}
            >
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: COLORS.white }}>
                {s.schema}
              </Text>
            </View>
            <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,0.65)", flex: 1, paddingTop: 2 }}>
              {s.desc}
            </Text>
          </View>
        ))}
      </View>

      {/* Key tables */}
      <SectionTitle color={COLORS.day2}>Key Tables in the Howden Catalog</SectionTitle>
      <SimpleTable
        headers={["Table (howden.schema.name)", "Description", "Rows"]}
        rows={CATALOG_TABLES}
        colWidths={[2, 2.2, 0.8]}
      />

      {/* BAYO callout */}
      <CalloutBox title="Why BAYO is Special">
        {"BAYO (a shared CRM used by Howden Schweiz AG and SWIBRO AG) delivers a single export with rows for both entities mixed together. The Entity Attribution task in Silver resolves each row to the correct entity using deal-level identifiers. Rows that cannot be attributed go to howden.silver.dq_rejected_records for manual review. Attribution must reach 100% before the Gold table can be written."}
      </CalloutBox>
    </Page>
  );
}
