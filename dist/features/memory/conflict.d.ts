/**
 * Memory Conflict Resolution
 * 메모리 충돌 해결
 */
import type { MemoryEntry, CreateMemoryInput, MemoryConflict, ConflictResolution } from './types';
/**
 * 충돌 감지
 */
export declare function detectConflict(existing: MemoryEntry, incoming: CreateMemoryInput): MemoryConflict | null;
/**
 * 충돌 해결
 * 기본 전략: 최신 우선 + 신뢰도 점수 기반
 */
export declare function resolveConflict(conflict: MemoryConflict): ConflictResolution;
/**
 * 메모리 병합
 */
export declare function mergeMemories(existing: MemoryEntry, incoming: CreateMemoryInput): MemoryEntry;
/**
 * 배치 충돌 검사
 */
export declare function detectBatchConflicts(existingMemories: MemoryEntry[], incoming: CreateMemoryInput): MemoryConflict[];
/**
 * 자동 충돌 해결
 */
export declare function autoResolveConflicts(conflicts: MemoryConflict[]): Map<string, ConflictResolution>;
/**
 * 충돌 심각도 계산
 */
export declare function calculateConflictSeverity(conflict: MemoryConflict): 'low' | 'medium' | 'high';
//# sourceMappingURL=conflict.d.ts.map