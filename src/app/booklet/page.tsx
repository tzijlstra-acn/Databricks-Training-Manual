"use client";

import { useState, useCallback } from "react";
import { Download, BookOpen, Loader2, CheckCircle2, FileText, Layers, Cpu, Workflow, BarChart3, BookMarked, Grid3X3, Network } from "lucide-react";

const CHAPTERS = [
  {
    number: "01",
    title: "Foundations",
    label: "Day 1",
    icon: <BookOpen size={20} />,
    color: "#1E40AF",
    bullets: ["7 workspace UI areas", "Workspace vs Unity Catalog", "Navigation essentials"],
  },
  {
    number: "02",
    title: "Data & Catalog",
    label: "Day 2",
    icon: <Layers size={20} />,
    color: "#0891B2",
    bullets: ["Medallion Architecture", "Unity Catalog hierarchy", "5 source CRM systems"],
  },
  {
    number: "03",
    title: "Develop & Query",
    label: "Day 3",
    icon: <Cpu size={20} />,
    color: "#059669",
    bullets: ["Notebooks & SQL Editor", "Compute types", "Query Gold tables"],
  },
  {
    number: "04",
    title: "Automate & Monitor",
    label: "Day 4",
    icon: <Workflow size={20} />,
    color: "#D97706",
    bullets: ["Databricks Jobs", "DQX data quality", "6-step Alerts"],
  },
  {
    number: "05",
    title: "Analyze & Apply",
    label: "Day 5",
    icon: <BarChart3 size={20} />,
    color: "#7C3AED",
    bullets: ["Genie AI Spaces", "Lakeview Dashboards", "End-to-end FINMA flow"],
  },
  {
    number: "A",
    title: "Glossary",
    label: "Appendix",
    icon: <BookMarked size={20} />,
    color: "#374151",
    bullets: ["32 key terms", "Plain-English definitions", "Real-world analogies"],
  },
  {
    number: "B",
    title: "Platform Quick Reference",
    label: "Appendix",
    icon: <Grid3X3 size={20} />,
    color: "#374151",
    bullets: ["All 16 workspace components", "When to use each", "Who at Howden uses it"],
  },
  {
    number: "C",
    title: "Architecture Reference",
    label: "Appendix",
    icon: <Network size={20} />,
    color: "#374151",
    bullets: ["11 architecture nodes", "Category color coding", "Component connection map"],
  },
];

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const SCREENSHOTS: Record<string, string> = {
  home: `${BASE}/screenshots/Opening_page.jpeg`,
  workspace: `${BASE}/screenshots/Workspace_overview.jpeg`,
  catalog: `${BASE}/screenshots/Catalog.jpeg`,
  "catalog-tree": `${BASE}/screenshots/Tables.jpeg`,
  compute: `${BASE}/screenshots/Compute.jpeg`,
  jobs: `${BASE}/screenshots/DB_jobs&pipelines.jpeg`,
  "job-detail": `${BASE}/screenshots/Inside_DB_jobs.jpeg`,
  "dashboard-dqx": `${BASE}/screenshots/Inside_Dashboard.jpeg`,
  genie: `${BASE}/screenshots/Genie_space.jpeg`,
  "medallion-arch": `${BASE}/screenshots/Medallion_architecture.jpeg`,
  "finma-arch": `${BASE}/screenshots/Finma_architecture.jpeg`,
};

type Status = "idle" | "generating" | "done" | "error";

export default function BookletPage() {
  const [status, setStatus] = useState<Status>("idle");

  const handleDownload = useCallback(async () => {
    setStatus("generating");
    try {
      // Pre-fetch every screenshot as a data URL so react-pdf never does its own
      // fetch (which hangs on special-character filenames or CORS edge cases).
      const resolvedScreenshots: Record<string, string> = {};
      await Promise.allSettled(
        Object.entries(SCREENSHOTS).map(async ([key, url]) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return;
            const blob = await res.blob();
            resolvedScreenshots[key] = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch {
            // Missing screenshot — ScreenshotBlock renders a placeholder, no crash.
          }
        })
      );

      const [{ pdf }, { BookletDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/booklet/BookletDocument"),
      ]);
      const blob = await pdf(<BookletDocument screenshots={resolvedScreenshots} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Databricks-Training-Booklet-Howden.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      console.error("PDF generation failed:", e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* ── Hero ─────────────────────────────────── */}
      <div className="bg-[#1F2144] text-white px-8 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#F47920] rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <span className="text-[#F47920] font-semibold text-sm tracking-widest uppercase">
              Client Resource
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-3 leading-tight">
            Databricks Training Booklet
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            A complete reference for the Howden Databricks FINMA platform — 5 training days, 32
            glossary terms, and every platform component documented in one client-ready PDF.
          </p>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: "Training Days", value: "5" },
              { label: "Glossary Terms", value: "32" },
              { label: "Platform Components", value: "16" },
              { label: "Architecture Nodes", value: "11" },
              { label: "Estimated Pages", value: "~35" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-bold text-[#F47920]">{s.value}</span>
                <span className="text-xs text-white/40 mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Download CTA ─────────────────────────── */}
      <div className="max-w-4xl mx-auto px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">Ready to download</p>
            <p className="text-sm text-gray-500 mt-0.5">
              A4 PDF · Howden branding · Confidential
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={status === "generating"}
            className="flex items-center gap-2.5 px-6 py-3 bg-[#F47920] hover:bg-[#e06810] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm shrink-0"
          >
            {status === "generating" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating…
              </>
            ) : status === "done" ? (
              <>
                <CheckCircle2 size={16} />
                Downloaded!
              </>
            ) : status === "error" ? (
              <>
                <Download size={16} />
                Retry Download
              </>
            ) : (
              <>
                <Download size={16} />
                Download PDF
              </>
            )}
          </button>
        </div>
        {status === "generating" && (
          <p className="text-center text-sm text-gray-400 mt-3">
            Building your PDF — this takes about 5–15 seconds…
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-red-500 mt-3">
            PDF generation failed. Check the browser console for details.
          </p>
        )}
      </div>

      {/* ── Chapter preview cards ─────────────────── */}
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h2 className="text-lg font-bold text-gray-900 mb-1">What&apos;s inside</h2>
        <p className="text-sm text-gray-500 mb-6">
          Each chapter maps directly to a training day and draws from the real Howden FINMA platform data.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.number}
              className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white flex flex-col"
            >
              {/* Colored header — mini chapter cover */}
              <div
                className="px-4 pt-4 pb-5 flex flex-col gap-2"
                style={{ backgroundColor: ch.color }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">
                    {ch.label}
                  </span>
                  <span
                    className="text-xs font-mono font-bold w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "white" }}
                  >
                    {ch.number}
                  </span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.85)" }}>{ch.icon}</div>
                <h3 className="font-bold text-white text-sm leading-tight">{ch.title}</h3>
              </div>
              {/* Bullet list */}
              <div className="px-4 py-3 flex flex-col gap-1.5 flex-1">
                {ch.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-1.5">
                    <span className="mt-[3px] w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                    <span className="text-[11px] text-gray-600 leading-snug">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-16" />
    </div>
  );
}
