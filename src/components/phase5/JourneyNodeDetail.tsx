"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export interface NodeDetail {
  id: string;
  label: string;
  color: string;
  bg: string;
  what: string;
  input: string;
  output: string;
  databricksComponent: string;
  relatedPhase: number;
  lessonRoute: string;
}

interface JourneyNodeDetailProps {
  node: NodeDetail;
  onClose: () => void;
}

export function JourneyNodeDetail({ node, onClose }: JourneyNodeDetailProps) {
  return (
    <motion.div
      id={`node-detail-${node.id}`}
      role="region"
      aria-label={`${node.label} detail`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
      className="mt-4 rounded-xl border-2 p-5"
      style={{ borderColor: `${node.color}40`, backgroundColor: node.bg }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: node.color }}>
            Stage detail
          </p>
          <h3 className="text-base font-bold text-gray-900">{node.label}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close detail panel"
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">{node.what}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg bg-white border border-gray-200 px-3 py-2.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Input</p>
          <p className="text-xs text-gray-700 leading-snug">{node.input}</p>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 px-3 py-2.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Output</p>
          <p className="text-xs text-gray-700 leading-snug">{node.output}</p>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 px-3 py-2.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Databricks component</p>
          <p className="text-xs font-medium text-gray-700 leading-snug" style={{ color: node.color }}>
            {node.databricksComponent}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={node.lessonRoute}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: node.color }}
        >
          Go to Phase {node.relatedPhase} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}
