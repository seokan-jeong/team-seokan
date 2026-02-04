---
name: team-shinchan:plan
description: Create systematic work plans with Nene(Planner). Used for "plan", "design" requests.
user-invocable: true
---

# Plan Skill

## ⚠️ MANDATORY: Agent Invocation

**이 스킬 실행 시 반드시 다음을 수행하세요:**

```typescript
Task(
  subagent_type="team-shinchan:nene",
  model="opus",
  prompt="사용자 요청: [요청 내용]\n\n체계적인 작업 계획을 수립하세요."
)
```

**❌ 직접 계획을 작성하지 마세요**
**✅ Nene 에이전트에게 위임하세요**

---

## 🔔 실시간 진행 상황 출력

**에이전트 호출 시 다음 프로토콜을 따르세요:**

### Task 호출 전
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 [{에이전트명}] 호출
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 목표: {수행할 작업}
🔧 모델: {haiku/sonnet/opus}
```

### Task 호출 후
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ [{에이전트명}] 완료
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 결과 요약:
- {핵심 결과 1}
- {핵심 결과 2}
⏭️ 다음 단계: {다음 작업}
```

**사용자가 모든 진행 과정을 볼 수 있도록 각 단계마다 공지하세요.**

---

## Features

- Nene(Planner) clarifies requirements through interview
- Misae(Metis) analyzes hidden requirements and risks
- Creates plan with testable acceptance criteria
- Action Kamen(Reviewer) reviews plan

## Planning Process

1. **Requirements Interview**: Identify goals, constraints, priorities
2. **Analysis**: Identify hidden requirements and risks
3. **Plan Writing**: Include implementation steps, file references, verification steps
4. **Review**: Action Kamen provides feedback

## Workflow Checklist

```
[ ] Complete requirements interview
[ ] Complete Misae analysis
[ ] Draft plan document
[ ] Pass Action Kamen review
```

## Plan Quality Criteria

- 80%+ of claims include file/line references
- 90%+ of acceptance criteria are testable
- No ambiguous terms
- All risks have mitigation plans
