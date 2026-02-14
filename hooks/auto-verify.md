---
name: auto-verify
description: Auto-trigger verify-implementation when entering Completion stage
event: PostToolUse
---

# Auto-Verify Hook

**This hook runs AFTER tool use to auto-trigger verification in Completion stage.**

## Purpose

Automatically invoke verify-implementation when:
1. Workflow transitions to Completion stage
2. All execution phases are complete

---

## Trigger Conditions

```
1. Check if WORKFLOW_STATE.yaml was modified:
   - Tool: Write
   - File: **/WORKFLOW_STATE.yaml

2. Read the updated state and check:
   - current.stage == "completion"
   - Previous event was "execution_completed"

3. If conditions met:
   - Announce: "🔧 Auto-triggering verification..."
   - Invoke verify-implementation skill
```

---

## Hook Logic

```
ON PostToolUse(Write, **/WORKFLOW_STATE.yaml):

1. Read modified WORKFLOW_STATE.yaml

2. Extract:
   - current.stage
   - history[-1].event

3. IF current.stage == "completion"
   AND history[-1].event == "execution_completed"
   AND NOT already_verified_this_session:

   THEN:
     a. Set already_verified_this_session = true
     b. Output:
        "
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        🔧 [Auto-Verify] Execution complete!
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Triggering automatic verification...
        Running all verify-* skills.
        "
     c. Execute /team-shinchan:verify-implementation
     d. On completion:
        - If all passed: Add verify_passed event to history
        - If failed: Block completion, list issues
```

---

## Integration with Completion Stage

The Completion stage transition gate now includes:

```yaml
transition_gates:
  completion_to_done:
    - retrospective_written: true
    - implementation_doc_written: true
    - action_kamen_review_passed: true
    - verify_implementation_passed: true  # NEW
```

---

## Workflow State Update

When verify-implementation completes:

**On Success:**
```yaml
history:
  - timestamp: "{timestamp}"
    event: verify_implementation_passed
    agent: action_kamen
    result: "all_passed"
    skills_run: 5
    issues_found: 0
```

**On Failure:**
```yaml
history:
  - timestamp: "{timestamp}"
    event: verify_implementation_failed
    agent: action_kamen
    result: "issues_found"
    skills_run: 5
    issues_found: 3
    blocking: true
```

---

## Skip Conditions

Do NOT trigger verification if:

1. `current.stage` is not "completion"
2. Verification already ran this session
3. Workflow is in "paused" or "blocked" status
4. User explicitly skipped with `--skip-verify` flag

---

## Manual Override

User can skip auto-verification:

```
/team-shinchan:complete --skip-verify
```

This sets:
```yaml
history:
  - timestamp: "{timestamp}"
    event: verify_skipped
    agent: shinnosuke
    reason: "user_override"
```

---

## Example Flow

```
1. User completes last execution phase
2. Shinnosuke updates WORKFLOW_STATE.yaml:
   - current.stage: "completion"
   - history: [..., {event: "execution_completed"}]

3. This hook triggers:
   - Detects stage transition
   - Invokes verify-implementation

4. verify-implementation runs:
   - Discovers verify-* skills
   - Executes each sequentially
   - Reports results

5. Hook updates state:
   - Adds verify_implementation_passed/failed event
   - Blocks or allows completion

6. Workflow continues:
   - If passed: Proceed to RETROSPECTIVE.md
   - If failed: Show issues, stay in execution
```

---

## Error Handling

**If verify-implementation fails to run:**
```
1. Log error to history
2. Warn user but don't block
3. Allow manual verification via /team-shinchan:verify-implementation
```

**If no verify-* skills exist:**
```
1. Consider verification "passed" (nothing to verify)
2. Log: "No verification skills found. Consider running /team-shinchan:manage-skills"
```
