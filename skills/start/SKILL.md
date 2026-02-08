---
name: team-shinchan:start
description: Start a new task with the integrated workflow. Creates documentation folder and begins requirements gathering.
user-invocable: true
---

# ⚠️ MANDATORY EXECUTION - DO NOT SKIP

**When this skill is invoked, execute immediately. Do not explain.**

## Step 0: Pause Active Workflows

```
Before creating a new workflow, check for active ones:
1. Scan shinchan-docs/*/WORKFLOW_STATE.yaml
2. For each with status: active:
   - Set status to "paused"
   - Add paused event to history:
     - timestamp: "{timestamp}"
       event: paused
       agent: shinnosuke
       reason: new_workflow_started
   - Notify: "⏸️ Paused {doc_id} (was at Stage {stage}, Phase {phase})"
3. If none found, proceed silently.
```

## Step 1: Setup (Folder + State)

```
1. Determine DOC_ID:
   - If args contains ISSUE-xxx → DOC_ID = args
   - Else → git branch + ls shinchan-docs/ → {branch}-{next_index}
   - If args > 2000 chars → truncate + warn

2. Create folder: mkdir -p shinchan-docs/{DOC_ID}

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

history:
  - timestamp: "{timestamp}"
    event: workflow_started
    agent: shinnosuke
```

> Stage rules and transition gates are defined in CLAUDE.md PART 6. Do not duplicate here.

## Step 2: Friendly Greeting + Invoke Nene

**Output a warm, friendly greeting (adapt to user's language):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👦 [Shinnosuke] Hey! Let's build something great~ 💪
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Project: {DOC_ID}
🎯 Stage: Requirements (with 📋 Nene)

Tell me what you want to create!
Our team is ready to help~ 🚀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Multi-language examples:**

- 🇺🇸 "Hey! Let's build something great~"
- 🇰🇷 "안녕! 뭔가 멋진 걸 만들어보자~"
- 🇯🇵 "やぁ！素敵なものを作ろう〜"

Then immediately invoke Nene:

```typescript
Task(
  subagent_type="team-shinchan:nene",
  model="opus",
  prompt="Starting Stage 1 requirements gathering.
DOC_ID: {DOC_ID}
User request: {args or 'None - Start interview'}
Write REQUESTS.md to shinchan-docs/{DOC_ID}/REQUESTS.md.
All 'do this' requests = requirements, NOT implementation.
Start by asking: 'What problem would you like to solve?'"
)
```

---

# ⛔ Prohibited

- ❌ Only explaining steps without executing
- ❌ Skipping folder/YAML creation
- ❌ Gathering requirements directly without invoking Nene
