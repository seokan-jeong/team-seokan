/**
 * 주석 체크 훅
 */
export function createCommentCheckerHook(context) {
    return {
        name: 'comment-checker',
        event: 'tool.execute.after',
        description: '과도한 주석 사용을 감지하고 경고합니다.',
        enabled: true,
        priority: 30,
        matchTools: ['Edit', 'Write'],
        handler: async () => ({ continue: true }),
    };
}
