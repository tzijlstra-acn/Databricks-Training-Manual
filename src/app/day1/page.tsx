"use client";

import { useEffect } from "react";
import { Database, Folder, FileText, Table2, Lock, ArrowRight } from "lucide-react";
import { markDayVisited } from "@/lib/progress";
import { WhatIsDatabricks } from "@/components/day1/WhatIsDatabricks";
import { WorkspaceExplorer } from "@/components/day1/WorkspaceExplorer";
import { UIWalkthrough } from "@/components/day1/UIWalkthrough";
import { FirstTenMinutes } from "@/components/day1/FirstTenMinutes";
import { AdvancedSection } from "@/components/shared/AdvancedSection";
import { HowdenContext } from "@/components/shared/HowdenContext";

export default function Day1Page() {
  useEffect(() => {
    markDayVisited(1);
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D1</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Day 1</p>
              <h1 className="text-3xl font-bold text-gray-900">Foundations: Meet the Platform</h1>
            </div>
          </div>
          <p className="text-lg text-gray-500 max-w-2xl mt-2">
            Understand where everything lives. By the end of today you will navigate the Databricks workspace with confidence.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-primary-50 text-primary-800 text-sm font-medium px-4 py-2 rounded-full border border-primary-100">
            <ArrowRight className="w-4 h-4" />
            Outcome: Know your way around the platform
          </div>
        </div>

        <HowdenContext>
          Three types of source data feed the pipeline. First: commission exports extracted manually from five CRMs
          (BAYO, IBS Alabus, MAX, KETL, and the Vorsorge Partner CRM), uploaded or emailed by data stewards. Second: a{" "}
          <strong>product type mapping table</strong> that links CRM product codes to the FINMA intermediary product
          categories required for regulatory submission. Third: an <strong>insurer name mapping table</strong> that
          resolves the insurer names recorded in each CRM to the FINMA-registered entity names. Both reference tables
          arrive as dedicated database uploads, separate from the CRM extracts. Databricks is the shared engine that
          brings all three together: the <strong>Workspace</strong> holds the scripts that join and validate them
          consistently, and the <strong>Catalog</strong> becomes the single governed place where the result lives.
          No more spreadsheets flying around in email.
        </HowdenContext>

        {/* What is Databricks */}
        <section className="mb-14">
          <WhatIsDatabricks />
        </section>

        {/* Workspace Explorer */}
        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">The Databricks Workspace</h2>
            <p className="text-sm text-gray-500 mt-1">
              This is an interactive mockup of the real interface. Click any sidebar item to learn what it does.
            </p>
          </div>
          <WorkspaceExplorer />

          <AdvancedSection title="Delta Lake: The Storage Layer" badge="Architecture">
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                Delta Lake is an open-source storage layer that brings <strong>ACID transactions</strong> to data lakes.
                It sits on top of your cloud object store (ADLS, S3, GCS) and adds a transaction log that turns a pile
                of Parquet files into a reliable, queryable table.
              </p>
              <div className="bg-gray-800 rounded-xl p-4 font-mono text-xs">
                <p className="text-gray-400 mb-2">{"// What a Delta Table looks like on disk"}</p>
                <p className="text-green-400">my-table/</p>
                <p className="text-green-400 pl-4">├── part-00000-abc.parquet</p>
                <p className="text-green-400 pl-4">├── part-00001-def.parquet</p>
                <p className="text-yellow-400 pl-4">└── _delta_log/</p>
                <p className="text-yellow-400 pl-8">├── 00000000000000000000.json  {"// first write"}</p>
                <p className="text-yellow-400 pl-8">├── 00000000000000000001.json  {"// second write"}</p>
                <p className="text-yellow-400 pl-8">└── 00000000000000000010.checkpoint.parquet</p>
              </div>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>ACID transactions</strong>: concurrent reads and writes without data corruption.</li>
                <li><strong>Scalable metadata</strong>: handles billions of files efficiently.</li>
                <li><strong>Schema enforcement</strong>: rejects any write that would break the table schema.</li>
                <li><strong>Time Travel</strong>: query any historical version of a table by date or version number.</li>
              </ul>
              <p className="italic text-gray-500">Think of it as a database engine built on top of files.</p>
              <p className="font-medium text-gray-800">Time Travel example:</p>
              <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`SELECT * FROM enterprise.gold.customer_summary
TIMESTAMP AS OF '2024-01-01';

-- Or by version number:
SELECT * FROM enterprise.gold.customer_summary VERSION AS OF 42;`}
              </pre>
            </div>
          </AdvancedSection>

          <AdvancedSection title="Apache Spark: The Compute Engine" badge="Engineering">
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                Spark is a <strong>distributed computing engine</strong>. It splits work across many machines so a
                query that would take hours on a single server completes in minutes. Databricks is the managed,
                performance-optimised platform built by the creators of Spark.
              </p>
              <div className="bg-gray-800 rounded-xl p-4 font-mono text-xs text-green-400">
                <p className="text-gray-400 mb-2">{"// Spark architecture"}</p>
                <p>Driver (your notebook) → Cluster Manager → Worker nodes (Executors)</p>
                <p className="text-gray-400 mt-2">{"// Driver plans the query. Executors do the work in parallel."}</p>
              </div>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>DataFrames</strong>: the primary way to work with structured data in Spark, similar to a table but distributed across many machines.</li>
                <li><strong>Lazy evaluation</strong>: transformations are planned but not executed until you trigger an action such as <code className="bg-gray-100 px-1 rounded">.count()</code>.</li>
                <li><strong>Photon engine</strong>: a Databricks-built query engine that accelerates SQL and batch processing by 2 to 10 times compared to standard Spark.</li>
              </ul>
              <p className="font-medium text-gray-800">When Spark matters vs. when it does not:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-700 mb-1">Use Spark for</p>
                  <p className="text-xs text-green-800">Data {">"} 1 GB, complex joins, ML feature engineering, streaming</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-amber-700 mb-1">Overkill for</p>
                  <p className="text-xs text-amber-800">{"<"} 100 MB lookups, simple single-row inserts, ad-hoc small queries</p>
                </div>
              </div>
            </div>
          </AdvancedSection>

          <AdvancedSection title="Access Control Model" badge="Administration">
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                Databricks has two levels of identity: <strong>workspace-level</strong> (notebooks, clusters) and
                <strong> account-level</strong> (Unity Catalog, billing). Understanding this prevents the most common
                &quot;I can&apos;t see the table&quot; support tickets.
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Users</strong>: individual people, identified by their email address.</li>
                <li><strong>Service Principals</strong>: machine identities used for automated pipelines, with no human login required.</li>
                <li><strong>Groups</strong>: collections of users or service principals. Assign permissions once at the group level rather than user by user.</li>
                <li><strong>Personal Access Tokens (PATs)</strong>: long-lived API keys for tooling integrations. Rotate them regularly.</li>
              </ul>
              <p className="font-medium text-gray-800">Unity Catalog permission hierarchy:</p>
              <div className="bg-gray-800 rounded-xl p-4 font-mono text-xs text-green-400">
                <p>Metastore (account-level)</p>
                <p className="pl-4">└── Catalog  (e.g. enterprise)</p>
                <p className="pl-8">└── Schema   (e.g. gold)</p>
                <p className="pl-12">└── Table    (e.g. customer_summary)</p>
              </div>
              <p className="font-medium text-gray-800">GRANT / REVOKE syntax:</p>
              <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Grant read access to a group
GRANT SELECT ON TABLE enterprise.gold.customer_summary
TO \`analysts@company.com\`;

-- Grant write access to a service principal
GRANT MODIFY ON SCHEMA enterprise.silver
TO \`sp-pipeline-prod\`;

-- Revoke
REVOKE SELECT ON TABLE enterprise.gold.customer_summary
FROM \`temp-contractor@company.com\`;`}
              </pre>
            </div>
          </AdvancedSection>
        </section>

        {/* Animated UI Walkthrough */}
        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">See It In Action</h2>
            <p className="text-sm text-gray-500 mt-1">
              Three guided walkthroughs showing how the common interactions actually look and where to click.
              Step through manually or press Play to let it run.
            </p>
          </div>
          <UIWalkthrough />
        </section>

        {/* First 10 Minutes */}
        <section className="mb-14">
          <FirstTenMinutes />
        </section>

        {/* Workspace vs Catalog comparison */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Workspace vs Catalog: What is the Difference?</h2>
            <p className="text-sm text-gray-500 mt-1">
              New Databricks users often confuse these two. Here is the essential distinction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Workspace card */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900">Workspace</h3>
                  <p className="text-xs text-blue-600 font-medium">Where working assets live</p>
                </div>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-4">
                Think of the Workspace as your <strong>file system</strong>. It holds the code and working files that you and your team create.
              </p>
              <ul className="space-y-2.5">
                {[
                  { Icon: FileText, label: "Notebooks", desc: "Code cells for Python, SQL, Scala" },
                  { Icon: Folder, label: "Folders", desc: "Organise notebooks by project or team" },
                  { Icon: FileText, label: "Dashboards", desc: "Visual displays built from queries" },
                ].map(({ Icon, label, desc }) => (
                  <li key={label} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-blue-700" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-blue-900">{label}</span>
                      <span className="text-xs text-blue-600 block">{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-700 font-medium">
                  Think of it as your <span className="bg-blue-200 px-1.5 py-0.5 rounded">Google Drive for code</span>
                </p>
              </div>
            </div>

            {/* Catalog card */}
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900">Catalog</h3>
                  <p className="text-xs text-green-600 font-medium">Where governed data assets live</p>
                </div>
              </div>
              <p className="text-sm text-green-800 leading-relaxed mb-4">
                Think of the Catalog as your <strong>data library</strong>. It holds all the tables and data assets with access control and a full history of where data came from.
              </p>
              <ul className="space-y-2.5">
                {[
                  { Icon: Database, label: "Catalogs", desc: "Top-level namespace (e.g. enterprise)" },
                  { Icon: Folder, label: "Schemas", desc: "Bronze, Silver, Gold layers" },
                  { Icon: Table2, label: "Tables", desc: "Actual data rows and columns" },
                  { Icon: Lock, label: "Permissions", desc: "Who can read, write, or manage each asset" },
                ].map(({ Icon, label, desc }) => (
                  <li key={label} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-green-700" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-green-900">{label}</span>
                      <span className="text-xs text-green-600 block">{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-green-200">
                <p className="text-xs text-green-700 font-medium">
                  Think of it as your <span className="bg-green-200 px-1.5 py-0.5 rounded">database with a governance layer</span>
                </p>
              </div>
            </div>
          </div>

          {/* Summary callout */}
          <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-200 p-5 flex items-start gap-4">
            <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">The golden rule</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-blue-700">Workspace</span> is where you <em>write code</em>.{" "}
                <span className="font-semibold text-green-700">Catalog</span> is where you <em>find data</em>.
                Your notebooks in Workspace query tables from the Catalog.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
