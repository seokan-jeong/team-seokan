/**
 * Memory Injector Hook
 * 에이전트 실행 전 관련 메모리 주입
 */
import type { HookConfig, PluginContext } from '../types';
export declare function createMemoryInjectorHook(context: PluginContext): HookConfig;
/**
 * 세션 시작 시 메모리 초기화 훅
 */
export declare function createMemoryInitHook(pluginContext: PluginContext): HookConfig;
//# sourceMappingURL=memory-injector.d.ts.map