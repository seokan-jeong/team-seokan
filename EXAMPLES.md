# Team-Shinchan Coding Examples

Karpathy-inspired principle examples tailored for the Team-Shinchan agent system.
These examples show how Bo implements code, and how Action Kamen reviews it.

> Principles reference: [agents/_shared/coding-principles.md](agents/_shared/coding-principles.md)

---

## Anti-Pattern Summary Table

| Anti-Pattern | Principle Violated | Detection Signal | Fix Direction |
|---|---|---|---|
| Rewrites entire module for a one-line fix | Surgical Changes | Diff shows 200+ lines for a 1-line request | Revert to minimal change |
| Factory + Strategy + Builder for a simple CRUD | Simplicity First | Class hierarchy for a trivial function | Delete abstractions, write a plain function |
| "Should be faster now" with no measurement | Goal-Driven Execution | No before/after data, no test run | Define success criteria upfront |
| "I assumed the user meant X" — after the fact | Think Before Coding | Silent assumption baked into the code | Ask before coding, not after |
| "While I was in there, I also fixed Y" | Surgical Changes | Unrelated hunks in the diff | Revert unrelated changes, open a separate task |
| Over-parameterized function "for future use" | Simplicity First | Parameters that no caller uses | Remove unused parameters |
| Copy-pasting logic instead of reading context | Think Before Coding | Duplicate logic that conflicts with existing code | Read the codebase first |

---

## Scenario 1: Add a Simple Helper Function (Simplicity First)

**Request from Shinnosuke to Bo:**
> "Add a helper that checks if a string is blank (empty or only whitespace)."

### Bad Example

Bo receives the task and immediately creates an abstraction layer:

```typescript
// agents/bo.md instruction: "Keep functions small and focused"
// Bo violated: Simplicity First

// src/utils/validation/StringValidationStrategy.ts
export interface ValidationStrategy<T> {
  validate(input: T): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  metadata?: Record<string, unknown>;
}

export abstract class BaseStringValidator implements ValidationStrategy<string> {
  abstract validate(input: string): ValidationResult;
}

export class BlankStringValidator extends BaseStringValidator {
  private readonly trimWhitespace: boolean;
  private readonly includeNullCheck: boolean;

  constructor(options: { trimWhitespace?: boolean; includeNullCheck?: boolean } = {}) {
    super();
    this.trimWhitespace = options.trimWhitespace ?? true;
    this.includeNullCheck = options.includeNullCheck ?? false;
  }

  validate(input: string): ValidationResult {
    if (this.includeNullCheck && input == null) {
      return { isValid: true, message: "Input is null/undefined", metadata: { type: "null" } };
    }
    const processed = this.trimWhitespace ? input.trim() : input;
    const isBlank = processed.length === 0;
    return {
      isValid: isBlank,
      message: isBlank ? "String is blank" : "String is not blank",
      metadata: { originalLength: input.length, processedLength: processed.length },
    };
  }
}

export const validatorFactory = (type: "blank" | "empty") => {
  if (type === "blank") return new BlankStringValidator({ trimWhitespace: true });
  return new BlankStringValidator({ trimWhitespace: false });
};
```

**Action Kamen review:**
```
🦸 [Action Kamen] REJECTED

| Check                    | Status |
|--------------------------|--------|
| Correctness              | ✅ PASS |
| Simplicity First         | ❌ FAIL |
| Surgical Changes         | ✅ PASS |

Required fixes:
1. [HIGH] Simplicity First violated: 50-line class hierarchy for a one-liner problem.
   The request asked for a helper function — not a validation framework.
   Delete ValidationStrategy, BaseStringValidator, BlankStringValidator, validatorFactory.
   Replace with a single function.
```

### Good Example

Bo applies Simplicity First — minimum code that solves the problem:

```typescript
// src/utils/string.ts

/**
 * Returns true if the string is empty or contains only whitespace.
 */
export function isBlank(s: string): boolean {
  return s.trim().length === 0;
}
```

**Action Kamen review:**
```
🦸 [Action Kamen] APPROVED ✅

| Check                    | Status |
|--------------------------|--------|
| Correctness              | ✅ PASS |
| Simplicity First         | ✅ PASS |
| Surgical Changes         | ✅ PASS |
| Goal-Driven Execution    | ✅ PASS |

One function. One line. Solves the problem exactly. Great work, Bo.
```

**Bo's completion report:**
```
😪 [Bo] Complete.

Success criteria: isBlank("") → true, isBlank("  ") → true, isBlank("hello") → false
Step 1: Write function → verify: unit test passes ✅
File: src/utils/string.ts (+3 lines)
```

---

## Scenario 2: Fix a Bug (Surgical Changes)

**Request from Shinnosuke to Bo:**
> "The error message on line 47 of src/auth/login.ts says 'Invalid credantials' — fix the typo."

### Bad Example

Bo fixes the typo, then "improves" the surrounding code while in the file:

```
😪 [Bo] Done.

Changes made to src/auth/login.ts:
- Line 47: Fixed typo 'credantials' → 'credentials'
- Line 44-52: Extracted error messages into ERROR_MESSAGES constant (cleaner)
- Line 38-42: Renamed variable 'usr' → 'user' for clarity
- Line 60-75: Reformatted the try/catch block to match project style guide
- Line 80: Removed trailing whitespace

Also updated src/auth/register.ts to use the same ERROR_MESSAGES constant.

Total: 2 files, 35 lines changed.
```

**Action Kamen review:**
```
🦸 [Action Kamen] REJECTED

| Check                      | Status |
|----------------------------|--------|
| Surgical Changes           | ❌ FAIL |
| Correctness                | ✅ PASS |

Required fixes:
1. [HIGH] Surgical Changes violated: request was to fix 1 typo (1 line).
   Actual diff: 35 lines across 2 files.
   Revert everything except line 47.
   "While I was in there" changes must not happen without explicit approval.
2. [HIGH] src/auth/register.ts was not mentioned in the request.
   Revert all changes to that file.

Note: If you believe the refactoring is valuable, report it to Shinnosuke
as a separate task — do not bundle it silently.
```

### Good Example

Bo changes exactly one line:

```diff
// src/auth/login.ts — line 47 only

- throw new Error('Invalid credantials');
+ throw new Error('Invalid credentials');
```

**Bo's completion report:**
```
😪 [Bo] Complete.

Success criteria: typo corrected, no other lines touched.
Step 1: Fix line 47 → verify: git diff shows exactly 1 line changed ✅
Step 2: Run existing tests → verify: all pass ✅

File: src/auth/login.ts (1 line changed)
Diff size: +1/-1
```

**Action Kamen review:**
```
🦸 [Action Kamen] APPROVED ✅

| Check                      | Status |
|----------------------------|--------|
| Correctness                | ✅ PASS |
| Surgical Changes           | ✅ PASS |

Side note: Spotted 'usr' variable name nearby — flagged for Shinnosuke's awareness,
not fixed here. Separate task if desired.
```

---

## Scenario 3: Add a New API Endpoint (Goal-Driven Execution)

**Request from Shinnosuke to Bo:**
> "Add a GET /api/users/:id endpoint that returns user data. Use the existing UserService."

### Bad Example

Bo jumps into implementation without defining success criteria:

```
😪 [Bo] Starting implementation...

[Bo writes the endpoint, wires it to UserService, returns 200 with user data]

😪 [Bo] Done. Added GET /api/users/:id.
```

No success criteria defined. No verification step. No mention of error handling, auth, or what "done" means. When Action Kamen reviews, issues emerge that could have been caught before coding:

```
🦸 [Action Kamen] REJECTED

| Check                       | Status |
|-----------------------------|--------|
| Correctness                 | ⚠️ WARN |
| Goal-Driven Execution       | ❌ FAIL |
| Think Before Coding         | ❌ FAIL |

Required fixes:
1. [HIGH] Goal-Driven Execution: No success criteria defined.
   What does "returns user data" mean exactly? All fields? Sanitized fields?
2. [HIGH] Think Before Coding: No 404 handling when user is not found.
   No auth check — is this endpoint public or protected?
3. [MEDIUM] No test written for the new endpoint.
   "Done" is undefined without a passing test.
```

### Good Example

Bo defines success criteria first, then implements in verified steps:

**Bo's pre-implementation statement:**
```
😪 [Bo] Starting: "Add GET /api/users/:id"

Assumptions (surfaced before coding):
- Authentication: endpoint requires valid session (inferred from other routes)
- Response shape: { id, name, email } — PII fields only, no passwordHash
- Error cases: 404 if user not found, 401 if unauthenticated

Success criteria:
- GET /api/users/123 → 200 with { id, name, email } for existing user
- GET /api/users/999 → 404 for non-existent user
- GET /api/users/123 (no auth) → 401
- All existing tests continue to pass

If any assumption is wrong, please correct before I proceed.
```

**Bo's implementation (after no objection from Shinnosuke):**

```typescript
// src/routes/users.ts

router.get('/api/users/:id', requireAuth, async (req, res) => {
  const user = await UserService.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});
```

```typescript
// src/routes/users.test.ts

describe('GET /api/users/:id', () => {
  it('returns user data for existing user', async () => {
    const res = await request(app).get('/api/users/1').set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' });
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('returns 404 for non-existent user', async () => {
    const res = await request(app).get('/api/users/999').set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(404);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.status).toBe(401);
  });
});
```

**Bo's completion report:**
```
😪 [Bo] Complete.

Step 1: Define success criteria → verified above ✅
Step 2: Implement endpoint → verify: manual curl returns 200 ✅
Step 3: Handle 404 and 401 → verify: tests pass ✅
Step 4: Run all existing tests → verify: 47/47 pass ✅

Files changed:
- src/routes/users.ts (+12 lines)
- src/routes/users.test.ts (+24 lines)
```

**Action Kamen review:**
```
🦸 [Action Kamen] APPROVED ✅

| Check                       | Status |
|-----------------------------|--------|
| Correctness                 | ✅ PASS |
| Security                    | ✅ PASS |
| Goal-Driven Execution       | ✅ PASS |
| Think Before Coding         | ✅ PASS |
| Surgical Changes            | ✅ PASS |
| Tests                       | ✅ PASS |

Assumptions were surfaced before coding. Success criteria were defined and verified.
passwordHash is correctly excluded. Auth guard is in place. Clean work.
```

---

## Scenario 4: Refactor Request with Hidden Scope Creep (Think Before Coding)

**Request from Shinnosuke to Bo:**
> "Refactor the UserService to be cleaner."

### Bad Example

"Cleaner" is undefined. Bo proceeds anyway:

```
😪 [Bo] Starting refactor...

[Bo rewrites UserService from scratch, changes method signatures,
 splits it into 3 classes, renames all methods, and removes
 deprecated methods that "looked unused"]
```

Downstream breakage: 12 callers now fail because method signatures changed. Tests fail.

**Action Kamen review:**
```
🦸 [Action Kamen] REJECTED

| Check                      | Status |
|----------------------------|--------|
| Think Before Coding        | ❌ FAIL |
| Surgical Changes           | ❌ FAIL |
| Correctness                | ❌ FAIL |

Critical issues:
1. [CRITICAL] "Cleaner" was never defined. Bo should have asked what "cleaner" means
   before touching a single line.
2. [CRITICAL] Method signatures changed — 12 callers are now broken.
3. [HIGH] "Deprecated" methods removed without verifying no callers exist.
   Run: grep -r "methodName" src/ before deleting anything.
```

### Good Example

Bo surfaces the ambiguity before starting:

```
😪 [Bo] Pausing before implementation.

"Refactor to be cleaner" is ambiguous. Before I start:

Q1: What specific aspect should be cleaner?
    a) Method naming conventions
    b) Reduce method count (consolidate)
    c) Extract sub-services
    d) Remove dead code

Q2: Is backward compatibility required? (changing method signatures would break callers)

Q3: Are there specific pain points you've noticed?

Please clarify, and I'll implement precisely that.
```

Shinnosuke responds: "Just fix the method naming — they're inconsistent (some camelCase, some snake_case)."

Bo then implements with surgical precision — renames only, updates all callers, confirms no logic changes.

```
😪 [Bo] Complete.

Success criteria: all methods follow camelCase, all callers updated, no logic changed.
Step 1: Audit method names → verify: found 4 snake_case methods ✅
Step 2: Rename 4 methods + update 7 callers → verify: grep finds 0 remaining snake_case ✅
Step 3: Run tests → verify: 47/47 pass ✅

Files changed: src/services/UserService.ts, 7 caller files (rename only, no logic change)
```

---

## Agent Workflow Reference

These scenarios reflect how Shinnosuke orchestrates the team:

```
Shinnosuke (orchestrator)
  → Bo (implements)
    → surfaces assumptions (Think Before Coding)
    → writes minimum code (Simplicity First)
    → touches only requested lines (Surgical Changes)
    → defines + verifies success (Goal-Driven Execution)
  → Action Kamen (reviews, MANDATORY before completion)
    → checks Karpathy principles (coding-principles.md)
    → APPROVED or REJECTED with actionable feedback
  → Shinnosuke (declares completion)
```

**Key rule**: Action Kamen review is never optional. Even for Lite Mode (1-2 file changes), Action Kamen must approve before Shinnosuke marks the task complete.
