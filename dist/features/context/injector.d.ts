/**
 * Context Injector
 * 에이전트 프롬프트에 메모리 주입
 */
import type { MemoryOwner, MemoryCategory, ContextInjection } from '../memory/types';
/**
 * 컨텍스트 주입 옵션
 */
export interface InjectionOptions {
    /** 대상 에이전트 */
    agent: MemoryOwner;
    /** 현재 작업 설명 */
    currentTask?: string;
    /** 관련 키워드 */
    keywords?: string[];
    /** 최대 토큰 수 */
    maxTokens?: number;
    /** 포함할 카테고리 (기본: 전체) */
    includeCategories?: MemoryCategory[];
    /** 제외할 카테고리 */
    excludeCategories?: MemoryCategory[];
    /** 최소 신뢰도 */
    minConfidence?: number;
    /** 상세 메모리 포함 여부 */
    includeDetails?: boolean;
}
/**
 * 컨텍스트 주입 생성
 */
export declare function generateContextInjection(options: InjectionOptions): Promise<ContextInjection>;
/**
 * 에이전트별 최적화된 컨텍스트 생성
 */
export declare function generateAgentContext(agent: MemoryOwner, task: string): Promise<string>;
/**
 * 프롬프트에 컨텍스트 삽입
 */
export declare function injectContextIntoPrompt(originalPrompt: string, context: string, position?: 'start' | 'end' | 'after-system'): string;
/**
 * 캐시된 컨텍스트 관리
 */
declare class ContextCache {
    private cache;
    private ttl;
    get(agent: MemoryOwner, taskHash: string): string | null;
    set(agent: MemoryOwner, taskHash: string, context: string): void;
    invalidate(): void;
}
export declare const contextCache: ContextCache;
/**
 * 캐시된 컨텍스트 생성
 */
export declare function getCachedAgentContext(agent: MemoryOwner, task: string): Promise<string>;
export {};
//# sourceMappingURL=injector.d.ts.map