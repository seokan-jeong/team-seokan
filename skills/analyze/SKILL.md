---
name: team-shinchan:analyze
description: Deep analysis of code, bugs, performance, architecture with Hiroshi(Oracle). Used for "analyze", "debug", "why isn't it working" requests.
user-invocable: true
---

# EXECUTE IMMEDIATELY

**Do not read further. Execute this Task NOW:**

```typescript
Task(
  subagent_type="team-shinchan:hiroshi",
  model="opus",
  prompt=`/team-shinchan:analyze가 호출되었습니다.

## 심층 분석 요청

다음 유형의 분석을 수행하세요:

| 유형 | 분석 내용 |
|------|----------|
| 코드 분석 | 구조, 의존성, 복잡도 |
| 버그 분석 | 오류 원인, 스택 트레이스, 재현 조건 |
| 성능 분석 | 병목점, 메모리, 최적화 전략 |
| 아키텍처 분석 | 전체 구조, 개선점, 트레이드오프 |

## 결과 포함 항목

- 현재 상태 요약
- 발견된 이슈
- 권장 솔루션
- 관련 파일 및 라인 참조

사용자 요청: ${args || '(분석할 대상을 설명해주세요)'}
`
)
```

**STOP HERE. The above Task handles everything.**
