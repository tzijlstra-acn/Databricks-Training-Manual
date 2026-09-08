# VISUAL AUDIT — Databricks Training Manual
*Audit date: 2026-08-28 | Auditor: Claude Sonnet 4.6*

---

## Scoring Key
All scores 1–10. Higher = stronger.

**Axes:**
- **Visual Storytelling** — does the page convey a narrative, not just facts?
- **Interactivity** — can the learner touch, explore, experiment?
- **Beginner Comprehension** — would someone with zero Databricks background get it?
- **Information Hierarchy** — is the most important thing the most prominent thing?
- **Memorability** — will the learner remember this in 48 hours?
- **Spatial Learning** — does the layout teach spatial/relational understanding?
- **Presentation Usefulness** — can a trainer project this without returning to PowerPoint?
- **Animation Quality** — does motion communicate meaning, or is it decoration?
- **Visual Polish** — does it look like it belongs in a professional training programme?
- **Content Density** — is density appropriate? (10 = perfectly calibrated, low = too sparse, high score penalty for overwhelming)

---

## Page Scores

### `/` — Home Page

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 6 | BigPictureArchitecture and FollowTheData create narrative moments, but they compete with 5 other sections |
| Interactivity | 5 | FollowTheData is genuinely interactive; everything else is hover-only |
| Beginner Comprehension | 5 | ScenarioIntro is the right idea but walls of text before the first visual |
| Information Hierarchy | 5 | No clear single dominant visual — 7 sections fight for attention |
| Memorability | 5 | The layered band diagram is distinctive, but the page overall is forgettable |
| Spatial Learning | 5 | BigPictureArchitecture teaches layers but relationships between components aren't clear |
| Presentation Usefulness | 3 | Too dense to project; no single idea dominates |
| Animation Quality | 6 | FollowTheData's framer-motion is smooth and purposeful; SVG dashes on BigPicture are nice |
| Visual Polish | 7 | Clean, brand-correct, consistent typography |
| Content Density | 4 | **Overloaded.** Seven components on one scroll; learner doesn't know where to focus |

**Classification: KEEP + ENHANCE**
The individual components are mostly strong. The problem is composition — too many sections of equal weight with no clear hierarchy.

---

### `/architecture` — Architecture Explorer

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 5 | React Flow graph exists but tells no story — it's a static reference map |
| Interactivity | 7 | Click-to-expand node panel works well; dragging is enabled |
| Beginner Comprehension | 4 | Abstract colored rectangles don't visually communicate what each node *does* |
| Information Hierarchy | 6 | Node categories are color-coded but the graph feels flat — all nodes have equal visual weight |
| Memorability | 4 | Generic boxes are not memorable; the category colors help but not enough |
| Spatial Learning | 7 | The spatial layout does show relationships; MiniMap reinforces it |
| Presentation Usefulness | 5 | Good starting point but no guided walkthrough mode |
| Animation Quality | 5 | Edges animate but are the default React Flow `animated: true` — no semantic meaning |
| Visual Polish | 5 | Default React Flow styling with custom colors — readable but not distinctive |
| Content Density | 7 | The node count is appropriate; side panel is well-structured |

**Critical problem:** Clicking a node opens an info panel but does **not** highlight/dim connected nodes. There is no connected-highlighting. The biggest affordance of a graph — seeing relationships light up — is absent.

**Classification: REWORK** (keep the data, replace the visual layer)

---

### `/day1` — Platform & Workspace

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 6 | WorkspaceExplorer is the strongest component — mock Databricks UI with ping hotspots |
| Interactivity | 7 | WorkspaceExplorer sidebar is fully clickable with detail panel |
| Beginner Comprehension | 7 | The workspace simulation is highly intuitive for newcomers |
| Information Hierarchy | 6 | WorkspaceExplorer is dominant as it should be; AdvancedSection blocks are well-gated |
| Memorability | 7 | Ping animations + mock browser chrome make it memorable |
| Spatial Learning | 7 | Spatial layout of sidebar sections mirrors real Databricks |
| Presentation Usefulness | 8 | WorkspaceExplorer is excellent for live demo |
| Animation Quality | 7 | `animate-ping` hotspots are purposeful — they communicate "click me" |
| Visual Polish | 7 | Strong; mock browser UI is convincing |
| Content Density | 6 | Good — AdvancedSection gates complexity appropriately |

**Classification: KEEP + ENHANCE**
WorkspaceExplorer is the strongest existing component. The page structure is good. Enhancement: add guided mode that spotlights items in sequence.

---

### `/day2` — Data & Catalog

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 6 | MedallionFlow tells the Bronze→Silver→Gold story with entrance animations |
| Interactivity | 6 | CatalogTree with analogy toggle is good; MedallionFlow is view-only after entrance |
| Beginner Comprehension | 6 | The analogy toggle in CatalogTree (Building/Floor/Room) is excellent for beginners |
| Information Hierarchy | 5 | Three separate components of similar weight compete: CatalogTree, MedallionFlow, tables |
| Memorability | 5 | The three-panel medallion is conceptually clear but not visceral |
| Spatial Learning | 6 | CatalogTree shows hierarchy spatially; MedallionFlow shows progression |
| Presentation Usefulness | 6 | MedallionFlow is projectable; CatalogTree requires interaction |
| Animation Quality | 6 | Framer-motion entrance in MedallionFlow is smooth; no ongoing animation to guide attention |
| Visual Polish | 7 | Good brand alignment |
| Content Density | 5 | **High.** Two AdvancedSection blocks, a layer table, and three main components |

**Core gap:** You can *see* the three Medallion layers but you cannot *watch data change* as it moves through them. The current MedallionFlow shows before/after comparisons — it does not animate the transformation.

**Classification: KEEP + ENHANCE** (MedallionFlow entrance is worth keeping; needs a live playground layer)

---

### `/day3` — Develop & Query

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 5 | NotebookSimulator is strong; ComputeExplainer is 4 static cards |
| Interactivity | 7 | NotebookSimulator's run buttons and cell execution are great |
| Beginner Comprehension | 6 | NotebookSimulator is immediately understandable |
| Information Hierarchy | 6 | NotebookSimulator is dominant; ComputeExplainer is secondary and weak |
| Memorability | 5 | Notebook simulation is memorable; compute concept is abstract |
| Spatial Learning | 3 | **Critical gap.** No visualization of Notebook → Compute → Data → Result relationship |
| Presentation Usefulness | 6 | NotebookSimulator is good for presentation; ComputeExplainer is not projectable |
| Animation Quality | 6 | Cell-run states (idle/running/done) are clear; ComputeExplainer is static |
| Visual Polish | 6 | Good |
| Content Density | 6 | Reasonable |

**Core gap:** ComputeExplainer is 4 static cards with a road-trip analogy. Compute is the most misunderstood Databricks concept. There is no simulation of the cluster state machine (stopped → starting → running) or what happens when you try to run without compute attached.

**Classification: KEEP NotebookSimulator + REPLACE ComputeExplainer**

---

### `/day4` — Automate & Monitor

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 6 | PipelineVisualizer animates task progression; DQXFlow has dot animation |
| Interactivity | 7 | PipelineVisualizer's run button + failure revelation is good; DQXFlow toggle |
| Beginner Comprehension | 5 | The BAYO attribution failure story is told in an error text box, not visually |
| Information Hierarchy | 5 | PipelineVisualizer + DQXFlow + Recharts pie + timeline is a lot |
| Memorability | 5 | The pipeline animation is memorable; DQX concepts are abstract |
| Spatial Learning | 4 | PipelineVisualizer is a vertical list — does not show task dependencies spatially |
| Presentation Usefulness | 6 | Pipeline animation projects well; DQX dot flow is engaging |
| Animation Quality | 6 | Pulse/spin states are purposeful; dot animation in DQXFlow is nice |
| Visual Polish | 6 | Good |
| Content Density | 5 | **High** — 4 major components on one page |

**Core gap:** PipelineVisualizer shows only one scenario (it always ends in failure). There is no scenario selector. More critically, it uses a vertical *list* of tasks — not a *graph* showing which tasks depend on which. The learner cannot see that Gold is blocked *because* DQ failed.

**Classification: REWORK PipelineVisualizer** (list → dependency graph + scenario selector)

---

### `/day5` — Analyse & Present

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 6 | DashboardLineage tells the upstream story well; GenieDemo shows AI processing steps |
| Interactivity | 7 | KPI cards → lineage tree is clever; GenieDemo typing + suggestions |
| Beginner Comprehension | 6 | Lineage concept is abstract — the vertical list doesn't immediately communicate "upstream" |
| Information Hierarchy | 6 | Good; DashboardLineage is dominant |
| Memorability | 5 | The lineage list is correct but not spatially striking |
| Spatial Learning | 4 | **Gap.** Lineage is shown as a vertical accordion-style list. It should be a graph that physically traces backward |
| Presentation Usefulness | 7 | GenieDemo is excellent for live demo; lineage is projectable |
| Animation Quality | 6 | GenieDemo step-through is smooth; DashboardLineage has no animation |
| Visual Polish | 7 | Strong |
| Content Density | 6 | Good |

**Core gap:** Data lineage shown as a collapsible list instead of an actual graph. The visual should make it *obvious* that a number traces backward through multiple layers — a list doesn't communicate that.

**Classification: KEEP GenieDemo + REWORK DashboardLineage**

---

### `/knowledge-check` — Full Assessment

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 3 | Pure question/answer UI with no visual narrative |
| Interactivity | 8 | FullTest + QuizComponent are well-implemented |
| Beginner Comprehension | 7 | Clear UI, good explanations |
| Information Hierarchy | 7 | Good; assessment first, practice below |
| Memorability | 4 | The content is memorable; the UI is not |
| Spatial Learning | 1 | None |
| Presentation Usefulness | 4 | Not suitable for classroom projection |
| Animation Quality | 4 | Basic transitions only |
| Visual Polish | 6 | Functional; not distinctive |
| Content Density | 7 | Good calibration |

**Classification: KEEP** (functional, well-implemented, not the priority for visual upgrade)

---

### `/glossary` — Glossary

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 3 | Grid of cards; no narrative |
| Interactivity | 5 | Search + filter + related-term navigation |
| Beginner Comprehension | 7 | Analogy field per term is very effective |
| Information Hierarchy | 7 | Good — search + categories + cards |
| Memorability | 3 | Card grid is not memorable |
| Spatial Learning | 1 | None |
| Presentation Usefulness | 3 | Not suitable for projection |
| Animation Quality | 2 | No meaningful animation |
| Visual Polish | 6 | Clean |
| Content Density | 7 | Good |

**Classification: KEEP** (adequate for reference; not the visual priority)

---

### `/troubleshooting` — Troubleshooting & FAQ

| Axis | Score | Note |
|------|-------|------|
| Visual Storytelling | 5 | Decision trees are genuinely visual; FAQ is text |
| Interactivity | 7 | YES/NO navigation is effective |
| Beginner Comprehension | 7 | Step-by-step diagnosis is intuitive |
| Information Hierarchy | 7 | Good; scenario cards → tree |
| Memorability | 5 | Trees are visually distinctive |
| Spatial Learning | 4 | Tree layout shows branching but tree visual is small and dense |
| Presentation Usefulness | 6 | Usable in classroom for real troubleshooting |
| Animation Quality | 3 | Path highlighting is CSS only; no animation |
| Visual Polish | 6 | Functional |
| Content Density | 5 | Good |

**Classification: KEEP + ENHANCE** (trees could animate transitions)

---

## Cross-Cutting Issues

### Issue 1: Card-UI Overload
Almost every page defaults to `rounded-2xl border bg-white p-4/5/6` cards. Even complex ideas (compute state machine, pipeline dependencies, data lineage) are expressed as cards with text. Cards are appropriate for reference content (glossary, FAQs). They are insufficient for system behaviour and relationships.

### Issue 2: No Connected Highlighting Anywhere
The Architecture Explorer uses React Flow but doesn't dim unrelated nodes when one is selected. No other page has this interaction pattern either. This is the highest-leverage missing interaction across the entire application.

### Issue 3: Scenarios Are Fixed
The PipelineVisualizer always runs the same sequence ending in the same failure. There is no way to explore alternative failure modes (compute down, permission error, missing source file). Students cannot develop diagnostic intuition.

### Issue 4: Compute Is Under-Visualized
The Notebook→Compute→Data→Result relationship is the most misunderstood in Databricks. It is currently taught with 4 static analogy cards. There is no state machine, no simulation of starting/stopping, no visualization of what "attached" means.

### Issue 5: Lineage Is a List, Not a Graph
Data lineage is the most important concept for the FINMA audit story. It is currently a vertical collapsible list. A backwards-tracing graph would be far more powerful.

### Issue 6: Presentation Mode Exists But Doesn't Work
`PresentationContext` is wired up but barely used. No page actually responds to it by hiding navigation, stepping through content, or maximizing the primary visual.

### Issue 7: Home Page Has No Dominant Visual
Projected on a 75-inch screen, no single concept dominates. Seven components of similar size compete. A visitor cannot answer "what does this teach?" from visual structure alone.

---

## Component Inventory

| Component | Status | Priority |
|-----------|--------|----------|
| `WorkspaceExplorer` | KEEP | — strong already |
| `BigPictureArchitecture` | KEEP + ENHANCE | Add scrollytelling trigger |
| `FollowTheData` | KEEP + ENHANCE | Add field-level transformations |
| `MedallionFlow` | KEEP + ENHANCE | Add Playground beneath it |
| `CatalogTree` | KEEP | Good as-is |
| `NotebookSimulator` | KEEP | Strong already |
| `ComputeExplainer` | REPLACE | Static cards insufficient |
| `PipelineVisualizer` | REWORK | List → dependency graph |
| `DQXFlow` | KEEP + ENHANCE | Good dot animation |
| `DashboardLineage` | REWORK | List → React Flow graph |
| `GenieDemo` | KEEP | Strong already |
| `ArchitecturePage` | REWORK | Custom nodes + highlighting |

---

*End of audit.*
