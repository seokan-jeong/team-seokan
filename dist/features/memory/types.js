/**
 * Memory System Types
 * 에이전트 학습 및 메모리 시스템의 타입 정의
 */
/**
 * 기본 설정
 */
export const DEFAULT_MEMORY_CONFIG = {
    globalPath: '~/.team-shinchan',
    projectPath: '.team-shinchan',
    maxEntries: 500,
    decayThreshold: 0.1,
    confidenceThreshold: 0.3,
    autoBackup: true,
};
/**
 * 기본 감쇠 설정
 */
export const DECAY_CONFIG = {
    /** 일일 감쇠율 */
    dailyDecayRate: 0.01,
    /** 반박 시 감쇠 가속 */
    contradictionDecayMultiplier: 2.0,
    /** 접근 시 감쇠 회복 */
    accessRecoveryRate: 0.05,
    /** 강화 시 신뢰도 증가 */
    reinforcementBoost: 0.1,
    /** 최대 신뢰도 */
    maxConfidence: 1.0,
    /** 최소 신뢰도 */
    minConfidence: 0.0,
};
