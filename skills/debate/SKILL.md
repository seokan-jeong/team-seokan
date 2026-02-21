---
name: team-shinchan:debate
description: Specialized agents debate to find optimal solutions. Used for "debate", "pros and cons", "gather opinions" requests.
user-invocable: true
---

# EXECUTE IMMEDIATELY - Debate Initiation

## Step 0: Validate Input

```
If args is empty or only whitespace:
  Ask user: "What topic would you like to debate?"
  STOP and wait for user response

If args length > 2000 characters:
  Truncate to 2000 characters
  Warn user: "Request was truncated to 2000 characters"
```

**All debates (explicit or auto-triggered) invoke Midori via Task tool.**

When `/team-shinchan:debate` is called or debate is auto-triggered, Shinnosuke always delegates to Midori.

---

## 🔔 Auto-Trigger Conditions

| Situation | Trigger |
|-----------|---------|
| 2+ approaches, architecture change, pattern break | ✅ |
| Performance vs readability, security, tech stack | ✅ |
| Simple CRUD, clear bug fix, user already decided | ❌ |

On detection: announce `⚠️ Design decision needed: [situation] → Starting Debate automatically`, then proceed Steps 1-3. Record decision in REQUESTS.md (Stage 1) or PROGRESS.md (Stage 2+).

---

## Step 1: Invoke Midori

```typescript
Task(
  subagent_type="team-shinchan:midori",
  model="sonnet",
  prompt="Please proceed with Debate.

## Topic
{discussion topic}

## Panel
{panel list}

## Procedure
1. Announce Debate start
2. Collect panel opinions (parallel Tasks)
3. Output opinions in real-time
4. Hiroshi derives consensus
5. Report final decision"
)
```

## Step 2: Deliver Results to User

When receiving results from Midori, deliver to user in the following format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💭 Debate Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Topic: {topic}

🎤 Expert Opinions:
- [Hiroshi]: {opinion summary}
- [Nene]: {opinion summary}

✅ Recommended Decision: {Midori's conclusion}
📝 Rationale: {reasoning}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 3: Confirm User Opinion

After delivering results, ask the user:

"Do you agree with the recommended decision? If you have other opinions or additional considerations, please let me know."

## Step 4: Final Decision

- If user agrees: Document decision and proceed
- If user disagrees: Revise decision reflecting concerns
- **Never proceed without user confirmation**

## Panel Selection

See `agents/midori.md` for full criteria. Quick reference:

| Topic | Panel |
|-------|-------|
| Frontend/UI | Aichan, Hiroshi |
| Backend/API | Bunta, Hiroshi |
| DevOps/Infra | Masao, Hiroshi |
| Architecture | Hiroshi, Nene, Misae |
| Security | Hiroshi, Bunta, Masao |

## 📖 Example (Auto-Trigger)

```
[Shinnosuke] Detected: JWT vs Session both viable
⚠️ Design decision needed: Authentication method
→ Starting Debate automatically

💭 Debate Started (auto)
📋 Topic: JWT vs Session auth
👥 Panel: Hiroshi, Bunta
[Regular Debate process follows...]
```

## ⚙️ Auto-Detection Signals

| Signal | Keywords |
|--------|----------|
| 2+ approaches | "A or B", "vs", "method1/method2" |
| Architecture | "schema change", "layer", "structure" |
| Pattern violation | Action Kamen: "differs from existing pattern" |
| Tradeoff | "but", "trade-off", "at the cost of" |
| Security | "auth", "encryption", "permission" |
