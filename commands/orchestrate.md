---
description: Explicitly invoke Shinnosuke to orchestrate through the integrated workflow
---

# Orchestrate Command

Explicitly starts the full integrated workflow with Shinnosuke orchestrating.

## Usage

```bash
/team-shinchan:orchestrate [task description]
```

## Integrated Workflow

```
┌─────────────────────────────────────────┐
│  Stage 1: Requirements                  │
│  ├─ Analyze request                     │
│  ├─ Nene/Misae: Clarify if unclear     │
│  ├─ Midori: Debate if design needed    │
│  └─ Create REQUESTS.md                  │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│  Stage 2: Planning                      │
│  ├─ Nene: Break into phases            │
│  ├─ Shiro: Impact analysis             │
│  └─ Create PROGRESS.md                  │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│  Stage 3: Execution (per phase)         │
│  ├─ Impact analysis                     │
│  ├─ Debate (if design decision)        │
│  ├─ Delegate to specialists            │
│  ├─ Action Kamen review                │
│  └─ Phase retrospective                │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│  Stage 4: Completion (auto)             │
│  ├─ RETROSPECTIVE.md                   │
│  ├─ IMPLEMENTATION.md                  │
│  └─ Final verification                 │
└─────────────────────────────────────────┘
```

## Debate Integration

Design decisions automatically trigger debate:
- 2+ implementation approaches
- Architecture changes
- Breaking existing patterns
- Security-sensitive decisions

## Example

```bash
/team-shinchan:orchestrate Build user authentication with OAuth and session management
```

Shinnosuke will:
1. Create `shinchan-docs/main-001/` (or appropriate ID)
2. Interview for requirements (Nene)
3. Debate OAuth vs Session approach (Midori)
4. Break into phases (Nene)
5. Execute with specialist delegation
6. Generate all documentation
