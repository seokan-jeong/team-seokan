---
name: team-shinchan:autopilot
description: Autonomously completes from requirements analysis to verification without user intervention. Used for "auto", "automatically", "autopilot" requests.
user-invocable: true
---

# EXECUTE IMMEDIATELY

**Do not read further. Execute this Task NOW:**

```typescript
Task(
  subagent_type="team-shinchan:shinnosuke",
  model="opus",
  prompt=`/team-shinchan:autopilot이 호출되었습니다.

## 자율 실행 모드

사용자 개입 없이 자율적으로 완료하세요:

1. WORKFLOW_STATE.yaml 생성 (stage: requirements)
2. Misae로 요구사항 자동 분석
3. Nene로 계획 수립 (REQUESTS.md, PROGRESS.md)
4. 적절한 에이전트에게 작업 분배 (Bo/Aichan/Bunta/Masao)
5. Action Kamen 검증
6. 문제 발견 시 자동 수정

## Stage 규칙 준수

- requirements Stage: 요구사항 수집만 (코드 수정 금지)
- planning Stage: 계획 수립만 (코드 수정 금지)
- execution Stage: 구현 진행
- completion Stage: 문서화 및 검증

사용자 요청: ${args || '(요청 내용 분석 필요)'}
`
)
```

**STOP HERE. The above Task handles everything.**
