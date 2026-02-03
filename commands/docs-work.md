---
description: Integrated workflow with documentation. Auto-generates doc ID from issue or branch.
---

# Docs-Work Command

Start the integrated workflow with full documentation.

**Note:** This workflow is automatically triggered for non-trivial tasks. Use this command to explicitly start it for any task.

## Usage

```bash
/team-shinchan:docs-work ISSUE-123   # With issue ID
/team-shinchan:docs-work             # Auto-generate ID from branch
```

## Document ID Generation

| Case | Format | Example |
|------|--------|---------|
| Issue ID provided | `ISSUE-{id}` | `ISSUE-123` |
| From branch name | `{branch}-{index}` | `feature-auth-001` |
| Main branch | `main-{index}` | `main-001` |

## What Happens

```
Stage 1: Requirements
├─ Nene: Interview (if unclear)
├─ Midori: Debate (if design decision needed)
└─ Create REQUESTS.md

Stage 2: Planning
├─ Nene: Break into phases
├─ Shiro: Impact analysis
└─ Create PROGRESS.md

Stage 3: Execution (per phase)
├─ Shiro: Phase impact analysis
├─ Midori: Debate (if needed)
├─ Bo/Aichan/Bunta/Masao: Implementation
├─ Action Kamen: Review
└─ Update PROGRESS.md

Stage 4: Completion (auto)
├─ Masumi: RETROSPECTIVE.md
├─ Masumi: IMPLEMENTATION.md
└─ Action Kamen: Final verification
```

## Output

```
shinchan-docs/{DOC_ID}/
├─ REQUESTS.md
├─ PROGRESS.md
├─ RETROSPECTIVE.md
└─ IMPLEMENTATION.md
```
