/**
 * Learning Categorizer
 * 학습 내용 자동 분류
 */
import type { CreateMemoryInput, MemoryCategory } from '../memory/types';
/**
 * 최적 카테고리 결정
 */
export declare function determineCategory(content: string, title?: string, tags?: string[]): MemoryCategory;
/**
 * 카테고리 신뢰도 계산
 */
export declare function calculateCategoryConfidence(content: string, determinedCategory: MemoryCategory): number;
/**
 * 학습 분류 및 보강
 */
export declare function classifyLearning(input: CreateMemoryInput): CreateMemoryInput;
/**
 * 배치 분류
 */
export declare function classifyBatch(inputs: CreateMemoryInput[]): CreateMemoryInput[];
/**
 * 카테고리 제안
 */
export declare function suggestCategories(content: string): {
    primary: MemoryCategory;
    alternatives: MemoryCategory[];
    scores: Map<MemoryCategory, number>;
};
/**
 * 태그에서 카테고리 힌트 추출
 */
export declare function extractCategoryFromTags(tags: string[]): MemoryCategory | null;
/**
 * 컨텍스트 기반 분류
 */
export declare function classifyWithContext(input: CreateMemoryInput, context: {
    recentCategories?: MemoryCategory[];
    agentType?: string;
    taskType?: string;
}): CreateMemoryInput;
/**
 * 카테고리 통계 분석
 */
export declare function analyzeCategoryDistribution(learnings: CreateMemoryInput[]): Map<MemoryCategory, {
    count: number;
    avgConfidence: number;
}>;
//# sourceMappingURL=categorizer.d.ts.map