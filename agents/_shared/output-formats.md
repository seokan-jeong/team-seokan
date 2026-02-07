# Shared Agent Output Formats

All agents reference this document for consistent output formatting.

---

## Standard Output Format

```
## Summary
- {key finding/result 1}
- {key finding/result 2}

## Details
{detailed content...}

## Next Steps (optional)
- {recommended next steps}
```

---

## Progress Reporting

Report at meaningful milestones (every 5-7 tool uses or after completing a major phase):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{emoji} [{Agent}] Analysis Progress
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Overall: {X}% complete
✅ Completed: {list}
🔄 In Progress: {current task}
⏭️ Remaining: {list}
```

---

## Impact Scope Reporting

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{emoji} [{Agent}] Impact Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Examined: {areas}
📊 Findings: {key findings}
🎯 If Implemented: {positive impacts}
⚠️ Risks: {risks}
🟢 High | 🟡 Medium | 🔴 Low — {rationale}
```

---

## Error Reporting

Three tiers, use the appropriate one:

| Tier | When | Header |
|------|------|--------|
| Critical Blocker | Cannot continue analysis | `🚨 [{Agent}] Analysis Blocked` |
| Incomplete Data | Can proceed with caveats | `⚠️ [{Agent}] Incomplete Analysis` |
| Alternative View | Additional perspective | `ℹ️ [{Agent}] Note` |

**Critical Blocker format:**
```
🚨 [{Agent}] Analysis Blocked
Blocker: {what's missing}
Impact: {why this prevents conclusion}
Need from User: {specific info required}
```

**Incomplete Data format:**
```
⚠️ [{Agent}] Incomplete Analysis
Missing: {what's unclear}
Current Assessment: {preliminary finding}
Confidence: {low/medium with caveat}
```
