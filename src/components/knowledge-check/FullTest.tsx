"use client";

import { useState, useMemo } from "react";
import {
  testQuestions,
  DAY_LABELS,
  DAY_SHORT,
  type Difficulty,
  type DayNumber,
} from "@/data/testQuestions";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  BookOpen,
} from "lucide-react";

type TestMode = "config" | "testing" | "results";

const DIFFICULTIES: {
  key: Difficulty;
  label: string;
  description: string;
  dot: string;
}[] = [
  {
    key: "beginner",
    label: "Beginner",
    description:
      "Conceptual: what each tool does and how it maps to Howden's insurance workflow",
    dot: "bg-green-500",
  },
  {
    key: "standard",
    label: "Standard",
    description:
      "Applied: choosing the right tool, interpreting results, working with the FINMA scenario",
    dot: "bg-blue-500",
  },
  {
    key: "pro",
    label: "Pro",
    description:
      "Technical: SQL, PySpark, DQX rule logic, architecture decisions, FINMA edge cases",
    dot: "bg-purple-500",
  },
];

const DAY_FILTERS: { key: DayNumber | "all"; label: string }[] = [
  { key: "all", label: "All Days" },
  { key: 1, label: "Day 1" },
  { key: 2, label: "Day 2" },
  { key: 3, label: "Day 3" },
  { key: 4, label: "Day 4" },
  { key: 5, label: "Day 5" },
];

const LETTERS = ["A", "B", "C", "D"];

function getScoreTier(pct: number): {
  label: string;
  color: string;
  desc: string;
} {
  if (pct >= 90)
    return {
      label: "Expert",
      color: "text-purple-600",
      desc: "Outstanding. Ready to lead the Databricks conversation.",
    };
  if (pct >= 75)
    return {
      label: "Strong",
      color: "text-blue-600",
      desc: "Solid understanding. Review a few areas and you are there.",
    };
  if (pct >= 50)
    return {
      label: "Developing",
      color: "text-yellow-600",
      desc: "Good foundation. Review the explanations and retry.",
    };
  return {
    label: "Needs Review",
    color: "text-red-600",
    desc: "Revisit the day content before retrying",
  };
}

export function FullTest() {
  const [mode, setMode] = useState<TestMode>("config");
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [dayFilter, setDayFilter] = useState<DayNumber | "all">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showReview, setShowReview] = useState(false);

  const questions = useMemo(
    () =>
      testQuestions.filter(
        (q) =>
          q.difficulty === difficulty &&
          (dayFilter === "all" || q.day === dayFilter)
      ),
    [difficulty, dayFilter]
  );

  function startTest() {
    setAnswers(new Array(questions.length).fill(null));
    setCurrentIndex(0);
    setShowReview(false);
    setMode("testing");
  }

  function resetTest() {
    setMode("config");
    setAnswers([]);
    setCurrentIndex(0);
    setShowReview(false);
  }

  function selectAnswer(optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  }

  const totalAnswered = answers.filter((a) => a !== null).length;

  const totalCorrect = useMemo(
    () =>
      answers.reduce<number>(
        (sum, ans, i) =>
          ans !== null && ans === questions[i]?.correctIndex ? sum + 1 : sum,
        0
      ),
    [answers, questions]
  );

  const scorePercent =
    questions.length > 0
      ? Math.round((totalCorrect / questions.length) * 100)
      : 0;

  const dayBreakdown = useMemo(() => {
    const days: DayNumber[] = [1, 2, 3, 4, 5];
    return days
      .map((day) => {
        const entries = questions
          .map((q, i) => ({ q, i }))
          .filter(({ q }) => q.day === day);
        if (entries.length === 0) return null;
        const correct = entries.filter(
          ({ q, i }) => answers[i] === q.correctIndex
        ).length;
        return {
          day,
          label: DAY_SHORT[day],
          total: entries.length,
          correct,
        };
      })
      .filter(
        (
          x
        ): x is {
          day: DayNumber;
          label: string;
          total: number;
          correct: number;
        } => x !== null
      );
  }, [questions, answers]);

  // ── Config ──────────────────────────────────────────────────────
  if (mode === "config") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
        {/* Difficulty */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Select difficulty
          </p>
          <div className="space-y-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={cn(
                  "w-full text-left rounded-xl border-2 px-4 py-3 transition-all",
                  difficulty === d.key
                    ? "border-primary-400 bg-primary-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-2.5 h-2.5 rounded-full flex-shrink-0",
                      d.dot
                    )}
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {d.label}
                  </span>
                  {difficulty === d.key && (
                    <span className="ml-auto text-xs font-medium text-primary-600">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-5.5">
                  {d.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Day filter */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Filter by day (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {DAY_FILTERS.map((d) => (
              <button
                key={String(d.key)}
                onClick={() => setDayFilter(d.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium border transition-all",
                  dayFilter === d.key
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{questions.length}</span>{" "}
            questions
            {dayFilter !== "all" && (
              <span className="text-gray-400">
                {" "}
                · {DAY_LABELS[dayFilter as DayNumber]}
              </span>
            )}
          </p>
          <button
            onClick={startTest}
            disabled={questions.length === 0}
            className="px-5 py-2.5 rounded-xl bg-[#F47920] text-white text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start Assessment →
          </button>
        </div>
      </div>
    );
  }

  // ── Results ──────────────────────────────────────────────────────
  if (mode === "results") {
    const tier = getScoreTier(scorePercent);
    return (
      <div className="space-y-5">
        {/* Score hero */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <Trophy className="w-10 h-10 mx-auto text-[#F47920] mb-3" />
          <p className="text-5xl font-black text-gray-900">{scorePercent}%</p>
          <p className={cn("text-xl font-bold mt-1", tier.color)}>
            {tier.label}
          </p>
          <p className="text-sm text-gray-500 mt-1">{tier.desc}</p>
          <p className="text-xs text-gray-400 mt-2">
            {totalCorrect} of {questions.length} correct
          </p>
        </div>

        {/* Day breakdown */}
        {dayBreakdown.length > 1 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Score by day
            </p>
            <div className="space-y-3">
              {dayBreakdown.map(({ day, label, total, correct }) => {
                const pct = Math.round((correct / total) * 100);
                return (
                  <div key={day}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Day {day}: {label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {correct}/{total}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          pct >= 80
                            ? "bg-green-500"
                            : pct >= 50
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowReview(!showReview)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {showReview ? "Hide Review" : "Review Answers"}
          </button>
          <button
            onClick={resetTest}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F47920] text-white text-sm font-bold hover:bg-orange-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Assessment
          </button>
        </div>

        {/* Review panel */}
        {showReview && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Answer Review
            </p>
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const isRight = userAnswer === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-2xl border p-4",
                    isRight
                      ? "border-green-200 bg-green-50"
                      : "border-red-100 bg-red-50"
                  )}
                >
                  <div className="flex items-start gap-2 mb-3">
                    {isRight ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Day {q.day} · {q.difficulty}
                      </span>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 ml-6">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-lg flex items-center gap-2",
                          oi === q.correctIndex
                            ? "bg-green-100 text-green-800 font-semibold"
                            : oi === userAnswer && !isRight
                            ? "bg-red-100 text-red-700"
                            : "text-gray-400"
                        )}
                      >
                        <span className="font-mono font-bold text-[10px] flex-shrink-0">
                          {LETTERS[oi]}
                        </span>
                        <span
                          className={
                            oi === userAnswer && !isRight
                              ? "line-through"
                              : undefined
                          }
                        >
                          {opt}
                        </span>
                        {oi === q.correctIndex && (
                          <span className="ml-auto">✓</span>
                        )}
                        {oi === userAnswer && !isRight && (
                          <span className="ml-auto text-red-500">✗</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="ml-6 mt-2 text-xs text-gray-600 leading-relaxed bg-white/70 rounded-lg px-3 py-2">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Testing ──────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const unanswered = questions.length - totalAnswered;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs font-medium text-gray-500">
            {totalAnswered} answered
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#F47920] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5">
        <span className="inline-block px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-[11px] font-bold uppercase tracking-wide">
          {DAY_LABELS[currentQuestion.day]}
        </span>

        <p className="text-base font-semibold text-gray-900 leading-relaxed">
          {currentQuestion.question}
        </p>

        <div className="space-y-2.5">
          {currentQuestion.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              className={cn(
                "w-full text-left rounded-xl border-2 px-4 py-3 text-sm transition-all flex items-start gap-3",
                currentAnswer === i
                  ? "border-primary-500 bg-primary-50 text-primary-900"
                  : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold border-2 transition-all mt-0.5",
                  currentAnswer === i
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-gray-300 text-gray-500"
                )}
              >
                {LETTERS[i]}
              </span>
              <span className="leading-snug">{opt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Dot indicators (≤15 questions) */}
        {questions.length <= 15 && (
          <div className="flex-1 flex justify-center gap-1.5 flex-wrap">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                title={`Question ${i + 1}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === currentIndex
                    ? "bg-[#F47920] scale-125"
                    : answers[i] !== null
                    ? "bg-gray-500"
                    : "bg-gray-200 hover:bg-gray-300"
                )}
              />
            ))}
          </div>
        )}

        {isLast ? (
          <button
            onClick={() => setMode("results")}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F47920] text-white text-sm font-bold hover:bg-orange-600 transition-colors"
          >
            Submit Test →
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
            }
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Unanswered hint on last question */}
      {isLast && unanswered > 0 && (
        <p className="text-center text-xs text-amber-600">
          {unanswered} question{unanswered !== 1 ? "s" : ""} unanswered. You
          can go back or submit anyway.
        </p>
      )}
    </div>
  );
}
