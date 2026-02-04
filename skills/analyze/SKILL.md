---
name: team-shinchan:analyze
description: Deep analysis of code, bugs, performance, architecture with Hiroshi(Oracle). Used for "analyze", "debug", "why isn't it working" requests.
user-invocable: true
---

# Analyze Skill

## ⚠️ MANDATORY: Agent Invocation

**이 스킬 실행 시 반드시 다음을 수행하세요:**

```typescript
Task(
  subagent_type="team-shinchan:hiroshi",
  model="opus",
  prompt="사용자 요청: [요청 내용]\n\n심층 분석을 수행하세요."
)
```

**❌ 직접 분석하지 마세요**
**✅ Hiroshi(Oracle) 에이전트에게 위임하세요**

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

- Analyze code structure, dependencies, complexity
- Trace error causes and stack traces
- Identify performance bottlenecks and suggest optimizations
- Understand overall architecture and suggest improvements

## Analysis Types

| Type | Analysis Contents |
|------|-------------------|
| Code Analysis | Structure, dependencies, complexity |
| Bug Analysis | Error causes, stack traces, reproduction conditions |
| Performance Analysis | Bottlenecks, memory, optimization strategies |
| Architecture Analysis | Overall structure, improvements, trade-offs |

## Workflow Checklist

```
[ ] Identify analysis target and type
[ ] Collect related code/logs
[ ] Perform Hiroshi(Oracle) analysis
[ ] Organize results and derive recommendations
```

## Analysis Results

Provided on completion:
- Current state summary
- Discovered issues
- Recommended solutions
- Related file and line references
