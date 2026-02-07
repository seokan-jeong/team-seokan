# Debate Process Diagram

This shows the step-by-step debate process facilitated by Midori.

```
┌─────────────────────────────────────────┐
│ 1. Shinnosuke: Call Midori              │
│    Task(team-shinchan:midori)           │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│ 2. Midori: Define topic, select panel   │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│ 3. Collect panel opinions (parallel     │
│    Task calls)                          │
│    → Real-time output of each opinion   │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│ 4. Discussion rounds (if needed, max 2) │
│    → Only proceed if disagreement exists│
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│ 5. Hiroshi: Reach consensus             │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│ 6. Midori: Return results to Shinnosuke │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│ 7. Shinnosuke: Deliver results to user  │
│    → Summarize expert opinions          │
│    → Present recommended decision and   │
│      rationale                          │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│ 8. Shinnosuke: Confirm user opinion     │
│    "Do you agree with the recommended   │
│    decision?"                           │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│ 9. Final decision with user             │
│    → Agree: Document decision           │
│    → Disagree: Revise after reflecting  │
│      concerns                           │
└─────────────────────────────────────────┘
```
