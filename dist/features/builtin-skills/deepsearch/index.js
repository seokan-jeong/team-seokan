/**
 * Deepsearch 스킬 - 심층 검색
 */
export function createDeepsearchSkill(context) {
    return {
        name: 'deepsearch',
        displayName: 'Deepsearch',
        description: '코드베이스를 깊이 탐색합니다.',
        triggers: ['deepsearch', '깊은검색', '찾아줘', 'search'],
        autoActivate: true,
        handler: async ({ args, sessionState }) => {
            sessionState.activeSkill = 'deepsearch';
            return {
                success: true,
                output: `🔎 **Deepsearch 모드 활성화**

흰둥이(Explorer)와 채성아(Librarian)가 함께 심층 검색을 수행합니다.

## 검색 대상
${args || '검색할 내용을 설명해주세요'}

## 검색 전략
1. **코드 탐색**: 흰둥이가 코드베이스 탐색
2. **문서 검색**: 채성아가 문서/외부 정보 검색
3. **결과 종합**: 발견한 정보 정리

병렬로 검색을 시작합니다...`,
                inject: `<deepsearch-mode>
Deepsearch 모드가 활성화되었습니다.
흰둥이(Explorer)와 채성아(Librarian)에게 병렬로 위임하세요.
</deepsearch-mode>`,
            };
        },
    };
}
