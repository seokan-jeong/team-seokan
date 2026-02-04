---
name: team-shinchan:start
description: Start a new task with the integrated workflow. Creates documentation folder and begins requirements gathering.
user-invocable: true
---

# EXECUTE IMMEDIATELY

**Do not read further. Execute this Task NOW:**

```typescript
Task(
  subagent_type="team-shinchan:shinnosuke",
  model="opus",
  prompt=`/team-shinchan:start가 호출되었습니다.

## 즉시 수행할 단계

### 1. 문서 ID 생성
- ISSUE ID가 있으면: ISSUE-{id}
- 없으면: {branch}-{index} (예: main-001)

### 2. 폴더 및 WORKFLOW_STATE.yaml 생성
\`\`\`bash
mkdir -p shinchan-docs/{DOC_ID}
\`\`\`

WORKFLOW_STATE.yaml 초기 내용:
\`\`\`yaml
version: 1
doc_id: "{DOC_ID}"
current:
  stage: requirements
  owner: nene
  status: active
\`\`\`

### 3. Stage 1 시작 - Nene 호출
\`\`\`typescript
Task(
  subagent_type="team-shinchan:nene",
  model="opus",
  prompt="Stage 1 (요구사항 수집)을 시작합니다.

DOC_ID: {DOC_ID}
사용자 요청: {args}

WORKFLOW_STATE.yaml이 생성되었습니다.
현재 Stage: requirements

규칙:
- 사용자가 '~해줘'라고 하면 요구사항으로 추가 (구현 아님)
- REQUESTS.md 작성
- 구현 요청은 거부하고 요구사항 수집 계속"
)
\`\`\`

### 4. 진행 상황 출력
\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Stage 1 시작: Requirements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 문서 폴더: shinchan-docs/{DOC_ID}/
📄 WORKFLOW_STATE.yaml 생성됨
👤 담당: Nene
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

사용자 요청: ${args || '(없음 - 요구사항 인터뷰 시작)'}
`
)
```

**STOP HERE. The above Task handles everything.**
