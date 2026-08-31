"use client";

import {
  Database,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ─── Before / After data ─────────────────────────────────────────────────────

const BEFORE_AFTER = [
  {
    before: "Commission data extracted manually from 5 different CRMs, emailed as Excel",
    after: "One automated pipeline ingests all 5 CRM exports, using the same logic every time.",
  },
  {
    before: "Each analyst has their own copy. Nobody knows which version is correct.",
    after: "One governed Gold table that everyone queries. No conflicting versions.",
  },
  {
    before: "FINMA report built by hand in a spreadsheet. Error-prone and takes weeks.",
    after: "Report generated automatically when the pipeline completes.",
  },
  {
    before: "Data quality issues discovered only after the submission has gone out.",
    after: "DQX catches data quality issues before they ever reach the Gold layer.",
  },
  {
    before: "CRM product codes and insurer names don't match FINMA's taxonomy. Mappings are maintained manually in a shared spreadsheet.",
    after: "Reference tables loaded in Bronze. Silver joins automatically assign every record the correct FINMA product category and registered insurer name.",
  },
];

// ─── What Databricks is: 4 pillars ───────────────────────────────────────────

const PILLARS = [
  {
    icon: Database,
    color: "#1F2144",
    bg: "#E8E9F0",
    border: "#D0D2E1",
    title: "A unified data platform",
    body: "Databricks brings storage, compute, and governance together in one place, rather than stitching together five separate tools.",
  },
  {
    icon: Users,
    color: "#0891B2",
    bg: "#ECFEFF",
    border: "#A5F3FC",
    title: "Built for collaboration",
    body: "Analysts, engineers, and business users all work from the same platform. Notebooks, dashboards, and tables are shared — not siloed.",
  },
  {
    icon: ShieldCheck,
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    title: "Governed by design",
    body: "Unity Catalog tracks who can see what, where data came from, and what changed. Compliance reports have a clear audit trail with no extra work required.",
  },
  {
    icon: Zap,
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    title: "Scales with the data",
    body: "Whether you are processing 100 rows or 100 million, the same code works. Databricks allocates the compute you need — and shuts it down when you are done.",
  },
];

// ─── Day 1 learning path ──────────────────────────────────────────────────────

const DAY1_PATH = [
  {
    step: "1",
    title: "What Databricks is",
    desc: "The platform in plain language — and why Howden is using it",
    done: true,
  },
  {
    step: "2",
    title: "The Workspace",
    desc: "Navigate the interface — where notebooks, data, and jobs live",
    done: false,
  },
  {
    step: "3",
    title: "Workspace vs Catalog",
    desc: "The essential distinction every user needs to understand first",
    done: false,
  },
  {
    step: "4",
    title: "Your first 10 minutes",
    desc: "Hands-on orientation: attach compute, run a cell, browse the Catalog",
    done: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function WhatIsDatabricks() {
  return (
    <div className="space-y-12">
      {/* ── 1. Plain-language definition ───────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border-2 border-[#1F2144]/10 bg-gradient-to-br from-[#1F2144] to-[#363A7A] p-8 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
            Before we start
          </p>
          <h2 className="text-2xl font-bold leading-snug mb-3">
            Databricks is a <span className="text-[#F47920]">data intelligence platform</span>.
          </h2>
          <p className="text-white/80 text-base leading-relaxed max-w-3xl">
            It is the place where raw data — arriving from your CRM systems, financial feeds, and other
            sources — is cleaned, validated, and turned into the trusted numbers your business runs on.
            Think of it as the factory floor between your source systems and your reports.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Not a spreadsheet replacement",
              "Not just a database",
              "Not only for engineers",
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F47920]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Four pillars ────────────────────────────────────────────────── */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          What it actually does — four things worth knowing
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PILLARS.map(({ icon: Icon, color, bg, border, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: bg, borderColor: border }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color }} size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color }}>
                    {title}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Before / After ──────────────────────────────────────────────── */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Why Howden is using it
        </h3>
        <p className="text-sm text-gray-500 mb-5">
          The commission reporting process is the clearest example of what changes.
        </p>

        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <div className="flex items-center gap-2 px-5 py-3 bg-red-50 border-b border-gray-200">
              <FileSpreadsheet className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Today — without Databricks</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-green-50 border-b border-gray-200">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">After — with Databricks</span>
            </div>
          </div>

          {BEFORE_AFTER.map(({ before, after }, i) => (
            <div
              key={i}
              className="grid grid-cols-2 divide-x divide-gray-200 border-t border-gray-100"
            >
              <div className="flex items-start gap-3 px-5 py-4 bg-red-50/40">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700 leading-relaxed">{before}</p>
              </div>
              <div className="flex items-start gap-3 px-5 py-4 bg-green-50/40">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700 leading-relaxed">{after}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-3 text-right">
          This 5-day programme takes you from where things are today to how they will work with Databricks, one step at a time.
        </p>
      </section>

      {/* ── 4. Day 1 learning path ─────────────────────────────────────────── */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">What you will cover today</h3>
        <p className="text-sm text-gray-500 mb-5">
          Day 1 is about orientation — no code required. By the end you will know where everything is
          and what it does.
        </p>

        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {DAY1_PATH.map(({ step, title, desc, done }, i) => (
              <div key={step} className="flex items-start gap-4 relative">
                {/* Step dot */}
                <div
                  className="absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 text-[10px] font-bold"
                  style={
                    done
                      ? { backgroundColor: "#F47920", borderColor: "#F47920", color: "#fff" }
                      : { backgroundColor: "#fff", borderColor: "#D1D5DB", color: "#9CA3AF" }
                  }
                >
                  {done ? <CheckCircle2 size={11} /> : step}
                </div>

                <div
                  className="flex-1 rounded-xl border p-4"
                  style={
                    i === 0
                      ? { borderColor: "#F47920", backgroundColor: "#FFF3E8" }
                      : { borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" }
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className="text-sm font-bold"
                      style={{ color: i === 0 ? "#C2440A" : "#374151" }}
                    >
                      {title}
                    </p>
                    {i === 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F47920] text-white">
                        You are here
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>

                {i < DAY1_PATH.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-3 hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
