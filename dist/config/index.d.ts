/**
 * Team-Shinchan 설정 시스템
 */
import type { PluginSettings, ModelTier, BuiltinAgentName } from '../types';
export declare function createDefaultSettings(): PluginSettings;
export declare function loadPluginConfig(): Promise<PluginSettings>;
export declare const AGENT_MODEL_MAP: Record<BuiltinAgentName, ModelTier>;
export declare const READ_ONLY_AGENTS: BuiltinAgentName[];
export declare const AGENT_CATEGORIES: {
    readonly orchestration: readonly ["shinnosuke", "himawari"];
    readonly execution: readonly ["bo", "kazama"];
    readonly specialist: readonly ["aichan", "bunta", "masao"];
    readonly advisor: readonly ["hiroshi", "nene", "misae", "actionkamen"];
    readonly exploration: readonly ["shiro", "masumi"];
    readonly utility: readonly ["ume"];
};
export declare const SKILL_TRIGGERS: {
    readonly ultrawork: readonly ["ulw", "ultrawork", "병렬", "빠르게", "parallel"];
    readonly ralph: readonly ["ralph", "끝까지", "완료할 때까지", "dont stop", "don't stop"];
    readonly autopilot: readonly ["autopilot", "자동으로", "알아서", "auto"];
    readonly plan: readonly ["plan", "계획", "설계", "planning"];
    readonly analyze: readonly ["analyze", "분석", "디버깅", "왜 안", "debug", "investigate"];
    readonly deepsearch: readonly ["deepsearch", "깊은검색", "찾아줘", "search"];
    readonly debate: readonly ["debate", "토론", "의견", "논의", "장단점", "비교", "어떤 방법"];
    readonly 'git-master': readonly ["commit", "push", "merge", "rebase", "git"];
    readonly 'frontend-ui-ux': readonly ["UI", "UX", "컴포넌트", "스타일", "CSS", "component"];
    readonly cancel: readonly ["cancel", "취소", "중단", "stop", "멈춰"];
};
//# sourceMappingURL=index.d.ts.map