/**
 * Debate 스킬 - 에이전트 간 토론을 통한 최적 해결책 도출
 */

import type { SkillConfig, PluginContext, SkillResult, BuiltinAgentName } from '../../../types';

// 토론 주제별 참여 에이전트 매핑
const DEBATE_PARTICIPANTS: Record<string, BuiltinAgentName[]> = {
  frontend: ['suji', 'shinhyungman'],
  backend: ['heukgom', 'shinhyungman'],
  devops: ['hooni', 'shinhyungman'],
  architecture: ['shinhyungman', 'yuri', 'bongmisun'],
  fullstack: ['suji', 'heukgom', 'hooni', 'shinhyungman'],
  default: ['shinhyungman', 'bongmisun'],
};

// 주제 키워드 분석
function analyzeTopicForParticipants(topic: string): BuiltinAgentName[] {
  const lowerTopic = topic.toLowerCase();

  if (/ui|ux|프론트|frontend|컴포넌트|component|react|css|스타일/.test(lowerTopic)) {
    return DEBATE_PARTICIPANTS.frontend;
  }
  if (/api|백엔드|backend|db|database|서버|server|graphql|rest/.test(lowerTopic)) {
    return DEBATE_PARTICIPANTS.backend;
  }
  if (/배포|deploy|인프라|infra|devops|ci|cd|docker|k8s/.test(lowerTopic)) {
    return DEBATE_PARTICIPANTS.devops;
  }
  if (/아키텍처|architecture|설계|design|구조|시스템/.test(lowerTopic)) {
    return DEBATE_PARTICIPANTS.architecture;
  }
  if (/전체|풀스택|fullstack|통합/.test(lowerTopic)) {
    return DEBATE_PARTICIPANTS.fullstack;
  }

  return DEBATE_PARTICIPANTS.default;
}

// 에이전트 이름 매핑
const AGENT_DISPLAY_NAMES: Record<BuiltinAgentName, string> = {
  jjangu: '짱구',
  jjanga: '짱아',
  maenggu: '맹구',
  cheolsu: '철수',
  suji: '수지',
  heukgom: '흑곰',
  hooni: '훈이',
  shinhyungman: '신형만',
  yuri: '유리',
  bongmisun: '봉미선',
  actiongamen: '액션가면',
  heendungi: '흰둥이',
  chaesunga: '채성아',
  namiri: '나미리',
  yiseul: '이슬',
};

// 에이전트 역할 매핑
const AGENT_ROLES: Record<BuiltinAgentName, string> = {
  jjangu: 'Orchestrator',
  jjanga: 'Atlas',
  maenggu: 'Executor',
  cheolsu: 'Hephaestus',
  suji: 'Frontend',
  heukgom: 'Backend',
  hooni: 'DevOps',
  shinhyungman: 'Oracle',
  yuri: 'Planner',
  bongmisun: 'Metis',
  actiongamen: 'Reviewer',
  heendungi: 'Explorer',
  chaesunga: 'Librarian',
  namiri: 'Multimodal',
  yiseul: 'Moderator',
};

export function createDebateSkill(context: PluginContext): SkillConfig {
  return {
    name: 'debate',
    displayName: 'Debate',
    description: '에이전트 간 토론을 통해 최적의 해결책을 도출합니다.',
    triggers: ['debate', '토론', '의견', '논의', '장단점', '비교'],
    autoActivate: true,

    handler: async ({ args, sessionState }): Promise<SkillResult> => {
      const topic = args || '토론 주제를 입력해주세요';
      const participants = analyzeTopicForParticipants(topic);

      // 세션 상태 업데이트
      sessionState.activeSkill = 'debate';
      sessionState.debateActive = true;
      sessionState.debateRound = 0;
      sessionState.debateMaxRounds = 3;
      sessionState.debateParticipants = participants;
      sessionState.debateTopic = topic;

      const participantList = participants
        .map(p => `- **${AGENT_DISPLAY_NAMES[p]}** (${AGENT_ROLES[p]})`)
        .join('\n');

      return {
        success: true,
        output: `🗣️ **토론 세션 시작**

## 주제
${topic}

## 참여 에이전트
${participantList}

## 토론 진행 방식

### Phase 1: 의견 수집
각 전문가가 자신의 관점에서 의견을 제시합니다.

### Phase 2: 상호 피드백 (최대 3라운드)
다른 의견에 대한 피드백과 반론을 교환합니다.

### Phase 3: 합의 도출
신형만(Oracle)이 모든 의견을 종합하여 최종안을 제시합니다.

### Phase 4: 검증
액션가면(Reviewer)이 합의안을 검토합니다.

---

**이슬(Moderator)에게 토론 진행을 위임합니다...**`,

        inject: `<debate-mode>
토론 세션이 활성화되었습니다.

## 토론 규칙
- 최대 라운드: 3회
- 각 발언: 최대 500토큰
- 합의 실패 시: 투표로 결정

## 토론 프로세스

### Step 1: 의견 수집 (병렬)
다음 에이전트들에게 동시에 의견을 요청하세요:
${participants.map(p => `- Task(subagent_type="team-seokan:${p}", prompt="주제: ${topic}\n\n이 주제에 대한 당신의 전문적 의견을 제시해주세요. 장점, 단점, 권장 사항을 포함해주세요.")`).join('\n')}

### Step 2: 피드백 라운드
수집된 의견을 각 에이전트에게 공유하고 상호 피드백을 요청하세요.

### Step 3: 합의 도출
Task(subagent_type="team-seokan:shinhyungman", prompt="다음 의견들을 종합하여 최적의 해결책을 제시해주세요: [의견들]")

### Step 4: 검증
Task(subagent_type="team-seokan:actiongamen", prompt="다음 합의안을 검토해주세요: [합의안]")

## 토론 진행
이슬(Moderator)가 토론을 진행합니다.
Task(subagent_type="team-seokan:yiseul", prompt="토론 주제: ${topic}\n참여자: ${participants.join(', ')}\n\n토론을 진행하고 합의를 도출해주세요.")
</debate-mode>`,
      };
    },
  };
}
