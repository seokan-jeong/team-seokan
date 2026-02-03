# 🎭 Team-Seokan v2.1

**짱구 캐릭터 기반 멀티 에이전트 오케스트레이션 시스템**

Claude Code를 위한 플러그인으로, 사용할수록 똑똑해지는 자기학습 시스템을 탑재했습니다.

## ✨ v2.1 새로운 기능

- **🗣️ 토론 시스템**: 여러 전문가 에이전트가 토론하여 최적의 해결책 도출
- **🎭 이슬 에이전트**: 토론 진행 및 중재를 담당하는 Moderator 추가
- **📋 워크플로우 체크리스트**: 각 스킬에 복사 가능한 체크리스트 제공
- **📚 스킬 모범사례 적용**: Claude Skill 모범사례에 따른 문서 개선

### v2.0 기능

- **🧠 자기학습**: 작업 결과에서 자동으로 패턴, 선호도, 실수 학습
- **🔄 회고 시스템**: 작업 완료 후 자동 회고 및 개선점 도출
- **💾 메모리 관리**: 학습된 내용을 영구 저장하고 활용
- **🚀 부트스트랩**: 프로젝트 첫 실행 시 자동 분석

---

## 🚀 설치

### 마켓플레이스 설치 (권장)

```bash
# 1. 마켓플레이스 추가
claude plugin marketplace add seokan-jeong/team-seokan

# 2. 플러그인 설치
claude plugin install team-seokan

# 3. Claude Code 재시작
```

### 원클릭 스크립트 설치

```bash
curl -fsSL https://raw.githubusercontent.com/seokan-jeong/team-seokan/main/install.sh | bash
```

### 수동 설치

```bash
# 1. 플러그인 디렉토리에 클론
git clone https://github.com/seokan-jeong/team-seokan.git ~/.claude/plugins/team-seokan

# 2. 의존성 설치 및 빌드
cd ~/.claude/plugins/team-seokan
npm install && npx tsc --outDir dist

# 3. Claude Code 재시작
```

### 업데이트

```bash
# 마켓플레이스 방식
claude plugin update team-seokan

# 수동 방식
cd ~/.claude/plugins/team-seokan
git pull origin main && npm install && npx tsc --outDir dist
```

---

## 🎭 에이전트 팀 (15명)

### 오케스트레이션
| 캐릭터 | 역할 | 모델 | 설명 |
|--------|------|------|------|
| **짱구** | Orchestrator | Opus | 작업 분석 및 위임 |
| **짱아** | Atlas | Opus | 복잡한 작업 분해 |
| **이슬** | Moderator | Opus | 🆕 토론 진행 및 중재 |

### 실행
| 캐릭터 | 역할 | 모델 | 설명 |
|--------|------|------|------|
| **맹구** | Executor | Sonnet | 코드 작성/수정 |
| **철수** | Hephaestus | Opus | 복잡한 구현 |

### 전문가
| 캐릭터 | 역할 | 모델 | 설명 |
|--------|------|------|------|
| **수지** | Frontend | Sonnet | UI/UX 개발 |
| **흑곰** | Backend | Sonnet | 서버/API 개발 |
| **훈이** | DevOps | Sonnet | 인프라/배포 |

### 조언 (읽기 전용)
| 캐릭터 | 역할 | 모델 | 설명 |
|--------|------|------|------|
| **신형만** | Oracle | Opus | 아키텍처 조언 |
| **유리** | Planner | Opus | 전략적 계획 |
| **봉미선** | Metis | Sonnet | 요구사항 분석 |
| **액션가면** | Reviewer | Opus | 코드 리뷰 |

### 탐색 (읽기 전용)
| 캐릭터 | 역할 | 모델 | 설명 |
|--------|------|------|------|
| **흰둥이** | Explorer | Haiku | 빠른 코드 탐색 |
| **채성아** | Librarian | Sonnet | 문서/라이브러리 검색 |
| **나미리** | Multimodal | Sonnet | 이미지/시각 분석 |

---

## 🗣️ 토론 시스템 (v2.1)

여러 전문가 에이전트가 토론하여 최적의 해결책을 도출합니다.

### 토론 패턴
| 패턴 | 설명 |
|------|------|
| 라운드 테이블 | 순차적 의견 제시 후 상호 피드백 |
| 변증법 | 정(Thesis) ↔ 반(Antithesis) → 합(Synthesis) |
| 전문가 패널 | 도메인별 관점 제시 |

### 참여자 자동 선정
| 주제 | 소집 에이전트 |
|------|--------------|
| UI, 프론트엔드 | 수지, 신형만 |
| API, 백엔드, DB | 흑곰, 신형만 |
| 배포, 인프라 | 훈이, 신형만 |
| 아키텍처, 설계 | 신형만, 유리, 봉미선 |

### 사용 예시
```
토론해줘: React vs Vue 어떤 걸 선택해야 할까?
장단점 비교해줘: REST API vs GraphQL
의견 모아줘: 마이크로서비스 아키텍처 도입
```

---

## 🧠 메모리 시스템 (v2.0)

### 자동 학습
플러그인이 자동으로 학습하는 내용:
- **선호도**: 사용자의 코딩 스타일, 명명 규칙
- **패턴**: 자주 사용하는 코드 패턴
- **실수**: 반복되는 실수와 해결법
- **결정**: 아키텍처 결정 사항
- **컨벤션**: 프로젝트 컨벤션

### 메모리 명령어
```bash
/memories          # 학습된 메모리 조회
/memories search   # 메모리 검색
/learn "내용"      # 수동으로 학습 추가
/forget <id>       # 특정 메모리 삭제
```

### 저장 위치
- **전역**: `~/.team-seokan/memories/` (모든 프로젝트에서 공유)
- **프로젝트**: `.team-seokan/memories/` (해당 프로젝트에서만 사용)

---

## 💡 스킬 사용

| 스킬 | 트리거 | 설명 |
|------|--------|------|
| `ultrawork` | "ulw", "병렬", "빠르게" | 병렬 실행 모드 |
| `ralph` | "끝까지", "완료할 때까지" | 완료까지 반복 |
| `autopilot` | "자동으로", "알아서" | 자율 실행 |
| `plan` | "계획", "설계" | 계획 세션 |
| `analyze` | "분석", "디버깅" | 심층 분석 |
| `deepsearch` | "찾아줘", "검색" | 심층 검색 |
| `debate` | "토론", "의견", "비교" | 🆕 에이전트 토론 |

### 예시

```
# Ultrawork 모드로 빠르게 작업
ulw 이 기능 구현해줘

# Ralph 모드로 완료까지
끝까지 해줘: TODO 리스트 전부 완료

# Autopilot으로 자율 실행
autopilot: REST API 만들어줘

# 토론으로 최적 방안 도출
토론해줘: 상태관리 라이브러리 선택
```

---

## ⚙️ 설정

`~/.config/team-seokan/config.json` 또는 프로젝트 루트의 `.team-seokan/config.json`:

```json
{
  "defaultModel": "sonnet",
  "maxConcurrentAgents": 5,
  "maxRetries": 3,
  "contextWarningThreshold": 50,
  "enableRalphLoop": true,
  "enableTodoEnforcer": true,
  "enableIntentGate": true,
  "enableReviewerCheck": true,
  "language": "ko"
}
```

---

## 🏗️ 프로젝트 구조

```
team-seokan/
├── src/
│   ├── agents/              # 15개 에이전트
│   ├── hooks/               # 훅 시스템
│   ├── tools/               # 도구
│   ├── features/
│   │   ├── memory/          # 메모리 시스템
│   │   ├── learning/        # 학습 엔진
│   │   ├── reflection/      # 회고 엔진
│   │   ├── context/         # 컨텍스트 주입
│   │   ├── bootstrap/       # 부트스트랩
│   │   └── builtin-skills/  # 스킬
│   ├── config/              # 설정
│   ├── shared/              # 공유 유틸리티
│   └── types/               # 타입 정의
├── skills/                  # 스킬 문서
│   ├── debate/              # 🆕 토론 스킬
│   └── ...
├── CLAUDE.md                # 시스템 프롬프트
├── plugin.json              # 플러그인 매니페스트
├── install.sh               # 설치 스크립트
└── package.json
```

---

## 🤝 영감

이 프로젝트는 다음에서 영감을 받았습니다:

- [oh-my-claudecode](https://github.com/anthropics/claude-code) - Claude Code 플러그인

---

## 📄 라이선스

MIT License

---

**Team-Seokan v2.1** - 짱구와 친구들이 토론하고, 학습하고, 성장합니다! 🖍️
