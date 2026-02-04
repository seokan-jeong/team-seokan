---
name: team-shinchan:plan
description: Create systematic work plans with Nene(Planner). Used for "plan", "design" requests.
user-invocable: true
---

# EXECUTE IMMEDIATELY

**Do not read further. Execute this Task NOW:**

```typescript
Task(
  subagent_type="team-shinchan:nene",
  model="opus",
  prompt=`/team-shinchan:plan이 호출되었습니다.

## 계획 수립 요청

체계적인 작업 계획을 수립하세요:

1. 요구사항 인터뷰 (목표, 제약사항, 우선순위)
2. 숨겨진 요구사항 및 리스크 분석
3. Phase 분해 및 수용 기준 정의
4. 계획 문서 작성

## 품질 기준

- 80%+ 주장에 파일/라인 참조 포함
- 90%+ 수용 기준이 테스트 가능
- 모호한 용어 금지
- 모든 리스크에 대응 방안 포함

사용자 요청: ${args || '(계획할 내용을 설명해주세요)'}
`
)
```

**STOP HERE. The above Task handles everything.**
