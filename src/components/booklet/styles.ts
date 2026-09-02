import { StyleSheet } from "@react-pdf/renderer";

export const COLORS = {
  navy: "#1F2144",
  orange: "#F47920",
  orangeLight: "#FFF3E8",
  surface: "#F8F9FA",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
  bronze: "#CD7F32",
  bronzeBg: "#FDF3E7",
  silver: "#9CA3AF",
  silverBg: "#F3F4F6",
  gold: "#D97706",
  goldBg: "#FFFBEB",
  green: "#4ADE80",
  codeGreen: "#86EFAC",
  day1: "#1E40AF",
  day2: "#0891B2",
  day3: "#059669",
  day4: "#D97706",
  day5: "#7C3AED",
};

export const CATEGORY_COLORS: Record<string, string> = {
  core: "#1E40AF",
  compute: "#059669",
  catalog: "#0891B2",
  pipeline: "#D97706",
  analytics: "#7C3AED",
  quality: "#DC2626",
};

export const styles = StyleSheet.create({
  // ── Page ──────────────────────────────────────────────────────────
  page: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 48,
    paddingRight: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.gray900,
    lineHeight: 1.5,
  },
  pageHeader: {
    position: "absolute",
    top: 18,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray200,
    paddingBottom: 5,
  },
  pageHeaderText: {
    fontSize: 7.5,
    color: COLORS.gray400,
    fontFamily: "Helvetica",
  },
  pageHeaderBold: {
    fontSize: 7.5,
    color: COLORS.navy,
    fontFamily: "Helvetica-Bold",
  },
  pageFooter: {
    position: "absolute",
    bottom: 18,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.gray200,
    paddingTop: 5,
  },
  pageFooterText: {
    fontSize: 7,
    color: COLORS.gray400,
    fontFamily: "Helvetica",
  },
  pageNumber: {
    fontSize: 7,
    color: COLORS.gray400,
    fontFamily: "Helvetica",
  },

  // ── Chapter header ────────────────────────────────────────────────
  chapterHeader: {
    marginBottom: 18,
    marginLeft: -48,
    marginRight: -48,
    paddingHorizontal: 48,
    paddingVertical: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  chapterNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  chapterNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: COLORS.white,
  },
  chapterTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 17,
    color: COLORS.white,
    flex: 1,
  },
  chapterSubtitle: {
    fontSize: 9,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },

  // ── Section title ─────────────────────────────────────────────────
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: COLORS.navy,
    marginBottom: 7,
    marginTop: 14,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange,
  },
  sectionSubtitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: COLORS.gray700,
    marginBottom: 5,
    marginTop: 10,
  },

  // ── Body text ─────────────────────────────────────────────────────
  body: {
    fontSize: 10,
    color: COLORS.gray700,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  bodySmall: {
    fontSize: 8.5,
    color: COLORS.gray500,
    lineHeight: 1.5,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  italic: {
    fontFamily: "Helvetica-Oblique",
  },

  // ── Callout box (HowdenContext equivalent) ────────────────────────
  calloutBox: {
    backgroundColor: COLORS.orangeLight,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
    borderRadius: 2,
  },
  calloutTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: COLORS.orange,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  calloutBody: {
    fontSize: 9.5,
    color: "#78350F",
    lineHeight: 1.55,
  },

  // ── Code block ────────────────────────────────────────────────────
  codeBlock: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  codeText: {
    fontFamily: "Courier",
    fontSize: 8,
    color: COLORS.codeGreen,
    lineHeight: 1.6,
  },

  // ── Screenshot placeholder ────────────────────────────────────────
  screenshotContainer: {
    marginBottom: 10,
  },
  screenshotImage: {
    // width-only: react-pdf derives height from natural aspect ratio.
    // No border — react-pdf border on Image can cause sizing inconsistencies.
    width: "100%",
  },
  screenshotPlaceholder: {
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 4,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  screenshotPlaceholderText: {
    fontSize: 8,
    color: COLORS.gray400,
    fontFamily: "Helvetica",
  },
  screenshotCaption: {
    fontSize: 7.5,
    color: COLORS.gray500,
    textAlign: "center",
    marginTop: 4,
    fontFamily: "Helvetica-Oblique",
  },

  // ── Two-column layout ─────────────────────────────────────────────
  twoColumn: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },

  // ── Table ─────────────────────────────────────────────────────────
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.navy,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 3,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: COLORS.white,
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray200,
  },
  tableRowAlt: {
    backgroundColor: COLORS.surface,
  },
  tableCell: {
    fontSize: 8.5,
    color: COLORS.gray700,
    flex: 1,
    lineHeight: 1.45,
  },
  tableCellBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: COLORS.gray900,
    flex: 1,
  },

  // ── Badge ─────────────────────────────────────────────────────────
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
  },

  // ── Numbered step ─────────────────────────────────────────────────
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 7,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  stepNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: COLORS.gray900,
    marginBottom: 1,
  },
  stepBody: {
    fontSize: 9,
    color: COLORS.gray700,
    lineHeight: 1.45,
  },

  // ── Glossary ──────────────────────────────────────────────────────
  glossaryEntry: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray200,
  },
  glossaryTerm: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: COLORS.navy,
    marginBottom: 2,
  },
  glossarySimple: {
    fontSize: 9,
    color: COLORS.gray700,
    lineHeight: 1.45,
    marginBottom: 2,
  },
  glossaryAnalogy: {
    fontSize: 8.5,
    color: COLORS.gray500,
    fontFamily: "Helvetica-Oblique",
    lineHeight: 1.4,
  },

  // ── Info card ─────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: COLORS.navy,
    marginBottom: 4,
  },
  infoCardBody: {
    fontSize: 9,
    color: COLORS.gray700,
    lineHeight: 1.45,
  },
  infoCardLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.gray500,
    marginBottom: 1,
  },

  // ── Layer boxes ───────────────────────────────────────────────────
  layerBox: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  layerTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: COLORS.white,
    marginBottom: 4,
  },
  layerSubtitle: {
    fontSize: 8,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 5,
  },
  layerBullet: {
    fontSize: 8,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 1.5,
  },
  arrowText: {
    fontSize: 16,
    color: COLORS.gray400,
    alignSelf: "center",
    paddingHorizontal: 4,
  },
});
