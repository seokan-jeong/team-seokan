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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Stage: {current_stage} ({stage_number} of 4)
🔄 Phase: {current_phase if not null else "N/A"}
👤 Owner: {current_owner}
🖥️ Dashboard: http://localhost:3333

📝 Context Loaded:
   - REQUESTS.md: {word_count} words
   - PROGRESS.md: {phases_complete}/{total_phases} phases complete

🎯 Resuming from: {last completed action}

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

**Agent invocation example:**
```typescript
Task(
  subagent_type="team-shinchan:{agent}",
  model="{model}",
  prompt=`
Resume workflow {DOC_ID}.

Stage: {current_stage}
Phase: {current_phase}

REQUESTS.md Summary:
{requirements_summary}

PROGRESS.md Current State:
{progress_summary}

Continue from: {last_action}
Next steps: {next_steps}
`
)
```

## Error Handling

### Missing DOC_ID Folder
```
Error: Workflow '{DOC_ID}' not found.

Available workflows:
- main-016 (active, execution stage)
- ISSUE-123 (paused, planning stage)

Use: /team-shinchan:resume {DOC_ID}
```

### Corrupted WORKFLOW_STATE.yaml
```
Warning: WORKFLOW_STATE.yaml is corrupted or unreadable.

Attempting recovery:
- Defaulting to execution stage
- Owner: bo
- Phase: 1

Recommendation: Review and manually update WORKFLOW_STATE.yaml
```

### Missing REQUESTS.md
```
Warning: REQUESTS.md not found in {DOC_ID}.

This workflow may be incomplete. Options:
1. Restart from requirements: /team-shinchan:start
2. Manually create REQUESTS.md with problem statement
3. Continue anyway (not recommended)
```

## Prohibited Actions

- ❌ **Never** describe the resume process without executing it
- ❌ **Never** skip WORKFLOW_STATE.yaml update
- ❌ **Never** invoke agent without loading context documents
- ❌ **Never** assume state - always read WORKFLOW_STATE.yaml first
- ❌ **Never** continue if status is 'completed'

## Success Criteria

- [x] WORKFLOW_STATE.yaml successfully read
- [x] history[] updated with 'resumed' event
- [x] current.status set to 'active'
- [x] Context documents loaded (REQUESTS.md minimum)
- [x] Appropriate agent invoked via Task tool
- [x] User informed of resume status

## Examples

### Example 1: Resume with auto-detection
```
User: /team-shinchan:resume

Shinnosuke:
Found interrupted workflows:
- main-016 (Stage: execution, Phase: 2, Owner: bo)
- ISSUE-123 (Stage: planning, Owner: nene)

Which workflow would you like to resume?

User: main-016

Shinnosuke:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶️ Workflow Resumed: main-016
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Stage: execution (3 of 4)
🔄 Phase: 2
👤 Owner: bo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calling Bo to continue Phase 2 implementation...
```

### Example 2: Resume specific workflow
```
User: /team-shinchan:resume ISSUE-123

Shinnosuke:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶️ Workflow Resumed: ISSUE-123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Stage: planning (2 of 4)
🔄 Phase: N/A
👤 Owner: nene
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calling Nene to continue planning...
```

### Example 3: No workflows to resume
```
User: /team-shinchan:resume

Shinnosuke:
No interrupted workflows found.

Use /team-shinchan:start to begin a new task.
```
