"use client";

import { useState } from "react";
import {
  Database,
  Layers,
  Table2,
  ChevronRight,
  ChevronDown,
  X,
  Hash,
  Info,
  Building2,
} from "lucide-react";
import { catalogTree } from "@/data/platformComponents";
import { MedallionBadge } from "@/components/shared/MedallionBadge";
import { MedallionLayer } from "@/lib/types";
import { cn } from "@/lib/utils";

type ViewMode = "technical" | "analogy";

interface TableNode {
  name: string;
  type: "table";
  rows: string;
  description: string;
  layer: MedallionLayer;
}

interface SchemaNode {
  name: string;
  type: "schema";
  description: string;
  children: TableNode[];
}

interface CatalogNode {
  name: string;
  type: "catalog";
  description: string;
  children: SchemaNode[];
}

const analogyMap: Record<string, string> = {
  catalog: "Building",
  schema: "Floor",
  table: "Room",
};

const analogyIcon: Record<string, React.ReactNode> = {
  catalog: <Building2 className="w-4 h-4" />,
  schema: <Layers className="w-4 h-4" />,
  table: <Table2 className="w-4 h-4" />,
};

const technicalIcon: Record<string, React.ReactNode> = {
  catalog: <Database className="w-4 h-4" />,
  schema: <Layers className="w-4 h-4" />,
  table: <Table2 className="w-4 h-4" />,
};

function schemaColor(name: string): string {
  if (name === "bronze") return "#CD7F32";
  if (name === "silver") return "#9CA3AF";
  if (name === "gold") return "#D97706";
  return "#6B7280";
}

function schemaBg(name: string): string {
  if (name === "bronze") return "bg-bronze-bg border-bronze-border";
  if (name === "silver") return "bg-silver-bg border-silver-border";
  if (name === "gold") return "bg-gold-bg border-gold-border";
  return "bg-gray-50 border-gray-200";
}

export function CatalogTree() {
  const [viewMode, setViewMode] = useState<ViewMode>("technical");
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set(["bronze", "silver"]));
  const [selectedTable, setSelectedTable] = useState<TableNode | null>(null);

  const catalog = catalogTree as CatalogNode;

  function toggleSchema(name: string) {
    setExpandedSchemas((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const typeLabel = (type: string) =>
    viewMode === "analogy" ? analogyMap[type] ?? type : type.charAt(0).toUpperCase() + type.slice(1);

  const typeIcon = (type: string) =>
    viewMode === "analogy" ? analogyIcon[type] : technicalIcon[type];

  return (
    <div className="w-full">
      {/* View toggle */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-500 font-medium">View as:</span>
        <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
          {(["technical", "analogy"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                viewMode === mode
                  ? "bg-white text-primary-800 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {mode === "technical" ? "Technical View" : "Building Analogy"}
            </button>
          ))}
        </div>
        {viewMode === "analogy" && (
          <span className="text-xs text-gray-400 italic">
            Catalog = Building, Schema = Floor, Table = Room
          </span>
        )}
      </div>

      <div className="flex gap-6">
        {/* Tree panel */}
        <div className="flex-1 min-w-0">
          {/* Catalog root */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 bg-primary-50 border-b border-primary-100">
              <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center text-white">
                {typeIcon("catalog")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary-900">{catalog.name}</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                    {typeLabel("catalog")}
                  </span>
                </div>
                <p className="text-xs text-primary-600">{catalog.description}</p>
              </div>
            </div>

            {/* Schemas */}
            <div className="divide-y divide-gray-100">
              {catalog.children.map((schema) => {
                const isExpanded = expandedSchemas.has(schema.name);
                const color = schemaColor(schema.name);
                const isMedallion = ["bronze", "silver", "gold"].includes(schema.name);

                return (
                  <div key={schema.name}>
                    {/* Schema row */}
                    <button
                      onClick={() => toggleSchema(schema.name)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {typeIcon("schema")}
                      </div>
                      <span className="flex-1 font-semibold text-sm text-gray-800">{schema.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mr-2">
                        {typeLabel("schema")}
                      </span>
                      {isMedallion && (
                        <MedallionBadge layer={schema.name as MedallionLayer} size="sm" />
                      )}
                      <span className="ml-2 text-gray-400">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </span>
                    </button>

                    {/* Tables */}
                    {isExpanded && (
                      <div className={cn("divide-y divide-gray-50 border-t", schemaBg(schema.name))}>
                        {schema.children.map((table) => (
                          <button
                            key={table.name}
                            onClick={() => setSelectedTable(selectedTable?.name === table.name ? null : table)}
                            className={cn(
                              "w-full flex items-center gap-3 pl-12 pr-5 py-2.5 text-left transition-colors",
                              selectedTable?.name === table.name
                                ? "bg-white ring-1 ring-inset ring-gray-200"
                                : "hover:bg-white/70"
                            )}
                          >
                            <Table2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="flex-1 text-sm text-gray-700 font-mono">{table.name}</span>
                            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full mr-2">
                              {typeLabel("table")}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Hash className="w-3 h-3" />
                              {table.rows}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analogy key */}
          {viewMode === "analogy" && (
            <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Building Analogy</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                {[
                  { type: "catalog", label: "Catalog = Building", desc: "The whole structure" },
                  { type: "schema", label: "Schema = Floor", desc: "A themed section" },
                  { type: "table", label: "Table = Room", desc: "A specific dataset" },
                ].map(({ type, label, desc }) => (
                  <div key={type} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-400">{analogyIcon[type]}</span>
                    <span>
                      <strong>{label}</strong> — {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedTable && (
          <div className="w-72 flex-shrink-0">
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden sticky top-4">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="font-semibold text-sm text-gray-800">Table Details</span>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-medium">TABLE NAME</p>
                  <p className="font-mono text-sm font-bold text-gray-900">{selectedTable.name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1 font-medium">LAYER</p>
                  <MedallionBadge layer={selectedTable.layer} size="md" />
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1 font-medium">DESCRIPTION</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedTable.description}</p>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                  <p className="text-xs text-gray-400 mb-1 font-medium">ROW COUNT</p>
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-800">{selectedTable.rows} rows</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">FULL PATH</p>
                  <p className="font-mono text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                    enterprise.{selectedTable.layer}.{selectedTable.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
