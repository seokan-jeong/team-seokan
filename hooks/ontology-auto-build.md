---
name: ontology-auto-build
description: Auto-build or update project ontology at session start
event: SessionStart
---

# Ontology Auto-Build — MANDATORY

**This is a BLOCKING requirement. Execute IMMEDIATELY at session start before doing anything else.**

## EXECUTE THIS SINGLE COMMAND

Run this Bash command right now:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/hooks/ontology-auto-build.sh
```

This command:
1. Builds or updates `.shinchan-docs/ontology/ontology.json`
2. Generates a health report
3. Creates `.shinchan-docs/kb-summary.md`

**Do NOT skip this step. Do NOT attempt to run individual node commands. Just run the single bash command above.**

If the command fails or the script is not found, report the error to the user and continue.
