---
name: team-shinchan:start
description: Start a new task with the integrated workflow. Creates documentation folder and begins requirements gathering.
user-invocable: true
---

# ⚠️ MANDATORY EXECUTION - DO NOT SKIP

**이 스킬이 호출되면 아래 작업을 즉시 실행해야 합니다. 설명하지 말고 실행하세요.**

## Step 1: 문서 ID 결정 (즉시)

```
IF args에 ISSUE-xxx 형식이 있으면:
  DOC_ID = args (예: ISSUE-123)
ELSE:
  현재 브랜치 확인: git branch --show-current
  기존 폴더 확인: ls shinchan-docs/
  DOC_ID = {branch}-{next_index} (예: main-004)
```

## Step 2: 폴더 생성 (즉시 - Bash 사용)

```bash
mkdir -p shinchan-docs/{DOC_ID}
```

## Step 3: WORKFLOW_STATE.yaml 생성 (즉시 - Write 사용)

파일 경로: `shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml`

```yaml
version: 1
doc_id: "{DOC_ID}"
created: "{현재 timestamp}"
updated: "{현재 timestamp}"

current:
  stage: requirements
  phase: null
  owner: nene
  status: active

stage_rules:
  requirements:
    allowed_tools: [Read, Glob, Grep, Task, AskUserQuestion]
    blocked_tools: [Edit, Write, TodoWrite, Bash]
    interpretation: "모든 사용자 요청은 '요구사항'으로 해석"

transition_gates:
  requirements_to_planning:
    requires:
      - REQUESTS.md 존재
      - Problem Statement 섹션
      - Requirements 섹션
      - Acceptance Criteria 섹션
      - 사용자 승인

history:
  - timestamp: "{현재 timestamp}"
    event: workflow_started
    agent: shinnosuke
```

## Step 4: 진행 상황 출력 (즉시)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Team-Shinchan 워크플로우 시작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 문서 ID: {DOC_ID}
📂 폴더: shinchan-docs/{DOC_ID}/
📄 WORKFLOW_STATE.yaml ✅ 생성됨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Stage 1: Requirements
👤 담당: Nene (Planner)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 5: Nene 호출 (즉시 - Task 사용)

```typescript
Task(
  subagent_type="team-shinchan:nene",
  model="opus",
  prompt=`Stage 1 (요구사항 수집)을 시작합니다.

## 컨텍스트
- DOC_ID: {DOC_ID}
- 사용자 요청: {args 또는 "없음 - 인터뷰 시작"}
- WORKFLOW_STATE.yaml 위치: shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml

## 당신의 임무
1. 사용자와 인터뷰하여 요구사항 수집
2. REQUESTS.md 작성 (shinchan-docs/{DOC_ID}/REQUESTS.md)
3. 모든 "~해줘" 요청은 요구사항으로 추가 (구현 아님!)

## 중요 규칙
- Edit, Write, Bash 도구 사용 금지 (REQUESTS.md 작성 제외)
- 코드 수정/생성 요청은 거부하고 요구사항으로 기록
- 요구사항이 충분하면 사용자 승인 요청

## 인터뷰 시작
사용자에게 다음을 질문하세요:
"어떤 문제를 해결하고 싶으신가요?"`
)
```

---

# ⛔ 금지 사항

1. ❌ 위 단계를 설명만 하고 실행하지 않는 것
2. ❌ Step 2-3을 건너뛰는 것
3. ❌ WORKFLOW_STATE.yaml 없이 진행하는 것
4. ❌ Nene 호출 없이 직접 요구사항 수집하는 것

# ✅ 체크리스트

실행 후 다음이 모두 완료되어야 합니다:
- [ ] `shinchan-docs/{DOC_ID}/` 폴더 생성됨
- [ ] `shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml` 파일 존재
- [ ] Nene 에이전트가 호출됨
- [ ] 사용자에게 첫 질문이 전달됨
