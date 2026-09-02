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
  MedallionDiagram,
  SimpleTable,
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

const SCHEMAS: Array<{
  name: string;
  color: string;
  description: string;
}> = [
  { name: "bronze", color: "#A0522D", description: "Raw ingested data from source systems — immutable" },
  { name: "silver", color: "#4B5563", description: "Cleaned, validated, integrated data — DQX applied" },
  { name: "gold",   color: "#B45309", description: "FINMA-ready aggregated reporting tables" },
  { name: "audit",  color: "#1E40AF", description: "DQX run logs and pipeline execution metadata" },
];

export function Chapter2_DataCatalog({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <>
      {/* ── Page 1 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 2: Data & Catalog" />
        <PageFooter />

        <ChapterHeader
          number="02"
          title="Data & Catalog"
          subtitle="Outcome: Navigate Unity Catalog and understand how data flows through Medallion layers"
          color={COLORS.day2}
        />

        <SectionTitle color={COLORS.day2}>The Medallion Architecture</SectionTitle>

        <Body>
          {"All data follows a three-layer pattern that progressively refines raw data into trusted, FINMA-ready datasets. Nothing in Gold exists unless every upstream check passed."}
        </Body>

        <MedallionDiagram />

        {/* Three description boxes in a row */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          {/* Bronze */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#FDF3E7",
              borderWidth: 1,
              borderColor: "#E8B86D",
              borderRadius: 4,
              padding: 9,
            }}
          >
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                fontSize: 8.5,
                color: "#92400E",
                marginBottom: 4,
              }}
            >
              BRONZE — Raw / Ingested
            </Text>
            <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5 }}>
              {"Data lands exactly as received. Immutable — no modifications allowed. Full history preserved. Debugging and audit use only. Engineers access only."}
            </Text>
          </View>

          {/* Silver */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#F3F4F6",
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 4,
              padding: 9,
            }}
          >
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                fontSize: 8.5,
                color: "#374151",
                marginBottom: 4,
              }}
            >
              SILVER — Cleaned + Validated
            </Text>
            <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5 }}>
              {"Standardised commission_chf field. Entity attribution for BAYO split. DQX quality rules applied. Rejected rows quarantined. Analysts and data scientists work here."}
            </Text>
          </View>

          {/* Gold */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFBEB",
              borderWidth: 1,
              borderColor: "#FCD34D",
              borderRadius: 4,
              padding: 9,
            }}
          >
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                fontSize: 8.5,
                color: "#92400E",
                marginBottom: 4,
              }}
            >
              GOLD — FINMA Ready
            </Text>
            <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5 }}>
              {"One table per legal entity. Written only after all DQX checks pass. Powers dashboards, Genie AI, and FINMA submission by 31 May deadline."}
            </Text>
          </View>
        </View>

        <ScreenshotBlock
          src={screenshots["catalog-tree"]}
          caption="Catalog tree — howden catalog with bronze, gold, silver schemas expanded showing commission tables"
        />

        <SectionTitle color={COLORS.day2}>Five Source CRM Systems</SectionTitle>

        <SimpleTable
          headers={["CRM System", "Howden Entity", "Commission Field in Source", "Bronze Row Count"]}
          rows={CRM_SOURCES}
          colWidths={[1.4, 1.8, 1.2, 0.6]}
        />
      </Page>

      {/* ── Page 2 ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Chapter 2: Data & Catalog" />
        <PageFooter />

        <SectionTitle color={COLORS.day2}>Unity Catalog: The Howden Data Hierarchy</SectionTitle>

        <Body>
          {"Unity Catalog organises every data asset — tables, volumes, models, functions — in a three-level hierarchy with permissions, lineage tracking, and governance applied automatically."}
        </Body>

        {/* Navy catalog hierarchy block */}
        <View
          style={{
            backgroundColor: COLORS.navy,
            borderRadius: 5,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Helvetica-Bold",
              fontSize: 11,
              color: COLORS.orange,
              marginBottom: 10,
            }}
          >
            howden  ·  Catalog
          </Text>

          {SCHEMAS.map((schema) => (
            <View
              key={schema.name}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 7,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "Helvetica",
                  width: 14,
                  flexShrink: 0,
                }}
              >
                └
              </Text>
              <View
                style={{
                  backgroundColor: schema.color,
                  borderRadius: 3,
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Helvetica-Bold",
                    fontSize: 8,
                    color: COLORS.white,
                  }}
                >
                  {schema.name}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 8.5,
                  color: "rgba(255,255,255,0.65)",
                  flex: 1,
                  lineHeight: 1.45,
                }}
              >
                {schema.description}
              </Text>
            </View>
          ))}
        </View>

        <SectionTitle color={COLORS.day2}>Key Tables in the Howden Catalog</SectionTitle>

        <SimpleTable
          headers={["Table (catalog.schema.name)", "What It Contains", "Rows"]}
          rows={CATALOG_TABLES}
          colWidths={[2.2, 2.2, 0.6]}
        />

        <CalloutBox title="Why BAYO is Special">
          {"BAYO (shared by Howden Schweiz AG and SWIBRO AG) delivers one file with rows for both entities mixed. The entity_attribution Silver task resolves each BAYO row using deal-level identifiers — rows that cannot be attributed go to dq_rejected_records for manual review. Attribution must reach 100% before Gold can be written."}
        </CalloutBox>

        <ScreenshotBlock
          src={screenshots["catalog"]}
          caption="Unity Catalog suggested tables view — Gold tables ready for querying and dashboard use"
        />
      </Page>
    </>
  );
}
