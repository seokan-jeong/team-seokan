---
name: team-shinchan:debate
description: Specialized agents debate to find optimal solutions. Used for "debate", "pros and cons", "gather opinions" requests.
user-invocable: true
---

# Debate Skill

## ⚠️ MANDATORY: 직접 Debate 오케스트레이션

**이 스킬 실행 시 Midori를 호출하지 않고 직접 Debate를 진행하세요.**

### Step 1: Debate 시작 공지
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💭 Debate 시작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 주제: {토론 주제}
👥 패널: {선정된 전문가들} (midori.md 패널 선정 기준 참조)
🎯 목표: {결정해야 할 사항}
```

### Step 2: 패널 의견 수집 (병렬 Task 호출)
```typescript
// 주제에 맞는 패널 선정 후 의견 수집
Task(subagent_type="team-shinchan:hiroshi", model="opus",
  prompt="Debate 주제: [주제]\n\n배경: [배경]\n\n선택지:\n- A: ...\n- B: ...\n\n당신의 전문가 의견을 간결하게 제시해주세요. (3-5문장)")

Task(subagent_type="team-shinchan:nene", model="opus",
  prompt="... (동일한 형식)")
```

### Step 3: 의견 실시간 출력
```
🎤 Round 1: 의견 수집
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 [Hiroshi] Oracle 의견:
> "{Hiroshi 의견 요약}"

🟣 [Nene] Planner 의견:
> "{Nene 의견 요약}"
```

### Step 4: 합의 도출
```
🔄 Round 2: 합의 확인
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 합의점: {합의 내용}
⚠️ 이견: {남은 이견, 없으면 생략}
```

### Step 5: 최종 결정 보고
```
✅ Debate 결론
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 결정: {최종 결정}
📝 근거: {결정 근거 요약}
```

**❌ Midori(team-shinchan:midori)를 호출하지 마세요 - 직접 오케스트레이션**
**✅ 패널을 직접 호출하고 과정을 실시간으로 출력하세요**

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

- Auto-summons expert agents based on topic
- Conducts structured discussions up to 3 rounds
- Hiroshi(Oracle) synthesizes final recommendation
- Action Kamen(Reviewer) verifies consensus

## Discussion Patterns

| Pattern | Description | Best For |
|---------|-------------|----------|
| Round Table | Sequential opinions with mutual feedback | General decisions |
| Dialectic | Thesis ↔ Antithesis → Synthesis | Opposing viewpoints |
| Expert Panel | Domain-specific perspectives | Multi-domain topics |

## Automatic Participant Selection

| Topic | Summoned Agents |
|-------|-----------------|
| UI, Frontend | Aichan, Hiroshi |
| API, Backend, DB | Bunta, Hiroshi |
| Deploy, Infrastructure | Masao, Hiroshi |
| Architecture, Design | Hiroshi, Nene, Misae |
| Full System | Aichan, Bunta, Masao, Hiroshi |

## Workflow Checklist

```
[ ] Phase 1: Define problem and summon panel
[ ] Phase 2: Collect opinions (parallel)
[ ] Phase 3: Discussion rounds (max 3)
[ ] Phase 4: Reach consensus (Hiroshi)
[ ] Phase 5: Verify (Action Kamen)
```

## Discussion Rules

- Max rounds: 3
- Token limit: 500 tokens per agent per turn
- No consensus: Hiroshi가 최종 결정권 행사

See [WORKFLOW.md](./WORKFLOW.md) for detailed workflow

---

## 📚 참조 문서

- [midori.md](../../agents/midori.md) - Debate 가이드라인 (패널 선정 기준, 진행 패턴 등)
