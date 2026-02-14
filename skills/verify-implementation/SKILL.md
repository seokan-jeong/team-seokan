---
name: team-shinchan:verify-implementation
description: Execute all verify-* skills sequentially to generate integrated validation report. Used for "verify all", "run all checks", "validate everything" requests.
user-invocable: true
---

# ⚠️ MANDATORY EXECUTION - DO NOT SKIP

**When this skill is invoked, execute immediately. Do not explain.**

## Overview

Orchestrates all verify-* skills for comprehensive validation. Discovers available skills, executes them, consolidates results, and optionally applies fixes.

## Fast Path

Run all 14 validators at once (recommended for quick checks):

```bash
node tests/validate/index.js
```

If all pass → report success and stop. If any fail → continue to detailed per-skill execution below.

## Step 1: Discovery

```
1. Use Glob to find all verify-* skills:
   pattern: "skills/verify-*/SKILL.md"

2. Filter out self (verify-implementation)

3. Output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🦸 [Action Kamen] Running comprehensive validation!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Discovered {count} verification skills:
{list each skill}

Starting execution...
```

## Step 2: Sequential Execution

For each verify-* skill (sorted alphabetically):

```
1. Read SKILL.md to extract validator commands
2. Announce: "🔍 Running: {skill-name}..."
3. Execute each validator command from the Workflow section
4. Capture results:
   - Status: PASS ✅ / FAIL ❌
   - Output from validator
```

**Error handling:**
- If SKILL.md missing → Skip with warning
- If validator command fails → Mark as FAIL, capture output
- Continue to next skill regardless

## Step 3: Consolidated Report

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🦸 [Action Kamen] Validation Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Summary

| Skill | Status | Validators |
|-------|--------|-----------|
| verify-agents | ✅ PASS | agent-schema, shared-refs |
| verify-skills | ❌ FAIL | skill-schema, skill-format, input-validation |
| verify-consistency | ✅ PASS | cross-refs, stage-matrix, debate-consistency |
| verify-workflow | ✅ PASS | workflow-state-schema, error-handling, part-numbering, quick-fix-path |
| verify-memory | ✅ PASS | memory-system |
| verify-budget | ✅ PASS | token-budget |

**Overall:** {passed}/{total} skills passed

## Issues Found (if any)

{validator output for failed checks}
```

## Step 4: User Action

```
If issues found:
  Use AskUserQuestion:
  - "Fix all issues automatically"
  - "Review each issue individually"
  - "Skip fixes"

If no issues:
  "🦸 [Action Kamen] All checks passed! ✅"
  STOP here.
```

## Step 5: Fix Application

```
For each approved fix:
1. Announce: "🔧 Applying fix: {description}..."
2. Apply fix using Edit/Write/Bash tools
3. Report: ✅ Fixed / ❌ Failed
```

## Step 6: Revalidation

```
Re-run only previously-failed validators:
1. Execute failed validator commands again
2. Report before/after comparison

| Skill | Before | After |
|-------|--------|-------|
| verify-skills | ❌ FAIL | ✅ PASS |
```

---

## Expected Verify Skills

| Skill | Validators | Trigger |
|-------|-----------|---------|
| verify-agents | agent-schema, shared-refs | agents/ changes |
| verify-skills | skill-schema, skill-format, input-validation | skills/ changes |
| verify-consistency | cross-refs, stage-matrix, debate-consistency | CLAUDE.md, cross-cutting changes |
| verify-workflow | workflow-state-schema, error-handling, part-numbering, quick-fix-path | workflow/hook changes |
| verify-memory | memory-system | memory config changes |
| verify-budget | token-budget | any file creation/expansion |

---

## Integration

- Called via `/team-shinchan:review` → Action Kamen runs this as part of review
- Called via `/team-shinchan:verify-implementation` → Runs standalone
- Works with manage-skills: gaps detected here → manage-skills resolves them

---

# ⛔ Prohibited

- ❌ Only explaining steps without executing
- ❌ Skipping skill discovery phase
- ❌ Applying fixes without user confirmation
- ❌ Not re-validating after fixes

---

# 🎯 Success Criteria

- [ ] All verify-* skills discovered and executed
- [ ] Consolidated report generated
- [ ] User confirmation obtained before fixes
- [ ] Post-fix revalidation completed
