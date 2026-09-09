export const PHASES = [
  { id: 1, route: '/phase1', shortLabel: 'Phase 1', fullLabel: 'Phase 1: Foundations' },
  { id: 2, route: '/phase2', shortLabel: 'Phase 2', fullLabel: 'Phase 2: Data & Catalog' },
  { id: 3, route: '/phase3', shortLabel: 'Phase 3', fullLabel: 'Phase 3: Develop & Query' },
  { id: 4, route: '/phase4', shortLabel: 'Phase 4', fullLabel: 'Phase 4: Automate & Monitor' },
  { id: 5, route: '/phase5', shortLabel: 'Phase 5', fullLabel: 'Phase 5: Analyze & Apply' },
] as const;

export type Phase = typeof PHASES[number];
