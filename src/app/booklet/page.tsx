"use client";

import { useState, useCallback } from "react";
import { Download, BookOpen, Loader2, CheckCircle2, FileText, Layers, Cpu, Workflow, BarChart3, BookMarked, Grid3X3, Network } from "lucide-react";

const CHAPTERS = [
  {
    number: "01",
    title: "Foundations",
    subtitle: "Day 1",
    icon: <BookOpen size={18} />,
    color: "#1E40AF",
    bg: "#EFF6FF",
    description: "Databricks workspace orientation: 7 UI areas, the difference between Workspace and Unity Catalog, and how to navigate the platform from day one.",
  },
  {
    number: "02",
    title: "Data & Catalog",
    subtitle: "Day 2",
    icon: <Layers size={18} />,
    color: "#0891B2",
    bg: "#ECFEFF",
    description: "The Medallion Architecture (Bronze → Silver → Gold), Unity Catalog hierarchy, the 5 Howden CRM entities, and how data lineage is tracked.",
  },
  {
    number: "03",
    title: "Develop & Query",
    subtitle: "Day 3",
    icon: <Cpu size={18} />,
    color: "#059669",
    bg: "#ECFDF5",
    description: "Notebooks vs SQL Editor, compute types, magic commands, and writing your first SQL query against the Howden Gold tables.",
  },
  {
    number: "04",
    title: "Automate & Monitor",
    subtitle: "Day 4",
    icon: <Workflow size={18} />,
    color: "#D97706",
    bg: "#FFFBEB",
    description: "Databricks Jobs, the 5-task FINMA pipeline, DQX data quality rules, and setting up 6-step Alerts for the 31 May submission deadline.",
  },
  {
    number: "05",
    title: "Analyze & Apply",
    subtitle: "Day 5",
    icon: <BarChart3 size={18} />,
    color: "#7C3AED",
    bg: "#F5F3FF",
    description: "Lakeview Dashboards, the four Howden Genie AI Spaces, natural language analytics, and the full end-to-end FINMA data journey.",
  },
  {
    number: "A",
    title: "Glossary",
    subtitle: "Appendix",
    icon: <BookMarked size={18} />,
    color: "#374151",
    bg: "#F9FAFB",
    description: "32 platform terms grouped by category — each with a plain-English definition and a real-world analogy designed for non-technical readers.",
  },
  {
    number: "B",
    title: "Platform Quick Reference",
    subtitle: "Appendix",
    icon: <Grid3X3 size={18} />,
    color: "#374151",
    bg: "#F9FAFB",
    description: "All 16 workspace sidebar components: what each does, when to use it, and who at Howden uses it — your go-to cheat sheet for navigating the platform.",
  },
  {
    number: "C",
    title: "Architecture Reference",
    subtitle: "Appendix",
    icon: <Network size={18} />,
    color: "#374151",
    bg: "#F9FAFB",
    description: "All 11 architecture node types with category color coding, key use-cases, and a component connection map showing how the platform holds together.",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.number}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              style={{ borderTop: `3px solid ${ch.color}` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: ch.bg, color: ch.color }}
                >
                  {ch.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: ch.color }}
                    >
                      {ch.subtitle}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-mono font-bold"
                      style={{ backgroundColor: ch.bg, color: ch.color }}
                    >
                      {ch.number}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5">{ch.title}</h3>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{ch.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-16" />
    </div>
  );
}
