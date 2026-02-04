---
name: midori
description: Debate Guidelines Document. NOT an agent to be called directly. Shinnosuke references this for debate orchestration patterns.

model: -
color: teal
tools: []
---

# Midori - Debate Guidelines (참조 문서)

> ⚠️ **이 문서는 직접 호출하는 에이전트가 아닙니다.**
> Shinnosuke가 Debate를 진행할 때 참조하는 가이드라인입니다.

---

## 📋 Debate 진행 가이드라인

### When to Trigger Debate

| 상황 | Debate |
|-----|--------|
| 구현 방법이 2개 이상 존재 | ✅ **필수** |
| 아키텍처 변경 필요 | ✅ **필수** |
| 기존 패턴/컨벤션 변경 | ✅ **필수** |
| 성능 vs 가독성 트레이드오프 | ✅ **필수** |
| 보안 관련 결정 | ✅ **필수** |
| 단순 CRUD | ❌ 불필요 |
| 명확한 버그 수정 | ❌ 불필요 |
| 사용자가 이미 결정함 | ❌ 불필요 |

---

## 👥 패널 선정 기준

| Topic | Panelists |
|-------|-----------|
| UI/Frontend | Aichan, Hiroshi |
| API/Backend | Bunta, Hiroshi |
| DevOps/Infra | Masao, Hiroshi |
| Architecture | Hiroshi, Nene, Misae |
| Full-stack | Aichan, Bunta, Masao, Hiroshi |
| Security | Hiroshi, Bunta, Masao |
| Performance | Hiroshi, Bunta |
| Testing Strategy | Hiroshi, Nene |

---

## 🎯 Debate 진행 패턴

### Pattern 1: Round Table (기본)
모든 패널이 순차적으로 의견을 제시하고 피드백

```
1. 주제 정의 → 2. 패널 선정 → 3. 의견 수집 → 4. 피드백 → 5. 합의
```

### Pattern 2: Dialectic (대립 구도)
두 가지 선택지가 명확할 때

```
1. 선택지 A 옹호자 지정 → 2. 선택지 B 옹호자 지정
3. 각 입장 발표 → 4. 반박 → 5. Hiroshi 종합
```

### Pattern 3: Expert Panel (전문가 패널)
특정 도메인 전문가들의 의견 수집

```
1. 도메인별 전문가 선정 → 2. 각 관점에서 분석
3. 교차 검토 → 4. 종합 결론
```

---

## 📢 Debate 출력 형식

### 시작 공지
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💭 Debate 시작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 주제: {토론 주제}
👥 패널: {선정된 전문가들}
🎯 목표: {결정해야 할 사항}
```

### 의견 수집
```
🎤 Round 1: 의견 수집
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 [Hiroshi] Oracle 의견:
> "{의견 요약}"

🟣 [Nene] Planner 의견:
> "{의견 요약}"
```

### 합의 도출
```
🔄 Round 2: 합의 확인
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 합의점: {합의 내용}
⚠️ 이견: {남은 이견, 없으면 생략}
```

### 최종 결정
```
✅ Debate 결론
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 결정: {최종 결정}
📝 근거: {결정 근거 요약}
```

---

## ⚙️ Debate 규칙

1. **최대 라운드**: 3회 (대부분 2회면 충분)
2. **의견 길이**: 각 에이전트 3-5문장으로 간결하게
3. **합의 실패 시**: Hiroshi가 최종 결정권 행사
4. **이견 기록**: 중요한 이견은 문서에 기록

---

## 🔄 Shinnosuke의 Debate 진행 절차

```
1. Debate 필요성 판단 (위 트리거 조건 참조)
2. 패널 선정 (위 기준표 참조)
3. 시작 공지 출력
4. 패널 의견 수집 (Task 병렬 호출)
5. 각 의견 실시간 출력
6. 합의점/이견 정리
7. 최종 결정 도출 (필요시 Hiroshi 종합)
8. 결론 보고
```

---

## 📝 의견 요청 프롬프트 템플릿

```
Debate 주제: {주제}

## 배경
{배경 설명}

## 선택지
- A: {선택지 A 설명}
- B: {선택지 B 설명}
(- C: {선택지 C, 있을 경우})

당신의 전문가 의견을 간결하게 제시해주세요. (3-5문장)
```
