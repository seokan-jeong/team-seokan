#!/bin/bash
# Team-Shinchan Commit Lint — Programmatic PreToolUse Hook (Bash matcher)
# Enforces Git R-1: Conventional Commit Messages
# Validates commit messages match: type(scope): description
#
# Stdin: {"tool_name":"Bash","tool_input":{"command":"git commit -m ..."}}
# Stdout: {"decision":"block","reason":"..."} or empty (allow)
set -eo pipefail

INPUT=$(cat)
if [ -z "$INPUT" ]; then
  exit 0
fi

RESULT=$(echo "$INPUT" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(chunks.join('')); } catch(e) { process.exit(0); }

  const toolName = input.tool_name || '';
  const command = (input.tool_input || {}).command || '';

  // Only check git commit commands
  if (toolName !== 'Bash' || !/git\s+commit/.test(command)) process.exit(0);

  // Extract message from -m flag (single or double quotes, or heredoc)
  const msgMatch = command.match(/-m\s+['\"](.+?)['\"]/s);
  if (!msgMatch) process.exit(0); // No -m flag or heredoc — skip

  const msg = msgMatch[1];
  const subjectLine = msg.split('\n')[0].trim();

  // Skip Co-Authored-By only commits
  if (/^Co-Authored-By:/i.test(subjectLine)) process.exit(0);

  // Validate conventional commit format
  const pattern = /^(feat|fix|chore|docs|refactor|test|perf|ci|build|style|revert)(\(.+\))?(!)?:\s.+/;
  if (!pattern.test(subjectLine)) {
    console.log(JSON.stringify({
      decision: 'block',
      reason: 'GIT R-1: Commit message must follow conventional format: type(scope): description. Valid types: feat, fix, chore, docs, refactor, test, perf, ci, build, style, revert. Got: \"' + subjectLine.slice(0, 60) + '\"'
    }));
    return;
  }

  // Check subject line length
  if (subjectLine.length > 72) {
    console.log(JSON.stringify({
      decision: 'block',
      reason: 'GIT R-1: Commit subject line must be 72 characters or fewer (currently ' + subjectLine.length + '). Shorten the description.'
    }));
    return;
  }

  process.exit(0);
});
" 2>/dev/null || true)

if [ -n "$RESULT" ]; then
  echo "$RESULT"
fi

exit 0
