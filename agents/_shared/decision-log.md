# Decision Log

Aggregated key decisions from Team-Shinchan workflows for future reference.
Masumi can search this log to suggest similar past workflows.

## Format

| Field | Description |
|-------|-------------|
| ID | Sequential identifier (DEC-001, DEC-002, ...) |
| Date | When the decision was made |
| Doc ID | Source workflow document |
| Topic | What was decided |
| Decision | The actual decision |
| Rationale | Why this decision was made |

---

## Decisions

### DEC-001: Debate System Unification
- **Date**: 2026-02-07
- **Doc ID**: main-012
- **Topic**: Should debate be facilitated by Midori only, or allow direct orchestration?
- **Decision**: All debates are facilitated exclusively by Midori via Task call
- **Rationale**: Eliminates contradictions between "Direct Orchestration" and "Midori Facilitation" paths; simplifies system

### DEC-002: Stage-Tool Matrix Permissions
- **Date**: 2026-02-07
- **Doc ID**: main-012
- **Topic**: Should AskUserQuestion be allowed in planning stage? Should Glob/Grep be allowed in completion?
- **Decision**: Both allowed (AskUserQuestion in planning, Glob/Grep in completion)
- **Rationale**: Planning needs user clarification; completion needs codebase verification

### DEC-003: CI/CD Scope
- **Date**: 2026-02-07
- **Doc ID**: main-013
- **Topic**: Full CI/CD with deployment vs static tests only
- **Decision**: Static tests only (no deployment pipeline)
- **Rationale**: Project is a prompt/agent system, not deployed software; static validation is sufficient

### DEC-004: CLAUDE.md PART Numbering
- **Date**: 2026-02-07
- **Doc ID**: main-013
- **Topic**: Keep irregular numbering (1, 1.5, 1.6, 3.5) or renumber sequentially
- **Decision**: Full sequential renumbering (PART 1 through PART 14)
- **Rationale**: Irregular numbers confused cross-references; sequential is cleaner

### DEC-005: Improvement Priority Order
- **Date**: 2026-02-07
- **Doc ID**: main-013
- **Topic**: Fix HIGH items first, or work across priority levels simultaneously
- **Decision**: Sequential priority order (HIGH first, then MEDIUM, then LOW)
- **Rationale**: Sequential approach ensures critical items are resolved before lower priority

### DEC-006: Promptfoo CI Trigger
- **Date**: 2026-02-07
- **Doc ID**: main-014
- **Topic**: Run promptfoo on every PR, manual dispatch only, or nightly schedule
- **Decision**: Run on every PR (with graceful skip if API key unavailable)
- **Rationale**: Every PR ensures no agent behavior regressions; graceful skip handles forks

### DEC-007: Performance Profiling Scope
- **Date**: 2026-02-07
- **Doc ID**: main-014
- **Topic**: Static token counting only, or also measure actual API response times
- **Decision**: Static token/character analysis only
- **Rationale**: Sufficient for identifying oversized content; runtime measurement is out of scope

### DEC-008: Debate Decision Storage
- **Date**: 2026-02-07
- **Doc ID**: main-014
- **Topic**: Centralized file vs dynamic search through RETROSPECTIVE.md files
- **Decision**: Centralized file (`agents/_shared/debate-decisions.md`)
- **Rationale**: Single source of truth; faster lookup than searching multiple retrospective files
