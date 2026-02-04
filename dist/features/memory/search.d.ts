/**
 * Memory Search
 * 메모리 검색 및 관련성 계산
 */
import type { MemoryEntry, MemoryQuery, MemorySearchResult, MemoryCategory } from './types';
/**
 * 메모리 필터링
 */
export declare function filterMemories(memories: MemoryEntry[], query: MemoryQuery): MemoryEntry[];
/**
 * 관련성 점수 계산
 */
export declare function calculateRelevanceScore(memory: MemoryEntry, context: {
    keywords?: string[];
    currentTask?: string;
    currentAgent?: string;
    recentTags?: string[];
}): number;
/**
 * 메모리 정렬
 */
export declare function sortMemories(memories: MemoryEntry[], sortBy?: MemoryQuery['sortBy'], sortOrder?: MemoryQuery['sortOrder'], relevanceScores?: Map<string, number>): MemoryEntry[];
/**
 * 메모리 검색
 */
export declare function searchMemories(memories: MemoryEntry[], query: MemoryQuery, context?: {
    keywords?: string[];
    currentTask?: string;
    currentAgent?: string;
    recentTags?: string[];
}): MemorySearchResult;
/**
 * 유사 메모리 찾기
 */
export declare function findSimilarMemories(targetMemory: MemoryEntry, allMemories: MemoryEntry[], limit?: number): MemoryEntry[];
/**
 * 카테고리별 메모리 그룹화
 */
export declare function groupByCategory(memories: MemoryEntry[]): Map<MemoryCategory, MemoryEntry[]>;
/**
 * 태그 빈도 분석
 */
export declare function analyzeTagFrequency(memories: MemoryEntry[]): Map<string, number>;
/**
 * 검색 제안 생성
 */
export declare function generateSearchSuggestions(memories: MemoryEntry[], partialQuery: string, limit?: number): string[];
//# sourceMappingURL=search.d.ts.map