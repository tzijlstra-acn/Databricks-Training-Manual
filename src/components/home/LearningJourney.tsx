"use client";

import { useRouter } from "next/navigation";
import { trainingDays } from "@/data/trainingDays";
import { LayoutDashboard, Table2, Code2, Workflow, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { getProgress } from "@/lib/progress";
import { useEffect, useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  "layout-dashboard": <LayoutDashboard size={24} />,
  "table": <Table2 size={24} />,
  "code-2": <Code2 size={24} />,
  "workflow": <Workflow size={24} />,
  "bar-chart-3": <BarChart3 size={24} />,
};

export function LearningJourney() {
  const router = useRouter();
  const [visitedDays, setVisitedDays] = useState<number[]>([]);

  useEffect(() => {
    const p = getProgress();
    setVisitedDays(p.visitedDays);
  }, []);

  return (
    <section className="py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#F47920] mb-1">Programme</p>
      <h2 className="text-2xl font-bold text-[#1F2144] mb-6">Your 5-Day Learning Journey</h2>
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {trainingDays.map((day, idx) => {
          const done = visitedDays.includes(day.id);
          return (
            <div key={day.id} className="flex items-center shrink-0">
              {/* Day card */}
              <div
                onClick={() => router.push(`/day${day.id}`)}
                className="group cursor-pointer w-48 rounded-2xl border-2 bg-white p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 relative"
                style={{ borderColor: `${day.color}40` }}
              >
                {/* Completion badge */}
                {done && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                )}

                {/* Day number */}
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: day.color }}
                >
                  Day {day.id}
                </div>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${day.color}15`, color: day.color }}
                >
                  {iconMap[day.icon]}
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{day.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{day.subtitle}</p>

                {/* Outcome */}
                <p className="text-xs text-gray-400 mt-2 leading-snug">{day.outcome}</p>

                {/* Progress ring placeholder */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: done ? "100%" : "0%",
                          backgroundColor: day.color,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{done ? "Done" : "Start"}</span>
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              {idx < trainingDays.length - 1 && (
                <div className="flex items-center px-1 text-gray-300">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Topics overview */}
      <div className="mt-6 grid grid-cols-5 gap-3">
        {trainingDays.map((day) => (
          <div key={day.id} className="space-y-1">
            {day.topics.map((topic, i) => (
              <p key={i} className="text-xs text-gray-500 flex items-start gap-1">
                <span className="mt-0.5 shrink-0" style={{ color: day.color }}>·</span>
                {topic}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
