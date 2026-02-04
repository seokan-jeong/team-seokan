/**
 * 선제적 컴팩션 훅
 */
export function createPreemptiveCompactionHook(context) {
    return {
        name: 'preemptive-compaction',
        event: 'chat.message',
        description: '컨텍스트가 가득 차기 전에 선제적으로 압축을 제안합니다.',
        enabled: true,
        priority: 50,
        handler: async () => ({ continue: true }),
    };
}
