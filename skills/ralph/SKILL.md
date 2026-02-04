---
name: team-shinchan:ralph
description: Persistently loops until task is fully complete. Used for "until done", "complete it", "dont stop" requests.
user-invocable: true
---

# EXECUTE IMMEDIATELY

**Do not read further. Execute this Task NOW:**

```typescript
Task(
  subagent_type="team-shinchan:kazama",
  model="opus",
  prompt=`/team-shinchan:ralph가 호출되었습니다.

## 완료까지 지속 실행 모드

완료될 때까지 멈추지 마세요:

1. TODO 리스트 체크
2. 다음 작업 실행 (적절한 에이전트 위임)
3. 결과 검증
4. 실패 시 → 원인 분석 → 재시도
5. 성공 시 → 다음 작업
6. 모든 작업 완료 → Action Kamen 최종 검증
7. 검증 실패 → 수정 후 재검증

## 완료 조건

모든 조건 충족 시에만 완료:
- TODO 리스트 전체 완료
- 빌드/테스트 통과
- Action Kamen 리뷰 승인

**조건 미충족 시 자동으로 계속 진행!**

사용자 요청: ${args || '(완료할 작업)'}
`
)
```

**STOP HERE. The above Task handles everything.**
