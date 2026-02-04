/**
 * Team-Shinchan Agent System
 */
import type { AgentConfig, PluginSettings, BuiltinAgentName } from '../types';
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
export declare function createBuiltinAgents(settings: PluginSettings): Promise<AgentConfig[]>;
export declare function getAgentByName(agents: AgentConfig[], name: BuiltinAgentName): AgentConfig | undefined;
export declare function isReadOnlyAgent(name: BuiltinAgentName): boolean;
export declare function getAgentModel(name: BuiltinAgentName, settings: PluginSettings): string;
export { createShinnosukeAgent, createHimawariAgent, createBoAgent, createKazamaAgent, createAichanAgent, createBuntaAgent, createMasaoAgent, createHiroshiAgent, createNeneAgent, createMisaeAgent, createActionKamenAgent, createShiroAgent, createMasumiAgent, createUmeAgent, createMidoriAgent, };
//# sourceMappingURL=index.d.ts.map