"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

interface DataStage {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  record: Record<string, string | null>;
  tags: string[];
  description: string;
}

const stages: DataStage[] = [
  {
    id: "bronze",
    label: "Bronze",
    color: "#CD7F32",
    bgColor: "#FDF3E7",
    borderColor: "#E8B86D",
    textColor: "#92400E",
    record: {
      name: "john smith",
      country: "CH",
      status: null,
      commission: "2450",
      timestamp: "2024-01-15T09:23:11Z",
      source_id: "SRC_001",
    },
    tags: ["Raw", "Messy", "Source-aligned"],
    description: "Data arrives exactly as sent from the CRM — lowercase names, country codes, null values, raw timestamps.",
  },
  {
    id: "silver",
    label: "Silver",
    color: "#6B7280",
    bgColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    textColor: "#374151",
    record: {
      name: "John Smith",
      country: "Switzerland",
      status: "Active",
      commission: "2,450.00",
      period_date: "2024-01-15",
      validated: "true",
    },
    tags: ["Cleaned", "Validated", "Standardised"],
    description: "Name capitalised, country expanded, null status resolved, amount formatted, timestamp converted to date.",
  },
  {
    id: "gold",
    label: "Gold",
    color: "#D97706",
    bgColor: "#FFFBEB",
    borderColor: "#FCD34D",
    textColor: "#92400E",
    record: {
      customer: "John Smith",
      segment: "Active",
      commission: "CHF 2,450",
      region: "DACH",
      period: "Jan 2024",
    },
    tags: ["Aggregated", "Business-ready", "Reporting-friendly"],
    description: "Shaped for business reporting — currency formatted, region derived from country, period normalised.",
  },
];

export function FollowTheData() {
  const [playing, setPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [dotPosition, setDotPosition] = useState(0);
  const [completed, setCompleted] = useState(false);

  const play = async () => {
    if (playing) return;
    setPlaying(true);
    setCompleted(false);

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i);
      setDotPosition(i);
      await new Promise((r) => setTimeout(r, 1800));
    }

    setCompleted(true);
    setPlaying(false);
  };

  const reset = () => {
    setPlaying(false);
    setCurrentStage(0);
    setDotPosition(0);
    setCompleted(false);
  };

  const activeStage = stages[currentStage];

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2144]">Follow The Data</h2>
          <p className="text-gray-500 mt-1">Watch a single customer record transform through all three layers.</p>
        </div>
        <div className="flex gap-2">
          {completed && (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
          <button
            onClick={play}
            disabled={playing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#F47920] text-white hover:bg-[#E06810] disabled:opacity-60 transition-colors text-sm font-medium shadow-sm"
          >
            <Play size={14} />
            {playing ? "Playing..." : "Play Animation"}
          </button>
        </div>
      </div>

      {/* Stage indicators + animated dot */}
      <div className="relative mb-8">
        {/* Track line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0" />

        {/* Animated progress line */}
        <motion.div
          className="absolute top-6 left-0 h-0.5 bg-[#F47920] z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${(dotPosition / (stages.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        <div className="flex justify-between relative z-10">
          {stages.map((stage, idx) => {
            const isActive = idx <= currentStage;
            const isCurrent = idx === currentStage;
            return (
              <div key={stage.id} className="flex flex-col items-center gap-2">
                <motion.div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? stage.bgColor : "#F9FAFB",
                    borderColor: isCurrent ? stage.color : isActive ? `${stage.color}60` : "#E5E7EB",
                    boxShadow: isCurrent ? `0 0 16px ${stage.color}50` : "none",
                  }}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: isCurrent && playing ? Infinity : 0 }}
                >
                  <span className="text-lg font-bold" style={{ color: isActive ? stage.color : "#D1D5DB" }}>
                    {stage.label[0]}
                  </span>
                </motion.div>
                <span
                  className="text-xs font-bold"
                  style={{ color: isActive ? stage.color : "#9CA3AF" }}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active stage detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border-2 p-6"
          style={{ backgroundColor: activeStage.bgColor, borderColor: activeStage.borderColor }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: activeStage.color }}
              >
                {activeStage.label} Layer
              </span>
              <p className="text-sm text-gray-600 mt-1 max-w-lg">{activeStage.description}</p>
            </div>
            <div className="flex gap-1 ml-4">
              {activeStage.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full border font-medium"
                  style={{
                    color: activeStage.textColor,
                    borderColor: activeStage.borderColor,
                    backgroundColor: `${activeStage.color}15`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Record card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
              </div>
              <span className="text-xs text-gray-400 font-mono">
                enterprise.{activeStage.id}.
                {activeStage.id === "bronze" ? "commission_raw" : activeStage.id === "silver" ? "commission_validated" : "commission_reporting"}
              </span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(activeStage.record).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-gray-400 font-mono uppercase">{key}</p>
                    <p
                      className={`text-sm font-mono mt-0.5 ${value === null ? "text-red-400 italic" : "text-gray-900 font-medium"}`}
                    >
                      {value === null ? "NULL" : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800"
        >
          <strong>Journey complete!</strong> This record travelled through Bronze → Silver → Gold, becoming more reliable and useful at each stage.
        </motion.div>
      )}
    </section>
  );
}
