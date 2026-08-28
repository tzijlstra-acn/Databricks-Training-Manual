"use client";

import { useState } from "react";
import { layerAssignmentQuiz, workflowOrderQuiz, quizQuestions } from "@/data/quizzes";
import { saveQuizScore } from "@/lib/progress";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Quiz 1 — Layer Assignment
// ─────────────────────────────────────────────────────────────────────────────

type Layer = "bronze" | "silver" | "gold";

const LAYER_CONFIG: Record<
  Layer,
  { emoji: string; label: string; sublabel: string; zone: string; badge: string; text: string }
> = {
  bronze: {
    emoji: "🥉",
    label: "Bronze",
    sublabel: "Raw data",
    zone: "bg-bronze-bg border-bronze-border hover:ring-2 hover:ring-bronze-border",
    badge: "bg-bronze-bg text-bronze-text border border-bronze-border",
    text: "text-bronze-text",
  },
  silver: {
    emoji: "🥈",
    label: "Silver",
    sublabel: "Cleaned data",
    zone: "bg-silver-bg border-silver-border hover:ring-2 hover:ring-silver-border",
    badge: "bg-silver-bg text-silver-text border border-silver-border",
    text: "text-silver-text",
  },
  gold: {
    emoji: "🥇",
    label: "Gold",
    sublabel: "Business-ready",
    zone: "bg-gold-bg border-gold-border hover:ring-2 hover:ring-gold-border",
    badge: "bg-gold-bg text-gold-text border border-gold-border",
    text: "text-gold-text",
  },
};

function LayerAssignmentQuiz() {
  const [assignments, setAssignments] = useState<Record<string, Layer | null>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleRecordClick(id: string) {
    if (submitted) return;
    setSelected(prev => (prev === id ? null : id));
  }

  function handleZoneClick(layer: Layer) {
    if (!selected || submitted) return;
    setAssignments(prev => ({ ...prev, [selected]: layer }));
    setSelected(null);
  }

  function handleSubmit() {
    const allDone = layerAssignmentQuiz.every(r => assignments[r.id]);
    if (!allDone) return;
    setSubmitted(true);
    const correct = layerAssignmentQuiz.filter(r => assignments[r.id] === r.correct).length;
    saveQuizScore("layer-assignment", Math.round((correct / layerAssignmentQuiz.length) * 100));
  }

  function handleReset() {
    setAssignments({});
    setSelected(null);
    setSubmitted(false);
  }

  const assignedCount = layerAssignmentQuiz.filter(r => assignments[r.id]).length;
  const allAssigned = assignedCount === layerAssignmentQuiz.length;
  const correctCount = submitted
    ? layerAssignmentQuiz.filter(r => assignments[r.id] === r.correct).length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Where should this data go?
        </h3>
        <p className="text-sm text-gray-500">
          {selected
            ? "Now click a layer zone to assign the selected record."
            : "Click a data record to select it, then click the correct layer zone."}
        </p>
      </div>

      {/* Records */}
      <div className="space-y-2">
        {layerAssignmentQuiz.map(record => {
          const assigned = assignments[record.id] as Layer | undefined;
          const isSelected = selected === record.id;
          const isCorrect = submitted && assigned === record.correct;
          const isWrong = submitted && assigned && assigned !== record.correct;

          return (
            <button
              key={record.id}
              onClick={() => handleRecordClick(record.id)}
              disabled={submitted}
              className={cn(
                "w-full text-left rounded-xl border-2 px-4 py-3 transition-all",
                isSelected
                  ? "border-primary-500 bg-primary-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300",
                submitted && isCorrect ? "border-green-500 bg-green-50" : "",
                submitted && isWrong ? "border-red-400 bg-red-50" : ""
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <code className="text-xs text-gray-700 font-mono leading-relaxed flex-1">
                  {record.description}
                </code>
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  {assigned && (
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-semibold",
                        LAYER_CONFIG[assigned].badge
                      )}
                    >
                      {LAYER_CONFIG[assigned].label}
                    </span>
                  )}
                  {submitted && isCorrect && (
                    <span className="text-xs text-green-600 font-semibold">Correct</span>
                  )}
                  {submitted && isWrong && (
                    <span className="text-xs text-red-500 font-semibold">
                      Should be {record.correct}
                    </span>
                  )}
                </div>
              </div>
              {submitted && (isCorrect || isWrong) && (
                <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-100 pt-2">
                  {record.hint}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Layer zones */}
      <div className="grid grid-cols-3 gap-3">
        {(["bronze", "silver", "gold"] as Layer[]).map(layer => {
          const cfg = LAYER_CONFIG[layer];
          const isClickable = Boolean(selected) && !submitted;
          return (
            <button
              key={layer}
              onClick={() => handleZoneClick(layer)}
              disabled={!isClickable}
              className={cn(
                "rounded-2xl border-2 p-4 text-center transition-all",
                cfg.zone,
                isClickable
                  ? "cursor-pointer hover:scale-105 hover:shadow-md"
                  : "cursor-default opacity-80"
              )}
            >
              <div className="text-2xl mb-1">{cfg.emoji}</div>
              <div className={cn("text-sm font-semibold", cfg.text)}>{cfg.label}</div>
              <div className={cn("text-xs mt-0.5 opacity-70", cfg.text)}>{cfg.sublabel}</div>
            </button>
          );
        })}
      </div>

      {/* Submit / score */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAssigned}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-colors",
            allAssigned
              ? "bg-[#F47920] text-white hover:bg-[#E06810]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {allAssigned
            ? "Check Answers"
            : `Assign all records first (${assignedCount}/${layerAssignmentQuiz.length})`}
        </button>
      ) : (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-gray-200">
          <div
            className={cn(
              "text-sm font-semibold",
              correctCount === layerAssignmentQuiz.length ? "text-green-700" : "text-amber-700"
            )}
          >
            Score: {correctCount}/{layerAssignmentQuiz.length} correct
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-primary-700 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quiz 2 — Workflow Ordering
// ─────────────────────────────────────────────────────────────────────────────

type OrderStep = (typeof workflowOrderQuiz)[number] & { idx: number };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function WorkflowOrderQuiz() {
  const [steps, setSteps] = useState<OrderStep[]>(() =>
    shuffle(workflowOrderQuiz).map((s, i) => ({ ...s, idx: i }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  function move(index: number, dir: "up" | "down") {
    if (submitted) return;
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next);
  }

  function handleSubmit() {
    const correct = steps.filter((s, i) => s.correct === i + 1).length;
    const pct = Math.round((correct / steps.length) * 100);
    setScore(pct);
    setSubmitted(true);
    saveQuizScore("workflow-order", pct);
  }

  function handleReset() {
    setSteps(shuffle(workflowOrderQuiz).map((s, i) => ({ ...s, idx: i })));
    setSubmitted(false);
    setScore(null);
  }

  const allCorrect = steps.every((s, i) => s.correct === i + 1);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Put the workflow in order
        </h3>
        <p className="text-sm text-gray-500">
          Use the arrows to arrange these steps in the correct pipeline sequence.
        </p>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => {
          const isCorrect = submitted && step.correct === i + 1;
          const isWrong = submitted && step.correct !== i + 1;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-200",
                isCorrect
                  ? "border-green-400 bg-green-50"
                  : isWrong
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-white"
              )}
            >
              {/* Position number */}
              <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>

              {/* Label */}
              <span className="flex-1 text-sm font-medium text-gray-800">{step.label}</span>

              {/* Result */}
              {submitted && (
                <span className="text-xs font-semibold">
                  {isCorrect ? (
                    <span className="text-green-600">Correct</span>
                  ) : (
                    <span className="text-red-500">Should be #{step.correct}</span>
                  )}
                </span>
              )}

              {/* Reorder buttons */}
              {!submitted && (
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => move(i, "up")}
                    disabled={i === 0}
                    className="w-6 h-5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => move(i, "down")}
                    disabled={i === steps.length - 1}
                    className="w-6 h-5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-xl bg-[#F47920] text-white text-sm font-semibold hover:bg-[#E06810] transition-colors"
        >
          Check Order
        </button>
      ) : (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-gray-200">
          <span
            className={cn(
              "text-sm font-semibold",
              allCorrect ? "text-green-700" : "text-amber-700"
            )}
          >
            {allCorrect ? "Perfect order!" : `Score: ${score}%`}
          </span>
          <button onClick={handleReset} className="text-sm text-primary-700 hover:underline">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quiz 3 — Multiple Choice
// ─────────────────────────────────────────────────────────────────────────────

function MultipleChoiceQuiz() {
  const questions = quizQuestions.slice(0, 4);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleAnswer(qId: string, optIdx: number) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  }

  function handleSubmit() {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitted(true);
    const correct = questions.filter(q => answers[q.id] === q.correct).length;
    saveQuizScore("multiple-choice", Math.round((correct / questions.length) * 100));
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
  }

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const correctCount = submitted
    ? questions.filter(q => answers[q.id] === q.correct).length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Multiple Choice</h3>
        <p className="text-sm text-gray-500">Answer all 4 questions then submit to see your score.</p>
      </div>

      <div className="space-y-5">
        {questions.map((q, qi) => {
          const answered = answers[q.id] !== undefined;
          const isCorrectQ = submitted && answers[q.id] === q.correct;
          const isWrongQ = submitted && answered && answers[q.id] !== q.correct;

          return (
            <div
              key={q.id}
              className={cn(
                "rounded-2xl border p-4",
                submitted && isCorrectQ
                  ? "border-green-300 bg-green-50"
                  : submitted && isWrongQ
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200 bg-white"
              )}
            >
              <p className="text-sm font-semibold text-gray-800 mb-3">
                <span className="text-primary-600 mr-1">Q{qi + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((option, oi) => {
                  const isSelected = answers[q.id] === oi;
                  const isCorrectOpt = oi === q.correct;
                  const isWrongOpt = submitted && isSelected && !isCorrectOpt;

                  return (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(q.id, oi)}
                      disabled={submitted}
                      className={cn(
                        "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-all",
                        submitted && isCorrectOpt
                          ? "border-green-500 bg-green-100 text-green-800"
                          : submitted && isWrongOpt
                          ? "border-red-400 bg-red-100 text-red-800"
                          : isSelected
                          ? "border-primary-500 bg-primary-50 text-primary-900"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white"
                      )}
                    >
                      {/* Radio indicator */}
                      <span
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          submitted && isCorrectOpt
                            ? "border-green-500 bg-green-500"
                            : submitted && isWrongOpt
                            ? "border-red-400 bg-red-400"
                            : isSelected
                            ? "border-primary-500 bg-primary-500"
                            : "border-gray-300 bg-white"
                        )}
                      >
                        {(isSelected || (submitted && isCorrectOpt)) && (
                          <span className="w-2 h-2 rounded-full bg-white block" />
                        )}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={cn(
                    "mt-3 text-xs px-3 py-2 rounded-lg leading-relaxed",
                    isCorrectQ
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-50 text-amber-800"
                  )}
                >
                  <span className="font-semibold">
                    {isCorrectQ ? "Correct! " : "Incorrect. "}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-colors",
            allAnswered
              ? "bg-[#F47920] text-white hover:bg-[#E06810]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {allAnswered
            ? "Submit Answers"
            : `Answer all questions first (${answeredCount}/${questions.length})`}
        </button>
      ) : (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-5 py-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">Your score</p>
            <p className="text-2xl font-bold text-primary-800">
              {correctCount}/{questions.length}
            </p>
          </div>
          <p
            className={cn(
              "text-3xl font-bold",
              correctCount === questions.length
                ? "text-green-500"
                : correctCount >= 3
                ? "text-yellow-500"
                : "text-red-400"
            )}
          >
            {Math.round((correctCount / questions.length) * 100)}%
          </p>
          <button onClick={handleReset} className="text-sm text-primary-700 hover:underline">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

interface QuizComponentProps {
  activeQuiz: 1 | 2 | 3;
}

export function QuizComponent({ activeQuiz }: QuizComponentProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {activeQuiz === 1 && <LayerAssignmentQuiz />}
      {activeQuiz === 2 && <WorkflowOrderQuiz />}
      {activeQuiz === 3 && <MultipleChoiceQuiz />}
    </div>
  );
}
