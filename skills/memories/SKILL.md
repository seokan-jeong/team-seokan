---
name: memories
description: 학습된 메모리(패턴, 선호도, 실수, 결정 등)를 조회하고 관리합니다. 현재 학습 내용을 확인하고 싶을 때 사용합니다.
user-invocable: true
---

# Memories Skill

## 기능

- 전역 메모리(`~/.team-seokan/memories/`) 조회
- 프로젝트 메모리(`.team-seokan/memories/`) 조회
- 키워드로 메모리 검색
- 신뢰도 순으로 정렬하여 표시

## 사용법

```
/memories           # 전체 메모리 조회
/memories search    # 키워드로 검색
```

## 메모리 카테고리

| 카테고리 | 설명 |
|----------|------|
| preference | 사용자 선호도 |
| pattern | 코드 패턴 |
| context | 프로젝트 컨텍스트 |
| mistake | 실수와 해결법 |
| decision | 아키텍처 결정 |
| convention | 프로젝트 컨벤션 |
| insight | 인사이트 |

## 출력 정보

각 메모리 항목에 대해 표시:
- 카테고리
- 태그
- 생성일
- 신뢰도
