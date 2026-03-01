#!/bin/bash
# Team-Shinchan Deny List Check — Programmatic PreToolUse Hook
# Blocks tool calls matching patterns in deny-list.json
#
# Stdin: {"tool_name":"...","tool_input":{...}}
# Stdout: {"decision":"block","reason":"..."} or empty (allow)
set -eo pipefail

INPUT=$(cat)
if [ -z "$INPUT" ]; then
  exit 0
fi

# Resolve deny-list.json path
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
DENY_LIST="${SCRIPT_DIR}/deny-list.json"

if [ ! -f "$DENY_LIST" ]; then
  exit 0
fi

RESULT=$(echo "$INPUT" | DENY_LIST="$DENY_LIST" node -e "
const fs = require('fs');
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(chunks.join('')); } catch(e) { process.exit(0); }

  const toolName = input.tool_name || '';
  const toolInput = input.tool_input || {};
  const command = toolInput.command || '';
  const filePath = toolInput.file_path || '';

  // Load deny list
  let rules;
  try {
    rules = JSON.parse(fs.readFileSync(process.env.DENY_LIST, 'utf-8'));
  } catch(e) { process.exit(0); }

  // Check each rule
  for (const rule of rules) {
    if (rule.tool !== toolName) continue;

    // Determine the string to match against
    let target = '';
    if (toolName === 'Bash') target = command;
    else if (toolName === 'Edit' || toolName === 'Write') target = filePath;
    else target = JSON.stringify(toolInput);

    // Match pattern as regex
    let matched = false;
    try {
      const re = new RegExp(rule.pattern);
      matched = re.test(target);
    } catch(e) {
      // Fallback to substring match
      matched = target.includes(rule.pattern);
    }

    if (matched) {
      console.log(JSON.stringify({
        decision: 'block',
        reason: 'DENY LIST BLOCK: Operation denied. Rule: \"' + rule.pattern + '\" — ' + rule.reason
      }));
      return;
    }
  }

  // No matches — allow
  process.exit(0);
});
" 2>/dev/null || true)

if [ -n "$RESULT" ]; then
  echo "$RESULT"
fi

exit 0
