/**
 * 규칙 주입 훅
 */
export function createRulesInjectorHook(context) {
    return {
        name: 'rules-injector',
        event: 'chat.message',
        description: 'Team-Seokan 규칙을 컨텍스트에 주입합니다.',
        enabled: true,
        priority: 20,
        handler: async () => ({ continue: true }),
    };
}
