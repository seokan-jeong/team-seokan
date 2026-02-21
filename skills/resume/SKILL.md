---
name: team-shinchan:resume
description: Resume an interrupted workflow from where it left off
user-invocable: true
---

# team-shinchan:resume

## Purpose

Resume a paused or interrupted workflow by loading its saved state and delegating to the appropriate agent. Ensures continuity without losing context.

## When to Use

- User returns after interruption
- Session timeout or disconnect
- Explicitly paused workflow (status: paused)
- Active workflow needs handoff

## Process

### Step 0: Input Validation

**If DOC_ID not provided:**
1. Scan `.shinchan-docs/*/WORKFLOW_STATE.yaml`
2. Filter by `status: active` OR `status: paused`
3. Display list to user:
   ```
   Found interrupted workflows:
   - main-016 (Stage: execution, Phase: 2, Owner: bo)
   - ISSUE-123 (Stage: planning, Phase: null, Owner: nene)

   Which workflow would you like to resume? (enter DOC_ID or 'cancel')
   ```
4. If none found: **"No interrupted workflows found. Use /team-shinchan:start to begin a new task."**

### Step 1: Load Context

1. Read `.shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml`
   - If not exists: **Error: "Workflow {DOC_ID} not found. Available workflows: {list active/paused DOC_IDs}"**

2. Check status:
   - If `status: completed`: **"Workflow {DOC_ID} is already completed. Use /team-shinchan:start for a new task."**
   - If `status: blocked`: **"Workflow {DOC_ID} is blocked. Reason: {blocker}. Resolve blocker first."**

3. Extract:
   ```yaml
   current_stage = current.stage       # requirements | planning | execution | completion
   current_phase = current.phase       # null | 1 | 2 | 3 | ...
   current_owner = current.owner       # agent_name
   ```

### Step 2: Load Workflow Documents

1. **Required**: Read `.shinchan-docs/{DOC_ID}/REQUESTS.md`
   - If not exists: **Warning + suggest restarting at requirements stage**

2. **Conditional**: Read `.shinchan-docs/{DOC_ID}/PROGRESS.md`
   - Only if `current_stage` is `planning`, `execution`, or `completion`
   - Extract current phase details, AC status, pending tasks

### Step 3: Update State

Update `WORKFLOW_STATE.yaml`:

```yaml
history:
  - timestamp: "{ISO 8601 timestamp}"
    event: resumed
    agent: shinnosuke
    from_stage: {current_stage}
    from_phase: {current_phase}
    notes: "Workflow resumed after interruption"

current:
  status: active  # Change from 'paused' to 'active' if needed
```

### Step 4: Output Status

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶️ Workflow Resumed: {DOC_ID}
Stage: {current_stage} ({stage_number}/4) | Phase: {current_phase|N/A} | Owner: {current_owner}
Dashboard: http://localhost:3333
Resuming from: {last completed action}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 5: Delegate to Appropriate Agent

**Route based on current_stage:**

| Stage | Agent | Model | Prompt Includes |
|-------|-------|-------|-----------------|
| **requirements** | Nene | Opus | REQUESTS.md + "Continue requirements gathering from where left off" |
| **planning** | Nene | Opus | REQUESTS.md + PROGRESS.md + "Continue planning from current phase" |
| **execution** | Bo/Specialist | Sonnet | REQUESTS.md + PROGRESS.md + current phase tasks |
| **completion** | Masumi + Action Kamen | Sonnet + Opus | All docs + "Generate retrospective and implementation docs" |

**Execution stage routing:**
- If phase indicates frontend work → Aichan
- If phase indicates backend work → Bunta
- If phase indicates infrastructure → Masao
- Default → Bo

**Agent invocation:**
```typescript
Task(subagent_type="team-shinchan:{agent}", model="{model}",
  prompt="Resume {DOC_ID}. Stage: {stage}, Phase: {phase}.\n{REQUESTS.md summary}\n{PROGRESS.md state}\nContinue from: {last_action}")
```

## Error Handling

| Error | Recovery |
|-------|----------|
| Missing DOC_ID folder | List available active/paused workflows |
| Corrupted WORKFLOW_STATE.yaml | Default to execution stage, owner: bo, phase: 1 |
| Missing REQUESTS.md | Suggest `/team-shinchan:start` or manual creation |

## Rules

- Always execute (never just describe), always read WORKFLOW_STATE.yaml first
- Never skip state update, never invoke agent without loaded context, never continue if status is 'completed'
- Success: state read + history updated + status active + docs loaded + agent invoked + user informed

## Example

```
User: /team-shinchan:resume

Shinnosuke:
Found interrupted workflows:
- main-016 (execution, Phase: 2, Owner: bo)
- ISSUE-123 (planning, Owner: nene)
Which workflow would you like to resume?

User: main-016

▶️ Workflow Resumed: main-016
Stage: execution (3/4) | Phase: 2 | Owner: bo
Calling Bo to continue Phase 2...
```
