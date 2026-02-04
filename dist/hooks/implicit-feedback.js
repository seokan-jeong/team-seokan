/**
 * Implicit Feedback Hook
 * 사용자의 암묵적 피드백 감지 및 학습
 */
import { detectImplicitFeedback, extractLearningFromFeedback, } from '../features/learning';
import { getMemoryManager } from '../features/memory';
/**
 * Edit 도구 결과에서 수정 내용 추출
 */
function extractEditFeedback(toolInput, toolOutput, sessionState) {
    const filePath = toolInput.file_path;
    const oldString = toolInput.old_string;
    const newString = toolInput.new_string;
    if (!filePath || !oldString || !newString) {
        return null;
    }
    // 이전 에이전트의 출력과 비교
    const lastAgentOutput = sessionState.lastAgentOutput;
    const lastAgent = sessionState.lastAgent;
    // 에이전트가 작성한 코드를 사용자가 수정한 경우
    if (lastAgentOutput && lastAgentOutput.includes(oldString)) {
        return {
            type: 'modify',
            timestamp: new Date(),
            context: {
                filePath,
                originalContent: oldString,
                modifiedContent: newString,
                agent: lastAgent,
                taskDescription: `${filePath} 수정`,
            },
        };
    }
    return null;
}
/**
 * Bash 도구에서 undo/revert 감지
 */
function detectUndoAction(toolInput, sessionState) {
    const command = toolInput.command;
    if (!command)
        return null;
    // git revert, git checkout, undo 관련 명령 감지
    const undoPatterns = [
        /git\s+(revert|checkout|reset)/i,
        /rm\s+-rf?\s+.*\.(ts|js|tsx|jsx|py)/i, // 코드 파일 삭제
    ];
    for (const pattern of undoPatterns) {
        if (pattern.test(command)) {
            return {
                type: 'undo',
                timestamp: new Date(),
                context: {
                    agent: sessionState.lastAgent,
                    taskDescription: `명령 실행: ${command}`,
                },
            };
        }
    }
    return null;
}
export function createImplicitFeedbackHook(context) {
    return {
        name: 'implicit-feedback',
        event: 'PostToolUse',
        description: '사용자의 수정/거부 행동에서 암묵적 피드백을 감지합니다.',
        enabled: true,
        priority: 40,
        handler: async ({ toolName, toolInput, toolOutput, sessionState, }) => {
            let userAction = null;
            const state = sessionState;
            // Edit 도구 사용 시
            if (toolName === 'Edit' && state) {
                userAction = extractEditFeedback(toolInput, toolOutput, state);
            }
            // Bash 도구에서 undo 감지
            if (toolName === 'Bash' && state) {
                userAction = detectUndoAction(toolInput, state);
            }
            if (!userAction) {
                return { continue: true };
            }
            try {
                // 암묵적 피드백 감지
                const feedback = detectImplicitFeedback(userAction);
                if (!feedback) {
                    return { continue: true };
                }
                // 학습 추출
                const extraction = extractLearningFromFeedback(feedback);
                if (extraction.learnings.length === 0) {
                    return { continue: true };
                }
                // 학습 저장
                const manager = getMemoryManager();
                await manager.initialize();
                for (const learning of extraction.learnings) {
                    await manager.create(learning);
                }
                // 기존 메모리 강화/반박
                for (const id of extraction.reinforceMemoryIds) {
                    await manager.reinforce(id);
                }
                for (const id of extraction.contradictMemoryIds) {
                    await manager.contradict(id);
                }
                return {
                    continue: true,
                    message: `💡 암묵적 피드백 학습됨: ${extraction.learnings[0]?.title || ''}`,
                };
            }
            catch (error) {
                console.error('Implicit feedback error:', error);
                return { continue: true };
            }
        },
    };
}
