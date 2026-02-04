/**
 * Plan 스킬 - 계획 세션
 */
export function createPlanSkill(context) {
    return {
        name: 'plan',
        displayName: 'Plan',
        description: '계획 세션을 시작하여 요구사항을 정리합니다.',
        triggers: ['plan', '계획', '설계', 'planning'],
        autoActivate: true,
        handler: async ({ args, sessionState }) => {
            sessionState.activeSkill = 'plan';
            return {
                success: true,
                output: `📋 **계획 세션 시작**

유리(Planner)와 함께 계획을 수립합니다.

## 프로젝트/작업
${args || '계획할 내용을 설명해주세요'}

## 진행 방식
1. **요구사항 수집**: 목표, 제약조건, 우선순위 파악
2. **분석**: 봉미선(Metis)이 숨은 요구사항 분석
3. **계획 작성**: 단계별 작업 분해
4. **검토**: 액션가면(Reviewer) 검토

## 질문
계획을 수립하기 위해 몇 가지 질문을 드리겠습니다.

유리(Planner)에게 위임합니다...`,
                inject: `<plan-mode>
계획 세션이 시작되었습니다.
유리(Planner)에게 위임하여 체계적인 계획을 수립하세요.
delegate_task(agent="yuri", task="...")
</plan-mode>`,
            };
        },
    };
}
