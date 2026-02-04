/**
 * Analyze 스킬 - 분석 모드
 */
export function createAnalyzeSkill(context) {
    return {
        name: 'analyze',
        displayName: 'Analyze',
        description: '심층 분석 모드를 활성화합니다.',
        triggers: ['analyze', '분석', '디버깅', '왜 안', 'debug', 'investigate'],
        autoActivate: true,
        handler: async ({ args, sessionState }) => {
            sessionState.activeSkill = 'analyze';
            return {
                success: true,
                output: `🔍 **분석 모드 활성화**

신형만(Oracle)과 함께 심층 분석을 수행합니다.

## 분석 대상
${args || '분석할 내용을 설명해주세요'}

## 분석 접근법
1. **현상 파악**: 문제 상황 정확히 이해
2. **원인 추적**: 근본 원인 식별
3. **영향 분석**: 관련 코드/기능 파악
4. **해결 방안**: 옵션 및 추천 제시

신형만(Oracle)에게 위임합니다...`,
                inject: `<analyze-mode>
분석 모드가 활성화되었습니다.
신형만(Oracle)에게 위임하여 심층 분석을 수행하세요.
delegate_task(agent="shinhyungman", task="...")
</analyze-mode>`,
            };
        },
    };
}
