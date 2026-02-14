---
name: team-shinchan:manage-skills
description: Analyze changes and ensure verify-* skill coverage for the team-shinchan plugin. Maintains verification pipeline integrity.
user-invocable: true
---

# ⚠️ MANDATORY EXECUTION - DO NOT SKIP

**When this skill is invoked, execute immediately. Do not explain.**

## Overview

Analyzes changed files in the team-shinchan plugin and maps them to the appropriate verify-* skills. Detects coverage gaps and reports uncovered areas.

## When to Run

- After completing a significant feature or refactor
- When verify-implementation reports many uncovered files
- Periodically to maintain skill coverage
- When explicitly requested by user

## Step 1: Collect Changes

```
1. Collect changed files:
   git status --porcelain
   git diff --name-only HEAD~1

2. Exempt these paths (NOT verification targets):
   - .shinchan-docs/**     (workflow output, not plugin code)
   - docs/**               (internal documentation)
   - WORKFLOW_STATE.yaml   (ephemeral state)
   - tests/validate/**     (validators themselves, not targets)
   - node_modules/**       (external)
   - .git/**               (version control)

3. Everything else IS a verification target, including:
   - agents/*.md           (agent definitions)
   - skills/*/SKILL.md     (skill definitions)
   - hooks/*.md            (hook definitions)
   - CLAUDE.md             (root config)
   - tests/**              (test infrastructure, except validators)
```

## Step 2: Map Changes to Validators

| Changed Path | Verify Skill | Validators |
|---|---|---|
| `agents/*.md` | verify-agents | agent-schema, shared-refs |
| `agents/_shared/*.md` | verify-agents | shared-refs |
| `skills/*/SKILL.md` | verify-skills | skill-schema, skill-format, input-validation |
| `CLAUDE.md` | verify-consistency | cross-refs, stage-matrix |
| `CLAUDE.md`, `agents/*.md` | verify-consistency | debate-consistency |
| `docs/workflow-guide.md`, `hooks/*.md` | verify-workflow | workflow-state-schema, error-handling, quick-fix-path |
| `agents/*-part-*.md` | verify-workflow | part-numbering |
| Memory-related sections | verify-memory | memory-system |
| Any file creation/expansion | verify-budget | token-budget |

## Step 3: Report Coverage

```
Output format:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 [Skill Manager] Coverage Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Changed files: {count} (after exemptions)

✅ Covered:
  - agents/bo.md → verify-agents (agent-schema, shared-refs)
  - CLAUDE.md → verify-consistency (cross-refs, stage-matrix)

⚠️ Uncovered (if any):
  - {file} → No matching verify-* skill

📋 Recommended validators to run:
  node tests/validate/agent-schema.js
  node tests/validate/cross-refs.js
  ...

Or run all: node tests/validate/index.js
```

## Step 4: Gap Resolution

If uncovered files are found:

1. **Fits existing category** → Report which verify-* skill should add coverage
2. **New category needed** → Report to user with recommendation
3. **Should be exempt** → Suggest adding to exempt list in this skill

## Current Verify Skills

| Skill | Validators Wrapped |
|---|---|
| verify-agents | agent-schema, shared-refs |
| verify-skills | skill-schema, skill-format, input-validation |
| verify-consistency | cross-refs, stage-matrix, debate-consistency |
| verify-workflow | workflow-state-schema, error-handling, part-numbering, quick-fix-path |
| verify-memory | memory-system |
| verify-budget | token-budget |

Total: 14 validators across 6 verify-* skills.

---

# ⛔ Prohibited

- ❌ Excluding `*.md` files from analysis (they ARE the codebase)
- ❌ Looking for `src/` directories (this is a markdown plugin)
- ❌ Auto-creating new verify-* skills without user approval
- ❌ Modifying validators in `tests/validate/`

---

# 🎯 Success Criteria

- [ ] All changed files analyzed (exempt paths excluded)
- [ ] Each change mapped to appropriate verify-* skill
- [ ] Coverage gaps identified and reported
- [ ] Recommended validator commands listed
