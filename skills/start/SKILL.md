---
name: team-shinchan:start
description: Start a new task with the integrated workflow. Creates documentation folder and begins requirements gathering.
user-invocable: true
---

# MANDATORY EXECUTION - DO NOT SKIP

**When this skill is invoked, execute immediately. Do not explain.**

## Step 0: Pause Active Workflows

```
Before creating a new workflow, check for active ones:
1. Scan .shinchan-docs/*/WORKFLOW_STATE.yaml
2. For each with status: active:
   - Set status to "paused"
   - Add paused event to history
   - Notify: "Paused {doc_id} (was at Stage {stage}, Phase {phase})"
3. If none found, proceed silently.
```

## Step 1: Setup (Folder + State)

```
1. Determine DOC_ID:
   - If args contains ISSUE-xxx -> DOC_ID = args
   - Else -> git branch + ls .shinchan-docs/ -> {branch}-{next_index}
   - If args > 2000 chars -> truncate + warn

2. Create folder: mkdir -p .shinchan-docs/{DOC_ID}

3. Create WORKFLOW_STATE.yaml (Write tool):
```

```yaml
version: 1
doc_id: "{DOC_ID}"
created: "{timestamp}"
updated: "{timestamp}"

current:
  stage: requirements
  phase: null
  owner: nene
  status: active
  interview:
    step: 0
    collected_count: 0
    last_question: null

history:
  - timestamp: "{timestamp}"
    event: workflow_started
    agent: shinnosuke
```

> Stage rules and transition gates are defined in CLAUDE.md and hooks/workflow-guard.md. Do not duplicate here.

## Step 2: Friendly Greeting + Stage-Based Agent Invocation

**Output a warm, friendly greeting (adapt to user's language):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👦 [Shinnosuke] Hey! Let's build something great~ 💪
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Project: {DOC_ID}
🎯 Stage: Requirements
🖥️ Dashboard: http://localhost:3333 (auto-opened in browser)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2A: Stage 1 (Requirements) - Invoke Nene DIRECTLY

**CRITICAL: Do NOT invoke Shinnosuke for Stage 1. Invoke Nene directly to reduce subagent chain depth (1-level instead of 2-level).**

```typescript
Task(
  subagent_type="team-shinchan:nene",
  model="opus",
  prompt="Starting Stage 1: Requirements Gathering via /team-shinchan:start.

## Context
- DOC_ID: {DOC_ID}
- User Request: {args}
- WORKFLOW_STATE.yaml Location: .shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml

## Your Mission
Conduct a thorough requirements interview with the user:
1. Analyze the user request
2. Ask clarifying questions using AskUserQuestion
3. Create REQUESTS.md with Problem Statement, Requirements (FR/NFR), Scope, AC
4. Get user approval before completing

## Stage 1 Completion
When user approves REQUESTS.md:
1. Update WORKFLOW_STATE.yaml: set current.stage to 'planning'
2. Return the summary of collected requirements

User request: {args}"
)
```

### Step 2B: After Nene Completes - Invoke Shinnosuke for Stage 2-4

**After Nene returns (Stage 1 complete), invoke Shinnosuke to continue from Stage 2:**

```typescript
Task(
  subagent_type="team-shinchan:shinnosuke",
  model="opus",
  prompt="Continuing workflow from Stage 2 via /team-shinchan:start.

## Context
- DOC_ID: {DOC_ID}
- WORKFLOW_STATE.yaml: .shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml
- REQUESTS.md: .shinchan-docs/{DOC_ID}/REQUESTS.md (already created and approved)

## Your Mission
Stage 1 (Requirements) is ALREADY COMPLETE. REQUESTS.md exists and is approved.
Start from Stage 2 (Planning) and guide through the remaining workflow:

### Stage 2: Planning
Delegate to Nene for PROGRESS.md creation.

### Stage 3-4: Follow standard workflow
See agents/shinnosuke.md for full stage details.

Nene's requirements summary: {nene_result_summary}"
)
```

---

# Prohibited

- Only explaining steps without executing
- Skipping folder/YAML creation
- Invoking Shinnosuke for Stage 1 (must use Nene directly)
- Gathering requirements directly without invoking Nene
