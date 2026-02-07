---
name: team-shinchan:start
description: Start a new task with the integrated workflow. Creates documentation folder and begins requirements gathering.
user-invocable: true
---

# ⚠️ MANDATORY EXECUTION - DO NOT SKIP

**When this skill is invoked, you MUST execute the tasks below immediately. Do not explain, just execute.**

## Step 1: Validate Input

```
If args length > 2000 characters:
  Truncate to 2000 characters
  Warn user: "Request was truncated to 2000 characters"
```

## Step 2: Determine Document ID (Immediately)

```
IF args contains ISSUE-xxx format:
  DOC_ID = args (e.g., ISSUE-123)
ELSE:
  Check current branch: git branch --show-current
  Check existing folders: ls shinchan-docs/
  DOC_ID = {branch}-{next_index} (e.g., main-004)
```

## Step 3: Create Folder (Immediately - Use Bash)

```bash
mkdir -p shinchan-docs/{DOC_ID}
```

## Step 4: Create WORKFLOW_STATE.yaml (Immediately - Use Write)

File path: `shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml`

```yaml
version: 1
doc_id: "{DOC_ID}"
created: "{current timestamp}"
updated: "{current timestamp}"

current:
  stage: requirements
  phase: null
  owner: nene
  status: active

stage_rules:
  requirements:
    allowed_tools: [Read, Glob, Grep, Task, AskUserQuestion]
    blocked_tools: [Edit, Write, TodoWrite, Bash]
    interpretation: "All user requests are interpreted as 'requirements'"
  planning:
    allowed_tools: [Read, Glob, Grep, Task, AskUserQuestion]
    blocked_tools: [Edit, Write, TodoWrite, Bash]
  execution:
    allowed_tools: [Read, Glob, Grep, Task, Edit, Write, TodoWrite, Bash, AskUserQuestion]
    blocked_tools: []
  completion:
    allowed_tools: [Read, Glob, Grep, Task, Write]
    blocked_tools: [Edit, TodoWrite, Bash, AskUserQuestion]

transition_gates:
  requirements_to_planning:
    requires:
      - REQUESTS.md exists
      - Problem Statement section
      - Requirements section
      - Acceptance Criteria section
      - User approval
  planning_to_execution:
    requires:
      - PROGRESS.md exists
      - Phase list defined
      - Each Phase has Acceptance Criteria
  execution_to_completion:
    requires:
      - All phases complete
      - All Action Kamen reviews passed
  completion_to_done:
    requires:
      - RETROSPECTIVE.md exists
      - IMPLEMENTATION.md exists
      - Final review passed

metrics:
  workflow:
    total_duration_minutes: null
    stages_completed: 0
  stages:
    requirements:
      start: "{current timestamp}"
      end: null
      duration_minutes: null
    planning:
      start: null
      end: null
      duration_minutes: null
    execution:
      start: null
      end: null
      duration_minutes: null
      phases_planned: 0
      phases_completed: 0
      review_pass_rate: null
    completion:
      start: null
      end: null
      duration_minutes: null
  agents: {}

history:
  - timestamp: "{current timestamp}"
    event: workflow_started
    agent: shinnosuke
```

## Step 5: Output Progress (Immediately)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Team-Shinchan Workflow Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Document ID: {DOC_ID}
📂 Folder: shinchan-docs/{DOC_ID}/
📄 WORKFLOW_STATE.yaml ✅ Created
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Stage 1: Requirements
👤 Owner: Nene (Planner)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 6: Invoke Nene (Immediately - Use Task)

```typescript
Task(
  subagent_type="team-shinchan:nene",
  model="opus",
  prompt=`Starting Stage 1 (Requirements Gathering).

## Context
- DOC_ID: {DOC_ID}
- User Request: {args or "None - Start interview"}
- WORKFLOW_STATE.yaml Location: shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml

## Your Mission
1. Interview user to gather requirements
2. Write REQUESTS.md (shinchan-docs/{DOC_ID}/REQUESTS.md)
3. All "please do ~" requests should be added as requirements (not implementation!)

## Important Rules
- Prohibited from using Edit, Write, Bash tools (except for writing REQUESTS.md)
- Reject code modification/creation requests and record as requirements
- Request user approval when requirements are sufficient

## Start Interview
Ask the user:
"What problem would you like to solve?"`
)
```

---

# ⛔ Prohibited Actions

1. ❌ Only explaining the steps without executing them
2. ❌ Skipping Steps 3-4
3. ❌ Proceeding without WORKFLOW_STATE.yaml
4. ❌ Gathering requirements directly without invoking Nene

# ✅ Checklist

After execution, all of the following must be completed:
- [ ] `shinchan-docs/{DOC_ID}/` folder created
- [ ] `shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml` file exists
- [ ] Nene agent invoked
- [ ] First question delivered to user
