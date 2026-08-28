import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  color?: "default" | "bronze" | "silver" | "gold" | "green" | "blue" | "red";
  className?: string;
}

const colorMap = {
  default: { bg: "bg-white", border: "border-gray-200", icon: "text-gray-500", value: "text-gray-900" },
  bronze: { bg: "bg-bronze-bg", border: "border-bronze-border", icon: "text-bronze", value: "text-bronze-text" },
  silver: { bg: "bg-silver-bg", border: "border-silver-border", icon: "text-silver", value: "text-silver-text" },
  gold: { bg: "bg-gold-bg", border: "border-gold-border", icon: "text-gold", value: "text-gold-text" },
  green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600", value: "text-green-900" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", value: "text-blue-900" },
  red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600", value: "text-red-900" },
};

export function MetricCard({ title, value, subtitle, icon: Icon, trend, color = "default", className }: MetricCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        colors.bg,
        colors.border,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className={cn("text-2xl font-bold mt-1", colors.value)}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          {trend && (
            <p className={cn("text-xs font-medium mt-1", trend.value >= 0 ? "text-green-600" : "text-red-500")}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-xl", colors.bg, "border", colors.border)}>
            <Icon size={20} className={colors.icon} />
          </div>
        )}
      </div>
    </div>
  );
}
