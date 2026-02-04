/**
 * 빈 작업 응답 감지 훅
 */
export function createEmptyTaskResponseDetectorHook(context) {
    return {
        name: 'empty-task-response-detector',
        event: 'tool.execute.after',
        description: '빈 작업 응답을 감지하고 재시도를 권장합니다.',
        enabled: true,
        priority: 45,
        handler: async () => ({ continue: true }),
    };
}
