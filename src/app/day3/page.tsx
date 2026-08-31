"use client";

import { useEffect } from "react";
import { markDayVisited } from "@/lib/progress";
import { NotebookSimulator } from "@/components/day3/NotebookSimulator";
import { ComputeExplainer } from "@/components/day3/ComputeExplainer";
import { ComputeStateMachine } from "@/components/day3/ComputeStateMachine";
import { AdvancedSection } from "@/components/shared/AdvancedSection";
import { HowdenContext } from "@/components/shared/HowdenContext";
import { cn } from "@/lib/utils";

const decisionTree = [
  {
    question: "Do you need to write Python?",
    yesPath: "Use a Notebook + All-Purpose Cluster",
    noPath: "Can be done in SQL Editor",
    yesIcon: "📓",
    noIcon: "⚡",
  },
  {
    question: "Is this a scheduled/automated job?",
    yesPath: "Use a Notebook in a Job with Job Cluster",
    noPath: "Use SQL Editor / Interactive Notebook",
    yesIcon: "🔄",
    noIcon: "🖱️",
  },
  {
    question: "Are you building a dashboard or reporting query?",
    yesPath: "Use SQL Editor with SQL Warehouse",
    noPath: "Use a Notebook for exploration",
    yesIcon: "📊",
    noIcon: "🔬",
  },
];

const magicCommands = [
  { cmd: "%sql", desc: "Switch cell to SQL" },
  { cmd: "%python", desc: "Switch cell to Python" },
  { cmd: "%scala", desc: "Switch cell to Scala" },
  { cmd: "%sh", desc: "Run shell commands" },
  { cmd: "%run", desc: "Execute another notebook" },
  { cmd: "%fs", desc: "Databricks filesystem commands" },
  { cmd: "%md", desc: "Markdown cell" },
];

export default function Day3Page() {
  useEffect(() => {
    markDayVisited(3);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">
            💻
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wide bg-green-100 px-2 py-0.5 rounded-full">
                Day 3
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Develop &amp; Query</h1>
            <p className="text-gray-600 mt-1">
              Learn how notebooks work, write your first SQL query on real data, and understand how compute powers your work.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Databricks Notebooks", "SQL vs Python", "All-Purpose Clusters", "SQL Warehouses"].map((topic) => (
                <span key={topic} className="text-xs bg-white border border-green-200 text-green-700 px-2.5 py-1 rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HowdenContext>
        Today, if someone wants to calculate the loss ratio across the Swiss property portfolio, they assemble the
        CSVs manually, run formulas in Excel, and hope nothing breaks on the large files. That analysis lives only
        on their laptop — nobody else can reproduce it or build on it. A Databricks <strong>notebook</strong> is
        the replacement: the logic is written once, runs on the same shared data everyone uses, and can handle the
        full dataset without crashing. Anyone on the team can open it and re-run it tomorrow.
      </HowdenContext>

      {/* Notebook Simulator */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Interactive Notebook</h2>
        <p className="text-sm text-gray-500 mb-4">
          Click <strong>▶ Run</strong> on each cell to execute it and see the output — just like a real Databricks notebook.
        </p>
        <NotebookSimulator />

        <AdvancedSection title="Notebook Magic Commands & Widgets" badge="Development">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Magic commands switch a cell&apos;s language or trigger special behaviours. They must be the
              first line of the cell.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2 font-semibold text-gray-600">Command</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-600">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {magicCommands.map(({ cmd, desc }) => (
                    <tr key={cmd}>
                      <td className="px-4 py-2 font-mono text-[#1F2144] font-semibold">{cmd}</td>
                      <td className="px-4 py-2 text-gray-700">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-medium text-gray-800">Widget parameters — create interactive inputs:</p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`# Create a text widget with a default value
dbutils.widgets.text("region", "DACH", "Select Region")

# Read the current widget value
region = dbutils.widgets.get("region")

# Use in a SQL query
spark.sql(f"SELECT * FROM enterprise.gold.customer_summary WHERE region = '{region}'")`}
            </pre>
            <p className="font-medium text-gray-800">Filesystem operations with dbutils.fs:</p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`# List files in ADLS
dbutils.fs.ls("abfss://raw@storageaccount.dfs.core.windows.net/")

# Copy a file
dbutils.fs.cp("source/path/file.csv", "dest/path/file.csv")

# Or use %fs magic:
# %fs ls abfss://raw@storageaccount.dfs.core.windows.net/`}
            </pre>
          </div>
        </AdvancedSection>

        <AdvancedSection title="Spark Execution Model — DAG, Stages & Tasks" badge="Engineering">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Spark uses <strong>lazy evaluation</strong>: transformations (<code className="bg-gray-100 px-1 rounded">.filter()</code>,
              <code className="bg-gray-100 px-1 rounded">.join()</code>) build up a plan called a DAG.
              Nothing executes until you call an <strong>action</strong> (<code className="bg-gray-100 px-1 rounded">.count()</code>,
              <code className="bg-gray-100 px-1 rounded">.write()</code>).
            </p>
            <div className="bg-gray-800 rounded-xl p-4 font-mono text-xs text-green-400">
              <p className="text-gray-400 mb-2">{"// Execution hierarchy"}</p>
              <p>Action (.count, .write)</p>
              <p className="pl-4">└── Job</p>
              <p className="pl-8">└── Stage (separated by shuffle/sort boundaries)</p>
              <p className="pl-12">└── Task (one per partition, runs on one executor core)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs font-bold text-green-700 mb-1">Narrow transformation (fast)</p>
                <p className="text-xs text-green-900"><code>.filter()</code>, <code>.map()</code> — data stays on same partition, no network shuffle</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                <p className="text-xs font-bold text-orange-700 mb-1">Wide transformation (slow)</p>
                <p className="text-xs text-orange-900"><code>.groupBy()</code>, <code>.join()</code> — triggers shuffle across all executors</p>
              </div>
            </div>
            <p className="font-medium text-gray-800">Controlling partitions:</p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`# Increase partitions — distribute work more evenly
df = df.repartition(200)

# Reduce partitions — consolidate before writing
df = df.coalesce(10)  # Faster than repartition; no full shuffle

# Check partition count
print(df.rdd.getNumPartitions())

# Open the Spark UI (in notebook toolbar) to see:
# - Stage duration, task distribution, shuffle read/write`}
            </pre>
          </div>
        </AdvancedSection>
      </div>

      {/* Compute Explainer */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Understanding Compute</h2>
        <p className="text-sm text-gray-500 mb-4">
          Compute is what actually executes your code. Without it, your notebook is just a text file.
          Walk through the cluster lifecycle — start, attach, run, idle, terminate — before reading the reference cards below.
        </p>
        <ComputeStateMachine />
        <div className="mt-5">
          <ComputeExplainer />
        </div>

        <AdvancedSection title="Cluster Configuration & Optimization" badge="Engineering">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Cluster configuration is the single biggest lever for both performance and cost. Over-provisioning
              wastes money; under-provisioning causes timeouts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs font-bold text-blue-700 mb-1">Memory-optimised</p>
                <p className="text-xs text-blue-900">Large joins, ML model training, caching big datasets in memory</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs font-bold text-green-700 mb-1">Compute-optimised</p>
                <p className="text-xs text-green-900">CPU-heavy ETL, Photon-accelerated SQL, parallel data processing</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                <p className="text-xs font-bold text-purple-700 mb-1">GPU</p>
                <p className="text-xs text-purple-900">Deep learning, image processing, LLM fine-tuning</p>
              </div>
            </div>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`# Photon helps most with:
# ✅ SQL aggregations, joins, window functions
# ✅ Batch ETL reading Parquet/Delta
# ✅ Delta MERGE operations

# Photon does NOT help with:
# ❌ Python UDFs (still run on JVM/Python worker)
# ❌ Custom ML training loops
# ❌ Structured streaming micro-batch overhead

# Cost formula
# cost = DBU_rate × instance_hours × num_workers
# A 4-worker Standard_D8ds_v4 cluster at $0.22/DBU
# running 2h = 4 × 2 × (DBU_per_instance) × $0.22`}
            </pre>
          </div>
        </AdvancedSection>

        <AdvancedSection title="Query Optimization & Explain Plans" badge="Engineering">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Before spending hours optimising a query, read the explain plan. Databricks shows you exactly how
              Spark will execute your SQL — including which optimisations it applied automatically.
            </p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- See the full query plan (logical + physical)
EXPLAIN EXTENDED
SELECT reporting_unit, SUM(commission_amount)
FROM enterprise.gold.customer_summary
WHERE region = 'DACH'
GROUP BY reporting_unit;
-- Look for: FileScan (with PartitionFilters), HashAggregate, Sort`}
            </pre>
            <ul className="list-disc list-inside space-y-1.5">
              <li><strong>Predicate pushdown</strong> — Databricks automatically pushes <code className="bg-gray-100 px-1 rounded">WHERE</code> filters to the storage scan, skipping irrelevant Parquet files</li>
              <li><strong>Z-ordering</strong> — co-locate related data in the same files; speeds up filtered reads dramatically</li>
              <li><strong>Liquid Clustering</strong> — newer adaptive approach; no need to pick Z-order columns upfront</li>
            </ul>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Z-order by your most common filter columns
OPTIMIZE enterprise.silver.customers_clean
ZORDER BY (region, customer_id);

-- Cache a hot reference table
CACHE TABLE enterprise.gold.reference_rates;

-- Liquid clustering (use instead of Z-order for new tables)
CREATE TABLE enterprise.silver.policies_clustered
CLUSTER BY (policy_date, region)
AS SELECT * FROM enterprise.silver.policies_raw;`}
            </pre>
          </div>
        </AdvancedSection>
      </div>

      {/* SQL Editor vs Notebook Decision Tree */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">SQL Editor vs Notebook — When to Use Which?</h2>
        <p className="text-sm text-gray-500 mb-5">Use this decision tree to pick the right tool for your task.</p>

        <div className="space-y-4">
          {decisionTree.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{item.question}</p>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className={cn("rounded-xl border p-3", "bg-green-50 border-green-200")}>
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">✅ YES</p>
                      <p className="text-sm text-green-800 font-medium">
                        <span className="mr-1">{item.yesIcon}</span>
                        {item.yesPath}
                      </p>
                    </div>
                    <div className={cn("rounded-xl border p-3", "bg-blue-50 border-blue-200")}>
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">❌ NO</p>
                      <p className="text-sm text-blue-800 font-medium">
                        <span className="mr-1">{item.noIcon}</span>
                        {item.noPath}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-primary-50 border border-primary-100 p-4 flex gap-3">
          <span className="text-lg">💡</span>
          <p className="text-sm text-primary-800">
            <strong>Rule of thumb:</strong> Notebooks for development and Python. SQL Editor for analytics and dashboards. Jobs for automation.
          </p>
        </div>
      </div>
    </div>
  );
}
