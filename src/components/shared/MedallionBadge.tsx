import { cn } from "@/lib/utils";
import { MedallionLayer } from "@/lib/types";

interface MedallionBadgeProps {
  layer: MedallionLayer;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const layerConfig = {
  bronze: {
    label: "Bronze",
    bg: "bg-bronze-bg",
    border: "border-bronze-border",
    text: "text-bronze-text",
    dot: "bg-bronze",
  },
  silver: {
    label: "Silver",
    bg: "bg-silver-bg",
    border: "border-silver-border",
    text: "text-silver-text",
    dot: "bg-silver",
  },
  gold: {
    label: "Gold",
    bg: "bg-gold-bg",
    border: "border-gold-border",
    text: "text-gold-text",
    dot: "bg-gold",
  },
};

const sizeMap = {
  sm: "text-xs px-1.5 py-0.5",
  md: "text-xs px-2 py-1",
  lg: "text-sm px-3 py-1.5",
};

export function MedallionBadge({ layer, size = "md", showLabel = true }: MedallionBadgeProps) {
  const config = layerConfig[layer];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.bg,
        config.border,
        config.text,
        sizeMap[size]
      )}
    >
      <span className={cn("rounded-full", config.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {showLabel && config.label}
    </span>
  );
}
