---
name: team-shinchan:verify-implementation
description: Execute all verify-* skills sequentially to generate integrated validation report. Used for "verify all", "run all checks", "validate everything" requests.
user-invocable: true
---

# ⚠️ MANDATORY EXECUTION - DO NOT SKIP

**When this skill is invoked, execute immediately. Do not explain.**

## Overview

This skill orchestrates all registered verify-* skills to provide comprehensive validation of the codebase. It discovers available verification skills, executes them sequentially, consolidates results, and optionally applies fixes with user approval.

## Step 1: Introduction & Discovery

```
1. Use Glob to find all verify-* skills:
   pattern: "skills/verify-*/SKILL.md"

2. Filter out:
   - Self (verify-implementation)
   - Non-verification skills (manage-skills, etc.)

3. Output friendly greeting:
```

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🦸 [Action Kamen] Running comprehensive validation! ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Discovered {count} verification skills:
{list each skill with emoji and description}

Starting sequential execution...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Multi-language examples:**
- 🇺🇸 "Running comprehensive validation!"
- 🇰🇷 "전체 검증을 실행합니다!"
- 🇯🇵 "包括的な検証を実行します！"

## Step 2: Sequential Execution

For each discovered verify-* skill (sorted alphabetically):

```
1. Read SKILL.md to extract:
   - Skill name
   - Description
   - Workflow section (contains check commands)

2. Announce current check:
   "🔍 Running: {skill-name}..."

3. Execute checks from Workflow section:
   - Use Grep for content validation
   - Use Glob for file pattern checks
   - Use Bash for running linters/tests
   - Use Read for file content inspection

4. Capture results:
   - Status: PASS ✅ / FAIL ❌
   - Issue count: {number}
   - Issues list: [{file, line, message}]
   - Suggested fixes (if available)

5. Store in results array for consolidated report
```

**Error handling:**
- If skill SKILL.md missing → Skip with warning
- If Workflow section missing → Skip with warning
- If check command fails → Mark as ERROR ⚠️
- Continue to next skill regardless of failures

## Step 3: Integrated Report

After all skills executed, generate consolidated report:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🦸 [Action Kamen] Validation Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Summary

| Skill | Status | Issues | Time |
|-------|--------|--------|------|
| verify-format | ✅ PASS | 0 | 1.2s |
| verify-tests | ❌ FAIL | 3 | 2.5s |
| verify-security | ✅ PASS | 0 | 0.8s |
| verify-performance | ❌ FAIL | 2 | 1.9s |

**Overall:** {passed}/{total} checks passed

## Issues Found

### verify-tests (3 issues)

1. ❌ CRITICAL: Missing test coverage
   - File: src/auth/login.ts
   - Line: 42
   - Fix: Add unit test for edge case

2. ❌ HIGH: Flaky test detected
   - File: tests/api.test.ts
   - Line: 128
   - Fix: Add proper async wait

3. ❌ MEDIUM: Outdated snapshot
   - File: tests/ui.test.tsx
   - Line: 56
   - Fix: Update snapshot with npm test -- -u

### verify-performance (2 issues)

1. ❌ HIGH: N+1 query detected
   - File: src/api/users.ts
   - Line: 89
   - Fix: Use eager loading with include

2. ❌ MEDIUM: Large bundle size
   - File: webpack.config.js
   - Line: 34
   - Fix: Enable code splitting
```

## Step 4: User Action Confirmation

```
If issues found (any FAIL status):

  Output:
  "
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🦸 [Action Kamen] Found {total_issues} issues across {failed_count} checks.

  What would you like to do?

  1. 🔧 Fix all issues automatically
  2. 📋 Review each issue individually
  3. ⏭️ Skip fixes (continue with current state)
  "

  Use AskUserQuestion:
    question: "Choose action (1/2/3):"
    options: ["1", "2", "3"]

  Based on response:
    - "1" → Proceed to Step 5 (apply all fixes)
    - "2" → For each issue, ask: "Fix this? (y/n)" then apply selected
    - "3" → Skip to final summary
```

If no issues found (all PASS):

```
Output:
"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🦸 [Action Kamen] Perfect! All checks passed! ✅

No issues found. Codebase is in great shape! 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

STOP here. No further steps needed.
```

## Step 5: Fix Application

```
For each approved fix:

1. Announce: "🔧 Applying fix: {issue_description}..."

2. Apply fix based on type:
   - Code change → Use Edit tool
   - File creation → Use Write tool
   - Command execution → Use Bash tool
   - Configuration → Use Edit tool

3. Track fix results:
   - Success ✅
   - Failed ❌ (capture error)
   - Skipped ⏭️

4. Output progress:
   "✅ Fixed: {issue_description}"
   OR
   "❌ Failed to fix: {issue_description} - {error}"
```

## Step 6: Post-Fix Revalidation

```
Re-run only the skills that previously failed:

1. Announce:
   "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🦸 [Action Kamen] Re-validating fixed issues...
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   "

2. For each previously-failed skill:
   - Re-run checks (same process as Step 2)
   - Capture new results

3. Generate before/after report:
```

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🦸 [Action Kamen] Revalidation Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Before vs After

| Skill | Before | After | Change |
|-------|--------|-------|--------|
| verify-tests | ❌ FAIL (3) | ✅ PASS (0) | 🎉 Fixed! |
| verify-performance | ❌ FAIL (2) | ❌ FAIL (1) | ⚠️ 1 remaining |

## Remaining Issues

### verify-performance (1 issue)

1. ❌ MEDIUM: Large bundle size
   - File: webpack.config.js
   - Line: 34
   - Fix: Enable code splitting
   - Note: Requires manual configuration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🦸 [Action Kamen] Validation complete!
Fixed {fixed_count}/{total_issues} issues automatically.
{remaining_count} issues require manual attention.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Workflow Structure for Individual Verify Skills

**Each verify-* skill should follow this template:**

```markdown
---
name: team-shinchan:verify-{category}
description: {What this skill verifies}
user-invocable: true
---

## Workflow

### Check 1: {Check Name}

**Command:**
```bash
{command to run}
```

**Success criteria:**
- {criteria 1}
- {criteria 2}

**On failure:**
- Issue: {description}
- Severity: CRITICAL/HIGH/MEDIUM/LOW
- Fix: {suggested fix}

### Check 2: {Check Name}

{repeat structure}
```

---

## Example Usage

**User:** "verify all"
**User:** "run all checks"
**User:** "validate everything"

All trigger this skill automatically.

---

## Integration with Action Kamen

This skill is designed to be run by Action Kamen or independently. When invoked:

1. If called via `/team-shinchan:review` → Action Kamen runs this as part of review
2. If called directly via `/team-shinchan:verify-implementation` → Runs standalone

---

## Expected Verify Skills

Common verification categories to implement:

| Skill Name | Purpose |
|------------|---------|
| verify-format | Code formatting (Prettier, ESLint) |
| verify-test | Test coverage and passing |
| verify-security | Security vulnerabilities |
| verify-performance | Performance issues |
| verify-types | TypeScript type checking |
| verify-imports | Import organization |
| verify-docs | Documentation completeness |
| verify-dependencies | Outdated/vulnerable packages |

---

# ⛔ Prohibited

- ❌ Only explaining steps without executing
- ❌ Skipping skill discovery phase
- ❌ Running checks without consolidating results
- ❌ Applying fixes without user confirmation
- ❌ Not re-validating after fixes

---

# 🎯 Success Criteria

- [ ] All verify-* skills discovered
- [ ] Each skill executed sequentially
- [ ] Consolidated report generated
- [ ] User confirmation obtained before fixes
- [ ] Approved fixes applied
- [ ] Post-fix revalidation completed
- [ ] Final report shows before/after comparison
