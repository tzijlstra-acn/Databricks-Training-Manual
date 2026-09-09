import { TroubleshootingScenario } from "@/lib/types";
import { FaqItem } from "@/data/faq";

export interface SearchResults {
  scenarios: TroubleshootingScenario[];
  faqs: FaqItem[];
}

function matchesQuery(fields: string[], query: string): boolean {
  const q = query.toLowerCase();
  return fields.some((f) => f.toLowerCase().includes(q));
}

function nodeText(node: TroubleshootingScenario["tree"]): string {
  const parts: string[] = [node.question];
  if (node.resolution) parts.push(node.resolution);
  if (node.yes) parts.push(nodeText(node.yes));
  if (node.no) parts.push(nodeText(node.no));
  return parts.join(" ");
}

export function searchTroubleshooting(
  query: string,
  scenarios: TroubleshootingScenario[],
  faqs: FaqItem[]
): SearchResults {
  if (!query.trim()) return { scenarios: [], faqs: [] };

  const matchedScenarios = scenarios.filter((s) =>
    matchesQuery([s.title, s.symptom, nodeText(s.tree)], query)
  );

  const matchedFaqs = faqs.filter((f) =>
    matchesQuery([f.question, f.answer], query)
  );

  return { scenarios: matchedScenarios, faqs: matchedFaqs };
}
