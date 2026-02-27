#!/bin/bash
# Team-Shinchan Layer Guard — Programmatic PreToolUse Hook (Task only)
# Blocks Task calls that violate layer dependency rules.
#
# Stdin: {"tool_name":"Task","tool_input":{"subagent_type":"team-shinchan:bo",...}}
# Stdout: {"decision":"block","reason":"..."} or empty (allow)
set -eo pipefail

INPUT=$(cat)
if [ -z "$INPUT" ]; then
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LAYER_MAP="${SCRIPT_DIR}/../agents/_shared/layer-map.json"
CURRENT_AGENT_FILE="${PWD}/.shinchan-docs/.current-agent"

if [ ! -f "$LAYER_MAP" ]; then
  # No layer map — graceful degradation, allow
  exit 0
fi

RESULT=$(echo "$INPUT" | LAYER_MAP="$LAYER_MAP" CURRENT_AGENT_FILE="$CURRENT_AGENT_FILE" node -e "
const fs = require('fs');
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(chunks.join('')); } catch(e) { process.exit(0); }

  const toolName = input.tool_name || '';
  if (toolName !== 'Task') { process.exit(0); }

  const toolInput = input.tool_input || {};
  const subagentType = toolInput.subagent_type || '';

  // Only check team-shinchan agents
  if (!subagentType.startsWith('team-shinchan:')) { process.exit(0); }

  const targetAgent = subagentType.split(':').pop();

  // Load layer map
  let layerMap;
  try {
    layerMap = JSON.parse(fs.readFileSync(process.env.LAYER_MAP, 'utf-8'));
  } catch(e) { process.exit(0); }

  // Determine source agent
  let sourceAgent = 'shinnosuke'; // default: orchestrator
  try {
    const ca = fs.readFileSync(process.env.CURRENT_AGENT_FILE, 'utf-8').trim();
    if (ca) sourceAgent = ca;
  } catch(e) { /* use default */ }

  // Find layers
  const layers = layerMap.layers || {};
  let sourceLayer = null;
  let targetLayer = null;

  for (const [layer, agents] of Object.entries(layers)) {
    if (agents.includes(sourceAgent)) sourceLayer = layer;
    if (agents.includes(targetAgent)) targetLayer = layer;
  }

  // If either agent is not in the layer map, allow (external agents)
  if (!sourceLayer || !targetLayer) { process.exit(0); }

  // Same layer — allow
  if (sourceLayer === targetLayer) { process.exit(0); }

  // Check allowed_calls
  const allowed = (layerMap.allowed_calls || {})[sourceLayer] || [];
  if (allowed.includes(targetLayer)) { process.exit(0); }

  // Check exceptions
  const exceptions = layerMap.exceptions || [];
  for (const exc of exceptions) {
    if (exc.from === sourceLayer && exc.to === targetLayer && exc.agent === targetAgent) {
      process.exit(0); // Exception matches — allow
    }
  }

  // Violation — block
  console.log(JSON.stringify({
    decision: 'block',
    reason: 'LAYER VIOLATION: ' + sourceAgent + '(' + sourceLayer + ') cannot call ' + targetAgent + '(' + targetLayer + '). Allowed targets for ' + sourceLayer + ': [' + allowed.join(', ') + ']'
  }));
});
" 2>/dev/null || true)

if [ -n "$RESULT" ]; then
  echo "$RESULT"
fi

exit 0
