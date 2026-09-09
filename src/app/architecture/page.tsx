"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const ArchitectureClient = dynamic(() => import("./ArchitectureClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[620px] flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200">
      <div className="text-sm text-gray-400">Loading architecture explorer…</div>
    </div>
  ),
});

function ArchFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="h-[620px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-200 gap-4 p-8 text-center">
      <div className="text-3xl">🏗️</div>
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">Interactive graph could not load</p>
        <p className="text-xs text-gray-500 max-w-sm">
          The architecture explorer requires a modern browser with JavaScript enabled.
          Try reloading the page, or use another browser.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
      >
        Retry
      </button>
      <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4 text-left max-w-md w-full">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Architecture overview</p>
        <div className="space-y-2 text-xs text-gray-600">
          {[
            { layer: "Unity Catalog", desc: "Single governance layer across all data assets" },
            { layer: "Bronze", desc: "Raw ingested data — exact copy of source" },
            { layer: "Silver", desc: "Cleaned and quality-validated records" },
            { layer: "Gold", desc: "Aggregated, business-ready tables" },
            { layer: "Compute", desc: "All-purpose clusters and SQL warehouses" },
            { layer: "Jobs & Pipelines", desc: "Orchestration and scheduling" },
          ].map(({ layer, desc }) => (
            <div key={layer} className="flex gap-2">
              <span className="font-semibold text-gray-700 w-36 flex-shrink-0">{layer}</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ArchitecturePage() {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <ErrorBoundary
      key={retryKey}
      fallback={<ArchFallback onRetry={() => setRetryKey((k) => k + 1)} />}
    >
      <ArchitectureClient />
    </ErrorBoundary>
  );
}
