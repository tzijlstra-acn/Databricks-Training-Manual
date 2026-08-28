export type MedallionLayer = "bronze" | "silver" | "gold";

export interface TrainingDay {
  id: number;
  title: string;
  subtitle: string;
  outcome: string;
  icon: string;
  color: string;
  topics: string[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  simple: string;
  analogy: string;
  example: string;
  related: string[];
  layer?: MedallionLayer;
  category: "core" | "compute" | "catalog" | "pipeline" | "analytics" | "quality";
}

export interface ArchitectureNode {
  id: string;
  label: string;
  description: string;
  usedFor: string[];
  dependsOn: string[];
  outputsTo: string[];
  category: "storage" | "compute" | "governance" | "analytics" | "orchestration" | "platform";
  x: number;
  y: number;
}

export interface PipelineTask {
  id: string;
  name: string;
  description: string;
  status: "success" | "running" | "waiting" | "failed";
  duration?: string;
  errorMessage?: string;
  type: "ingestion" | "transform" | "quality" | "build" | "refresh";
}

export interface QualityRule {
  id: string;
  name: string;
  type: "null" | "duplicate" | "schema" | "threshold" | "business";
  description: string;
  passCount: number;
  failCount: number;
  severity: "critical" | "warning" | "info";
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  primaryTools: string[];
  color: string;
  icon: string;
}

export interface TroubleshootingScenario {
  id: string;
  title: string;
  symptom: string;
  tree: TroubleshootingNode;
}

export interface TroubleshootingNode {
  id: string;
  question: string;
  type: "question" | "solution";
  yes?: TroubleshootingNode;
  no?: TroubleshootingNode;
  resolution?: string;
}

export interface ProgressState {
  visitedDays: number[];
  completedSteps: string[];
  quizScores: Record<string, number>;
  overallCompletion: number;
}
