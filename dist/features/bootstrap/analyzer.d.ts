/**
 * Bootstrap Analyzer
 * 프로젝트 초기 분석 및 컨벤션 감지
 */
import type { CreateMemoryInput, BootstrapResult } from '../memory/types';
/**
 * 프로젝트 정보
 */
export interface ProjectInfo {
    name: string;
    type: 'node' | 'python' | 'go' | 'rust' | 'java' | 'unknown';
    frameworks: string[];
    languages: string[];
    hasTests: boolean;
    hasCI: boolean;
    hasDocs: boolean;
}
/**
 * 파일 구조 분석
 */
export interface StructureAnalysis {
    sourceDir: string | null;
    testDir: string | null;
    configFiles: string[];
    entryPoints: string[];
    patterns: string[];
}
/**
 * 프로젝트 유형 감지
 */
export declare function detectProjectType(rootPath: string): ProjectInfo;
/**
 * 구조 분석
 */
export declare function analyzeStructure(rootPath: string): StructureAnalysis;
/**
 * 컨벤션 감지
 */
export declare function detectConventions(rootPath: string): CreateMemoryInput[];
/**
 * 전체 부트스트랩 분석 실행
 */
export declare function runBootstrapAnalysis(rootPath: string): BootstrapResult;
//# sourceMappingURL=analyzer.d.ts.map