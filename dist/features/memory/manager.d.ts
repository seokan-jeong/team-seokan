/**
 * Memory Manager
 * 메모리 시스템의 메인 인터페이스
 */
import type { MemoryEntry, CreateMemoryInput, UpdateMemoryInput, MemoryQuery, MemorySearchResult, MemorySummary } from './types';
import { MemoryStorage } from './storage';
/**
 * 메모리 매니저 클래스
 */
export declare class MemoryManager {
    private storage;
    private cache;
    private cacheExpiry;
    constructor(storage?: MemoryStorage);
    /**
     * 초기화
     */
    initialize(): Promise<void>;
    /**
     * 메모리 로드 (캐시 적용)
     */
    loadMemories(force?: boolean): Promise<void>;
    /**
     * 모든 메모리 가져오기 (글로벌 + 프로젝트 병합)
     */
    getAllMemories(): MemoryEntry[];
    /**
     * 메모리 생성
     */
    create(input: CreateMemoryInput): Promise<MemoryEntry>;
    /**
     * 메모리 읽기
     */
    read(id: string): Promise<MemoryEntry | null>;
    /**
     * 메모리 업데이트
     */
    update(id: string, input: UpdateMemoryInput): Promise<MemoryEntry | null>;
    /**
     * 메모리 삭제
     */
    delete(id: string): Promise<boolean>;
    /**
     * 메모리 검색
     */
    search(query: MemoryQuery, context?: {
        keywords?: string[];
        currentTask?: string;
        currentAgent?: string;
        recentTags?: string[];
    }): Promise<MemorySearchResult>;
    /**
     * 메모리 강화
     */
    reinforce(id: string): Promise<MemoryEntry | null>;
    /**
     * 메모리 반박
     */
    contradict(id: string): Promise<MemoryEntry | null>;
    /**
     * 유사 메모리 찾기
     */
    findSimilar(id: string, limit?: number): Promise<MemoryEntry[]>;
    /**
     * 메모리 요약 생성
     */
    generateSummary(query?: MemoryQuery, maxTokens?: number): Promise<MemorySummary>;
    /**
     * 감쇠 처리 (배치)
     */
    processDecay(): Promise<{
        removed: number;
        remaining: number;
    }>;
    /**
     * 통계
     */
    getStats(): Promise<{
        total: number;
        global: number;
        project: number;
        byCategory: Map<string, number>;
        byOwner: Map<string, number>;
        averageConfidence: number;
        topTags: [string, number][];
    }>;
    /**
     * 키워드로 잊기 (forget)
     */
    forget(keyword: string): Promise<number>;
    /**
     * 캐시 무효화
     */
    private invalidateCache;
    /**
     * 백업
     */
    backup(): Promise<string>;
}
export declare function getMemoryManager(): MemoryManager;
export declare function setMemoryManager(manager: MemoryManager): void;
//# sourceMappingURL=manager.d.ts.map