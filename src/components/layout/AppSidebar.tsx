"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  LayoutDashboard,
  Table2,
  Code2,
  Workflow,
  BarChart3,
  Map,
  FolderOpen,
  BookOpen,
  Wrench,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getProgress } from "@/lib/progress";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  dayId?: number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: <Home size={16} /> },
  {
    href: "#learning",
    label: "Learning Journey",
    icon: <LayoutDashboard size={16} />,
    children: [
      { href: "/day1", label: "Day 1 — Foundations", icon: <LayoutDashboard size={14} />, dayId: 1 },
      { href: "/day2", label: "Day 2 — Data & Catalog", icon: <Table2 size={14} />, dayId: 2 },
      { href: "/day3", label: "Day 3 — Develop & Query", icon: <Code2 size={14} />, dayId: 3 },
      { href: "/day4", label: "Day 4 — Automate & Monitor", icon: <Workflow size={14} />, dayId: 4 },
      { href: "/day5", label: "Day 5 — Analyze & Apply", icon: <BarChart3 size={14} />, dayId: 5 },
    ],
  },
  { href: "/architecture", label: "Architecture Explorer", icon: <Map size={16} /> },
  { href: "/workspace-map", label: "Workspace Map", icon: <FolderOpen size={16} /> },
  { href: "/glossary", label: "Glossary", icon: <BookOpen size={16} /> },
  { href: "/troubleshooting", label: "Troubleshooting", icon: <Wrench size={16} /> },
  { href: "/knowledge-check", label: "Knowledge Check", icon: <CheckCircle2 size={16} /> },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(true);
  const [progress, setProgress] = useState({ visitedDays: [] as number[], overallCompletion: 0 });

  useEffect(() => {
    const p = getProgress();
    setProgress(p);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;
  const isChildActive = (children?: NavItem[]) => children?.some((c) => pathname === c.href);

  /* ── Collapsed state ─────────────────────────────────────── */
  if (collapsed) {
    return (
      <div className="flex flex-col h-full w-14 bg-[#1F2144] border-r border-white/10 items-center py-4 gap-2">
        {/* Orange H monogram */}
        <div className="w-7 h-7 bg-[#F47920] rounded-lg flex items-center justify-center mb-1">
          <span className="text-white text-xs font-bold">H</span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg hover:bg-white/10 text-white/50"
        >
          <ChevronRight size={16} />
        </button>
        {navItems.slice(0, 1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors",
              isActive(item.href) && "bg-[#F47920]/20 text-[#F47920]"
            )}
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    );
  }

  /* ── Expanded state ──────────────────────────────────────── */
  return (
    <div className="flex flex-col h-full w-64 bg-[#1F2144] border-r border-white/10 shrink-0">

      {/* ── Howden brand header ─── */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Orange H monogram */}
          <div className="w-8 h-8 bg-[#F47920] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold tracking-tight">H</span>
          </div>
          <div className="flex flex-col leading-none min-w-0">
            <span className="font-bold text-[11px] text-white tracking-[0.12em] uppercase">Howden</span>
            <span className="text-[10px] text-white/50 mt-0.5 leading-tight truncate">
              Databricks Learning Journey
            </span>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded hover:bg-white/10 text-white/30 shrink-0"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* ── Navigation ─── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.href}>
                <button
                  onClick={() => setJourneyOpen((o) => !o)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors",
                    isChildActive(item.children) && "text-[#F47920]"
                  )}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronRight
                    size={14}
                    className={cn("transition-transform text-white/30", journeyOpen && "rotate-90")}
                  />
                </button>
                {journeyOpen && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {item.children.map((child) => {
                      const done = child.dayId !== undefined && progress.visitedDays.includes(child.dayId);
                      const active = isActive(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            active
                              ? "bg-[#F47920]/15 text-[#F47920] border-l-2 border-[#F47920] pl-[10px]"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <span className={active ? "text-[#F47920]" : "text-white/30"}>
                            {done
                              ? <CheckCircle size={12} className="text-green-400" />
                              : <Circle size={12} />
                            }
                          </span>
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[#F47920]/15 text-[#F47920] border-l-2 border-[#F47920] pl-[10px]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Progress footer ─── */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-white/50">Overall Progress</span>
          <span className="text-xs font-bold text-[#F47920]">{progress.overallCompletion}%</span>
        </div>
        {/* Progress bar — orange on navy track */}
        <div className="w-full bg-white/15 rounded-full h-1.5">
          <div
            className="bg-[#F47920] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress.overallCompletion}%` }}
          />
        </div>
        {/* Day dots */}
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((day) => (
            <div
              key={day}
              className={cn(
                "flex-1 h-1 rounded-full",
                progress.visitedDays.includes(day) ? "bg-[#F47920]" : "bg-white/15"
              )}
              title={`Day ${day}`}
            />
          ))}
        </div>
        <p className="text-xs text-white/30 mt-1">{progress.visitedDays.length}/5 days visited</p>
      </div>
    </div>
  );
}
