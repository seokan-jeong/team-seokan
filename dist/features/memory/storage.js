/**
 * Memory Storage
 * 파일 기반 메모리 저장소
 */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
/**
 * 메모리를 마크다운 형식으로 변환
 */
export function memoryToMarkdown(memory) {
    const tags = memory.tags.length > 0 ? memory.tags.map((t) => `#${t}`).join(' ') : '';
    const sources = memory.sources.length > 0 ? memory.sources.join(', ') : 'unknown';
    return `## [${memory.createdAt.toISOString().split('T')[0]}] ${memory.title}
- **ID**: ${memory.id}
- **내용**: ${memory.content}
- **카테고리**: ${memory.category}
- **신뢰도**: ${memory.confidence.toFixed(2)}
- **출처**: ${sources}
- **태그**: ${tags}
- **감쇠**: ${memory.decayFactor.toFixed(2)}
- **강화 횟수**: ${memory.reinforcementCount}
- **반박 횟수**: ${memory.contradictionCount}
- **접근 횟수**: ${memory.accessCount}
- **마지막 접근**: ${memory.lastAccessedAt.toISOString()}
- **업데이트**: ${memory.updatedAt.toISOString()}
`;
}
/**
 * 마크다운에서 메모리 파싱
 */
export function markdownToMemory(markdown, scope) {
    try {
        const idMatch = markdown.match(/- \*\*ID\*\*: (.+)/);
        const titleMatch = markdown.match(/## \[.+\] (.+)/);
        const contentMatch = markdown.match(/- \*\*내용\*\*: (.+)/);
        const categoryMatch = markdown.match(/- \*\*카테고리\*\*: (.+)/);
        const confidenceMatch = markdown.match(/- \*\*신뢰도\*\*: (.+)/);
        const sourcesMatch = markdown.match(/- \*\*출처\*\*: (.+)/);
        const tagsMatch = markdown.match(/- \*\*태그\*\*: (.+)/);
        const decayMatch = markdown.match(/- \*\*감쇠\*\*: (.+)/);
        const reinforcementMatch = markdown.match(/- \*\*강화 횟수\*\*: (.+)/);
        const contradictionMatch = markdown.match(/- \*\*반박 횟수\*\*: (.+)/);
        const accessCountMatch = markdown.match(/- \*\*접근 횟수\*\*: (.+)/);
        const lastAccessMatch = markdown.match(/- \*\*마지막 접근\*\*: (.+)/);
        const updatedMatch = markdown.match(/- \*\*업데이트\*\*: (.+)/);
        const dateMatch = markdown.match(/## \[(\d{4}-\d{2}-\d{2})\]/);
        if (!idMatch || !titleMatch || !contentMatch) {
            return null;
        }
        const tags = tagsMatch?.[1]
            ? tagsMatch[1]
                .split(' ')
                .filter((t) => t.startsWith('#'))
                .map((t) => t.slice(1))
            : [];
        const sources = sourcesMatch?.[1] && sourcesMatch[1] !== 'unknown' ? sourcesMatch[1].split(', ') : [];
        return {
            id: idMatch[1].trim(),
            title: titleMatch[1].trim(),
            content: contentMatch[1].trim(),
            category: (categoryMatch?.[1]?.trim() || 'insight'),
            scope,
            owner: 'shared',
            confidence: parseFloat(confidenceMatch?.[1] || '0.5'),
            tags,
            sources,
            createdAt: dateMatch ? new Date(dateMatch[1]) : new Date(),
            updatedAt: updatedMatch ? new Date(updatedMatch[1]) : new Date(),
            lastAccessedAt: lastAccessMatch ? new Date(lastAccessMatch[1]) : new Date(),
            accessCount: parseInt(accessCountMatch?.[1] || '0', 10),
            reinforcementCount: parseInt(reinforcementMatch?.[1] || '0', 10),
            decayFactor: parseFloat(decayMatch?.[1] || '1.0'),
            contradictionCount: parseInt(contradictionMatch?.[1] || '0', 10),
            relatedMemories: [],
            metadata: {},
        };
    }
    catch {
        return null;
    }
}
/**
 * 경로 확장 (~ 처리)
 */
export function expandPath(filePath) {
    if (filePath.startsWith('~')) {
        return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
}
/**
 * 단일 학습 파일 이름 반환
 */
export function getLearningFileName() {
    return 'learnings.md';
}
/**
 * 메모리 저장소 클래스
 */
export class MemoryStorage {
    config;
    globalPath;
    projectPath;
    constructor(config = {}) {
        this.config = {
            globalPath: config.globalPath || '~/.team-shinchan',
            projectPath: config.projectPath || '.team-shinchan',
            maxEntries: config.maxEntries || 500,
            decayThreshold: config.decayThreshold || 0.1,
            confidenceThreshold: config.confidenceThreshold || 0.3,
            autoBackup: config.autoBackup ?? true,
        };
        this.globalPath = expandPath(this.config.globalPath);
        this.projectPath = this.config.projectPath;
    }
    /**
     * 디렉토리 초기화
     */
    async initialize() {
        // 글로벌 메모리 디렉토리 생성
        await this.ensureDirectory(this.globalPath);
        await this.ensureDirectory(path.join(this.globalPath, 'agents'));
        // 프로젝트 메모리 디렉토리 생성 (프로젝트 루트에 있을 때만)
        if (fs.existsSync(this.projectPath) || fs.existsSync('.git') || fs.existsSync('package.json')) {
            await this.ensureDirectory(this.projectPath);
            await this.ensureDirectory(path.join(this.projectPath, 'agents'));
        }
    }
    /**
     * 디렉토리 존재 확인 및 생성
     */
    async ensureDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    /**
     * 스코프에 따른 기본 경로 반환
     */
    getBasePath(scope) {
        return scope === 'global' ? this.globalPath : this.projectPath;
    }
    /**
     * 메모리 파일 경로 반환
     */
    getMemoryFilePath(scope, owner = 'shared') {
        const basePath = this.getBasePath(scope);
        if (owner === 'shared') {
            return path.join(basePath, getLearningFileName());
        }
        else {
            return path.join(basePath, 'agents', `${owner}.md`);
        }
    }
    /**
     * 파일에서 메모리 로드
     */
    async loadFromFile(filePath, scope) {
        const fullPath = expandPath(filePath);
        if (!fs.existsSync(fullPath)) {
            return [];
        }
        try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const sections = content.split(/(?=## \[)/);
            const memories = [];
            for (const section of sections) {
                if (section.trim()) {
                    const memory = markdownToMemory(section, scope);
                    if (memory) {
                        memories.push(memory);
                    }
                }
            }
            return memories;
        }
        catch (error) {
            console.error(`Failed to load memories from ${fullPath}:`, error);
            return [];
        }
    }
    /**
     * 파일에 메모리 저장 (카테고리별 섹션으로)
     */
    async saveToFile(filePath, memories) {
        const fullPath = expandPath(filePath);
        const dirPath = path.dirname(fullPath);
        await this.ensureDirectory(dirPath);

        // 카테고리별로 그룹화
        const categories = ['preference', 'pattern', 'context', 'mistake', 'decision', 'convention', 'insight'];
        const categoryNames = {
            preference: 'Preferences',
            pattern: 'Patterns',
            context: 'Context',
            mistake: 'Mistakes',
            decision: 'Decisions',
            convention: 'Conventions',
            insight: 'Insights'
        };

        const header = `# Team-Shinchan Learnings
> 자동 생성된 메모리 파일입니다. 직접 수정하지 마세요.
> 마지막 업데이트: ${new Date().toISOString()}

`;

        let content = header;

        for (const category of categories) {
            const categoryMemories = memories.filter(m => m.category === category);
            if (categoryMemories.length > 0) {
                content += `\n## ${categoryNames[category]}\n\n`;
                const sortedMemories = [...categoryMemories].sort((a, b) => b.confidence - a.confidence);
                content += sortedMemories.map((m) => memoryToMarkdown(m)).join('\n---\n\n');
                content += '\n';
            }
        }

        fs.writeFileSync(fullPath, content, 'utf-8');
    }
    /**
     * 모든 메모리 로드 (글로벌 + 프로젝트, 단일 learnings.md 파일에서)
     */
    async loadAllMemories() {
        const globalMemories = [];
        const projectMemories = [];

        // 글로벌 메모리 로드 (learnings.md에서)
        const globalFilePath = this.getMemoryFilePath('global');
        const globalLearnings = await this.loadFromFile(globalFilePath, 'global');
        globalMemories.push(...globalLearnings);

        // 글로벌 에이전트별 메모리 로드
        const agentsDir = path.join(this.globalPath, 'agents');
        if (fs.existsSync(agentsDir)) {
            const agentFiles = fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md'));
            for (const file of agentFiles) {
                const memories = await this.loadFromFile(path.join(agentsDir, file), 'global');
                globalMemories.push(...memories);
            }
        }

        // 프로젝트 메모리 로드 (learnings.md에서)
        if (fs.existsSync(this.projectPath)) {
            const projectFilePath = this.getMemoryFilePath('project');
            const projectLearnings = await this.loadFromFile(projectFilePath, 'project');
            projectMemories.push(...projectLearnings);

            // 프로젝트 에이전트별 메모리 로드
            const projectAgentsDir = path.join(this.projectPath, 'agents');
            if (fs.existsSync(projectAgentsDir)) {
                const agentFiles = fs.readdirSync(projectAgentsDir).filter((f) => f.endsWith('.md'));
                for (const file of agentFiles) {
                    const memories = await this.loadFromFile(path.join(projectAgentsDir, file), 'project');
                    projectMemories.push(...memories);
                }
            }
        }

        return { global: globalMemories, project: projectMemories };
    }
    /**
     * 메모리 저장 (단일 learnings.md 파일에)
     */
    async saveMemory(memory) {
        const filePath = this.getMemoryFilePath(memory.scope, memory.owner);
        const existingMemories = await this.loadFromFile(filePath, memory.scope);
        // 기존 메모리 업데이트 또는 추가
        const index = existingMemories.findIndex((m) => m.id === memory.id);
        if (index >= 0) {
            existingMemories[index] = memory;
        }
        else {
            existingMemories.push(memory);
        }
        await this.saveToFile(filePath, existingMemories);
    }
    /**
     * 메모리 삭제 (단일 learnings.md 파일에서)
     */
    async deleteMemory(memoryId, scope) {
        const { global: globalMemories, project: projectMemories } = await this.loadAllMemories();
        const memories = scope === 'global' ? globalMemories : projectMemories;
        const memory = memories.find((m) => m.id === memoryId);
        if (!memory) {
            return false;
        }
        const filePath = this.getMemoryFilePath(scope, memory.owner);
        const fileMemories = await this.loadFromFile(filePath, scope);
        const filtered = fileMemories.filter((m) => m.id !== memoryId);
        await this.saveToFile(filePath, filtered);
        return true;
    }
    /**
     * 백업 생성
     */
    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(this.globalPath, 'backups', timestamp);
        await this.ensureDirectory(backupDir);
        // 글로벌 메모리 백업
        const files = fs.readdirSync(this.globalPath).filter((f) => f.endsWith('.md'));
        for (const file of files) {
            const src = path.join(this.globalPath, file);
            const dest = path.join(backupDir, file);
            fs.copyFileSync(src, dest);
        }
        return backupDir;
    }
    /**
     * 설정 반환
     */
    getConfig() {
        return { ...this.config };
    }
}
/**
 * 기본 저장소 인스턴스
 */
let defaultStorage = null;
export function getDefaultStorage() {
    if (!defaultStorage) {
        defaultStorage = new MemoryStorage();
    }
    return defaultStorage;
}
export function setDefaultStorage(storage) {
    defaultStorage = storage;
}
