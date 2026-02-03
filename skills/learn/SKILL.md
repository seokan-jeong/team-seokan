---
name: learn
description: 새로운 학습 내용(패턴, 선호도, 규칙 등)을 메모리에 수동으로 추가합니다. 특정 정보를 기억시키고 싶을 때 사용합니다.
user-invocable: true
---

# Learn Skill

## 기능

- 입력 내용을 분석하여 적절한 카테고리 자동 분류
- 신뢰도 0.7로 초기화하여 저장
- 기본적으로 프로젝트 메모리에 저장

## 사용법

```
/learn "사용자는 함수명에 camelCase를 선호함"
/learn "이 프로젝트는 Jest 대신 Vitest를 사용"
/learn --global "전역으로 저장할 내용"
```

## 카테고리 자동 분류

| 키워드 | 카테고리 |
|--------|----------|
| 선호, prefer, like | preference |
| 패턴, pattern, 방식 | pattern |
| 규칙, rule, convention | convention |
| 실수, error, mistake | mistake |
| 결정, decision, 아키텍처 | decision |

## 저장 위치

- 기본: `.team-seokan/memories/` (프로젝트)
- `--global` 플래그: `~/.team-seokan/memories/` (전역)
