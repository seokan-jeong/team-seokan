/**
 * Memory Storage
 * 파일 기반 메모리 저장소
 */
import type { MemoryEntry, MemoryCategory, MemoryScope, MemoryOwner, MemoryStorageConfig } from './types';
/**
 * 메모리를 마크다운 형식으로 변환
 */
export declare function memoryToMarkdown(memory: MemoryEntry): string;
/**
 * 마크다운에서 메모리 파싱
 */
export declare function markdownToMemory(markdown: string, scope: MemoryScope): MemoryEntry | null;
/**
 * 경로 확장 (~ 처리)
 */
export declare function expandPath(filePath: string): string;
/**
 * 단일 학습 파일 이름 반환
 */
export declare function getLearningFileName(): string;
/**
 * 메모리 저장소 클래스
 */
export declare class MemoryStorage {
    private config;
    private globalPath;
    private projectPath;
    constructor(config?: Partial<MemoryStorageConfig>);
    /**
     * 디렉토리 초기화
     */
    initialize(): Promise<void>;
    /**
     * 디렉토리 존재 확인 및 생성
     */
    private ensureDirectory;
    /**
     * 스코프에 따른 기본 경로 반환
     */
    getBasePath(scope: MemoryScope): string;
    /**
     * 메모리 파일 경로 반환
     */
    getMemoryFilePath(scope: MemoryScope, owner?: MemoryOwner): string;
    /**
     * 파일에서 메모리 로드
     */
    loadFromFile(filePath: string, scope: MemoryScope): Promise<MemoryEntry[]>;
    /**
     * 파일에 메모리 저장
     */
    saveToFile(filePath: string, memories: MemoryEntry[]): Promise<void>;
    /**
     * 모든 메모리 로드 (글로벌 + 프로젝트)
     */
    loadAllMemories(): Promise<{
        global: MemoryEntry[];
        project: MemoryEntry[];
    }>;
    /**
     * 메모리 저장
     */
    saveMemory(memory: MemoryEntry): Promise<void>;
    /**
     * 메모리 삭제
     */
    deleteMemory(memoryId: string, scope: MemoryScope): Promise<boolean>;
    /**
     * 백업 생성
     */
    createBackup(): Promise<string>;
    /**
     * 설정 반환
     */
    getConfig(): MemoryStorageConfig;
}
export declare function getDefaultStorage(): MemoryStorage;
export declare function setDefaultStorage(storage: MemoryStorage): void;
//# sourceMappingURL=storage.d.ts.map