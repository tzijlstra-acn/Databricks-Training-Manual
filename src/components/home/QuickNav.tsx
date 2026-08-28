import Link from "next/link";
import { Database, Code2, Cpu, Workflow, ShieldCheck, Sparkles } from "lucide-react";

const quickLinks = [
  {
    question: "Where is my data?",
    href: "/day2",
    icon: <Database size={18} />,
    color: "#0891B2",
    bg: "#EFF8FB",
    border: "#BAE6FD",
  },
  {
    question: "How do I query it?",
    href: "/day3",
    icon: <Code2 size={18} />,
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  {
    question: "What runs my code?",
    href: "/day3",
    icon: <Cpu size={18} />,
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  {
    question: "How do pipelines work?",
    href: "/day4",
    icon: <Workflow size={18} />,
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  {
    question: "How is quality checked?",
    href: "/day4",
    icon: <ShieldCheck size={18} />,
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  {
    question: "What is Genie?",
    href: "/day5",
    icon: <Sparkles size={18} />,
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
];

export function QuickNav() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-[#1F2144] mb-6">Quick Navigation</h2>
      <div className="grid grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.question}
            href={link.href}
            className="group rounded-2xl border-2 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4"
            style={{ backgroundColor: link.bg, borderColor: link.border }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${link.color}20`, color: link.color }}
            >
              {link.icon}
            </div>
            <span className="font-semibold text-sm text-gray-800 group-hover:text-gray-900">
              {link.question}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
