import { View, Text, Image } from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";

// ── Page header/footer (used in every chapter page) ───────────────────────────

export function PageHeader({ chapter }: { chapter: string }) {
  return (
    <View style={styles.pageHeader} fixed>
      <Text style={styles.pageHeaderBold}>Databricks Training Booklet</Text>
      <Text style={styles.pageHeaderText}>{chapter}</Text>
    </View>
  );
}

export function PageFooter() {
  return (
    <View style={styles.pageFooter} fixed>
      <Text style={styles.pageFooterText}>
        Databricks Training · Howden Group · Confidential
      </Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
          `${pageNumber} / ${totalPages}`
        }
      />
    </View>
  );
}

// ── Chapter header bar ─────────────────────────────────────────────────────────

export function ChapterHeader({
  number,
  title,
  subtitle,
  color,
}: {
  number: string;
  title: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <View
      wrap={false}
      style={[styles.chapterHeader, { backgroundColor: color }]}
    >
      {/* Left: large decorative number — normal flow, low opacity */}
      <Text
        style={{
          fontFamily: "Helvetica-Bold",
          fontSize: 68,
          color: "rgba(255,255,255,0.18)",
          lineHeight: 1,
          flexShrink: 0,
          marginRight: 18,
          alignSelf: "center",
        }}
      >
        {number}
      </Text>

      {/* Centre: label stack + title */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 7,
            fontFamily: "Helvetica-Bold",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 2,
            marginBottom: 5,
          }}
        >
          CHAPTER {number}
        </Text>
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 22,
            color: COLORS.white,
            lineHeight: 1.15,
            marginBottom: subtitle ? 5 : 0,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.65)" }}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right: crisp number badge */}
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: "rgba(255,255,255,0.18)",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          borderWidth: 1.5,
          borderColor: "rgba(255,255,255,0.3)",
        }}
      >
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: 22,
            color: COLORS.white,
          }}
        >
          {number}
        </Text>
      </View>
    </View>
  );
}

// ── Section title with left orange border ─────────────────────────────────────

export function SectionTitle({ children, color }: { children: string; color?: string }) {
  return (
    <View style={[styles.sectionTitle, color ? { borderLeftColor: color } : {}]}>
      <Text>{children}</Text>
    </View>
  );
}

export function SubTitle({ children }: { children: string }) {
  return <Text style={styles.sectionSubtitle}>{children}</Text>;
}

// ── Callout box (HowdenContext equivalent) ────────────────────────────────────

export function CalloutBox({ title, children }: { title?: string; children: string }) {
  return (
    <View wrap={false} style={styles.calloutBox}>
      {title && <Text style={styles.calloutTitle}>{title}</Text>}
      <Text style={styles.calloutBody}>{children}</Text>
    </View>
  );
}

// ── Body text ─────────────────────────────────────────────────────────────────

export function Body({ children }: { children: string }) {
  return <Text style={styles.body}>{children}</Text>;
}

// ── Code block ────────────────────────────────────────────────────────────────

export function CodeBlock({ code }: { code: string }) {
  return (
    <View style={styles.codeBlock}>
      <Text style={styles.codeText}>{code}</Text>
    </View>
  );
}

// ── Screenshot block ──────────────────────────────────────────────────────────
// Pass src as a full URL (e.g. process.env.NEXT_PUBLIC_BASE_URL + '/screenshots/foo.jpeg')
// If src is undefined, renders a placeholder box.

export function ScreenshotBlock({
  src,
  caption,
}: {
  src?: string;
  caption?: string;
}) {
  return (
    // wrap={false} keeps the image + caption together and prevents the
    // image from being split across a page break.
    <View wrap={false} style={styles.screenshotContainer}>
      {src ? (
        // No width or height override — react-pdf renders the image at its
        // natural aspect ratio scaled to the full content width.
        <Image style={styles.screenshotImage} src={src} />
      ) : (
        <View style={[styles.screenshotPlaceholder, { paddingVertical: 36 }]}>
          <Text style={styles.screenshotPlaceholderText}>{caption ?? "Screenshot"}</Text>
        </View>
      )}
      {caption && <Text style={styles.screenshotCaption}>{caption}</Text>}
    </View>
  );
}

// ── Two-column layout ─────────────────────────────────────────────────────────

export function TwoColumn({ children }: { children: React.ReactNode }) {
  return <View style={styles.twoColumn}>{children}</View>;
}

export function Column({ children }: { children: React.ReactNode }) {
  return <View style={styles.column}>{children}</View>;
}

// ── Medallion Architecture diagram (drawn with primitives) ────────────────────

export function MedallionDiagram() {
  const layers = [
    {
      color: COLORS.bronze,
      bg: "#A0522D",
      title: "BRONZE",
      subtitle: "Raw / Ingested Data",
      bullets: ["Raw Tables", "Immutable", "Full History"],
    },
    {
      color: COLORS.silver,
      bg: "#4B5563",
      title: "SILVER",
      subtitle: "Clean + Transform",
      bullets: ["Cleansing", "Standardisation", "Integration"],
    },
    {
      color: COLORS.gold,
      bg: "#B45309",
      title: "GOLD",
      subtitle: "Business Ready",
      bullets: ["Curated Tables", "Validated", "Dashboards"],
    },
  ];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 0 }}>
      {layers.map((layer, i) => (
        <View key={layer.title} style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={[
              styles.layerBox,
              { backgroundColor: layer.bg, borderWidth: 1.5, borderColor: layer.color },
            ]}
          >
            <Text style={styles.layerTitle}>{layer.title}</Text>
            <Text style={styles.layerSubtitle}>{layer.subtitle}</Text>
            {layer.bullets.map((b) => (
              <Text key={b} style={styles.layerBullet}>
                · {b}
              </Text>
            ))}
          </View>
          {i < layers.length - 1 && <Text style={styles.arrowText}>›</Text>}
        </View>
      ))}
    </View>
  );
}

// ── FINMA pipeline flow ───────────────────────────────────────────────────────

export function PipelineFlow({
  tasks,
  color,
}: {
  tasks: Array<{ name: string; description: string; type: string }>;
  color: string;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      {tasks.map((task, i) => (
        <View key={task.name} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: color,
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: COLORS.white }}>
              {i + 1}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5, color: COLORS.navy, marginBottom: 1 }}>
              {task.name}
            </Text>
            <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.45 }}>
              {task.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Numbered step list ────────────────────────────────────────────────────────

export function StepList({
  steps,
  color,
}: {
  steps: Array<{ title: string; body: string }>;
  color: string;
}) {
  return (
    <View>
      {steps.map((step, i) => (
        <View key={step.title} style={styles.stepRow}>
          <View style={[styles.stepCircle, { backgroundColor: color }]}>
            <Text style={styles.stepNumber}>{i + 1}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepBody}>{step.body}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Simple table ──────────────────────────────────────────────────────────────

export function SimpleTable({
  headers,
  rows,
  colWidths,
}: {
  headers: string[];
  rows: string[][];
  colWidths?: number[];
}) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {headers.map((h, i) => (
          <Text
            key={h}
            style={[styles.tableHeaderCell, colWidths ? { flex: colWidths[i] } : {}]}
          >
            {h}
          </Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={[styles.tableRow, ri % 2 === 1 ? styles.tableRowAlt : {}]}>
          {row.map((cell, ci) => (
            <Text
              key={ci}
              style={[
                ci === 0 ? styles.tableCellBold : styles.tableCell,
                colWidths ? { flex: colWidths[ci] } : {},
              ]}
            >
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

// ── Info card ─────────────────────────────────────────────────────────────────

export function InfoCard({ title, body, label }: { title: string; body: string; label?: string }) {
  return (
    <View style={styles.infoCard}>
      {label && <Text style={styles.infoCardLabel}>{label.toUpperCase()}</Text>}
      <Text style={styles.infoCardTitle}>{title}</Text>
      <Text style={styles.infoCardBody}>{body}</Text>
    </View>
  );
}

// ── Glossary entry ────────────────────────────────────────────────────────────

export function GlossaryEntry({
  term,
  simple,
  analogy,
  category,
}: {
  term: string;
  simple: string;
  analogy: string;
  category: string;
}) {
  const color = {
    core: COLORS.day1,
    compute: COLORS.day3,
    catalog: COLORS.day2,
    pipeline: COLORS.day4,
    analytics: COLORS.day5,
    quality: "#DC2626",
  }[category] ?? COLORS.navy;

  return (
    <View style={styles.glossaryEntry}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 3 }}>
        <Text style={styles.glossaryTerm}>{term}</Text>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={{ fontSize: 6.5, color: COLORS.white, fontFamily: "Helvetica-Bold" }}>
            {category.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.glossarySimple}>{simple}</Text>
      <Text style={styles.glossaryAnalogy}>Analogy: {analogy}</Text>
    </View>
  );
}
