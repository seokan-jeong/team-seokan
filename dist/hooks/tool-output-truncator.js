/**
 * 도구 출력 잘라내기 훅
 */
export function createToolOutputTruncatorHook(context) {
    return {
        name: 'tool-output-truncator',
        event: 'tool.execute.after',
        description: '너무 긴 도구 출력을 잘라냅니다.',
        enabled: true,
        priority: 40,
        handler: async () => ({ continue: true }),
    };
}
