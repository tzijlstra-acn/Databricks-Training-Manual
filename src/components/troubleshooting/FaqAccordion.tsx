"use client";

import { useState } from "react";
import { faqItems, type FaqItem } from "@/data/faq";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const CATEGORIES: { key: FaqItem["category"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "platform", label: "Platform" },
  { key: "data", label: "Data & Medallion" },
  { key: "pipeline", label: "Pipeline & Jobs" },
  { key: "finma", label: "FINMA Scenario" },
  { key: "analytics", label: "Analytics" },
];

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<
    FaqItem["category"] | "all"
  >("all");

  const filtered =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter((f) => f.category === activeCategory);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-5">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              activeCategory === c.key
                ? "bg-primary-800 text-white border-primary-800"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        {filtered.map((item, i) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-2xl border-2 transition-all duration-200 bg-white",
                isOpen ? "border-primary-300" : "border-gray-100"
              )}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-3"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-semibold text-gray-800 leading-snug">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-0 ml-9">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 text-center">
        {filtered.length} questions · click to expand
      </p>
    </div>
  );
}
