---
name: team-shinchan:ultrawork
description: Complete tasks quickly with parallel agent execution. Used for "fast", "parallel", "ulw" requests.
user-invocable: true
---

# EXECUTE IMMEDIATELY

**Do not read further. Execute this Task NOW:**

```typescript
Task(
  subagent_type="team-shinchan:shinnosuke",
  model="opus",
  prompt=`/team-shinchan:ultrawork가 호출되었습니다.

## 병렬 실행 모드

최대 병렬 실행으로 빠르게 완료하세요:

1. 작업을 독립적인 단위로 분해
2. 각 단위를 적절한 에이전트에게 병렬 할당
   - run_in_background=true 사용
   - 에이전트 라우팅:
     | 도메인 | Haiku | Sonnet | Opus |
     |--------|-------|--------|------|
     | 분석 | Shiro | Misae | Hiroshi |
     | 실행 | - | Bo | Kazama |
     | Frontend | - | Aichan | - |
     | Backend | - | Bunta | - |
     | DevOps | - | Masao | - |
     | 검증 | - | - | Action Kamen |
3. 순차적 작업은 큐에 대기
4. 모든 작업 완료 대기
5. 결과 통합 및 Action Kamen 검증

## 완료 조건

- TODO 리스트 전체 완료
- 모든 기능 정상 동작
- 테스트 통과
- 에러 없음

**조건 미충족 시 계속 작업!**

사용자 요청: ${args || '(병렬 처리할 작업)'}
`
)
```

**STOP HERE. The above Task handles everything.**
