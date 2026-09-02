import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import { PageHeader, PageFooter } from "../shared";
import { workspaceSidebarItems } from "@/data/platformComponents";

export function AppendixPlatformRef() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader chapter="Appendix B: Platform Quick Reference" />
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
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: COLORS.orange }}>B</Text>
        </View>
        <View>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 15, color: COLORS.white }}>
            Appendix B: Platform Quick Reference
          </Text>
          <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
            All 16 workspace components — when to use them and who uses them
          </Text>
        </View>
      </View>

      {/* Table header */}
      <View style={[styles.tableHeader, { marginBottom: 2 }]}>
        <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Component</Text>
        <Text style={[styles.tableHeaderCell, { flex: 2.2 }]}>What It Does</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.8 }]}>When to Use It</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Who Uses It</Text>
      </View>

      {workspaceSidebarItems.map((item, i) => (
        <View
          key={item.id}
          style={[
            styles.tableRow,
            i % 2 === 1 ? styles.tableRowAlt : {},
            {
              borderLeftWidth: 2,
              borderLeftColor: item.color,
            },
          ]}
        >
          <Text style={[styles.tableCellBold, { flex: 1.2, fontSize: 8 }]}>{item.label}</Text>
          <Text style={[styles.tableCell, { flex: 2.2, fontSize: 8 }]}>
            {/* Strip long parenthetical Howden-specific detail for conciseness */}
            {item.description.length > 140
              ? item.description.substring(0, 137) + "…"
              : item.description}
          </Text>
          <Text style={[styles.tableCell, { flex: 1.8, fontSize: 8 }]}>{item.whenToUse}</Text>
          <Text style={[styles.tableCell, { flex: 1, fontSize: 8 }]}>{item.whoUses}</Text>
        </View>
      ))}

      {/* Footer note */}
      <View
        style={{
          marginTop: 14,
          padding: 10,
          backgroundColor: COLORS.orangeLight,
          borderRadius: 4,
          borderLeftWidth: 3,
          borderLeftColor: COLORS.orange,
        }}
      >
        <Text style={{ fontSize: 8.5, color: "#78350F", lineHeight: 1.5 }}>
          {"Howden-specific items: The cluster is adb-cluster-howden-switzerland-groupdatapoc-we (Runtime 17.3). Jobs: VorsorgePartnerCommission_nondlt, VP_kundenliste_nondlt, VP_nondlt. Genie Spaces: VP_Space, IBS_Space, Max_Genie, Perennial_KETL_Space. Dashboards: DQX_Dashboard_v1, Howden VP Dashboard."}
        </Text>
      </View>
    </Page>
  );
}
