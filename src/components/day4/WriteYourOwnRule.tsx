"use client";

import { useState } from "react";
import {
  Sparkles,
  ClipboardCopy,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Code2,
  Play,
  ArrowRight,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "1",
    title: "State what must be true",
    desc: "Describe your rule as a plain-English sentence. Focus on the data problem you want to catch, not how to code it.",
    example: '"Every commission record must have a valid FINMA product code — no blank or unknown values."',
    color: "#1F2144",
    bg: "#E8E9F0",
    border: "#C8CAD8",
  },
  {
    number: "2",
    title: "Hand it to an AI tool",
    desc: "Use Databricks Copilot, Claude, or ChatGPT. Give it your rule and a short description of the table column.",
    example: "Paste the prompt template below into your AI tool of choice.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  {
    number: "3",
    title: "Review the code it writes",
    desc: "The AI returns a DQX rule in Python. Read it — does it match what you described? If not, correct the prompt and try again.",
    example: "You do not need to understand every line. You need to confirm it captures your intent.",
    color: "#0891B2",
    bg: "#ECFEFF",
    border: "#A5F3FC",
  },
  {
    number: "4",
    title: "Paste it into your notebook and run",
    desc: "Add it to the rules list in your Silver notebook. Run the DQX engine. Check the quarantine table for any flagged rows.",
    example: "A rule only works if it runs. Paste and test before the next pipeline run.",
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
];

const PROMPT_TEMPLATE = `I'm writing a DQX (Databricks Quality Extension) rule in Python.

Column name: [COLUMN]
What it should contain: [DESCRIPTION]
Rule: [YOUR PLAIN-ENGLISH RULE]

Write a DQX rule using DQXRule or a built-in helper (is_not_null, is_in_list, is_in_range).
Return only the Python snippet — no explanation needed.`;

const WORKED_EXAMPLE = {
  rule: "Every commission record must have a FINMA product code. The column is finma_product_code and it should never be null, empty, or the placeholder string 'UNKNOWN'.",
  prompt: `I'm writing a DQX (Databricks Quality Extension) rule in Python.

Column name: finma_product_code
What it should contain: FINMA intermediary product category code, e.g. "I_PROP_NL"
Rule: The value must never be null, an empty string, or the placeholder "UNKNOWN"

Write a DQX rule using DQXRule or a built-in helper (is_not_null, is_in_list, is_in_range).
Return only the Python snippet — no explanation needed.`,
  code: `from databricks.labs.dqx.engine import DQXRule

DQXRule(
    name="finma_product_code_valid",
    constraint=(
        "finma_product_code IS NOT NULL"
        " AND TRIM(finma_product_code) != ''"
        " AND finma_product_code != 'UNKNOWN'"
    ),
    criticality="error",   # stops the pipeline — FINMA submission requires this field
)`,
  explanation: [
    "IS NOT NULL — catches missing values",
    "TRIM(...) != '' — catches blank strings (spaces only)",
    "!= 'UNKNOWN' — catches placeholder values left by incomplete reference table joins",
    "criticality='error' — any row failing this rule goes to quarantine and is blocked from Gold",
  ],
};

const CHALLENGES = [
  {
    id: "c1",
    label: "Commission rate sanity",
    rule: "The commission_rate column should always be a decimal between 0 and 0.50. A rate above 50% almost certainly means a data entry error.",
    hint: "is_in_range is perfect for this. The range is 0 (inclusive) to 0.50 (inclusive).",
    code: `from databricks.labs.dqx.col_rules import is_in_range

is_in_range("commission_rate", min=0.0, max=0.50)`,
  },
  {
    id: "c2",
    label: "Insurer FINMA name populated",
    rule: "Every row must have an insurer_finma_name. If it is null the record could not be matched to the FINMA registered entity list and must be quarantined.",
    hint: "is_not_null is the simplest helper for this.",
    code: `from databricks.labs.dqx.col_rules import is_not_null

is_not_null("insurer_finma_name")`,
  },
  {
    id: "c3",
    label: "CRM source system allowed list",
    rule: "The source_system column must be one of the five known CRM identifiers: BAYO, IBS_ALABUS, MAX, KETL, VP. Any other value means the extract came from an unknown system and should be flagged.",
    hint: "is_in_list takes a column name and a list of allowed values.",
    code: `from databricks.labs.dqx.col_rules import is_in_list

is_in_list(
    "source_system",
    ["BAYO", "IBS_ALABUS", "MAX", "KETL", "VP"],
)`,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors border border-white/20"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <ClipboardCopy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ChallengeCard({ c }: { c: (typeof CHALLENGES)[0] }) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className="rounded-2xl border border-[#1F2144]/10 bg-white overflow-hidden">
      <div className="px-5 py-4 bg-[#1F2144]/5 border-b border-[#1F2144]/10">
        <div className="flex items-center gap-2 mb-2">
          <Code2 size={14} className="text-[#1F2144]" />
          <span className="text-xs font-bold text-[#1F2144] uppercase tracking-wide">{c.label}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{c.rule}&rdquo;</p>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-xs text-gray-500">
          Generate the DQX rule from the description above. Use Databricks Copilot, Claude, or ChatGPT.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1"
          >
            <Lightbulb size={12} />
            {showHint ? "Hide hint" : "Hint"}
          </button>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1"
          >
            <Play size={12} />
            {showAnswer ? "Hide answer" : "Show answer"}
          </button>
        </div>
        {showHint && (
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-xs text-amber-800">{c.hint}</p>
          </div>
        )}
        {showAnswer && (
          <div className="relative rounded-xl bg-[#1F2144] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <span className="text-xs text-white/50 font-mono">Python</span>
              <CopyButton text={c.code} />
            </div>
            <pre className="px-4 py-3 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
              {c.code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WriteYourOwnRule() {
  const [exampleOpen, setExampleOpen] = useState(false);

  return (
    <div className="space-y-10">

      {/* Intro callout */}
      <div className="rounded-2xl border-2 border-[#F47920]/30 bg-gradient-to-br from-orange-50 to-amber-50 p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#F47920] flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            You do not need to be a developer to write rules
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            DQX rules are short Python snippets — but you do not have to write them from scratch.
            Your job is to <strong>describe the data problem in plain English</strong>. An AI tool
            (Databricks Copilot, Claude, ChatGPT) translates it into working code. You review, paste,
            and run. That is the whole workflow.
          </p>
        </div>
      </div>

      {/* 4-step process */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-5">The four-step workflow</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STEPS.map(({ number, title, desc, example, color, bg, border }) => (
            <div
              key={number}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: bg, borderColor: border }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  style={{ backgroundColor: color }}
                >
                  {number}
                </div>
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color }}>
                    {title}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{desc}</p>
                  <p className="text-xs italic text-gray-500 leading-relaxed">{example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt template */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-2">Your AI prompt template</h3>
        <p className="text-sm text-gray-500 mb-4">
          Copy this template, fill in the three placeholders, and paste it into any AI chat tool.
        </p>
        <div className="rounded-2xl bg-[#1F2144] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#F47920]" />
              <span className="text-xs font-semibold text-white/70">Prompt template — paste into Copilot, Claude, or ChatGPT</span>
            </div>
            <CopyButton text={PROMPT_TEMPLATE} />
          </div>
          <pre className="px-5 py-4 text-sm font-mono text-green-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
            {PROMPT_TEMPLATE}
          </pre>
        </div>
      </div>

      {/* Worked example — collapsible */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setExampleOpen(!exampleOpen)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#1F2144] flex items-center justify-center flex-shrink-0">
              <ArrowRight size={14} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Worked example — FINMA product code rule</p>
              <p className="text-xs text-gray-500">See the full journey from plain-English rule to running code</p>
            </div>
          </div>
          {exampleOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
          )}
        </button>

        {exampleOpen && (
          <div className="px-5 py-6 bg-white border-t border-gray-100 space-y-6">

            {/* Step 1: The business rule */}
            <div>
              <p className="text-xs font-bold text-[#1F2144] uppercase tracking-widest mb-2">
                Step 1 — The rule in plain English
              </p>
              <div className="rounded-xl bg-[#E8E9F0] border border-[#C8CAD8] px-4 py-3">
                <p className="text-sm text-[#1F2144] italic leading-relaxed">
                  &ldquo;{WORKED_EXAMPLE.rule}&rdquo;
                </p>
              </div>
            </div>

            {/* Step 2: The prompt */}
            <div>
              <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
                Step 2 — The prompt you give the AI
              </p>
              <div className="rounded-xl bg-[#1F2144] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <span className="text-xs text-white/50">Prompt</span>
                  <CopyButton text={WORKED_EXAMPLE.prompt} />
                </div>
                <pre className="px-4 py-3 text-xs font-mono text-purple-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                  {WORKED_EXAMPLE.prompt}
                </pre>
              </div>
            </div>

            {/* Step 3: The code */}
            <div>
              <p className="text-xs font-bold text-cyan-700 uppercase tracking-widest mb-2">
                Step 3 — What the AI returns
              </p>
              <div className="rounded-xl bg-[#1F2144] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <span className="text-xs text-white/50 font-mono">Python</span>
                  <CopyButton text={WORKED_EXAMPLE.code} />
                </div>
                <pre className="px-4 py-3 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
                  {WORKED_EXAMPLE.code}
                </pre>
              </div>
              <div className="mt-3 rounded-xl bg-cyan-50 border border-cyan-100 px-4 py-3">
                <p className="text-xs font-semibold text-cyan-800 mb-2">What each line does:</p>
                <ul className="space-y-1">
                  {WORKED_EXAMPLE.explanation.map((line) => (
                    <li key={line} className="text-xs text-cyan-700 flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 4: Where to put it */}
            <div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">
                Step 4 — Add it to your rules list
              </p>
              <div className="rounded-xl bg-[#1F2144] overflow-hidden">
                <div className="px-4 py-2 border-b border-white/10">
                  <span className="text-xs text-white/50 font-mono">Silver notebook — quality gate cell</span>
                </div>
                <pre className="px-4 py-3 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">{`rules = [
    is_not_null("entity_id"),
    is_in_list("source_system", ["BAYO", "IBS_ALABUS", "MAX", "KETL", "VP"]),
    is_in_range("commission_rate", min=0.0, max=0.50),

    # Your new rule — pasted from the AI output above:
    DQXRule(
        name="finma_product_code_valid",
        constraint=(
            "finma_product_code IS NOT NULL"
            " AND TRIM(finma_product_code) != ''"
            " AND finma_product_code != 'UNKNOWN'"
        ),
        criticality="error",
    ),
]

good_df, bad_df = engine.apply_checks_and_split(df, rules)`}</pre>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Try it yourself */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#F47920] flex items-center justify-center flex-shrink-0">
            <Code2 size={16} className="text-white" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Try it yourself</h3>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Each card below gives you a business rule written in plain English. Generate the DQX code using
          an AI tool, then reveal the hint or answer to check your work.
        </p>
        <div className="space-y-4">
          {CHALLENGES.map((c) => (
            <ChallengeCard key={c.id} c={c} />
          ))}
        </div>
      </div>

      {/* Closing note */}
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 flex items-start gap-4">
        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">The real skill is spotting the problem — not writing the code</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            A developer can turn any rule into code in seconds. What is harder to learn is knowing
            <em> which rules matter</em> — what data quality issues would break the FINMA submission, cause an
            incorrect commission payment, or silently produce wrong KPIs. That domain knowledge is yours.
            The AI handles the syntax.
          </p>
        </div>
      </div>

    </div>
  );
}
