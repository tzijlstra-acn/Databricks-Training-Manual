"use client";

import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { markDayVisited } from "@/lib/progress";
import { CatalogTree } from "@/components/day2/CatalogTree";
import { MedallionFlow } from "@/components/day2/MedallionFlow";
import { MedallionPlayground } from "@/components/day2/MedallionPlayground";
import { AdvancedSection } from "@/components/shared/AdvancedSection";
import { HowdenContext } from "@/components/shared/HowdenContext";

export default function Day2Page() {
  useEffect(() => {
    markDayVisited(2);
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#0891B2" }}>
              <span className="text-white font-bold text-sm">D2</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#0891B2" }}>Day 2</p>
              <h1 className="text-3xl font-bold text-gray-900">Data & Catalog — Find Your Data</h1>
            </div>
          </div>
          <p className="text-lg text-gray-500 max-w-2xl mt-2">
            Navigate Unity Catalog, understand the Medallion Architecture, and know exactly which layer to use for each purpose.
          </p>
          <div
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border"
            style={{ backgroundColor: "#E0F2FE", color: "#0C4A6E", borderColor: "#BAE6FD" }}
          >
            <ArrowRight className="w-4 h-4" />
            Outcome: Navigate Unity Catalog and understand Medallion layers
          </div>
        </div>

        <HowdenContext title="The FINMA scenario in Medallion terms">
          Five CRM systems (BAYO, IBS Alabus, MAX, KETL, Vorsorge Partner) each export a different field name
          for the commission amount. Critically, BAYO is shared by Howden Schweiz AG and SWIBRO AG — its extract
          contains rows for both entities mixed together. <strong>Bronze</strong> stores every extract exactly as
          delivered (untouched audit trail, always recoverable). <strong>Silver</strong> applies the fixes a data
          steward does manually today: rename all commission field variants to one canonical name, split BAYO rows
          correctly by entity, flag anything ambiguous. <strong>Gold</strong> produces 5 separate datasets — one
          per entity — reconciled against Abacus and ready for FINMA submission by 31 May.
        </HowdenContext>

        {/* Catalog Tree */}
        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Unity Catalog Explorer</h2>
            <p className="text-sm text-gray-500 mt-1">
              Browse the catalog hierarchy: Catalog → Schema → Table. Click any table to see its details.
              Toggle between technical naming and an everyday building analogy.
            </p>
          </div>
          <CatalogTree />

          <AdvancedSection title="Managed vs External Tables" badge="Architecture">
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                Unity Catalog tracks two fundamentally different kinds of table. Getting this wrong is expensive —
                dropping a managed table deletes the underlying data permanently.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-red-700 uppercase mb-2">Managed Table</p>
                  <ul className="text-xs text-red-900 space-y-1 list-disc list-inside">
                    <li>Databricks owns metadata AND data files</li>
                    <li><strong>DROP TABLE = data gone forever</strong></li>
                    <li>Simpler — no storage config needed</li>
                    <li>Best for: Gold layer, curated tables</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-700 uppercase mb-2">External Table</p>
                  <ul className="text-xs text-blue-900 space-y-1 list-disc list-inside">
                    <li>Databricks owns metadata only</li>
                    <li>DROP TABLE leaves files intact</li>
                    <li>Data shared with other systems</li>
                    <li>Best for: Bronze raw landing, shared data</li>
                  </ul>
                </div>
              </div>
              <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Managed table (Databricks picks the storage location)
CREATE TABLE enterprise.gold.commission_summary (
  reporting_unit STRING,
  total_commission DECIMAL(18, 2),
  report_date DATE
) USING DELTA;

-- External table (you specify the storage path)
CREATE TABLE enterprise.bronze.raw_policies
USING DELTA
LOCATION 'abfss://raw@storageaccount.dfs.core.windows.net/policies/';`}
              </pre>
            </div>
          </AdvancedSection>

          <AdvancedSection title="Unity Catalog Governance — Row & Column Security" badge="Governance">
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                Unity Catalog lets you enforce fine-grained access at the row and column level — without changing
                the underlying data or creating multiple copies of a table.
              </p>
              <p className="font-medium text-gray-800">Row filters — restrict which rows a user sees:</p>
              <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Create a filter: users only see rows matching their region
CREATE ROW ACCESS POLICY filter_by_region
AS (region STRING)
RETURN region = current_region();

-- Attach to a table
ALTER TABLE enterprise.gold.commission_reporting
ADD ROW FILTER filter_by_region ON (region);`}
              </pre>
              <p className="font-medium text-gray-800">Column masks — hide sensitive values:</p>
              <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Admins see real commission; others see NULL
CREATE COLUMN MASK mask_commission
AS (commission DECIMAL)
RETURN CASE WHEN is_account_admin() THEN commission ELSE NULL END;

ALTER TABLE enterprise.gold.commission_reporting
ALTER COLUMN commission_amount SET MASK mask_commission;`}
              </pre>
              <p className="text-sm text-gray-600">
                Every access — reads, writes, schema changes — is logged to <code className="bg-gray-100 px-1 rounded">system.access.audit</code>,
                giving you a full audit trail for regulatory requirements.
              </p>
            </div>
          </AdvancedSection>
        </section>

        {/* Medallion flow */}
        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Medallion Architecture — Data in Motion</h2>
            <p className="text-sm text-gray-500 mt-1">
              Follow a single customer record through Bronze ingestion, Silver cleaning, and Gold aggregation.
              See exactly what changes at each stage.
            </p>
          </div>
          <MedallionFlow />

          <AdvancedSection title="Delta Format Internals" badge="Architecture">
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                Every Delta write appends a new Parquet file and a JSON entry to the transaction log. Understanding
                this helps you tune performance and manage storage costs.
              </p>
              <div className="bg-gray-800 rounded-xl p-4 font-mono text-xs text-green-400">
                <p className="text-gray-400 mb-2">{"// _delta_log/ commit entry (simplified)"}</p>
                <p>{"{"}</p>
                <p className="pl-4">{'"add": {"path": "part-00000-abc.parquet", "size": 1048576},'}</p>
                <p className="pl-4">{'"commitInfo": {"operation": "WRITE", "timestamp": 1704067200000}'}</p>
                <p>{"}"}</p>
              </div>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Checkpointing</strong> — every 10 commits, Databricks writes a Parquet checkpoint so readers do not have to replay the full log</li>
                <li><strong>VACUUM</strong> — physically deletes Parquet files no longer referenced by the log (default retention: 7 days)</li>
              </ul>
              <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- See full history of a table
DESCRIBE HISTORY enterprise.bronze.customers_raw;

-- Remove files older than 7 days (168 hours)
VACUUM enterprise.bronze.customers_raw RETAIN 168 HOURS;

-- WARNING: never VACUUM below 7 days if you have active streaming readers`}
              </pre>
            </div>
          </AdvancedSection>

          <AdvancedSection title="Schema Evolution & Enforcement" badge="Engineering">
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                Delta Lake is strict about schema by default. This prevents silent data corruption — one of the most
                insidious bugs in data pipelines.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-green-700 uppercase mb-2">Schema Enforcement (default)</p>
                  <p className="text-xs text-green-900">Writes that add/remove columns or change types are <strong>rejected</strong>. Protects you from upstream schema changes breaking downstream.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-700 uppercase mb-2">Schema Evolution (opt-in)</p>
                  <p className="text-xs text-amber-900">New columns in the source are <strong>automatically added</strong> to the target table. Enable with <code>mergeSchema</code> option.</p>
                </div>
              </div>
              <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Enable schema evolution for a single write
df.write.option("mergeSchema", "true") \
  .mode("append") \
  .saveAsTable("enterprise.silver.customers_clean")

-- Add a column without rewriting data
ALTER TABLE enterprise.silver.customers_clean
ADD COLUMN loyalty_tier STRING;

-- Auto-evolution for streaming (set at table level)
ALTER TABLE enterprise.silver.customers_clean
SET TBLPROPERTIES ('delta.columnMapping.mode' = 'name');`}
              </pre>
            </div>
          </AdvancedSection>
        </section>

        {/* Layer quick-reference table */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Layer Quick Reference</h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Layer</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">State of data</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Who queries it</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Use for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    layer: "Bronze",
                    color: "#CD7F32",
                    bg: "#FDF3E7",
                    state: "Raw, unmodified source data",
                    who: "Data Engineers only",
                    use: "Debugging, re-processing, audit trail",
                  },
                  {
                    layer: "Silver",
                    color: "#6B7280",
                    bg: "#F3F4F6",
                    state: "Cleaned, validated, standardised",
                    who: "Data Engineers, Data Scientists",
                    use: "ML features, detailed analysis, joins",
                  },
                  {
                    layer: "Gold",
                    color: "#D97706",
                    bg: "#FFFBEB",
                    state: "Aggregated, business-ready",
                    who: "Analysts, Business Users, Executives",
                    use: "Dashboards, KPIs, reports",
                  },
                ].map(({ layer, color, bg, state, who, use }) => (
                  <tr key={layer} style={{ backgroundColor: bg }}>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-full text-xs"
                        style={{ color, backgroundColor: color + "20", border: `1px solid ${color}40` }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {layer}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{state}</td>
                    <td className="px-5 py-3 text-gray-700">{who}</td>
                    <td className="px-5 py-3 text-gray-700">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Medallion Playground */}
        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Medallion Playground — Watch Records Transform</h2>
            <p className="text-sm text-gray-500 mt-1">
              Four real BAYO extracts, three transformation stages. Click through to see which records pass, which get quarantined, and what the Gold layer looks like for the FINMA submission.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <MedallionPlayground />
          </div>
        </section>
      </div>
    </div>
  );
}
