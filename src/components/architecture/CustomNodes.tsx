"use client";

import { memo } from "react";
import {
  LayoutDashboard,
  Shield,
  FileCode,
  Terminal,
  Cpu,
  Zap,
  Settings,
  GitMerge,
  BarChart3,
  Sparkles,
  Bell,
} from "lucide-react";

export interface CustomNodeData {
  nodeId: string;
  label: string;
  category: string;
  selected: boolean;
  highlighted: boolean;
  dimmed: boolean;
}

const ICONS: Record<string, React.ElementType> = {
  workspace: LayoutDashboard,
  "unity-catalog": Shield,
  notebooks: FileCode,
  "sql-editor": Terminal,
  compute: Cpu,
  "sql-warehouse": Zap,
  jobs: Settings,
  pipelines: GitMerge,
  dashboards: BarChart3,
  genie: Sparkles,
  alerts: Bell,
};

const STYLES: Record<
  string,
  {
    color: string;
    bg: string;
    border: string;
    iconBg: string;
    textColor: string;
    labelColor: string;
    label: string;
    dark: boolean;
  }
> = {
  platform: {
    color: "#1F2144",
    bg: "linear-gradient(140deg, #1F2144 0%, #363A7A 100%)",
    border: "#4B4F9E",
    iconBg: "rgba(255,255,255,0.18)",
    textColor: "#ffffff",
    labelColor: "rgba(255,255,255,0.55)",
    label: "Platform",
    dark: true,
  },
  governance: {
    color: "#0891B2",
    bg: "linear-gradient(140deg, #ECFEFF 0%, #CFFAFE 100%)",
    border: "#22D3EE",
    iconBg: "rgba(8,145,178,0.12)",
    textColor: "#164E63",
    labelColor: "#0891B2CC",
    label: "Governance",
    dark: false,
  },
  compute: {
    color: "#059669",
    bg: "linear-gradient(140deg, #ECFDF5 0%, #D1FAE5 100%)",
    border: "#34D399",
    iconBg: "rgba(5,150,105,0.12)",
    textColor: "#064E3B",
    labelColor: "#059669CC",
    label: "Compute",
    dark: false,
  },
  analytics: {
    color: "#7C3AED",
    bg: "linear-gradient(140deg, #F5F3FF 0%, #EDE9FE 100%)",
    border: "#A78BFA",
    iconBg: "rgba(124,58,237,0.12)",
    textColor: "#3B0764",
    labelColor: "#7C3AEDCC",
    label: "Analytics",
    dark: false,
  },
  orchestration: {
    color: "#D97706",
    bg: "linear-gradient(140deg, #FFFBEB 0%, #FEF3C7 100%)",
    border: "#FCD34D",
    iconBg: "rgba(217,119,6,0.12)",
    textColor: "#78350F",
    labelColor: "#D97706CC",
    label: "Orchestration",
    dark: false,
  },
};

export const CustomArchNode = memo(function CustomArchNode({
  data,
}: {
  data: CustomNodeData;
}) {
  const { nodeId, label, category, selected, highlighted, dimmed } = data;
  const s = STYLES[category] ?? STYLES.platform;
  const Icon = ICONS[nodeId] ?? LayoutDashboard;

  const opacity = dimmed ? 0.18 : 1;
  const scale = selected ? 1.1 : highlighted ? 1.04 : 1;
  const borderColor = selected
    ? s.color
    : highlighted
    ? s.border
    : s.border + "60";
  const boxShadow = selected
    ? `0 0 0 3px ${s.color}60, 0 8px 32px ${s.color}40`
    : highlighted
    ? `0 0 0 2px ${s.border}90, 0 4px 16px ${s.color}25`
    : "0 2px 8px rgba(0,0,0,0.08)";

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        transition: "opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
        transformOrigin: "center",
        boxShadow,
        background: s.bg,
        border: `2px solid ${borderColor}`,
        borderRadius: 14,
        minWidth: category === "platform" ? 162 : 142,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Accent stripe */}
      <div
        style={{
          height: 3,
          background: s.dark
            ? "rgba(255,255,255,0.3)"
            : s.color,
          opacity: 0.9,
        }}
      />

      {/* Content */}
      <div style={{ padding: "10px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          {/* Icon */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: s.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: s.dark ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            <Icon
              size={17}
              color={s.dark ? "#fff" : s.color}
              strokeWidth={2.2}
            />
          </div>

          {/* Label */}
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.09em",
                textTransform: "uppercase" as const,
                color: s.labelColor,
                lineHeight: 1,
                marginBottom: 3,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: s.textColor,
                lineHeight: 1.25,
              }}
            >
              {label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const nodeTypes = { customArch: CustomArchNode };
