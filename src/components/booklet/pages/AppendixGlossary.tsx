import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import { PageHeader, PageFooter, GlossaryEntry } from "../shared";
import { glossaryTerms } from "@/data/glossary";

const CATEGORY_ORDER = ["core", "catalog", "compute", "pipeline", "analytics", "quality"];
const CATEGORY_LABELS: Record<string, string> = {
  core: "Core Concepts",
  catalog: "Catalog & Governance",
  compute: "Compute & Notebooks",
  pipeline: "Pipelines & Orchestration",
  analytics: "Analytics & Reporting",
  quality: "Data Quality & FINMA",
};

export function AppendixGlossary() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: CATEGORY_LABELS[cat],
    terms: glossaryTerms.filter((t) => t.category === cat),
  }));

  return (
    <>
      {grouped.map((group) => (
        <Page key={group.cat} size="A4" style={styles.page}>
          <PageHeader chapter={`Appendix A: Glossary — ${group.label}`} />
          <PageFooter />

          {/* Appendix header (first page only per category) */}
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
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: COLORS.orange }}>
                A
              </Text>
            </View>
            <View>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 15, color: COLORS.white }}>
                Appendix A: Glossary
              </Text>
              <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                {group.label} · {group.terms.length} terms
              </Text>
            </View>
          </View>

          {/* Two-column glossary */}
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {group.terms
                .filter((_, i) => i % 2 === 0)
                .map((term) => (
                  <GlossaryEntry
                    key={term.id}
                    term={term.term}
                    simple={term.simple}
                    analogy={term.analogy}
                    category={term.category}
                  />
                ))}
            </View>
            <View style={styles.column}>
              {group.terms
                .filter((_, i) => i % 2 === 1)
                .map((term) => (
                  <GlossaryEntry
                    key={term.id}
                    term={term.term}
                    simple={term.simple}
                    analogy={term.analogy}
                    category={term.category}
                  />
                ))}
            </View>
          </View>
        </Page>
      ))}
    </>
  );
}
