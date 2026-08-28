"use client";

import { useEffect } from "react";
import { Database, Folder, FileText, Table2, Lock, ArrowRight } from "lucide-react";
import { markDayVisited } from "@/lib/progress";
import { WorkspaceExplorer } from "@/components/day1/WorkspaceExplorer";
import { FirstTenMinutes } from "@/components/day1/FirstTenMinutes";

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
              <h1 className="text-3xl font-bold text-gray-900">Foundations — Meet the Platform</h1>
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

        {/* Workspace Explorer */}
        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">The Databricks Workspace</h2>
            <p className="text-sm text-gray-500 mt-1">
              This is an interactive mockup of the real interface. Click any sidebar item to learn what it does.
            </p>
          </div>
          <WorkspaceExplorer />
        </section>

        {/* First 10 Minutes */}
        <section className="mb-14">
          <FirstTenMinutes />
        </section>

        {/* Workspace vs Catalog comparison */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Workspace vs Catalog — What is the Difference?</h2>
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
                Think of the Workspace as your <strong>file system</strong> — it holds the code and development artefacts that you and your team create.
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
                Think of the Catalog as your <strong>data library</strong> — it holds all the tables, schemas, and data with access control and lineage.
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
