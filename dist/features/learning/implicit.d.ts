/**
 * Implicit Feedback Detection
 * 사용자의 암묵적 피드백 감지 및 학습 변환
 */
import type { ImplicitFeedback, MemoryOwner, LearningExtraction } from '../memory/types';
/**
 * 사용자 행동 타입
 */
export interface UserAction {
    type: 'edit' | 'undo' | 'reject' | 'accept' | 'modify' | 'retry';
    timestamp: Date;
    context: {
        filePath?: string;
        originalContent?: string;
        modifiedContent?: string;
        agent?: MemoryOwner;
        taskDescription?: string;
        errorMessage?: string;
    };
}
/**
 * 암묵적 피드백 감지
 */
export declare function detectImplicitFeedback(action: UserAction): ImplicitFeedback | null;
/**
 * 피드백에서 학습 추출
 */
export declare function extractLearningFromFeedback(feedback: ImplicitFeedback): LearningExtraction;
/**
 * 피드백 배치 처리
 */
export declare function processFeedbackBatch(actions: UserAction[]): LearningExtraction;
/**
 * 수정 패턴 분석
 */
export declare function analyzeModificationPatterns(feedbacks: ImplicitFeedback[]): Map<string, number>;
//# sourceMappingURL=implicit.d.ts.map