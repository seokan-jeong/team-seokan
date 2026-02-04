/**
 * Best Practices
 * 언어/프레임워크별 기본 베스트 프랙티스
 */
import type { CreateMemoryInput, MemoryCategory } from '../memory/types';
/**
 * 해당하는 베스트 프랙티스 가져오기
 */
export declare function getBestPractices(languages: string[], frameworks: string[]): CreateMemoryInput[];
/**
 * 카테고리별 베스트 프랙티스
 */
export declare function getBestPracticesByCategory(category: MemoryCategory, languages: string[], frameworks: string[]): CreateMemoryInput[];
/**
 * 베스트 프랙티스 요약
 */
export declare function summarizeBestPractices(practices: CreateMemoryInput[]): string;
/**
 * 기본 베스트 프랙티스 (언어/프레임워크 무관)
 */
export declare function getDefaultBestPractices(): CreateMemoryInput[];
//# sourceMappingURL=best-practices.d.ts.map