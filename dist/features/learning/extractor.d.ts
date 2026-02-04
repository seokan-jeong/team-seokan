/**
 * Learning Extractor
 * 상호작용에서 학습 포인트 추출
 */
import type { CreateMemoryInput, MemoryCategory, MemoryScope, MemoryOwner, LearningExtraction } from '../memory/types';
/**
 * 작업 결과 타입
 */
export interface TaskResult {
    taskId: string;
    description: string;
    success: boolean;
    agent: MemoryOwner;
    filesModified: string[];
    codeChanges: CodeChange[];
    userFeedback?: string;
    duration: number;
    errors: string[];
    context: Record<string, unknown>;
}
/**
 * 코드 변경 정보
 */
export interface CodeChange {
    filePath: string;
    changeType: 'create' | 'modify' | 'delete';
    language: string;
    linesAdded: number;
    linesRemoved: number;
    summary: string;
}
/**
 * 학습 추출 실행
 */
export declare function extractLearnings(result: TaskResult): LearningExtraction;
/**
 * 간단한 학습 생성 (명시적 학습용)
 */
export declare function createSimpleLearning(content: string, options?: {
    category?: MemoryCategory;
    scope?: MemoryScope;
    owner?: MemoryOwner;
    tags?: string[];
    source?: string;
}): CreateMemoryInput;
/**
 * 코드 변경에서 학습 추출
 */
export declare function extractFromCodeChanges(changes: CodeChange[]): CreateMemoryInput[];
//# sourceMappingURL=extractor.d.ts.map