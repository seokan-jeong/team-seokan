export type AgentCategory = 'orchestration' | 'execution' | 'specialist' | 'advisor' | 'exploration' | 'utility';
export type AgentCost = 'FREE' | 'CHEAP' | 'EXPENSIVE';
export type ModelTier = 'opus' | 'sonnet' | 'haiku';
export type BuiltinAgentName = 'shinnosuke' | 'himawari' | 'bo' | 'kazama' | 'aichan' | 'bunta' | 'masao' | 'hiroshi' | 'nene' | 'misae' | 'actionkamen' | 'shiro' | 'masumi' | 'ume' | 'midori';
export interface AgentPromptMetadata {
    name: BuiltinAgentName;
    displayName: string;
    character: string;
    role: string;
    category: AgentCategory;
    cost: AgentCost;
    model: ModelTier;
    description: string;
    delegationTriggers: string[];
    allowedTools?: string[];
    disallowedTools?: string[];
    isReadOnly: boolean;
}
export interface AgentConfig {
    name: BuiltinAgentName;
    systemPrompt: string;
    metadata: AgentPromptMetadata;
    overrides?: AgentOverrideConfig;
}
export interface AgentOverrideConfig {
    model?: ModelTier;
    promptAppend?: string;
    allowedTools?: string[];
    disallowedTools?: string[];
    disabled?: boolean;
}
export type HookEvent = 'PreToolUse' | 'PostToolUse' | 'UserPromptSubmit' | 'Stop' | 'SessionStart' | 'SessionEnd' | 'onSummarize' | 'chat.message' | 'tool.execute.before' | 'tool.execute.after' | 'event';
export interface HookConfig {
    name: string;
    event: HookEvent;
    description: string;
    enabled: boolean;
    priority: number;
    matchTools?: string[];
    handler: HookHandler;
}
export type HookHandler = (context: HookContext) => Promise<HookResult>;
export interface HookContext {
    event: HookEvent;
    toolName?: string;
    toolInput?: unknown;
    toolOutput?: unknown;
    message?: string;
    todos?: TodoItem[];
    sessionState?: SessionState;
}
export interface HookResult {
    continue: boolean;
    modified?: boolean;
    message?: string;
    inject?: string;
}
export interface ToolConfig {
    name: string;
    description: string;
    parameters: ToolParameter[];
    handler: ToolHandler;
}
export interface ToolParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description: string;
    required: boolean;
    default?: unknown;
}
export type ToolHandler = (params: Record<string, unknown>) => Promise<ToolResult>;
export interface ToolResult {
    success: boolean;
    output?: unknown;
    error?: string;
}
export interface SkillConfig {
    name: string;
    displayName: string;
    description: string;
    triggers: string[];
    autoActivate: boolean;
    handler: SkillHandler;
}
export type SkillHandler = (context: SkillContext) => Promise<SkillResult>;
export interface SkillContext {
    args?: string;
    message: string;
    sessionState: SessionState;
}
export interface SkillResult {
    success: boolean;
    output?: string;
    inject?: string;
}
export interface SessionState {
    sessionId: string;
    startTime: Date;
    messageCount: number;
    contextUsage: number;
    activeAgent?: BuiltinAgentName;
    activeSkill?: string;
    ralphLoopActive: boolean;
    ultraworkActive: boolean;
    autopilotActive: boolean;
    todos: TodoItem[];
    backgroundTasks: BackgroundTask[];
    lastAgent?: BuiltinAgentName;
    taskStartTime?: number;
    memoryInitialized?: boolean;
    shouldRunBootstrap?: boolean;
    lastAgentOutput?: string;
    debateActive?: boolean;
    debateRound?: number;
    debateMaxRounds?: number;
    debateParticipants?: BuiltinAgentName[];
    debateTopic?: string;
    debateOpinions?: DebateOpinion[];
}
export interface TodoItem {
    id: string;
    content: string;
    status: 'pending' | 'in_progress' | 'completed';
    activeForm: string;
    createdAt: Date;
    completedAt?: Date;
}
export interface BackgroundTask {
    id: string;
    agentName: BuiltinAgentName;
    description: string;
    status: 'running' | 'completed' | 'failed';
    startTime: Date;
    endTime?: Date;
    result?: unknown;
}
export interface DebateOpinion {
    agent: BuiltinAgentName;
    round: number;
    opinion: string;
    pros: string[];
    cons: string[];
    recommendation: string;
    timestamp: Date;
}
export interface DebateResult {
    topic: string;
    participants: BuiltinAgentName[];
    rounds: number;
    opinions: DebateOpinion[];
    consensus: string;
    rationale: string[];
    alternatives: {
        option: string;
        reason: string;
    }[];
    verified: boolean;
    verificationResult?: string;
}
export interface PluginSettings {
    defaultModel: ModelTier;
    maxConcurrentAgents: number;
    maxRetries: number;
    contextWarningThreshold: number;
    enableRalphLoop: boolean;
    enableTodoEnforcer: boolean;
    enableIntentGate: boolean;
    enableReviewerCheck: boolean;
    language: 'ko' | 'en';
    agentOverrides?: Record<BuiltinAgentName, AgentOverrideConfig>;
    disabledHooks?: string[];
    disabledSkills?: string[];
}
export interface PluginContext {
    settings: PluginSettings;
    sessionState: SessionState;
    agents: Map<BuiltinAgentName, AgentConfig>;
    hooks: Map<string, HookConfig>;
    tools: Map<string, ToolConfig>;
    skills: Map<string, SkillConfig>;
}
export interface PluginEvent {
    type: 'session.created' | 'session.deleted' | 'error' | 'notification';
    payload: unknown;
    timestamp: Date;
}
export interface DelegationRequest {
    targetAgent: BuiltinAgentName;
    task: string;
    context?: string;
    runInBackground?: boolean;
    waitForResult?: boolean;
}
export interface DelegationResult {
    success: boolean;
    agentName: BuiltinAgentName;
    output?: string;
    error?: string;
    duration?: number;
}
//# sourceMappingURL=index.d.ts.map