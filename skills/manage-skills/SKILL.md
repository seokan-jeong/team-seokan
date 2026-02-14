---
name: team-shinchan:manage-skills
description: Analyze session changes and automatically create/update verify-* skills based on modified files. Maintains skill coverage for verification workflow.
user-invocable: true
---

# ⚠️ MANDATORY EXECUTION - DO NOT SKIP

**When this skill is invoked, execute immediately. Do not explain.**

## Overview

This skill implements automated skill management workflow that analyzes codebase changes, detects coverage gaps, and creates/updates verify-* skills to maintain comprehensive verification coverage.

## When to Run

This skill should be run:
- After completing a significant feature or refactor
- When verify-implementation reports many uncovered files
- Periodically to maintain skill coverage
- When explicitly requested by user

## Step 1: Analysis Phase

```
1. Collect changed files using Bash:
   git status --porcelain
   git diff --name-only HEAD~1

2. Filter out exempt categories:
   - Configuration files: package.json, tsconfig.json, *.config.js
   - Lock files: package-lock.json, yarn.lock, pnpm-lock.yaml
   - Documentation: *.md (except README.md in src/)
   - Test fixtures: **/__fixtures__/**, **/__mocks__/**
   - Vendor: node_modules/**, vendor/**
   - CI/CD: .github/**, .gitlab-ci.yml

3. Group remaining files by directory structure:
   Example:
   - src/auth/ → [login.ts, register.ts, middleware.ts]
   - src/api/ → [users.ts, posts.ts]
   - tests/ → [auth.test.ts, api.test.ts]

4. Output:
   "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔧 [Skill Manager] Analyzing changes...
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   📊 Found {count} changed files (after filters):
   {list files grouped by directory}
   "
```

## Step 2: Mapping Phase

```
1. Find all existing verify-* skills:
   Glob: "skills/verify-*/SKILL.md"

2. For each verify-* skill:
   - Read SKILL.md
   - Extract "Related Files" section
   - Extract "Workflow" section patterns

3. Cross-reference changed files:
   For each changed file:
     - Check if ANY verify-* skill references it
     - Mark as: COVERED / UNCOVERED

4. Output mapping result:
   "
   📋 Coverage Analysis:

   ✅ Covered by existing skills:
   - src/auth/login.ts → verify-authentication
   - src/auth/middleware.ts → verify-authentication

   ⚠️ Uncovered (no skill references):
   - src/api/users.ts
   - src/api/posts.ts
   "
```

## Step 3: Gap Detection

```
Detect 4 issue types:

1. UNCOVERED CHANGES:
   - Changed files NOT referenced by any verify-* skill
   - Example: src/payment/stripe.ts exists but no verify-payment skill

2. INVALID REFERENCES:
   - Verify-* skill points to deleted/moved file
   - Example: verify-auth references src/auth/old.ts (deleted)

3. MISSING CHECKS:
   - New pattern/feature added but no verification
   - Example: Added Redis caching but no verify-caching skill

4. STALE VALUES:
   - Outdated configuration or detection commands
   - Example: verify-format uses old ESLint config path

Output:
"
🔍 Gap Analysis:

❌ UNCOVERED (3):
  - src/payment/stripe.ts
  - src/payment/webhook.ts
  - src/utils/currency.ts

⚠️ INVALID REFS (1):
  - verify-auth → src/auth/old.ts (file deleted)

🆕 MISSING CHECKS (2):
  - Redis caching pattern detected (no verify-caching)
  - GraphQL schema validation (no verify-graphql)

📅 STALE VALUES (1):
  - verify-format → .eslintrc.json (now .eslintrc.js)
"
```

## Step 4: Decision Tree

```
For each gap, decide action:

Decision logic:
┌─ Uncovered file(s) detected
│
├─ Is related to EXISTING verify-* skill?
│  YES → ACTION: UPDATE existing skill
│  NO  → Continue...
│
├─ Are there 3+ related files in same category?
│  YES → ACTION: CREATE new skill
│  NO  → Continue...
│
├─ Is file type critical (security/auth/payment)?
│  YES → ACTION: CREATE new skill
│  NO  → ACTION: EXEMPT (add to .skillignore)

Example outputs:
- "src/payment/*.ts → CREATE verify-payment (3+ files)"
- "src/auth/new-flow.ts → UPDATE verify-authentication"
- "src/utils/logger.ts → EXEMPT (single utility file)"
```

## Step 5: Implementation

### 5A. Updating Existing Skills

```
For each UPDATE decision:

1. Read existing SKILL.md
2. Identify sections to update:
   - Related Files: Add new file paths
   - Workflow: Add new checks if needed

3. Use Edit tool to update:
   old_string: (existing Related Files section)
   new_string: (with added files)

4. Output:
   "✅ Updated verify-{category}: added {count} files"
```

### 5B. Creating New Skills

```
For each CREATE decision:

1. Generate skill name:
   Format: verify-{category}
   Examples: verify-payment, verify-caching, verify-graphql

2. Ask user for confirmation:
   Use AskUserQuestion:
   "
   🆕 Recommend creating new skill: verify-{category}

   Coverage:
   - {file1}
   - {file2}
   - {file3}

   Proceed? (y/n)
   "

3. If approved, create SKILL.md with template:
```

```markdown
---
name: team-shinchan:verify-{category}
description: Verify {category} implementation following best practices
user-invocable: true
---

## Purpose

Validates {category} code to ensure:
- {validation point 1}
- {validation point 2}
- {validation point 3}

## When to Run

- After modifying {category}-related files
- Before committing changes to {key files}
- As part of verify-implementation workflow

## Related Files

{list discovered files}

## Workflow

### Check 1: {Check Name}

**Command:**
```bash
{detection command - grep/find/linter}
```

**Success criteria:**
- {criteria 1}
- {criteria 2}

**On failure:**
- Issue: {description}
- Severity: HIGH/MEDIUM/LOW
- Fix: {suggested fix}

### Check 2: {Check Name}

{repeat structure}

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 [verify-{category}] Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: PASS ✅ / FAIL ❌

{If PASS:}
All checks passed! {category} implementation is valid.

{If FAIL:}
Found {count} issues:

1. ❌ {severity}: {issue description}
   - File: {file}
   - Line: {line}
   - Fix: {suggested fix}

{repeat for each issue}
```

## Exceptions

1. **{Exception scenario 1}**
   - Example: {realistic example}
   - Reason: {why this is acceptable}

2. **{Exception scenario 2}**
   - Example: {realistic example}
   - Reason: {why this is acceptable}

3. **{Exception scenario 3}**
   - Example: {realistic example}
   - Reason: {why this is acceptable}
```

```
4. Write new skill file:
   Write tool → skills/verify-{category}/SKILL.md

5. Output:
   "✅ Created verify-{category} skill with {check_count} checks"
```

**Required Exception Examples:**

Every new skill MUST include at least 2-3 realistic exception scenarios. Examples:

- verify-authentication exceptions:
  - Test files using mock credentials (acceptable)
  - Demo/example code with hardcoded tokens (must be marked clearly)

- verify-performance exceptions:
  - Admin dashboards with relaxed performance (low traffic)
  - Development-only debugging pages

- verify-security exceptions:
  - Public API endpoints (intentionally accessible)
  - Health check endpoints without auth

### 5C. Exempting Files

```
For EXEMPT decisions:

1. Create or update .skillignore:
   Pattern: glob pattern matching exempt files

2. Format (similar to .gitignore):
   # Single utilities
   src/utils/logger.ts
   src/utils/helpers.ts

   # Auto-generated
   src/generated/**
   **/*.generated.ts

3. Output:
   "⏭️ Exempted {count} files (added to .skillignore)"
```

## Step 6: Registration

```
After all implementations complete:

1. Update CLAUDE.md Skills section:

   Find: "### Memory Skills" section
   Add before it:

   ### Verification Skills

   | Command | Description | When |
   |---------|-------------|------|
   | `/team-shinchan:verify-implementation` | Run all checks | Before commit |
   {for each verify-* skill}
   | `/team-shinchan:verify-{category}` | Check {category} | After {category} changes |

2. Sync verify-implementation target list:
   Read: skills/verify-implementation/SKILL.md
   Update: "Expected Verify Skills" section
   Add newly created skills to the table

3. Output:
   "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔧 [Skill Manager] Complete!
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   📊 Summary:
   - Created: {new_skills_count} skills
   - Updated: {updated_skills_count} skills
   - Exempted: {exempt_files_count} files

   ✅ All verify-* skills registered in CLAUDE.md
   ✅ verify-implementation updated

   Next: Run /team-shinchan:verify-implementation to test
   "
```

---

## Naming Conventions

**Skill names must:**
- Start with `verify-`
- Use kebab-case (verify-authentication, not verify_authentication)
- Be singular (verify-test, not verify-tests)
- Be descriptive but concise (verify-auth, not verify-authentication-and-authorization)

**Examples:**
- ✅ verify-authentication
- ✅ verify-payment
- ✅ verify-graphql
- ✅ verify-cache
- ❌ verify_api (use verify-api)
- ❌ verify-tests (use verify-test)
- ❌ verifyFormat (use verify-format)

---

## Exempt Categories

**ALWAYS skip these file types:**

| Category | Patterns | Reason |
|----------|----------|--------|
| Configuration | `*.config.js`, `tsconfig.json`, `.prettierrc` | Project setup, not code |
| Lock files | `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` | Auto-generated |
| Documentation | `*.md` (except src/README.md) | Non-executable |
| Test fixtures | `__fixtures__/**`, `__mocks__/**` | Test data |
| Vendor | `node_modules/**`, `vendor/**` | External code |
| CI/CD | `.github/**`, `.gitlab-ci.yml` | Infrastructure |
| Build output | `dist/**`, `build/**`, `out/**` | Generated code |

---

## Example Workflows

### Example 1: New Feature (Payment)

```
Input: User added payment integration
Changed files:
  - src/payment/stripe.ts
  - src/payment/webhook.ts
  - src/payment/invoice.ts

Workflow:
1. Analysis → 3 payment files detected
2. Mapping → No existing verify-payment skill
3. Gap → UNCOVERED (3 files in same category)
4. Decision → CREATE verify-payment (3+ files)
5. Implementation → Generate skill with Stripe validation checks
6. Registration → Add to CLAUDE.md + verify-implementation

Output:
"✅ Created verify-payment skill with 4 checks"
```

### Example 2: Update Existing (Auth)

```
Input: User added OAuth flow
Changed files:
  - src/auth/oauth.ts
  - src/auth/providers/google.ts

Workflow:
1. Analysis → 2 auth files detected
2. Mapping → verify-authentication exists, covers src/auth/*
3. Gap → UNCOVERED (new files in covered category)
4. Decision → UPDATE verify-authentication
5. Implementation → Add OAuth-specific checks
6. Registration → No CLAUDE.md update needed

Output:
"✅ Updated verify-authentication: added OAuth checks"
```

### Example 3: Exempt Utility

```
Input: User added helper function
Changed files:
  - src/utils/date-formatter.ts

Workflow:
1. Analysis → 1 utility file detected
2. Mapping → Not covered by any skill
3. Gap → UNCOVERED (single file)
4. Decision → EXEMPT (single utility, not critical)
5. Implementation → Add to .skillignore
6. Registration → N/A

Output:
"⏭️ Exempted 1 file (added to .skillignore)"
```

---

# ⛔ Prohibited

- ❌ Creating skills without user confirmation
- ❌ Naming skills without `verify-` prefix
- ❌ Creating skills for single files (unless critical)
- ❌ Skipping exception examples in new skills
- ❌ Not updating CLAUDE.md after skill creation
- ❌ Creating skills for exempt file types
- ❌ Using snake_case or camelCase for skill names

---

# 🎯 Success Criteria

- [ ] All changed files analyzed
- [ ] Coverage gaps identified
- [ ] Decision tree applied correctly
- [ ] New skills created with user approval
- [ ] Existing skills updated appropriately
- [ ] Files exempt when appropriate
- [ ] CLAUDE.md updated with new skills
- [ ] verify-implementation list synced
- [ ] All new skills follow naming conventions
- [ ] All new skills include realistic exceptions

---

## Integration with verify-implementation

This skill works hand-in-hand with verify-implementation:

1. **verify-implementation** runs all verify-* skills
2. If many files uncovered → suggests running **manage-skills**
3. **manage-skills** creates/updates skills
4. Re-run **verify-implementation** to verify coverage

**Workflow:**
```
verify-implementation (detects gaps)
    ↓
manage-skills (fixes gaps)
    ↓
verify-implementation (confirms coverage)
```

---

## User Invocation Examples

**User:** "manage skills"
**User:** "update verification skills"
**User:** "create missing verify skills"
**User:** "skill coverage check"

All trigger this skill automatically.
