---
name: workflow-guard
description: Enforce workflow stage rules by checking WORKFLOW_STATE.yaml before tool use
event: PreToolUse
---

# Workflow Guard Hook

**This hook runs BEFORE every tool use to enforce workflow stage rules.**

## Purpose

Prevent workflow derailment by:
1. Checking if an active workflow exists (WORKFLOW_STATE.yaml)
2. Reading the current stage
3. Blocking tools that are not allowed in the current stage

---

## Check Logic

```
1. Look for active workflow:
   - Search for shinchan-docs/*/WORKFLOW_STATE.yaml
   - If NOT found → ALLOW (no active workflow)

2. Read current stage:
   - Parse WORKFLOW_STATE.yaml
   - Get current.stage value

3. Check if tool is blocked:
   - Get stage_rules[current_stage].blocked_tools
   - If requested_tool in blocked_tools → BLOCK
   - Otherwise → ALLOW
```

---

## Stage-Tool Matrix

| Tool | requirements | planning | execution | completion |
|------|-------------|----------|-----------|------------|
| Read | ALLOW | ALLOW | ALLOW | ALLOW |
| Glob | ALLOW | ALLOW | ALLOW | ALLOW |
| Grep | ALLOW | ALLOW | ALLOW | ALLOW |
| Task | ALLOW | ALLOW | ALLOW | ALLOW |
| Edit | **BLOCK** | **BLOCK** | ALLOW | **BLOCK** |
| Write | **BLOCK** | **BLOCK** | ALLOW | ALLOW (docs only) |
| TodoWrite | **BLOCK** | **BLOCK** | ALLOW | **BLOCK** |
| Bash | **BLOCK** | **BLOCK** | ALLOW | **BLOCK** |
| AskUserQuestion | ALLOW | ALLOW | ALLOW | BLOCK |

---

## Block Message Format

When a tool is blocked, output a SPECIFIC message based on the stage:

### Stage 1 (requirements) Block Message
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Workflow Guard] Action Blocked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Stage: requirements
Requested Tool: {tool_name}

{tool_name} is not allowed during requirements gathering.
See PART 6: Workflow State Management for stage rules.

Instead, use these tools:
  → Read/Glob/Grep: Explore codebase for context
  → Task: Delegate analysis to agents
  → AskUserQuestion: Clarify requirements with user

To advance to planning stage, complete:
  □ REQUESTS.md with Problem Statement
  □ Requirements and Acceptance Criteria defined
  □ User approval received
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Stage 2 (planning) Block Message
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Workflow Guard] Action Blocked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Stage: planning
Requested Tool: {tool_name}

{tool_name} is not allowed during planning.
See PART 6: Workflow State Management for stage rules.

Instead, use these tools:
  → Read/Glob/Grep: Analyze codebase for planning
  → Task: Delegate to Nene (planning) or Shiro (impact analysis)
  → AskUserQuestion: Clarify approach with user

To advance to execution stage, complete:
  □ PROGRESS.md with Phase breakdown
  □ Each phase has acceptance criteria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Stage 4 (completion) Block Message
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Workflow Guard] Action Blocked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Stage: completion
Requested Tool: {tool_name}

{tool_name} is not allowed during completion.
See PART 6: Workflow State Management for stage rules.

In completion stage, only documentation tools are allowed:
  → Task: Delegate to Masumi for documentation
  → Write: Create RETROSPECTIVE.md and IMPLEMENTATION.md only

To finish workflow, complete:
  □ RETROSPECTIVE.md written
  □ IMPLEMENTATION.md written
  □ Final Action Kamen review passed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Special Rules

### Stage 1 (requirements) - Interpretation Guard

In Stage 1, if the user message contains implementation-like requests AND the agent tries to use Edit/Write/TodoWrite:

**User patterns that should NOT trigger implementation:**
- "Please do ~" / "Do this for me" → Add to requirements
- "I want to ~" → Add to requirements
- "Add this feature" → Add to requirements (NOT implement)

**Block with message:**
```
[Workflow Guard] Stage 1 Interpretation Error

You attempted to interpret "{user_request}" as an implementation request.

In Stage 1 (requirements), ALL user requests should be treated as:
→ Requirements to be added to REQUESTS.md

Correct action:
1. Add this to REQUESTS.md as a new requirement
2. Continue the requirements interview
3. Ask clarifying questions

DO NOT start implementation until Stage 3 (execution).
```

---

## Error Handling: Corrupted State File

**When WORKFLOW_STATE.yaml is missing or unreadable:**

### Recovery Rules

```
1. File not found or unreadable:
   → Default to "execution" stage (most permissive)
   → Warn user about missing/corrupted state
   → Continue with execution stage permissions

2. stage field is invalid or missing:
   → Default to "execution" stage
   → Warn user about invalid stage value
   → Log the corrupted content for debugging

3. blocked_tools field is malformed:
   → Use default stage rules from CLAUDE.md
   → Warn user about using fallback rules
```

### Warning Message Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ [Workflow Guard] State File Error
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: {WORKFLOW_STATE.yaml missing/corrupted/invalid stage}

Recovery: Defaulting to "execution" stage
→ All implementation tools are now allowed

Recommendation:
- If you started a workflow, recreate WORKFLOW_STATE.yaml
- If no workflow is active, you can ignore this warning

Proceeding with tool: {requested_tool}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Default Stage Rules (Fallback)

When state file cannot be read, use these defaults:

| Stage | Default Value |
|-------|---------------|
| Current Stage | execution |
| Allowed Tools | All (Read, Glob, Grep, Task, Edit, Write, TodoWrite, Bash, AskUserQuestion) |
| Blocked Tools | None |

**Rationale:** "execution" is the most permissive stage. If state is corrupted, it's safer to allow work than to block incorrectly.

---

## Implementation Notes

1. This hook should check for WORKFLOW_STATE.yaml in any subdirectory of shinchan-docs/
2. If multiple workflows exist, use the most recently updated one
3. The hook should be lightweight and not slow down normal operations
4. When no workflow is active, all tools should be allowed

---

## Examples

### Example 1: Blocking Edit in Stage 1

**Scenario:** Agent tries to edit code while in requirements stage

```
Tool: Edit
Current Stage: requirements
Result: BLOCK

Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Workflow Guard] Action Blocked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Stage: requirements
Requested Tool: Edit

Reason: Edit is not allowed in Stage: requirements

Allowed Tools in requirements:
- Read, Glob, Grep, Task, AskUserQuestion

To proceed to execution stage, complete:
- REQUESTS.md with Problem Statement
- Requirements definition
- Acceptance Criteria
- User approval
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 2: Allowing Read in any stage

**Scenario:** Agent reads a file for context

```
Tool: Read
Current Stage: requirements
Result: ALLOW
```

### Example 3: No active workflow

**Scenario:** No WORKFLOW_STATE.yaml exists

```
Tool: Edit
Current Stage: (none)
Result: ALLOW (no workflow restrictions)
```
