/**
 * Memory Decay
 * 메모리 감쇠 관리
 */
import type { MemoryEntry } from './types';
/**
 * 시간 기반 감쇠 계산
 */
export declare function calculateTimeDecay(memory: MemoryEntry, now?: Date): number;
/**
 * 반박에 의한 감쇠 계산
 */
export declare function calculateContradictionDecay(memory: MemoryEntry): number;
/**
 * 강화에 의한 신뢰도 증가
 */
export declare function calculateReinforcementBoost(memory: MemoryEntry): number;
/**
 * 접근에 의한 감쇠 회복
 */
export declare function calculateAccessRecovery(accessCount: number): number;
/**
 * 최종 유효 신뢰도 계산
 */
export declare function calculateEffectiveConfidence(memory: MemoryEntry, now?: Date): number;
/**
 * 메모리 감쇠 적용
 */
export declare function applyDecay(memory: MemoryEntry, now?: Date): MemoryEntry;
/**
 * 감쇠된 메모리 필터링 (삭제 대상)
 */
export declare function filterDecayedMemories(memories: MemoryEntry[], threshold?: number): {
    active: MemoryEntry[];
    expired: MemoryEntry[];
};
/**
 * 메모리 강화
 */
export declare function reinforceMemory(memory: MemoryEntry): MemoryEntry;
/**
 * 메모리 반박
 */
export declare function contradictMemory(memory: MemoryEntry): MemoryEntry;
/**
 * 메모리 접근 기록
 */
export declare function recordAccess(memory: MemoryEntry): MemoryEntry;
/**
 * 배치 감쇠 처리
 */
export declare function processBatchDecay(memories: MemoryEntry[], options?: {
    threshold?: number;
    applyChanges?: boolean;
}): {
    processed: MemoryEntry[];
    removed: MemoryEntry[];
    stats: {
        total: number;
        active: number;
        expired: number;
        averageConfidence: number;
    };
};
//# sourceMappingURL=decay.d.ts.map