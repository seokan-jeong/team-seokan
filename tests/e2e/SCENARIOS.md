# E2E Workflow Test Scenarios

## Overview

5 scenarios that validate the full Team-Shinchan workflow pipeline.
Each scenario tests agent behavior across workflow stages using promptfoo.

## Scenario 1: Simple Feature Addition (Full Workflow)

**Goal**: Verify /start → requirements → planning → execution → completion flow
**Input**: "Add a dark mode toggle to settings page"
**Expected**:
- Shinnosuke delegates to Nene for requirements
- Stage awareness (requirements stage = gather, not implement)
- Phase breakdown with acceptance criteria
- Delegation to implementation agent (Aichan)
- Action Kamen review requested

## Scenario 2: Bug Fix (Quick Fix Path)

**Goal**: Verify simplified workflow for clear bug fixes
**Input**: "Fix the null pointer error in user.getProfile()"
**Expected**:
- Recognized as quick fix
- Direct delegation to Bo (skip full workflow overhead)
- Action Kamen review still requested

## Scenario 3: Design Decision (Debate Trigger)

**Goal**: Verify debate is triggered when design decisions are needed
**Input**: "Should we use WebSocket or SSE for real-time notifications?"
**Expected**:
- Shinnosuke detects debate condition (2+ approaches)
- Delegates to Midori
- Panel selection includes relevant experts
- Structured debate output

## Scenario 4: Large Multi-Phase Project (Himawari Escalation)

**Goal**: Verify Himawari escalation for large projects
**Input**: "Build a full microservices architecture with 5 services, API gateway, shared auth, message queue, monitoring dashboard, and CI/CD pipeline"
**Expected**:
- Recognized as large-scale (3+ phases, 20+ files, 3+ domains)
- Himawari escalation triggered or mentioned
- Multi-domain awareness (frontend + backend + infra)

## Scenario 5: Review Rejection (Action Kamen Reject → Retry)

**Goal**: Verify error recovery when Action Kamen rejects
**Input**: "The code review found critical issues. How should we handle this?"
**Expected**:
- Recognition of review failure
- Retry or fix-and-resubmit behavior
- Not silently skipping the review
- User notification if retry also fails
