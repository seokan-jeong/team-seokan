---
name: load-learnings
description: Load past learnings at session start to apply to new tasks
event: SessionStart
---

# Load Learnings Hook

At session start, load past learnings from `.team-shinchan/learnings.md`.

## Process

1. **Check**: If `.team-shinchan/learnings.md` exists, read it. If not, do nothing (silent).
2. **Load**: Extract last 20 learnings (most recent first, high-confidence prioritized).
3. **Display** (max 5 key items):

```
📚 [Team-Shinchan] Loaded {N} learnings from memory
• [pattern] {most relevant pattern}
• [preference] {most relevant preference}
• [convention] {most relevant convention}
💡 Applying these learnings to this session.
```

4. **Apply during session**: Check patterns, avoid known mistakes, follow preferences, use conventions.

## Rules

- Silent if no learnings file exists
- Max 5 key learnings in summary
- Actually apply learnings when making decisions (don't just display)
