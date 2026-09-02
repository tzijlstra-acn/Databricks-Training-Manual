import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS } from "../styles";

export function CoverPage() {
  return (
    <Page
      size="A4"
      style={{
        backgroundColor: COLORS.navy,
        padding: 0,
        fontFamily: "Helvetica",
      }}
    >
      {/* Top accent stripe */}
      <View style={{ height: 6, backgroundColor: COLORS.orange }} />

      {/* Main content */}
      <View style={{ flex: 1, paddingHorizontal: 56, paddingTop: 70 }}>
        {/* Badge */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 4,
            alignSelf: "flex-start",
            marginBottom: 28,
          }}
        >
          <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontFamily: "Helvetica" }}>
            HOWDEN GROUP · ACCENTURE · 2026
          </Text>
        </View>

        {/* Title */}
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 44,
            color: COLORS.white,
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          DATABRICKS
        </Text>
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 44,
            color: COLORS.orange,
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          TRAINING
        </Text>
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 44,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          BOOKLET
        </Text>

        {/* Divider */}
        <View
          style={{
            height: 2,
            backgroundColor: COLORS.orange,
            width: 80,
            marginBottom: 28,
          }}
        />

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.5,
            marginBottom: 6,
            maxWidth: 360,
          }}
        >
          A complete reference for the Howden FINMA Commission Reporting platform built on Azure Databricks
        </Text>

        {/* Medallion visual */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 52, gap: 0 }}>
          {[
            { label: "BRONZE", sublabel: "Raw Data", color: "#A0522D" },
            { label: "SILVER", sublabel: "Clean Data", color: "#4B5563" },
            { label: "GOLD", sublabel: "FINMA Ready", color: "#B45309" },
          ].map((layer, i) => (
            <View key={layer.label} style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: layer.color,
                  borderWidth: 2,
                  borderColor: "rgba(255,255,255,0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Helvetica-Bold",
                    fontSize: 10,
                    color: COLORS.white,
                    marginBottom: 3,
                  }}
                >
                  {layer.label}
                </Text>
                <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>
                  {layer.sublabel}
                </Text>
              </View>
              {i < 2 && (
                <Text
                  style={{
                    fontSize: 22,
                    color: COLORS.orange,
                    paddingHorizontal: 8,
                  }}
                >
                  ›
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: "row", gap: 28, marginTop: 52 }}>
          {[
            ["5", "Training Days"],
            ["32", "Glossary Terms"],
            ["5", "FINMA Entities"],
            ["3", "Medallion Layers"],
          ].map(([num, label]) => (
            <View key={label}>
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontSize: 22,
                  color: COLORS.orange,
                  lineHeight: 1,
                }}
              >
                {num}
              </Text>
              <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom strip */}
      <View
        style={{
          paddingHorizontal: 56,
          paddingVertical: 14,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.12)",
        }}
      >
        <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>
          CONFIDENTIAL · FOR INTERNAL USE ONLY
        </Text>
        <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>
          Azure Databricks · Howden Switzerland · 2026
        </Text>
      </View>
    </Page>
  );
}
