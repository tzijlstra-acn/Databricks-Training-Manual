"use client";

import { cn } from "@/lib/utils";

const analogies = [
  {
    label: "Notebook",
    icon: "🚗",
    analogy: "Driver",
    description: "You write the instructions. The notebook is your steering wheel.",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
  },
  {
    label: "Compute",
    icon: "⚙️",
    analogy: "Engine",
    description: "The cluster does the heavy lifting. Without it, your code goes nowhere.",
    color: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100",
  },
  {
    label: "Data",
    icon: "📦",
    analogy: "Cargo",
    description: "Your tables and files are the payload being transported and transformed.",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
  },
  {
    label: "Result",
    icon: "🏁",
    analogy: "Destination",
    description: "The output (a dashboard, a Gold table, or a chart) is where your journey ends.",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
  },
];

const allPurposeFeatures = {
  title: "All-Purpose Compute",
  subtitle: "Cluster",
  icon: "🔧",
  color: "bg-bronze-bg border-bronze-border",
  titleColor: "text-bronze-text",
  bestFor: [
    "Interactive notebook development",
    "Ad-hoc data exploration",
    "Python & SQL mixed workflows",
    "Machine learning experiments",
  ],
  characteristics: [
    "Stays alive while you work",
    "Shared across notebooks",
    "Starts in ~2–5 minutes",
    "Full Spark cluster",
  ],
  cost: "Higher cost: it runs continuously while you are working and shuts off automatically after 2 hours of inactivity.",
};

const jobComputeFeatures = {
  title: "Job Compute",
  subtitle: "Per-Job Cluster",
  icon: "⚡",
  color: "bg-gold-bg border-gold-border",
  titleColor: "text-gold-text",
  bestFor: [
    "Scheduled pipeline runs",
    "Automated data transformation jobs",
    "Production jobs",
    "Dashboard refresh triggers",
  ],
  characteristics: [
    "Spins up only when job runs",
    "Dedicated per job run",
    "Auto-terminates on completion",
    "Isolated environment",
  ],
  cost: "Lower cost: you only pay while the job is actually running. Best for scheduled tasks that run at a predictable time each day.",
};

export function ComputeExplainer() {
  return (
    <div className="space-y-6">
      {/* Analogy row */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          The Road Trip Analogy
        </h3>
        <div className="flex items-center gap-0 overflow-x-auto">
          {analogies.map((item, i) => (
            <div key={item.label} className="flex items-center flex-shrink-0">
              <div
                className={cn(
                  "rounded-2xl border p-4 w-44 transition-all hover:shadow-md hover:-translate-y-0.5",
                  item.color
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3", item.iconBg)}>
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">{item.label}</div>
                <div className="text-sm font-semibold text-gray-900 mt-0.5">{item.analogy}</div>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
              </div>

              {i < analogies.length - 1 && (
                <div className="flex items-center px-2 flex-shrink-0">
                  <div className="flex items-center gap-0.5 text-gray-300">
                    <div className="w-6 h-0.5 bg-gray-300" />
                    <span className="text-gray-400 text-xs">▶</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side compute comparison */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Which Compute Should I Use?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[allPurposeFeatures, jobComputeFeatures].map((compute) => (
            <div
              key={compute.title}
              className={cn(
                "rounded-2xl border p-5 transition-all hover:shadow-md",
                compute.color
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{compute.icon}</span>
                <div>
                  <p className={cn("font-bold text-base", compute.titleColor)}>{compute.title}</p>
                  <p className="text-xs text-gray-500">{compute.subtitle}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Best For</p>
                  <ul className="space-y-1">
                    {compute.bestFor.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Characteristics</p>
                  <ul className="space-y-1">
                    {compute.characteristics.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-white/60 border border-white/80 p-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">💰 Cost Implication</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{compute.cost}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SQL Warehouse note */}
        <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 p-4 flex gap-3">
          <span className="text-xl flex-shrink-0">⚡</span>
          <div>
            <p className="text-sm font-semibold text-primary-800">SQL Warehouse: for Pure SQL and Dashboards</p>
            <p className="text-xs text-primary-700 mt-1 leading-relaxed">
              When running SQL from the SQL Editor, Genie, or refreshing dashboards, use a <strong>SQL Warehouse</strong> instead.
              It is built for SQL queries: faster and cheaper for analytics, with no need to manage a full Spark cluster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
