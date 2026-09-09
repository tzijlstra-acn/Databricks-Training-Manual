import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import { PageHeader, PageFooter, SectionTitle, Body } from "../shared";

const BEST_PRACTICES_P1 = [
  {
    num: "1",
    title: "Use the provided Excel template",
    detail: "Always use the approved FINMA input template. Do not change sheet names, column names, or structure, the pipeline reads exact headers.",
  },
  {
    num: "2",
    title: "Follow the file naming convention",
    detail: "Use the consistent format (e.g., Commissions_2026.xlsx). The reporting year in the file name must match the data it contains.",
  },
  {
    num: "3",
    title: "Do not modify column headers",
    detail: "Header names must remain exactly as defined. Avoid spaces, special characters, or spelling changes, any deviation breaks ingestion.",
  },
  {
    num: "4",
    title: "Ensure all mandatory fields are populated",
    detail: "Policy Number, Client, Insurer, Product/Branch, Dates, and Amounts must not be blank. Rows with missing mandatory fields are rejected at validation.",
  },
  {
    num: "5",
    title: "Maintain consistent data formats",
    detail: "Dates must use the required format. Monetary values must be numeric, no CHF symbol, no text mixed into numeric columns.",
  },
  {
    num: "6",
    title: "Check for duplicate records",
    detail: "Review for repeated policy numbers and commission records before uploading. Duplicates cause double-counting in the generated FINMA report.",
  },
  {
    num: "7",
    title: "Keep mapping information up to date",
    detail: "Review Product and Insurer mappings at the start of each reporting year. Add new products or insurers before generating the report.",
  },
];

const BEST_PRACTICES_P2 = [
  {
    num: "8",
    title: "Upload complete data for the reporting period",
    detail: "All required source files must be included. Avoid partial uploads, missing files will leave gaps in the FINMA output.",
  },
  {
    num: "9",
    title: "Do not manually modify processed output data",
    detail: "Make corrections in the source files and re-upload. Do not edit the generated FINMA report directly, it will be overwritten on the next run.",
  },
  {
    num: "10",
    title: "Review validation results before generating the final report",
    detail: "Check the DQX data-quality summary after upload. Correct rejected records and reprocess before triggering final report generation.",
  },
  {
    num: "11",
    title: "Maintain the original source files",
    detail: "Keep an exact copy of each uploaded file for traceability. Auditors and regulators may request the originals.",
  },
  {
    num: "12",
    title: "Use the correct reporting year",
    detail: "Verify the selected reporting year and all uploaded files are consistent before starting the process. Year mismatches are not caught until report generation.",
  },
];

const UPLOAD_CHECKLIST = [
  "Excel template is the approved FINMA version, sheet and column names unchanged",
  "File name follows the convention and matches the reporting year in the data",
  "All mandatory fields populated: Policy Number, Client, Insurer, Product/Branch, Dates, Amounts",
  "Date columns use the required format; monetary columns are numeric only",
  "No duplicate policy or commission records",
  "Product and Insurer mappings reviewed and updated for this reporting year",
  "All required source files for the period are included, no partial upload",
  "DQX validation run and all rejected records corrected before final report",
  "Original source files saved and accessible for audit purposes",
  "Reporting year selection matches all uploaded files",
  "No manual edits to pipeline-generated output files",
  "A second reviewer has signed off on the data before upload",
];

const AppendixHeader = ({ letter, title, subtitle }: { letter: string; title: string; subtitle: string }) => (
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
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: COLORS.orange }}>{letter}</Text>
    </View>
    <View>
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 15, color: COLORS.white }}>{title}</Text>
      <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{subtitle}</Text>
    </View>
  </View>
);

function NumberedItem({ num, title, detail }: { num: string; title: string; detail: string }) {
  return (
    <View
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
          {num}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: COLORS.navy, marginBottom: 1 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.45 }}>
          {detail}
        </Text>
      </View>
    </View>
  );
}

export function AppendixBestPractices() {
  return (
    <>
      {/* ── Page 1 ── Best practices 1-7 */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Appendix F: Best Practices for FINMA Data" />
        <PageFooter />

        <AppendixHeader
          letter="F"
          title="Appendix F: Best Practices for FINMA Data"
          subtitle="12 practices and an upload checklist for clean, audit-ready reporting"
        />

        <Body>
          {"Follow these practices every time you prepare and upload FINMA source data. Most data quality failures trace back to avoidable formatting or preparation errors caught by the DQX validation layer."}
        </Body>

        <SectionTitle color={COLORS.gray500}>12 Best Practices for FINMA Data</SectionTitle>

        <View style={{ marginBottom: 4 }}>
          {BEST_PRACTICES_P1.map((item) => (
            <NumberedItem key={item.num} {...item} />
          ))}
        </View>
      </Page>

      {/* ── Page 2 ── Best practices 8-12 + upload checklist */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Appendix F: Best Practices for FINMA Data" />
        <PageFooter />

        <View style={{ marginBottom: 10 }}>
          {BEST_PRACTICES_P2.map((item) => (
            <NumberedItem key={item.num} {...item} />
          ))}
        </View>

        <SectionTitle color={COLORS.gray500}>Before Uploading, Checklist</SectionTitle>

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
          {UPLOAD_CHECKLIST.map((item, i) => (
            <Text key={i} style={{ fontSize: 8.5, color: COLORS.codeGreen, lineHeight: 1.6, marginBottom: 1 }}>
              {"✓  " + item}
            </Text>
          ))}
        </View>
      </Page>
    </>
  );
}
