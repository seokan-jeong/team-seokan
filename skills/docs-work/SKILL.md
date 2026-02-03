---
name: team-shinchan:docs-work
description: Integrated workflow with documentation. Auto-generates document ID from issue or branch. Phase-based work with Debate integration.
user-invocable: true
---

# Docs-Work Skill (Integrated Workflow)

**This skill is now integrated into the main Team-Shinchan workflow.**

The documentation process (REQUESTS → PROGRESS → RETROSPECTIVE → IMPLEMENTATION) is automatically triggered for all non-trivial tasks.

---

## Document ID Generation

### Automatic ID Assignment

| Case | Format | Example |
|------|--------|---------|
| Issue ID in request | `ISSUE-{id}` | `ISSUE-123` |
| Issue ID in branch | `ISSUE-{id}` | `ISSUE-456` |
| No issue ID | `{branch}-{index}` | `feature-auth-001` |
| Main branch | `main-{index}` | `main-001` |

### ID Generation Logic

```bash
# 1. Check if issue ID mentioned in request
if request contains "ISSUE-xxx" or "PRO-xxx" or "#xxx":
    DOC_ID = extracted_issue_id

# 2. Check branch name for issue ID
elif branch matches pattern like "feature/ISSUE-123" or "fix/123":
    DOC_ID = "ISSUE-{extracted_number}"

# 3. Generate from branch + index
else:
    BRANCH = current_branch_name (sanitized)
    INDEX = count_existing_folders(branch) + 1
    DOC_ID = "{BRANCH}-{INDEX:03d}"
```

---

## Folder Structure

```
shinchan-docs/
├── ISSUE-123/
├── ISSUE-456/
├── feature-auth-001/
├── feature-auth-002/
├── main-001/
└── main-002/
    ├── REQUESTS.md        # Requirements (co-created)
    ├── PROGRESS.md        # Progress tracking
    ├── RETROSPECTIVE.md   # Final retrospective
    └── IMPLEMENTATION.md  # Implementation doc
```

---

## Integrated Workflow Stages

### Stage 1: Requirements (REQUESTS.md)

**Agents involved:**
- **Nene (Planner)**: Interview user for unclear requirements
- **Misae (Metis)**: Analyze hidden requirements
- **Midori (Moderator)**: Debate if design decision needed

**Output:** REQUESTS.md with:
- Clear problem statement
- Acceptance criteria
- Scope boundaries
- Edge cases
- User approval

### Stage 2: Planning (PROGRESS.md init)

**Agents involved:**
- **Nene (Planner)**: Break down into phases
- **Shiro (Explorer)**: Impact analysis

**Output:** PROGRESS.md with:
- Phase breakdown
- Acceptance criteria per phase
- Impact analysis table

### Stage 3: Execution (Per Phase)

**Agents involved:**
- **Shiro (Explorer)**: Phase-specific impact analysis
- **Midori (Moderator)**: Debate for design decisions
- **Bo/Aichan/Bunta/Masao**: Implementation
- **Action Kamen (Reviewer)**: Code review

**For each Phase:**
1. Impact analysis (Shiro)
2. Design decision? → Debate (Midori)
3. Implementation (Bo/Aichan/Bunta/Masao)
4. Review (Action Kamen) - **MANDATORY**
5. Phase retrospective → Update PROGRESS.md

### Stage 4: Completion (Auto-proceed)

**Agents involved:**
- **Masumi (Librarian)**: Write final documents
- **Action Kamen (Reviewer)**: Final verification

**Auto-generates (no user prompt):**
1. RETROSPECTIVE.md
2. IMPLEMENTATION.md
3. Final verification

---

## Debate Integration

### When Debate Triggers

| Situation | Debate? |
|-----------|---------|
| 2+ implementation approaches | ✅ Yes |
| Architecture change | ✅ Yes |
| Breaking existing patterns | ✅ Yes |
| Performance vs Readability | ✅ Yes |
| Security-sensitive | ✅ Yes |
| Simple CRUD | ❌ No |
| Clear bug fix | ❌ No |

### Debate in Workflow

```
Phase N starts
    ↓
Shiro: Impact analysis
    ↓
Design decision needed?
    ├─ Yes → Midori: Moderate debate
    │        ├─ Experts present opinions
    │        ├─ Discussion (max 3 rounds)
    │        ├─ Hiroshi: Synthesize consensus
    │        └─ Action Kamen: Review decision
    │              ↓
    └─ No ─────────┘
    ↓
Implementation (Bo/Aichan/Bunta/Masao)
    ↓
Action Kamen: Review
    ↓
Phase retrospective
```

---

## Invocation

```bash
# Explicit invocation (creates docs even for simple tasks)
/team-shinchan:docs-work ISSUE-123
/team-shinchan:docs-work

# Natural language (auto-triggers for non-trivial tasks)
"Add user authentication"  # Full workflow auto-starts
"Fix typo in README"       # Quick fix, no docs
```

---

## Templates

Located in `skills/docs-work/templates/`:
- `REQUESTS_TEMPLATE.md`
- `PROGRESS_TEMPLATE.md`
- `RETROSPECTIVE_TEMPLATE.md`
- `IMPLEMENTATION_TEMPLATE.md`

---

## Core Principles

### 1. Definition of Done

> **Code complete ≠ Work complete**

```
Work complete = Code + RETROSPECTIVE.md + IMPLEMENTATION.md + Action Kamen approval
```

### 2. Session Continuity

```
PROHIBITED:
Last Phase done → "Run retrospective?" → Wait → Session ends

REQUIRED:
Last Phase done → Auto-start retrospective → Auto-write docs → Report
```

### 3. Mandatory Verification

Every phase and final completion requires Action Kamen review.

---

## Version History

### v2.0 (2026-02-03)
- Integrated into main Team-Shinchan workflow
- Auto ID generation (branch + index)
- Debate integration at phase level
- Agent assignments for each stage
