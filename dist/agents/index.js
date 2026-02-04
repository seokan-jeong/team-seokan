/**
 * Team-Shinchan Agent System
 */
import { AGENT_MODEL_MAP, READ_ONLY_AGENTS } from '../config';
// Agent factory functions
import { createShinnosukeAgent } from './shinnosuke';
import { createHimawariAgent } from './himawari';
import { createBoAgent } from './bo';
import { createKazamaAgent } from './kazama';
import { createAichanAgent } from './aichan';
import { createBuntaAgent } from './bunta';
import { createMasaoAgent } from './masao';
import { createHiroshiAgent } from './hiroshi';
import { createNeneAgent } from './nene';
import { createMisaeAgent } from './misae';
import { createActionKamenAgent } from './actionkamen';
import { createShiroAgent } from './shiro';
import { createMasumiAgent } from './masumi';
import { createUmeAgent } from './ume';
import { createMidoriAgent } from './midori';
// ============================================================
// Agent Factory Map
// ============================================================
const AGENT_FACTORIES = {
    shinnosuke: createShinnosukeAgent,
    himawari: createHimawariAgent,
    bo: createBoAgent,
    kazama: createKazamaAgent,
    aichan: createAichanAgent,
    bunta: createBuntaAgent,
    masao: createMasaoAgent,
    hiroshi: createHiroshiAgent,
    nene: createNeneAgent,
    misae: createMisaeAgent,
    actionkamen: createActionKamenAgent,
    shiro: createShiroAgent,
    masumi: createMasumiAgent,
    ume: createUmeAgent,
    midori: createMidoriAgent,
};
// ============================================================
// Create all builtin agents
// ============================================================
export async function createBuiltinAgents(settings) {
    const agents = [];
    for (const [name, factory] of Object.entries(AGENT_FACTORIES)) {
        const agentName = name;
        // Skip disabled agents
        if (settings.agentOverrides?.[agentName]?.disabled) {
            continue;
        }
        const agent = factory(settings);
        // Apply overrides
        if (settings.agentOverrides?.[agentName]) {
            const override = settings.agentOverrides[agentName];
            if (override.model) {
                agent.metadata.model = override.model;
            }
            if (override.promptAppend) {
                agent.systemPrompt += '\n\n' + override.promptAppend;
            }
            if (override.allowedTools) {
                agent.metadata.allowedTools = override.allowedTools;
            }
            if (override.disallowedTools) {
                agent.metadata.disallowedTools = override.disallowedTools;
            }
        }
        agents.push(agent);
    }
    return agents;
}
// ============================================================
// Agent lookup
// ============================================================
export function getAgentByName(agents, name) {
    return agents.find((a) => a.name === name);
}
export function isReadOnlyAgent(name) {
    return READ_ONLY_AGENTS.includes(name);
}
export function getAgentModel(name, settings) {
    return settings.agentOverrides?.[name]?.model || AGENT_MODEL_MAP[name];
}
// ============================================================
// Exports
// ============================================================
export { createShinnosukeAgent, createHimawariAgent, createBoAgent, createKazamaAgent, createAichanAgent, createBuntaAgent, createMasaoAgent, createHiroshiAgent, createNeneAgent, createMisaeAgent, createActionKamenAgent, createShiroAgent, createMasumiAgent, createUmeAgent, createMidoriAgent, };
