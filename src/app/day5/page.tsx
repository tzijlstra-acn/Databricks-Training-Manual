"use client";

import { useEffect } from "react";
import { markDayVisited } from "@/lib/progress";
import { DashboardLineage } from "@/components/day5/DashboardLineage";
import { GenieDemo } from "@/components/day5/GenieDemo";
import { AdvancedSection } from "@/components/shared/AdvancedSection";
import { HowdenContext } from "@/components/shared/HowdenContext";
import { ArrowRight, BarChart3 } from "lucide-react";

const capstoneNodes = [
  { id: "source", label: "Source System", color: "#6B7280", bg: "#F9FAFB", desc: "CRM, Mainframe, APIs" },
  { id: "bronze", label: "Bronze", color: "#CD7F32", bg: "#FDF3E7", desc: "Raw ingested data" },
  { id: "silver", label: "Silver", color: "#9CA3AF", bg: "#F3F4F6", desc: "Cleaned & validated" },
  { id: "gold", label: "Gold", color: "#D97706", bg: "#FFFBEB", desc: "Business-ready" },
  { id: "sql", label: "SQL / Queries", color: "#0891B2", bg: "#EFF8FB", desc: "Saved queries" },
  { id: "dashboard", label: "Dashboard", color: "#7C3AED", bg: "#F5F3FF", desc: "Visual KPIs" },
  { id: "genie", label: "Genie AI", color: "#DC2626", bg: "#FEF2F2", desc: "Natural language" },
  { id: "decision", label: "Business Decision", color: "#1F2144", bg: "#E8E9F0", desc: "Value created" },
];

const supportingCapabilities = [
  "Unity Catalog", "Governance", "Compute", "Jobs", "Pipelines", "Data Quality", "Monitoring", "Alerts",
];

export default function Day5Page() {
  useEffect(() => {
    markDayVisited(5);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#7C3AED" }}>
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7C3AED" }}>Day 5</p>
            <h1 className="text-3xl font-bold text-gray-900">Analyze &amp; Apply</h1>
          </div>
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-2">
          Turn trusted data into business decisions. Dashboards, lineage, and natural language analytics.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 text-purple-800 text-sm font-medium px-4 py-2 rounded-full border border-purple-100">
          <ArrowRight className="w-4 h-4" />
          Outcome: Navigate from dashboard KPI back to source data and ask questions in plain English
        </div>
      </div>

      <HowdenContext>
        Today, getting total commission by line of business means someone assembles the CSVs, runs the pivot in
        Excel, and sends a report, sometimes a day later and sometimes with last week&apos;s data. Once the CSVs are flowing
        through Databricks, that same question becomes a 10-second <strong>Genie</strong> query:{" "}
        &ldquo;What is our total commission for Swiss property this quarter?&rdquo; Answered live, from a
        dashboard, by anyone. And if a number looks wrong, you can click it to trace it all the way back to the
        exact row in the original CSV that generated it.
      </HowdenContext>

      {/* Dashboard Lineage */}
      <section className="mb-14">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">Dashboard Lineage: Where Does This Number Come From?</h2>
          <p className="text-sm text-gray-500 mt-1">Click any KPI card to trace its origin back to the source.</p>
        </div>
        <DashboardLineage />

        <AdvancedSection title="Lakeview Dashboard Architecture" badge="Architecture">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Lakeview (AI/BI Dashboards) is Databricks&apos; newer dashboarding tool, replacing the
              legacy &quot;Databricks SQL Dashboards&quot;. It is designed for performance and
              governed data sharing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: "Dataset layer", desc: "SQL queries that define the data powering each widget. Cached independently." },
                { title: "Widget layer", desc: "Counter, table, bar, line, scatter, pie, map. Drag-and-drop layout." },
                { title: "Refresh layer", desc: "Scheduled, manual, or auto-refresh when the SQL Warehouse detects changes." },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-purple-700 mb-1">{title}</p>
                  <p className="text-xs text-purple-900">{desc}</p>
                </div>
              ))}
            </div>
            <p className="font-medium text-gray-800">SQL Optimization for dashboards:</p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Materialized view: pre-compute expensive aggregations
-- Refreshed on a schedule; queries hit the cache, not raw tables
CREATE MATERIALIZED VIEW enterprise.gold.commission_kpi_mv AS
SELECT
    reporting_unit,
    region,
    report_month,
    SUM(commission_amount)  AS total_commission,
    COUNT(DISTINCT customer_id) AS unique_customers
FROM enterprise.gold.commission_reporting
GROUP BY reporting_unit, region, report_month;

-- Zero-copy clone for dashboard dev/test
-- (doesn't duplicate data — shares underlying files)
CREATE TABLE enterprise.dev.commission_kpi_clone
CLONE enterprise.gold.commission_reporting;`}
            </pre>
            <p className="text-sm text-gray-600">
              <strong>Serverless SQL Warehouse:</strong> starts instantly with no warm-up time and charges per query.
              Good for dashboards with unpredictable usage. Identical queries within 10 minutes are served from
              cache automatically.
            </p>
          </div>
        </AdvancedSection>

        <AdvancedSection title="SQL Optimization for Dashboards" badge="Engineering">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Dashboard performance is almost always a query problem, not a hardware problem. These patterns
              eliminate the most common causes of slow dashboards.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Materialized views:</strong> pre-aggregate expensive calculations on a schedule so dashboard queries hit a small pre-computed table.</li>
              <li><strong>Query result cache:</strong> identical queries within 10 minutes are answered instantly from cache. Use parameterised queries to share the cache across users.</li>
              <li><strong>Serverless warehouses:</strong> start instantly, suspend automatically, and charge per query. Best for dashboards with variable traffic.</li>
              <li><strong>Predictive IO:</strong> Databricks pre-fetches data based on recent query history. Enabled by default on Delta tables.</li>
            </ul>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Bad: scanning full table every dashboard load
SELECT reporting_unit, SUM(commission_amount)
FROM enterprise.gold.commission_reporting   -- 500M rows
GROUP BY reporting_unit;

-- Better: query a materialized view (~1000 rows)
SELECT reporting_unit, total_commission
FROM enterprise.gold.commission_kpi_mv
WHERE report_month = date_trunc('month', current_date());

-- Best for high-concurrency: add result cache hint
-- (queries with the same text share cached results)
SELECT /*+ CACHE */ reporting_unit, total_commission
FROM enterprise.gold.commission_kpi_mv;`}
            </pre>
          </div>
        </AdvancedSection>
      </section>

      {/* Genie Demo */}
      <section className="mb-14">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">Genie: Ask Your Data Anything</h2>
          <p className="text-sm text-gray-500 mt-1">Natural language queries powered by AI. No SQL knowledge required.</p>
        </div>
        <GenieDemo />

        <AdvancedSection title="Genie Semantic Layer Configuration" badge="Architecture">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Genie works best when your data is well-described. A Genie Space built on well-annotated Gold tables
              will answer complex business questions reliably. One pointed at raw Bronze data with no descriptions
              will give unreliable answers.
            </p>
            <p className="font-medium text-gray-800">Column annotations (the most impactful thing you can do):</p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Add business-friendly descriptions to columns
-- Genie reads these to understand what the column means

COMMENT ON COLUMN enterprise.gold.commission_reporting.commission_amount
IS 'Total commission earned in CHF, inclusive of all treaty and facultative adjustments. Excludes void policies.';

COMMENT ON COLUMN enterprise.gold.commission_reporting.reporting_unit
IS 'Business unit responsible for the policy. Use this to filter by team or division.';

COMMENT ON TABLE enterprise.gold.commission_reporting
IS 'Primary fact table for commission reporting. Updated daily at 06:00 CET. Use for all commission KPIs.';`}
            </pre>
            <p className="font-medium text-gray-800">Trusted assets (pre-approved SQL that Genie can reference):</p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Save this query as a "Trusted Asset" in the Genie Space
-- Genie will use it verbatim when users ask about DACH commissions

SELECT
    reporting_unit,
    SUM(commission_amount) AS total_commission_chf,
    COUNT(DISTINCT policy_id) AS policy_count
FROM enterprise.gold.commission_reporting
WHERE region IN ('CH', 'DE', 'AT')
  AND policy_status = 'ACTIVE'
  AND report_date >= date_trunc('year', current_date())
GROUP BY reporting_unit
ORDER BY total_commission_chf DESC;`}
            </pre>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs font-bold text-amber-700 mb-1">Genie limitations to know</p>
              <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
                <li>Works best on the Gold layer. Point it at pre-aggregated, well-named tables.</li>
                <li>Struggles with queries that join 4 or more tables. Use views to pre-join complex relationships.</li>
                <li>Does not write data. It is read-only by design.</li>
                <li>Instruction sets (natural language hints) help it handle domain-specific terminology</li>
              </ul>
            </div>
          </div>
        </AdvancedSection>

        <AdvancedSection title="Alert Escalation & Notification Patterns" badge="Operations">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Databricks Alerts evaluate a SQL query on a schedule and trigger notifications when a condition
              is met. Combined with Jobs, you can build sophisticated incident response automations.
            </p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Alert query: fire when quality failures exceed threshold
SELECT COUNT(*) AS failure_count
FROM enterprise.bronze.quarantine
WHERE ingest_date = current_date()
-- Alert condition: failure_count > 10
-- Schedule: every 15 minutes
-- Destinations: Slack #data-ops, PagerDuty (if > 50), email`}
            </pre>
            <div className="bg-gray-800 rounded-xl p-4 font-mono text-xs text-green-400">
              <p className="text-gray-400 mb-2">{"// End-to-end alert → remediation pattern"}</p>
              <p>Alert: quality_failures {">"} 10</p>
              <p className="pl-4">→ Slack: #data-ops-alerts (immediate)</p>
              <p className="pl-4">→ Job trigger: remediation_pipeline</p>
              <p className="pl-8">→ Re-ingest failed records from quarantine</p>
              <p className="pl-8">→ Email data-owner if job also fails</p>
              <p className="pl-4">→ PagerDuty: if failures {">"} 100 (P2 incident)</p>
            </div>
            <ul className="list-disc list-inside space-y-1.5">
              <li><strong>Alert destinations:</strong> Email, Slack, PagerDuty, Teams, generic webhook</li>
              <li><strong>Muting:</strong> schedule maintenance windows to silence alerts during planned downtime</li>
              <li><strong>Alert-to-Job:</strong> Databricks REST API allows alerts to trigger job runs via webhook</li>
              <li><strong>Automation platform integration:</strong> use webhooks to connect alerts to Splunk or similar tools used in regulated environments</li>
            </ul>
          </div>
        </AdvancedSection>
      </section>

      {/* End-to-End Capstone */}
      <section className="mb-14">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">End-to-End: The Complete Journey</h2>
          <p className="text-sm text-gray-500 mt-1">Every step from raw data to business value. Click any node to explore.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {/* Main flow */}
          <div className="flex items-center gap-1 overflow-x-auto pb-4">
            {capstoneNodes.map((node, idx) => (
              <div key={node.id} className="flex items-center gap-1 shrink-0">
                <div
                  className="rounded-xl border-2 p-3 cursor-pointer hover:shadow-md transition-all text-center min-w-[90px]"
                  style={{ backgroundColor: node.bg, borderColor: `${node.color}50` }}
                >
                  <p className="text-xs font-bold" style={{ color: node.color }}>{node.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{node.desc}</p>
                </div>
                {idx < capstoneNodes.length - 1 && (
                  <ArrowRight size={14} className="text-gray-300 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Supporting capabilities */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Supporting Capabilities</p>
            <div className="flex flex-wrap gap-2">
              {supportingCapabilities.map((cap) => (
                <span
                  key={cap}
                  className="text-xs font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-3 py-1"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
