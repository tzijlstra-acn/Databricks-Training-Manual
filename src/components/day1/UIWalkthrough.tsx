"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, ChevronLeft, ChevronRight, RotateCcw,
  Folder, Database, Cpu, BookOpen, Search, FolderOpen,
  ChevronDown, CheckCircle2, FileCode, Table2, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Layout constants (mockup = 860 × 460px) ──────────────────────────────────
const SW = 200;   // sidebar width
const TH = 36;    // browser chrome height
const BB = 44;    // brand bar height
const NI = 36;    // nav item height
// Sidebar nav items Y (from top of container)
const NAV_Y = TH + BB;

const R = {
  wsItem:     { x: 0,    y: NAV_Y,            w: SW, h: NI },
  catItem:    { x: 0,    y: NAV_Y + NI,        w: SW, h: NI },
  cpItem:     { x: 0,    y: NAV_Y + NI * 3,    w: SW, h: NI },
  content:    { x: SW,   y: TH + BB,           w: 660, h: 380 },
  // notebook header compute button (right side of content topbar)
  computeBtn: { x: SW + 380, y: TH + BB + 8,  w: 160, h: 28 },
  // cluster dropdown rows
  cluster: (n: number) => ({ x: SW + 380, y: TH + BB + 44 + n * 40, w: 268, h: 36 }),
  // notebook cells
  cell: (n: number)    => ({ x: SW + 24,  y: TH + BB + 60 + n * 76, w: 580, h: 68 }),
  // catalog tree rows
  catRow: (n: number)  => ({ x: SW + 16,  y: TH + BB + 8 + n * 36,  w: 300, h: 32 }),
  // table schema columns
  colRow: (n: number)  => ({ x: SW + 16,  y: TH + BB + 120 + n * 36, w: 620, h: 32 }),
  // workspace file rows
  fileRow: (n: number) => ({ x: SW + 16,  y: TH + BB + 56 + n * 40,  w: 620, h: 36 }),
};

// ── Scenario data ─────────────────────────────────────────────────────────────

type Box = { x: number; y: number; w: number; h: number };
type Step = { caption: string; sub: string; ui: string; hl?: Box };

const SCENARIOS: { id: string; title: string; emoji: string; steps: Step[] }[] = [
  {
    id: "notebook",
    title: "Open a Notebook",
    emoji: "📓",
    steps: [
      {
        caption: "Find Workspace in the sidebar",
        sub: "The sidebar is always on the left. Workspace is where all your code and notebooks live.",
        ui: "idle",
        hl: R.wsItem,
      },
      {
        caption: "Click Workspace — folder tree appears",
        sub: "You'll see shared and personal folders. Look for a team or training folder.",
        ui: "ws-tree",
        hl: R.fileRow(0),
      },
      {
        caption: "Expand the Training folder",
        sub: "Notebooks are listed as files inside the folder. You'll recognise them by the language badge.",
        ui: "ws-folder",
        hl: R.fileRow(1),
      },
      {
        caption: "Click a notebook to open it",
        sub: "The notebook opens in the main area. Cells are ready — but you need compute before running.",
        ui: "notebook-detached",
        hl: R.cell(0),
      },
    ],
  },
  {
    id: "compute",
    title: "Attach Compute",
    emoji: "⚡",
    steps: [
      {
        caption: "Notebook is open — compute shows 'Detached'",
        sub: "Before you can run any cell, you must connect to a compute cluster.",
        ui: "notebook-detached",
        hl: R.computeBtn,
      },
      {
        caption: "Click the compute button — dropdown opens",
        sub: "Any clusters already running are listed here. Starting a stopped cluster takes 2–5 minutes.",
        ui: "compute-dropdown",
        hl: R.cluster(0),
      },
      {
        caption: "Select a running cluster",
        sub: "A green dot means it's already running — no wait. Grey means it needs to start.",
        ui: "compute-connecting",
        hl: R.computeBtn,
      },
      {
        caption: "Cluster attached — you can now run cells",
        sub: "The compute button turns green. Every cell in this notebook now has access to that cluster.",
        ui: "compute-connected",
        hl: R.cell(0),
      },
    ],
  },
  {
    id: "catalog",
    title: "Browse the Catalog",
    emoji: "📂",
    steps: [
      {
        caption: "Click Catalog in the sidebar",
        sub: "Catalog is where all governed tables live — Bronze, Silver, and Gold layers are all here.",
        ui: "idle",
        hl: R.catItem,
      },
      {
        caption: "Expand the 'enterprise' catalog",
        sub: "Catalogs are the top-level namespace. Your organisation's data lives under 'enterprise'.",
        ui: "catalog-root",
        hl: R.catRow(1),
      },
      {
        caption: "Open the 'silver' schema",
        sub: "Schemas group tables by Medallion layer. Bronze, Silver, and Gold are all visible here.",
        ui: "catalog-schemas",
        hl: R.catRow(3),
      },
      {
        caption: "Click a table to inspect it",
        sub: "Every column, its type, nullability, and description — all in one view.",
        ui: "catalog-tables",
        hl: R.catRow(4),
      },
      {
        caption: "Schema, sample data, and lineage — all here",
        sub: "You can preview rows without writing any code. Lineage shows which notebook wrote this table.",
        ui: "catalog-detail",
        hl: R.colRow(1),
      },
    ],
  },
];

// ── Mockup sub-components ─────────────────────────────────────────────────────

function Sidebar({ active }: { active: "workspace" | "catalog" | "compute" | "none" }) {
  const items = [
    { id: "workspace", icon: FolderOpen,  label: "Workspace",  color: "#0891B2" },
    { id: "catalog",   icon: Database,    label: "Catalog",    color: "#059669" },
    { id: "recents",   icon: BookOpen,    label: "Recents",    color: "#6B7280" },
    { id: "compute",   icon: Cpu,         label: "Compute",    color: "#7C3AED" },
    { id: "jobs",      icon: Layers,      label: "Jobs & Pipelines", color: "#D97706" },
  ];
  return (
    <div className="flex flex-col" style={{ width: SW, backgroundColor: "#1A1A2E", minHeight: "100%" }}>
      {/* Brand bar */}
      <div className="flex items-center gap-2 px-4 border-b border-[#2D2D4E]" style={{ height: BB }}>
        <div className="w-6 h-6 bg-[#FF3621] rounded flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-bold">D</span>
        </div>
        <span className="text-white text-sm font-semibold">Databricks</span>
      </div>
      {/* Nav */}
      <nav className="flex-1 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 text-xs"
              style={{
                height: NI,
                backgroundColor: isActive ? "#2D2D4E" : "transparent",
                color: isActive ? "#fff" : "#9CA3AF",
              }}
            >
              <Icon size={14} style={{ color: isActive ? item.color : undefined }} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

function ContentPane({ ui }: { ui: string }) {
  const topbar = (
    <div className="flex items-center justify-between px-4 border-b border-gray-100 bg-white" style={{ height: BB, flexShrink: 0 }}>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="font-medium text-gray-700">
          {ui === "idle" ? "Select an item from the sidebar" :
           ui.startsWith("ws") || ui.startsWith("notebook") ? "Workspace / Training" :
           ui.startsWith("catalog") ? "Catalog / enterprise" :
           ui.startsWith("compute") ? "Training Notebook" : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-gray-100 rounded-md px-3 py-1 flex items-center gap-2">
          <Search size={11} className="text-gray-400" />
          <span className="text-[11px] text-gray-400">Search...</span>
        </div>
      </div>
    </div>
  );

  if (ui === "idle") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {topbar}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-gray-400">Click a sidebar item to get started</p>
        </div>
      </div>
    );
  }

  if (ui === "ws-tree") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {topbar}
        <div className="flex-1 p-4 space-y-1">
          {[
            { icon: FolderOpen, label: "Training",   indent: 0, bold: true },
            { icon: Folder,     label: "Personal",   indent: 0, bold: false },
            { icon: Folder,     label: "Shared",     indent: 0, bold: false },
          ].map(({ icon: Icon, label, indent, bold }) => (
            <div key={label} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer" style={{ marginLeft: indent * 16 }}>
              <Icon size={14} className="text-[#0891B2]" />
              <span className={cn("text-xs", bold ? "font-semibold text-gray-800" : "text-gray-600")}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ui === "ws-folder") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {topbar}
        <div className="flex-1 p-4 space-y-1">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer">
            <FolderOpen size={14} className="text-[#0891B2]" />
            <span className="text-xs font-semibold text-gray-800">Training</span>
          </div>
          {[
            { label: "day1_foundations.py",   lang: "PY",  color: "#3B82F6" },
            { label: "day2_medallion.sql",     lang: "SQL", color: "#059669" },
            { label: "silver_transform.py",    lang: "PY",  color: "#3B82F6" },
            { label: "finma_gold_build.sql",   lang: "SQL", color: "#059669" },
          ].map(({ label, lang, color }) => (
            <div key={label} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer ml-4">
              <FileCode size={13} style={{ color }} />
              <span className="text-xs text-gray-700 flex-1">{label}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: color + "18", color }}>{lang}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ui === "notebook-detached") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {/* Notebook header */}
        <div className="flex items-center justify-between px-4 border-b border-gray-100 bg-gray-50" style={{ height: BB, flexShrink: 0 }}>
          <span className="text-xs font-semibold text-gray-800">day1_foundations.py</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-500 cursor-pointer">
              <Cpu size={12} className="text-gray-400" />
              <span>Detached</span>
              <ChevronDown size={11} className="text-gray-400" />
            </div>
          </div>
        </div>
        {/* Cells */}
        <div className="flex-1 overflow-auto bg-white p-4 space-y-3">
          {[
            { code: "# Day 1 — Databricks Foundations\nprint('Hello, Databricks!')", out: null },
            { code: "display(spark.sql('SHOW CATALOGS'))", out: null },
          ].map(({ code, out }, i) => (
            <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-3 py-1.5 flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-gray-200">
                  <Play size={9} className="text-gray-500" />
                </div>
                <span className="text-[10px] text-gray-400 font-mono">In [{i + 1}]:</span>
              </div>
              <pre className="px-3 py-2 text-[11px] font-mono text-gray-700 bg-white whitespace-pre">{code}</pre>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ui === "compute-dropdown") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 border-b border-gray-100 bg-gray-50" style={{ height: BB, flexShrink: 0 }}>
          <span className="text-xs font-semibold text-gray-800">day1_foundations.py</span>
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0891B2] bg-white text-xs cursor-pointer shadow-sm" style={{ color: "#0891B2" }}>
              <Cpu size={12} />
              <span>Select cluster</span>
              <ChevronDown size={11} />
            </div>
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-10 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Available Clusters</p>
              </div>
              {[
                { name: "howden-training-cluster",  status: "running", nodes: "4 nodes" },
                { name: "howden-dev-small",          status: "stopped", nodes: "2 nodes" },
                { name: "howden-prod-pipeline",      status: "running", nodes: "8 nodes" },
              ].map(({ name, status, nodes }) => (
                <div key={name} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0", status === "running" ? "bg-green-500" : "bg-gray-300")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{name}</p>
                    <p className="text-[10px] text-gray-400">{nodes} · {status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white p-4 space-y-3">
          <div className="rounded-lg border border-gray-200 overflow-hidden opacity-40">
            <pre className="px-3 py-2 text-[11px] font-mono text-gray-700 bg-gray-50 whitespace-pre">{"# Day 1 — Databricks Foundations"}</pre>
          </div>
        </div>
      </div>
    );
  }

  if (ui === "compute-connecting") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 border-b border-gray-100 bg-gray-50" style={{ height: BB, flexShrink: 0 }}>
          <span className="text-xs font-semibold text-gray-800">day1_foundations.py</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-700">
            <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to howden-training-cluster...</span>
          </div>
        </div>
        <div className="flex-1 bg-white p-4 flex items-center justify-center">
          <p className="text-xs text-gray-400">Cluster is starting — this may take 2–5 minutes for a stopped cluster</p>
        </div>
      </div>
    );
  }

  if (ui === "compute-connected") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 border-b border-gray-100 bg-gray-50" style={{ height: BB, flexShrink: 0 }}>
          <span className="text-xs font-semibold text-gray-800">day1_foundations.py</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-xs text-green-700">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>howden-training-cluster</span>
            <CheckCircle2 size={12} className="text-green-500" />
          </div>
        </div>
        <div className="flex-1 bg-white p-4 space-y-3">
          {[
            { code: "# Day 1 — Databricks Foundations\nprint('Hello, Databricks!')", out: "Hello, Databricks!" },
            { code: "display(spark.sql('SHOW CATALOGS'))", out: null },
          ].map(({ code, out }, i) => (
            <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-3 py-1.5 flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-green-100">
                  <Play size={9} className="text-green-600" />
                </div>
                <span className="text-[10px] text-gray-400 font-mono">In [{i + 1}]:</span>
              </div>
              <pre className="px-3 py-2 text-[11px] font-mono text-gray-700 bg-white whitespace-pre">{code}</pre>
              {out && (
                <div className="border-t border-gray-100 px-3 py-1.5 bg-green-50">
                  <span className="text-[10px] font-mono text-green-700">{out}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ui === "catalog-root") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {topbar}
        <div className="flex-1 p-4 space-y-1">
          {[
            { label: "enterprise",   icon: Database,  indent: 0, bold: true,  color: "#059669" },
            { label: "samples",      icon: Database,  indent: 0, bold: false, color: "#6B7280" },
            { label: "system",       icon: Database,  indent: 0, bold: false, color: "#6B7280" },
          ].map(({ label, icon: Icon, indent, bold, color }) => (
            <div key={label} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer" style={{ marginLeft: indent * 16 }}>
              <Icon size={13} style={{ color }} />
              <span className={cn("text-xs", bold ? "font-semibold text-gray-900" : "text-gray-500")}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ui === "catalog-schemas") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {topbar}
        <div className="flex-1 p-4 space-y-0.5">
          <div className="flex items-center gap-2 px-2 py-2 cursor-pointer">
            <Database size={13} className="text-[#059669]" />
            <span className="text-xs font-semibold text-gray-900">enterprise</span>
          </div>
          {[
            { label: "bronze", color: "#CD7F32", desc: "3 tables" },
            { label: "silver", color: "#6B7280", desc: "6 tables" },
            { label: "gold",   color: "#D97706", desc: "5 tables" },
          ].map(({ label, color, desc }) => (
            <div key={label} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer ml-4">
              <Folder size={12} style={{ color }} />
              <span className="text-xs text-gray-700 flex-1">{label}</span>
              <span className="text-[10px] text-gray-400">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ui === "catalog-tables") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {topbar}
        <div className="flex-1 p-4 space-y-0.5">
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer">
            <Database size={12} className="text-[#059669]" />
            <span className="text-[11px] text-gray-500">enterprise</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 ml-3 cursor-pointer">
            <Folder size={12} className="text-[#6B7280]" />
            <span className="text-[11px] font-semibold text-gray-800">silver</span>
          </div>
          {[
            "commission_clean",
            "product_type_mapping",
            "insurer_entity_mapping",
            "entity_attribution",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer ml-6">
              <Table2 size={12} className="text-[#0891B2]" />
              <span className="text-xs text-gray-700">{t}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ui === "catalog-detail") {
    return (
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {topbar}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <Table2 size={14} className="text-[#0891B2]" />
          <div>
            <p className="text-sm font-semibold text-gray-900">enterprise.silver.commission_clean</p>
            <p className="text-[11px] text-gray-400">Delta · Managed · Last modified 2 hours ago</p>
          </div>
          <div className="ml-auto flex gap-2">
            {["Columns", "Sample Data", "Lineage"].map((tab, i) => (
              <span key={tab} className={cn("text-[11px] px-2.5 py-1 rounded-md cursor-pointer", i === 0 ? "bg-[#0891B2] text-white font-medium" : "text-gray-500 hover:bg-gray-100")}>{tab}</span>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Column</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Type</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Nullable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { col: "policy_ref", type: "STRING", null: "No" },
                { col: "insured_name", type: "STRING", null: "No" },
                { col: "finma_product_code", type: "STRING", null: "No" },
                { col: "insurer_finma_name", type: "STRING", null: "No" },
                { col: "commission_chf", type: "DECIMAL(18,2)", null: "No" },
                { col: "is_valid", type: "BOOLEAN", null: "No" },
              ].map(({ col, type, null: nl }) => (
                <tr key={col} className="hover:bg-blue-50/40">
                  <td className="px-4 py-2 font-mono text-gray-800">{col}</td>
                  <td className="px-4 py-2 font-mono text-[#7C3AED]">{type}</td>
                  <td className="px-4 py-2 text-gray-500">{nl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return <div className="flex-1 bg-white" />;
}

// ── Sidebar activity derived from scenario/step ───────────────────────────────

function activeSidebar(scenarioId: string, stepIndex: number): "workspace" | "catalog" | "compute" | "none" {
  if (scenarioId === "notebook") return stepIndex >= 1 ? "workspace" : "none";
  if (scenarioId === "compute")  return "none";
  if (scenarioId === "catalog")  return stepIndex >= 1 ? "catalog" : "none";
  return "none";
}

// ── Highlight overlay ─────────────────────────────────────────────────────────

function Highlight({ box }: { box: Box }) {
  return (
    <motion.div
      key={`${box.x}-${box.y}-${box.w}-${box.h}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {/* Pulsing border */}
      <motion.div
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: 8,
          border: "2px solid #F47920",
        }}
      />
      {/* Fill glow */}
      <motion.div
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 6,
          backgroundColor: "#F47920",
        }}
      />
      {/* Click dot */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: "#F47920",
        }}
      />
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function UIWalkthrough() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenario = SCENARIOS[scenarioIdx];
  const step = scenario.steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === scenario.steps.length - 1;

  const advance = useCallback(() => {
    setStepIdx((i) => {
      if (i >= scenario.steps.length - 1) {
        setPlaying(false);
        return i;
      }
      return i + 1;
    });
  }, [scenario.steps.length]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(advance, 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, advance]);

  function pickScenario(idx: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPlaying(false);
    setScenarioIdx(idx);
    setStepIdx(0);
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPlaying(false);
    setStepIdx(0);
  }

  const sidebarActive = activeSidebar(scenario.id, stepIdx);

  return (
    <div className="space-y-4">

      {/* Scenario tabs */}
      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => pickScenario(i)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
              scenarioIdx === i
                ? "bg-[#1F2144] text-white border-[#1F2144] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
          >
            <span>{s.emoji}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Step progress dots */}
      <div className="flex items-center gap-2">
        {scenario.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => { reset(); setStepIdx(i); }}
            className={cn(
              "rounded-full transition-all",
              i === stepIdx ? "w-6 h-2.5 bg-[#F47920]" : i < stepIdx ? "w-2.5 h-2.5 bg-[#F47920]/40" : "w-2.5 h-2.5 bg-gray-200"
            )}
          />
        ))}
        <span className="ml-2 text-xs text-gray-400">Step {stepIdx + 1} of {scenario.steps.length}</span>
      </div>

      {/* Mockup */}
      <div
        className="relative rounded-2xl border border-gray-200 overflow-hidden shadow-xl"
        style={{ height: 460 }}
      >
        {/* Browser chrome */}
        <div className="absolute top-0 left-0 right-0 bg-gray-100 border-b border-gray-200 flex items-center gap-2 px-4 z-10" style={{ height: TH }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4 text-center">
            <div className="inline-block bg-white border border-gray-200 rounded px-3 py-0.5 text-[11px] text-gray-400">
              adb-1234567890.1.azuredatabricks.net
            </div>
          </div>
        </div>

        {/* Main layout below chrome */}
        <div className="absolute left-0 right-0 bottom-0 flex" style={{ top: TH }}>
          <Sidebar active={sidebarActive} />
          <AnimatePresence mode="wait">
            <motion.div
              key={`${scenario.id}-${stepIdx}`}
              className="flex-1 flex flex-col overflow-hidden"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <ContentPane ui={step.ui} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Highlight overlay */}
        <AnimatePresence>
          {step.hl && <Highlight box={{ ...step.hl, y: step.hl.y + TH }} />}
        </AnimatePresence>
      </div>

      {/* Caption */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`cap-${scenario.id}-${stepIdx}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[#F47920]/20 bg-orange-50 px-5 py-4"
        >
          <p className="text-sm font-semibold text-gray-900 mb-0.5">{step.caption}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{step.sub}</p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500"
          title="Restart"
        >
          <RotateCcw size={15} />
        </button>
        <button
          onClick={() => { if (!isFirst) { setPlaying(false); setStepIdx(i => i - 1); } }}
          disabled={isFirst}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            playing ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-[#F47920] text-white hover:bg-[#d96a18]"
          )}
        >
          {playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> {isLast ? "Restart" : "Play"}</>}
        </button>
        <button
          onClick={() => { if (!isLast) { setPlaying(false); setStepIdx(i => i + 1); } else reset(); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
            isLast ? "border-[#1F2144] bg-[#1F2144] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
          )}
        >
          {isLast ? <><RotateCcw size={14} /> Again</> : <><ChevronRight size={15} /> Next</>}
        </button>
        <span className="ml-auto text-xs text-gray-400">
          {isLast ? "End of walkthrough" : "Auto-advances every 3 seconds when playing"}
        </span>
      </div>

    </div>
  );
}
