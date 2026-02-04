---
name: team-shinchan:debate
description: Specialized agents debate to find optimal solutions. Used for "debate", "pros and cons", "gather opinions" requests.
user-invocable: true
---

# EXECUTE IMMEDIATELY - 직접 오케스트레이션

**Midori를 호출하지 마세요. 직접 Debate를 진행하세요.**

## Step 1: Debate 시작 공지

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💭 Debate 시작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 주제: {토론 주제}
👥 패널: {패널 선정 - 아래 표 참조}
🎯 목표: {결정해야 할 사항}
```

## Step 2: 패널 선정 및 의견 수집 (병렬 Task)

| 주제 | 패널 |
|------|------|
| UI/Frontend | Aichan, Hiroshi |
| API/Backend | Bunta, Hiroshi |
| DevOps/Infra | Masao, Hiroshi |
| Architecture | Hiroshi, Nene, Misae |

```typescript
// 병렬로 패널 의견 수집
Task(subagent_type="team-shinchan:hiroshi", model="opus",
  prompt="Debate 주제: [주제]\n배경: [배경]\n선택지:\n- A: ...\n- B: ...\n\n전문가 의견을 간결하게 제시해주세요. (3-5문장)")

Task(subagent_type="team-shinchan:nene", model="opus",
  prompt="... (동일 형식)")
```

## Step 3: 의견 출력 및 합의 도출

```
🎤 Round 1: 의견 수집
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 [Hiroshi]: "{의견}"
🟣 [Nene]: "{의견}"

✅ Debate 결론
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 결정: {최종 결정}
📝 근거: {결정 근거}
```

**STOP HERE. Execute the above steps NOW.**
