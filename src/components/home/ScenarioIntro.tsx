"use client";

import { AlertTriangle, CheckCircle2, Target, Shield } from "lucide-react";

// 5 real entities — each needs its own FINMA submission by 31 May
const ENTITIES = [
  { id: 1, name: "Howden Schweiz AG",        crm: "BAYO + IBS Alabus", note: "Dual CRM (BAYO shared with SWIBRO)" },
  { id: 2, name: "Howden Broker Services AG", crm: "MAX",               note: "" },
  { id: 3, name: "SWIBRO AG",                 crm: "BAYO",              note: "Shares BAYO extract with Howden Schweiz" },
  { id: 4, name: "Perennial AG",              crm: "KETL",              note: "" },
  { id: 5, name: "Vorsorge Partner AG",       crm: "Vorsorge Partner",  note: "" },
];

// The real data problems: different field names per CRM + BAYO attribution ambiguity
const SCRAMBLED_ROWS = [
  { crm: "IBS Alabus",       field: "commission_chf",   issue: "" },
  { crm: "BAYO",             field: "remuneration",     issue: "Rows for Howden Schweiz AG AND SWIBRO AG mixed together" },
  { crm: "MAX",              field: "brokerage_fee",    issue: "" },
  { crm: "KETL",             field: "comm_amt",         issue: "" },
  { crm: "Vorsorge Partner", field: "fee_earned",       issue: "" },
];

const OBJECTIVES = [
  { day: 1, label: "Navigate the platform",        detail: "Workspace · Catalog · Unity Catalog hierarchy" },
  { day: 2, label: "Understand Medallion layers",  detail: "Bronze → DQ → Silver → Gold for the 5-entity pipeline" },
  { day: 3, label: "Query and validate",           detail: "SQL to check entity attribution and commission totals" },
  { day: 4, label: "Automate with quality gates",  detail: "Flag attribution errors and field mismatches before Silver" },
  { day: 5, label: "Produce the 5 FINMA reports",  detail: "Gold datasets validated, reconciled against Abacus, ready for submission" },
];

export function ScenarioIntro() {
  return (
    <div className="space-y-4 pb-2">
      {/* Scenario banner */}
      <div className="rounded-2xl border-2 border-[#1F2144] bg-[#1F2144] text-white overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#F47920]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F47920]">
              Training Scenario
            </span>
          </div>
          <h2 className="text-xl font-bold mb-2">
            FINMA Intermediary Reporting: 5 Entities, 5 CRM Systems, 1 Deadline
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed max-w-3xl">
            Under Article 190b of the Insurance Supervision Ordinance (ISO), every Howden Swiss entity must
            submit an annual intermediary report to FINMA by <strong className="text-white">31 May</strong>,
            covering commissions, sales structures, and client data. Each entity uses a different CRM system.
            Data stewards extract the files manually and deliver them as Excel exports. This week you will
            learn how Databricks turns those raw extracts into 5 validated, submission-ready reports.
          </p>
        </div>
      </div>

      {/* Entities + data problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 5 entities */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            5 Entities · 5 CRM Extracts · 5 FINMA Reports
          </p>
          <div className="space-y-0">
            {ENTITIES.map((e, i) => (
              <div
                key={e.id}
                className={`flex items-start gap-3 py-2.5 ${i < ENTITIES.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#F47920]/10 border border-[#F47920]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-[#F47920]">{e.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{e.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className="font-mono bg-gray-100 px-1 rounded text-gray-500">{e.crm}</span>
                    {e.note && <span className="text-amber-600 ml-1">· {e.note}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The data scramble problem */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-xs font-bold text-red-600 uppercase tracking-wide">The Data Problems</p>
          </div>
          <p className="text-xs text-red-700 mb-3 leading-relaxed">
            Each CRM exports a different field name for the commission amount. Worse: BAYO is shared by
            Howden Schweiz AG and SWIBRO AG: a single export contains rows for both entities mixed
            together, and they must be correctly separated before any report can be built.
          </p>
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-2 px-3 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">CRM System</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Commission field</span>
            </div>
            {SCRAMBLED_ROWS.map((row) => (
              <div key={row.crm} className="space-y-1">
                <div className="grid grid-cols-2 gap-2 items-center bg-white rounded-lg border border-red-100 px-3 py-2 font-mono text-xs">
                  <span className="text-gray-600 truncate">{row.crm}</span>
                  <span className="text-amber-700 truncate">{row.field}</span>
                </div>
                {row.issue && (
                  <p className="text-[10px] text-red-600 pl-3 flex items-start gap-1">
                    <span className="flex-shrink-0">⚠</span>
                    {row.issue}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-red-400 mt-3 italic">
            Silver standardises all field names and correctly attributes each BAYO row to Howden Schweiz AG
            or SWIBRO AG. Every transformation is auditable back to the original extract.
          </p>
        </div>
      </div>

      {/* Training objectives */}
      <div className="rounded-2xl border border-orange-100 bg-[#FFF3E8] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-[#F47920]" />
          <p className="text-xs font-bold text-[#F47920] uppercase tracking-wide">
            By the end of this week you will be able to…
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {OBJECTIVES.map((obj) => (
            <div key={obj.day} className="flex sm:flex-col gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-[#F47920] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{obj.day}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{obj.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{obj.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-orange-200 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>End state:</strong> 5 entity-attributed commission datasets in Gold, field-standardised,
            entity-correctly-split (including BAYO), reconciled against Abacus, traceable to the original
            CRM extract, and ready for FINMA submission by 31 May.
          </p>
        </div>
      </div>
    </div>
  );
}
