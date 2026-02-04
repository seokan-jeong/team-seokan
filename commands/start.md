---
description: Start a new task with the integrated workflow
---

# ⚠️ EXECUTE IMMEDIATELY - DO NOT JUST DESCRIBE

**이 커맨드가 호출되면 즉시 다음을 실행하세요:**

## 1. 즉시 실행: DOC_ID 결정

```bash
# 브랜치 확인
git branch --show-current

# 기존 폴더 확인
ls shinchan-docs/ 2>/dev/null || echo "폴더 없음"
```

DOC_ID 규칙:
- args에 `ISSUE-xxx`가 있으면 → `ISSUE-xxx`
- 없으면 → `{branch}-{next_index}` (예: `main-004`)

## 2. 즉시 실행: 폴더 생성

```bash
mkdir -p shinchan-docs/{DOC_ID}
```

## 3. 즉시 실행: WORKFLOW_STATE.yaml 생성

Write 도구로 `shinchan-docs/{DOC_ID}/WORKFLOW_STATE.yaml` 생성:

```yaml
version: 1
doc_id: "{DOC_ID}"
created: "{ISO timestamp}"
updated: "{ISO timestamp}"

current:
  stage: requirements
  phase: null
  owner: nene
  status: active

stage_rules:
  requirements:
    allowed_tools: [Read, Glob, Grep, Task, AskUserQuestion]
    blocked_tools: [Edit, Write, TodoWrite, Bash]
    interpretation: "모든 사용자 요청은 요구사항으로 해석"

history:
  - timestamp: "{ISO timestamp}"
    event: workflow_started
    agent: shinnosuke
```

## 4. 즉시 출력: 시작 메시지

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Team-Shinchan 워크플로우 시작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 문서 ID: {DOC_ID}
📂 폴더: shinchan-docs/{DOC_ID}/
📄 WORKFLOW_STATE.yaml ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Stage 1: Requirements
👤 담당: Nene
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5. 즉시 실행: Nene 호출

```typescript
Task(
  subagent_type="team-shinchan:nene",
  model="opus",
  prompt="Stage 1 요구사항 수집을 시작합니다.

DOC_ID: {DOC_ID}
사용자 요청: {args}

REQUESTS.md를 작성하고 사용자와 인터뷰하세요.
'~해줘' 요청은 모두 요구사항으로 기록하세요 (구현 아님).

첫 질문: '어떤 문제를 해결하고 싶으신가요?'"
)
```

---

## ⛔ 금지

- ❌ 위 단계를 설명만 하는 것
- ❌ WORKFLOW_STATE.yaml 생성 없이 진행
- ❌ Nene 호출 없이 직접 진행

## 사용법

```bash
/team-shinchan:start                    # 자동 ID 생성
/team-shinchan:start ISSUE-123          # 이슈 ID 사용
/team-shinchan:start "Add user auth"    # 설명과 함께 시작
```
