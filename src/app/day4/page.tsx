"use client";

import { useEffect } from "react";
import { markDayVisited } from "@/lib/progress";
import { PipelineVisualizer } from "@/components/day4/PipelineVisualizer";
import { DQXFlow } from "@/components/day4/DQXFlow";
import { AdvancedSection } from "@/components/shared/AdvancedSection";
import { HowdenContext } from "@/components/shared/HowdenContext";
import { recentRuns } from "@/data/pipeline";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const successCount = recentRuns.filter((r) => r.status === "success").length;
const failCount = recentRuns.filter((r) => r.status === "failed").length;

const donutData = [
  { name: "Success", value: successCount },
  { name: "Failed", value: failCount },
];

const DONUT_COLORS = ["#22C55E", "#EF4444"];

export default function Day4Page() {
  useEffect(() => {
    markDayVisited(4);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide bg-amber-100 px-2 py-0.5 rounded-full">
                Day 4
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Automate &amp; Monitor</h1>
            <p className="text-gray-600 mt-1">
              Build automated pipelines, enforce data quality gates, and monitor your workflows — so bad data never reaches your stakeholders.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Databricks Jobs", "Pipeline DAG", "Data Quality (DQX)", "Monitoring & Alerting"].map((topic) => (
                <span key={topic} className="text-xs bg-white border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HowdenContext>
        Instead of an analyst manually downloading policy files from carrier portals every morning, a Databricks
        <strong> Job</strong> does it automatically at 2 am — ingesting new policies, running data quality checks
        (is the premium present? is the insured name non-null? are coverage dates valid?), and if everything
        passes, updating the Gold commission tables so your reporting is fresh when the team arrives. If a quality
        check fails, an <strong>alert</strong> fires immediately — bad data never reaches your dashboards.
      </HowdenContext>

      {/* Pipeline Visualizer */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Pipeline Visualizer</h2>
        <p className="text-sm text-gray-500 mb-4">
          Click <strong>Run Now</strong> to simulate the pipeline. Watch tasks activate in sequence — and see what happens when a quality gate fails.
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <PipelineVisualizer />
        </div>

        <AdvancedSection title="Multi-Task Job Orchestration" badge="Engineering">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Databricks Jobs can orchestrate complex multi-step workflows with conditional branching, retry logic,
              and cross-task value passing — no external orchestrator required for most use cases.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Notebook", "Python script", "SQL", "DLT pipeline", "dbt", "Spark JAR"].map((t) => (
                <div key={t} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 text-center">{t}</div>
              ))}
            </div>
            <p className="font-medium text-gray-800">Passing values between tasks:</p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`# Task 1: Ingest — store a result for downstream tasks
df = spark.read.format("csv").load("...")
dbutils.jobs.taskValues.set(key="record_count", value=df.count())

# Task 2: Validate — read the upstream value
count = dbutils.jobs.taskValues.get(
    taskKey="ingest",
    key="record_count",
    default=0
)
if count == 0:
    raise Exception("Upstream produced zero records — aborting")`}
            </pre>
            <p className="font-medium text-gray-800">Branch conditions:</p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`# In the Job UI or API, set task dependencies:
# - depends_on: ["ingest"]  with  if_succeeded
# - depends_on: ["ingest"]  with  if_failed   → alert_task
# - depends_on: ["ingest"]  with  if_any      → always runs (cleanup)

# Retry policy (set per task in Job settings):
# max_retries: 3
# retry_on_timeout: true
# timeout_seconds: 3600`}
            </pre>
          </div>
        </AdvancedSection>

        <AdvancedSection title="Delta Live Tables (DLT) — Declarative Pipelines" badge="Architecture">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              DLT flips the orchestration model: instead of writing imperative code that runs tasks in order,
              you <strong>declare</strong> what each table should contain and Databricks works out the
              execution order automatically.
            </p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`import dlt
from pyspark.sql import functions as F

# Bronze: raw ingest
@dlt.table(comment="Raw policy records from source system")
def bronze_policies():
    return spark.readStream.format("cloudFiles") \
        .option("cloudFiles.format", "json") \
        .load("abfss://raw@storage.dfs.core.windows.net/policies/")

# Silver: clean + expectations
@dlt.expect("valid_commission", "commission_amount > 0")
@dlt.expect_or_drop("non_null_customer", "customer_id IS NOT NULL")
@dlt.table(comment="Validated policy records")
def silver_policies():
    return dlt.read_stream("bronze_policies") \
        .withColumn("ingest_date", F.current_date())

# Gold: aggregate
@dlt.table(comment="Commission KPIs by reporting unit")
def gold_commission_summary():
    return dlt.read("silver_policies") \
        .groupBy("reporting_unit") \
        .agg(F.sum("commission_amount").alias("total_commission"))`}
            </pre>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs font-bold text-green-700 mb-1">Use DLT when</p>
                <p className="text-xs text-green-900">You need built-in data quality, automatic lineage, and simple dependency management</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs font-bold text-blue-700 mb-1">Use standard Jobs when</p>
                <p className="text-xs text-blue-900">You need complex branching, external API calls, or dbt/non-DLT task types</p>
              </div>
            </div>
          </div>
        </AdvancedSection>
      </div>

      {/* DQX Flow */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Data Quality with DQX</h2>
        <p className="text-sm text-gray-500 mb-4">
          DQX (Databricks Quality Extension) applies rule-based gates before data reaches Gold. Only records passing all rules flow through.
        </p>
        <DQXFlow />

        <AdvancedSection title="DQX Rule Writing" badge="Engineering">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              DQX rules are Python objects that wrap a SQL expression. Each rule has a name, an expression,
              and an action that determines what happens when records fail.
            </p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`from databricks.labs.dqx.col_rules import (
    DQXRule, is_not_null, is_in_list, is_in_range
)

rules = [
    # Use built-in helpers
    is_not_null("customer_id"),
    is_in_list("country", ["CH", "DE", "AT", "GB"]),
    is_in_range("commission_amount", min=0, max=10_000_000),

    # Or write custom SQL expressions
    DQXRule(
        name="commission_positive",
        constraint="commission_amount > 0",
        criticality="warn"   # warn | error
    ),
    DQXRule(
        name="valid_policy_date",
        constraint="policy_date >= '2020-01-01' AND policy_date <= current_date()",
        criticality="error"
    ),
]

# Apply rules — returns (good_df, bad_df)
from databricks.labs.dqx.engine import DQEngine
engine = DQEngine(spark)
good_df, bad_df = engine.apply_checks_and_split(df, rules)

# Write quarantined records for investigation
bad_df.write.mode("append").saveAsTable("enterprise.bronze.quarantine")`}
            </pre>
            <p className="text-sm text-gray-600">
              The quarantine table schema includes the original record plus a <code className="bg-gray-100 px-1 rounded">_errors</code> column
              listing which rules failed and why — making it easy for data stewards to investigate issues.
            </p>
          </div>
        </AdvancedSection>
      </div>

      {/* Monitoring section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Monitoring &amp; Observability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Donut chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Job Success Rate (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((_entry, index) => (
                    <Cell key={index} fill={DONUT_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} run${Number(v) !== 1 ? "s" : ""}`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
                <p className="text-xs text-gray-500">Successful</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{failCount}</p>
                <p className="text-xs text-gray-500">Failed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-800">
                  {Math.round((successCount / recentRuns.length) * 100)}%
                </p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Recent runs timeline */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Runs Timeline</h3>
            <div className="relative pl-5">
              {/* Timeline line */}
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-3">
                {recentRuns.map((run) => (
                  <div key={run.id} className="relative flex items-start gap-3">
                    <div
                      className={cn(
                        "absolute -left-3.5 w-3 h-3 rounded-full border-2 border-white",
                        run.status === "success" ? "bg-green-500" : "bg-red-500"
                      )}
                    />
                    <div
                      className={cn(
                        "flex-1 rounded-xl border p-2.5",
                        run.status === "success"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-600">{run.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-400">{run.duration}</span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                              run.status === "success"
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            )}
                          >
                            {run.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AdvancedSection title="Observability & Monitoring" badge="Operations">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Databricks exposes system telemetry through <strong>system tables</strong> — Delta tables you can
              query like any other table. No external monitoring tool required for most operational dashboards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { table: "system.lakeflow.job_run_timeline", desc: "Job run history, duration, status" },
                { table: "system.access.audit", desc: "Every data access event" },
                { table: "system.billing.usage", desc: "DBU consumption by workspace/tag" },
              ].map(({ table, desc }) => (
                <div key={table} className="bg-[#F0F1F5] border border-[#E2E3EA] rounded-xl p-3">
                  <p className="text-[10px] font-mono font-semibold text-[#1F2144] mb-1">{table}</p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
            <p className="font-medium text-gray-800">Alert on repeated failures using system tables:</p>
            <pre className="bg-[#1F2144] text-green-400 font-mono text-xs rounded-xl p-4 overflow-x-auto">
{`-- Jobs that failed more than twice in the last 24 hours
SELECT
    job_id,
    COUNT(*) AS failure_count,
    MAX(period_end_time) AS last_failure
FROM system.lakeflow.job_run_timeline
WHERE result_state = 'FAILED'
  AND period_start_time > DATEADD(hour, -24, NOW())
GROUP BY job_id
HAVING COUNT(*) > 2
ORDER BY failure_count DESC;

-- Save this as a SQL Alert in the Databricks workspace
-- and configure it to fire to Slack / PagerDuty / email`}
            </pre>
          </div>
        </AdvancedSection>
      </div>
    </div>
  );
}
