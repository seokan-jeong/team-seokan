/**
 * Memory Operations Tool
 * 에이전트가 메모리를 읽고 쓸 수 있는 도구
 */
import { getMemoryManager } from '../../features/memory';
import { createSimpleLearning } from '../../features/learning';
export function createMemoryOpsTool(context) {
    return {
        name: 'memory_ops',
        description: '메모리를 읽고, 쓰고, 검색합니다. (read: 읽기, write: 쓰기, search: 검색, reinforce: 강화, contradict: 반박)',
        parameters: [
            {
                name: 'operation',
                type: 'string',
                description: '수행할 작업: read, write, search, reinforce, contradict',
                required: true,
            },
            {
                name: 'memoryId',
                type: 'string',
                description: '(read/reinforce/contradict) 메모리 ID',
                required: false,
            },
            {
                name: 'content',
                type: 'string',
                description: '(write) 저장할 내용',
                required: false,
            },
            {
                name: 'category',
                type: 'string',
                description: '(write) 메모리 카테고리: preference, pattern, context, mistake, decision, convention, insight',
                required: false,
            },
            {
                name: 'scope',
                type: 'string',
                description: '(write) 메모리 범위: global, project (기본: project)',
                required: false,
                default: 'project',
            },
            {
                name: 'tags',
                type: 'array',
                description: '(write) 태그 목록',
                required: false,
            },
            {
                name: 'keyword',
                type: 'string',
                description: '(search) 검색 키워드',
                required: false,
            },
            {
                name: 'limit',
                type: 'number',
                description: '(search) 최대 결과 수 (기본: 5)',
                required: false,
                default: 5,
            },
        ],
        handler: async (params) => {
            const manager = getMemoryManager();
            await manager.initialize();
            const operation = params.operation;
            switch (operation) {
                case 'read': {
                    const memoryId = params.memoryId;
                    if (!memoryId) {
                        return { success: false, error: 'memoryId가 필요합니다.' };
                    }
                    const memory = await manager.read(memoryId);
                    if (!memory) {
                        return { success: false, error: `ID ${memoryId}의 메모리를 찾을 수 없습니다.` };
                    }
                    return {
                        success: true,
                        output: JSON.stringify({
                            id: memory.id,
                            title: memory.title,
                            content: memory.content,
                            category: memory.category,
                            confidence: memory.confidence,
                            tags: memory.tags,
                            createdAt: memory.createdAt,
                        }, null, 2),
                    };
                }
                case 'write': {
                    const content = params.content;
                    if (!content) {
                        return { success: false, error: 'content가 필요합니다.' };
                    }
                    const learning = createSimpleLearning(content, {
                        category: params.category,
                        scope: params.scope || 'project',
                        owner: context.sessionState?.lastAgent || undefined,
                        tags: params.tags,
                        source: 'agent-memory-ops',
                    });
                    const memory = await manager.create(learning);
                    return {
                        success: true,
                        output: JSON.stringify({
                            id: memory.id,
                            title: memory.title,
                            message: '메모리가 저장되었습니다.',
                        }),
                    };
                }
                case 'search': {
                    const keyword = params.keyword;
                    const limit = params.limit || 5;
                    const result = await manager.search({
                        keyword,
                        categories: params.category ? [params.category] : undefined,
                        limit,
                        sortBy: 'relevance',
                    });
                    return {
                        success: true,
                        output: JSON.stringify({
                            total: result.total,
                            memories: result.memories.map((m) => ({
                                id: m.id,
                                title: m.title,
                                content: m.content.slice(0, 100) + (m.content.length > 100 ? '...' : ''),
                                category: m.category,
                                confidence: m.confidence,
                            })),
                        }, null, 2),
                    };
                }
                case 'reinforce': {
                    const memoryId = params.memoryId;
                    if (!memoryId) {
                        return { success: false, error: 'memoryId가 필요합니다.' };
                    }
                    const reinforced = await manager.reinforce(memoryId);
                    if (!reinforced) {
                        return { success: false, error: `ID ${memoryId}의 메모리를 찾을 수 없습니다.` };
                    }
                    return {
                        success: true,
                        output: JSON.stringify({
                            id: reinforced.id,
                            title: reinforced.title,
                            newConfidence: reinforced.confidence,
                            reinforcementCount: reinforced.reinforcementCount,
                            message: '메모리가 강화되었습니다.',
                        }),
                    };
                }
                case 'contradict': {
                    const memoryId = params.memoryId;
                    if (!memoryId) {
                        return { success: false, error: 'memoryId가 필요합니다.' };
                    }
                    const contradicted = await manager.contradict(memoryId);
                    if (!contradicted) {
                        return { success: false, error: `ID ${memoryId}의 메모리를 찾을 수 없습니다.` };
                    }
                    return {
                        success: true,
                        output: JSON.stringify({
                            id: contradicted.id,
                            title: contradicted.title,
                            newConfidence: contradicted.confidence,
                            contradictionCount: contradicted.contradictionCount,
                            message: '메모리가 반박 처리되었습니다.',
                        }),
                    };
                }
                default:
                    return {
                        success: false,
                        error: `알 수 없는 operation: ${operation}`,
                    };
            }
        },
    };
}
