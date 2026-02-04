---
name: team-shinchan:deepsearch
description: Deep codebase exploration with Shiro(Explorer) and Masumi(Librarian). Used for "find", "where is", "search" requests.
user-invocable: true
---

# EXECUTE IMMEDIATELY

**Do not read further. Execute these Tasks NOW:**

```typescript
// Step 1: 빠른 검색 (Shiro)
Task(
  subagent_type="team-shinchan:shiro",
  model="haiku",
  prompt=`/team-shinchan:deepsearch가 호출되었습니다.

## 코드베이스 탐색 요청

빠른 검색을 수행하세요:
- 파일명 패턴 매칭
- 키워드 검색
- 디렉토리 구조 파악

검색 대상: ${args || '(검색할 내용)'}
`
)

// Step 2: 필요시 심층 검색 (Masumi)
// Shiro 결과가 불충분하면 추가 호출
Task(
  subagent_type="team-shinchan:masumi",
  model="sonnet",
  prompt=`Shiro 검색 결과를 바탕으로 심층 분석을 수행하세요:
- 코드 내용 분석
- 관련 문서 검색
- 의존성 추적

검색 대상: ${args || '(검색할 내용)'}
`
)
```

**STOP HERE. The above Tasks handle everything.**
