import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import { PageHeader, PageFooter } from "../shared";
import { architectureNodes } from "@/data/architecture";

const CATEGORY_COLORS: Record<string, { bg: string; border: string; label: string; text: string }> = {
  platform:      { bg: COLORS.navy,     border: "#4B4F9E", label: "Platform",      text: COLORS.white },
  governance:    { bg: "#ECFEFF",        border: "#22D3EE", label: "Governance",    text: "#164E63" },
  compute:       { bg: "#ECFDF5",        border: "#34D399", label: "Compute",       text: "#064E3B" },
  analytics:     { bg: "#F5F3FF",        border: "#A78BFA", label: "Analytics",     text: "#3B0764" },
  orchestration: { bg: "#FFFBEB",        border: "#FCD34D", label: "Orchestration", text: "#78350F" },
};

export function AppendixArchitecture() {
  const left = architectureNodes.filter((_, i) => i % 2 === 0);
  const right = architectureNodes.filter((_, i) => i % 2 === 1);

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Appendix C: Architecture Reference" />
      <PageFooter />

      {/* Header */}
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
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: COLORS.orange }}>C</Text>
        </View>
        <View>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 15, color: COLORS.white }}>
            Appendix C: Architecture Reference
          </Text>
          <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
            11 platform components and their roles in the Databricks architecture
          </Text>
        </View>
      </View>

      {/* Category legend */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
        {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
          <View
            key={key}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: val.bg,
              borderWidth: 1,
              borderColor: val.border,
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: val.border }} />
            <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: val.text }}>
              {val.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Two-column node cards */}
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          {left.map((node) => {
            const cfg = CATEGORY_COLORS[node.category] ?? CATEGORY_COLORS.platform;
            return (
              <View
                key={node.id}
                style={{
                  backgroundColor: cfg.bg,
                  borderWidth: 1.5,
                  borderColor: cfg.border,
                  borderRadius: 5,
                  padding: 9,
                  marginBottom: 7,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: cfg.text, flex: 1 }}>
                    {node.label}
                  </Text>
                  <View style={{ backgroundColor: cfg.border + "60", borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1 }}>
                    <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: cfg.text }}>
                      {cfg.label.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 8, color: cfg.text, lineHeight: 1.45, opacity: 0.85 }}>
                  {node.description}
                </Text>
                {node.usedFor.length > 0 && (
                  <View style={{ marginTop: 5 }}>
                    {node.usedFor.map((u) => (
                      <Text key={u} style={{ fontSize: 7.5, color: cfg.text, opacity: 0.75, marginBottom: 1 }}>
                        · {u}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.column}>
          {right.map((node) => {
            const cfg = CATEGORY_COLORS[node.category] ?? CATEGORY_COLORS.platform;
            return (
              <View
                key={node.id}
                style={{
                  backgroundColor: cfg.bg,
                  borderWidth: 1.5,
                  borderColor: cfg.border,
                  borderRadius: 5,
                  padding: 9,
                  marginBottom: 7,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: cfg.text, flex: 1 }}>
                    {node.label}
                  </Text>
                  <View style={{ backgroundColor: cfg.border + "60", borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1 }}>
                    <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: cfg.text }}>
                      {cfg.label.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 8, color: cfg.text, lineHeight: 1.45, opacity: 0.85 }}>
                  {node.description}
                </Text>
                {node.usedFor.length > 0 && (
                  <View style={{ marginTop: 5 }}>
                    {node.usedFor.map((u) => (
                      <Text key={u} style={{ fontSize: 7.5, color: cfg.text, opacity: 0.75, marginBottom: 1 }}>
                        · {u}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Connection summary */}
      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 4,
          padding: 10,
          borderWidth: 1,
          borderColor: COLORS.gray200,
          marginTop: 4,
        }}
      >
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: COLORS.navy, marginBottom: 4 }}>
          How the components connect (key flows)
        </Text>
        {[
          "Workspace → Notebooks, Compute, Catalog, Jobs",
          "Unity Catalog → Notebooks, SQL Editor, Genie AI, Dashboards",
          "Compute → Notebooks, Jobs, DLT Pipelines",
          "SQL Warehouse → SQL Editor, Dashboards, Genie AI",
          "Jobs & Workflows → DLT Pipelines, Alerts",
          "Dashboards → Alerts",
        ].map((flow) => (
          <Text key={flow} style={{ fontSize: 8, color: COLORS.gray700, marginBottom: 2 }}>
            · {flow}
          </Text>
        ))}
      </View>
    </Page>
  );
}
