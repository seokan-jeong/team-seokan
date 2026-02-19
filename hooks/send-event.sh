#!/bin/bash
# Team-Shinchan Dashboard Event Forwarder
# stdin에서 Claude Code Hook 이벤트 JSON을 읽어서 대시보드 서버로 전송
#
# 사용법: echo '{"agent_type":"team-shinchan:bo"}' | HOOK_EVENT=SubagentStart bash send-event.sh
#
# 환경변수:
#   HOOK_EVENT      - 이벤트 타입 (hooks.json에서 주입)
#   DASHBOARD_URL   - 대시보드 서버 URL (기본값: http://localhost:3333)

DASHBOARD_URL="${DASHBOARD_URL:-http://localhost:3333}"
HOOK_EVENT="${HOOK_EVENT:-unknown}"

# stdin에서 JSON 읽기
INPUT=$(cat)

# 입력이 비어있으면 종료
if [ -z "$INPUT" ]; then
  exit 0
fi

# node가 있으면 node로 변환, 없으면 raw 전달
if command -v node &>/dev/null; then
  PAYLOAD=$(echo "$INPUT" | HOOK_EVENT="$HOOK_EVENT" node -e "
    const chunks = [];
    process.stdin.on('data', c => chunks.push(c));
    process.stdin.on('end', () => {
      let input;
      try {
        input = JSON.parse(chunks.join(''));
      } catch (e) {
        // JSON 파싱 실패 시 빈 객체로 처리
        input = {};
      }

      const event = process.env.HOOK_EVENT || 'unknown';

      // agent_type에서 에이전트 ID 추출
      // 예: 'team-shinchan:bo' -> 'bo'
      const extractAgent = (t) => (t ? t.split(':').pop() : null);

      let output = {};

      switch (event) {
        case 'SubagentStart':
          output = {
            type: 'agent_start',
            agent: extractAgent(input.agent_type),
          };
          break;

        case 'SubagentStop':
          output = {
            type: 'agent_done',
            agent: extractAgent(input.agent_type),
            content: (input.last_assistant_message || '').slice(0, 500),
          };
          break;

        case 'PostToolUse':
          // Task 툴 호출 = 에이전트 위임
          if (input.tool_name === 'Task' && input.tool_input && input.tool_input.subagent_type) {
            output = {
              type: 'delegation',
              from: 'shinnosuke',
              to: extractAgent(input.tool_input.subagent_type),
              content: (input.tool_input.prompt || '').slice(0, 200),
            };
          } else {
            output = {
              type: 'tool_use',
              agent: 'unknown',
              content: input.tool_name || 'unknown',
            };
          }
          break;

        case 'UserPromptSubmit':
          output = {
            type: 'user_prompt',
            content: (input.prompt || '').slice(0, 500),
          };
          break;

        case 'Stop':
          output = {
            type: 'stop',
            content: (input.last_assistant_message || '').slice(0, 500),
          };
          break;

        case 'SessionStart':
          output = {
            type: 'session_start',
            content: 'Session started (model: ' + (input.model || 'unknown') + ')',
          };
          break;

        case 'SessionEnd':
          output = {
            type: 'session_end',
            content: 'Session ended: ' + (input.reason || 'unknown'),
          };
          break;

        default:
          output = {
            type: event.toLowerCase(),
            content: JSON.stringify(input).slice(0, 200),
          };
      }

      console.log(JSON.stringify(output));
    });
  " 2>/dev/null)
else
  # node 없으면 이벤트 타입과 raw 입력을 그대로 전달
  PAYLOAD="{\"type\":\"${HOOK_EVENT}\",\"content\":$(echo "$INPUT" | head -c 500)}"
fi

# 페이로드가 비어있으면 종료
if [ -z "$PAYLOAD" ]; then
  exit 0
fi

# 비동기로 전송 (실패해도 무시 - 훅 실패가 Claude Code를 방해하면 안 됨)
curl -s -X POST "${DASHBOARD_URL}/api/events" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  --connect-timeout 2 \
  --max-time 4 \
  > /dev/null 2>&1 &

exit 0
