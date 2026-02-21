---
name: workflow-guard
description: Enforce workflow stage rules by checking WORKFLOW_STATE.yaml before tool use
event: PreToolUse
---

# Workflow Guard Hook

**This hook runs BEFORE every tool use to enforce workflow stage rules.**

## Check Logic

```
1. Search for .shinchan-docs/*/WORKFLOW_STATE.yaml
   - If NOT found → ALLOW (no active workflow)
2. Parse current.stage from WORKFLOW_STATE.yaml
3. If requested_tool in blocked_tools[current_stage] → BLOCK
   Otherwise → ALLOW
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

```
[Workflow Guard] Action Blocked
Stage: {stage} | Tool: {tool_name}
{tool_name} is not allowed in {stage} stage.

Allowed: {allowed_tools_for_stage}
To advance: {advancement_conditions}
```

| Stage | Allowed Tools | Advancement Conditions |
|-------|--------------|----------------------|
| requirements | Read, Glob, Grep, Task, AskUserQuestion | REQUESTS.md + Problem Statement + AC + User approval |
| planning | Read, Glob, Grep, Task, AskUserQuestion | PROGRESS.md + Phase breakdown + per-phase AC |
| completion | Task, Write (docs only) | RETROSPECTIVE.md + IMPLEMENTATION.md + Final review |

---

## Special Rules

### Stage 1 - Interpretation Guard

In Stage 1, user requests like "Please do ~", "Add this feature" must be added to REQUESTS.md — never implemented. If Edit/Write/TodoWrite is attempted:

```
[Workflow Guard] Stage 1 Interpretation Error
In Stage 1 (requirements), ALL user requests → add to REQUESTS.md.
Do NOT implement until Stage 3 (execution).
```

### Completion Stage - Write Path Filtering

Write is allowed ONLY for `.shinchan-docs/**` or `*.md` files. All other paths:

```
[Workflow Guard] Write Restricted in Completion Stage
Target: {file_path} — only .shinchan-docs/** and *.md allowed.
For code changes, return to execution stage.
```

---

## Error Handling: Corrupted State

| Situation | Action |
|-----------|--------|
| File not found / unreadable | Default to "requirements" stage, warn user |
| stage field invalid / missing | Default to "requirements" stage, warn user |
| blocked_tools malformed | Use Stage-Tool Matrix above as fallback |

Warning format:
```
⚠️ [Workflow Guard] State File Error
Issue: {description} | Defaulting to: requirements
Allowed: Read, Glob, Grep, Task, AskUserQuestion | Blocking: {tool}
Action: Run /team-shinchan:resume or /team-shinchan:start
```

---

## Implementation Notes

- Check all `.shinchan-docs/*/WORKFLOW_STATE.yaml`; use most recently updated if multiple exist
- When no workflow is active, allow all tools
