/**
 * Reflection Engine
 * 작업 완료 후 회고 실행
 */
import type { ReflectionResult } from '../memory/types';
import { type TaskResult } from '../learning/extractor';
/**
 * 회고 깊이 결정 요소
 */
interface ComplexityFactors {
    filesModified: number;
    linesChanged: number;
    errorCount: number;
    duration: number;
    hasUserFeedback: boolean;
    isNewFeature: boolean;
    involvedAgents: number;
}
/**
 * 회고 깊이 수준
 */
export type ReflectionDepth = 'simple' | 'standard' | 'deep';
/**
 * 복잡도 계산
 */
export declare function calculateComplexity(factors: ComplexityFactors): number;
/**
 * 적응형 깊이 결정
 */
export declare function determineDepth(factors: ComplexityFactors): ReflectionDepth;
/**
 * 회고 실행 (메인 함수)
 */
export declare function reflect(result: TaskResult, options?: {
    forceDepth?: ReflectionDepth;
    includeContext?: boolean;
}): ReflectionResult;
/**
 * 배치 회고
 */
export declare function reflectBatch(results: TaskResult[], options?: {
    aggregateLearnings?: boolean;
}): ReflectionResult[];
/**
 * 회고 요약 생성
 */
export declare function summarizeReflection(reflection: ReflectionResult): string;
export {};
//# sourceMappingURL=engine.d.ts.map