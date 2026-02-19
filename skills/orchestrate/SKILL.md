---
name: team-shinchan:orchestrate
description: Explicitly invoke Shinnosuke to orchestrate through the integrated workflow. Creates documentation folder and guides through requirements → planning → execution → completion stages.
user-invocable: true
---

# Redirecting to /team-shinchan:start

**Output immediately before executing:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👦 [Shinnosuke] Orchestrating your task~ 🎯
🖥️ Dashboard: http://localhost:3333
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**This skill has been merged into `/team-shinchan:start`.** Both skills now invoke Shinnosuke as orchestrator.

Execute `/team-shinchan:start` with the same arguments:

```typescript
// Simply redirect to start skill behavior
Task(
  subagent_type="team-shinchan:shinnosuke",
  model="opus",
  prompt="Starting Orchestration via /team-shinchan:orchestrate (redirected to /start behavior).

## Context
- User Request: {args}

## Your Mission
Follow the same workflow as /team-shinchan:start:
1. Create .shinchan-docs/{DOC_ID}/ folder
2. Create WORKFLOW_STATE.yaml
3. Guide through 4-stage workflow

User request: {args}"
)
```
