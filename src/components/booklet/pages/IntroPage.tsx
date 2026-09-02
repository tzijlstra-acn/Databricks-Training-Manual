import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import { PageHeader, PageFooter, CalloutBox, SectionTitle, Body, ScreenshotBlock, TwoColumn, Column, MedallionDiagram } from "../shared";

export function IntroPage({ screenshots }: { screenshots: Record<string, string> }) {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Introduction" />
      <PageFooter />

      {/* Title */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 20, color: COLORS.navy, marginBottom: 4 }}>
          Introduction
        </Text>
        <Text style={{ fontSize: 10, color: COLORS.gray500 }}>
          Platform overview · FINMA context · How to use this booklet
        </Text>
      </View>

      {/* What is Databricks */}
      <SectionTitle>What is Databricks?</SectionTitle>
      <Body>
        Databricks is a unified data and AI platform built on Apache Spark, running on Azure cloud infrastructure. It brings together data storage, compute, governance, and analytics into a single workspace — removing the need to manage multiple separate tools for ingestion, transformation, reporting, and machine learning.
      </Body>
      <Body>
        At Howden, Databricks serves as the central engine for the FINMA Commission Reporting pipeline: raw commission data from five CRM systems flows in, is validated and transformed, and emerges as a FINMA-ready Gold dataset ready for regulatory submission by 31 May each year.
      </Body>

      {/* FINMA context */}
      <CalloutBox title="The Howden FINMA Context">
        {"FINMA Article 190b ISO requires Swiss insurance intermediaries to submit annual commission reports per legal entity by 31 May. Howden Switzerland operates five entities: Howden Schweiz AG, SWIBRO AG, Howden Broker Services AG, Perennial AG, and KETL AG. Each entity's commission data is extracted from a different CRM, processed through Databricks, validated against Abacus cashflows, and submitted separately."}
      </CalloutBox>

      {/* Home screenshot */}
      <ScreenshotBlock
        src={screenshots["home"]}
        caption="The Databricks home page — recently accessed objects, suggested items, and the left navigation panel"
        height={155}
      />

      {/* Medallion */}
      <SectionTitle>The Medallion Architecture</SectionTitle>
      <Body>
        {"All data in this platform follows the Medallion Architecture: a three-layer pattern that progressively refines raw data into trusted, business-ready datasets."}
      </Body>
      <MedallionDiagram />

      {/* How to use */}
      <SectionTitle>How to Use This Booklet</SectionTitle>
      <TwoColumn>
        <Column>
          <View style={{ backgroundColor: COLORS.surface, borderRadius: 4, padding: 10, borderWidth: 1, borderColor: COLORS.gray200 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: COLORS.navy, marginBottom: 5 }}>For New Learners</Text>
            <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5 }}>
              {"Read chapters 1–5 in order. Each chapter builds on the previous one and follows the flow of the actual FINMA pipeline: from ingesting raw data (Day 1–2) to automating and monitoring it (Day 4) to presenting insights (Day 5)."}
            </Text>
          </View>
        </Column>
        <Column>
          <View style={{ backgroundColor: COLORS.surface, borderRadius: 4, padding: 10, borderWidth: 1, borderColor: COLORS.gray200 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: COLORS.navy, marginBottom: 5 }}>As a Reference</Text>
            <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5 }}>
              {"Use Appendix A (Glossary) when you encounter an unfamiliar term. Appendix B (Quick Reference) tells you which Databricks component to open for a given task. Appendix C shows how all platform components connect."}
            </Text>
          </View>
        </Column>
      </TwoColumn>
    </Page>
  );
}
