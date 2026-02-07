#!/usr/bin/env node
/**
 * Agent Schema Validator
 * Validates markdown structure of agent definitions
 */

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '../../agents');

// Required sections in agent markdown
const REQUIRED_PATTERNS = [
  { name: 'Name/Title', pattern: /^#\s+.+/m },
  { name: 'Role Description', pattern: /(role|역할|You are|당신은|is the|is an?|specialist|facilitator|moderator|orchestrator|executor|planner|reviewer|explorer|librarian)/i },
  { name: 'Signature Emoji', pattern: /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u },
];

// Forbidden patterns (agents shouldn't have these unless specific role)
const ROLE_RESTRICTIONS = {
  'shiro.md': {
    forbidden: [/Edit|Write|수정|작성/],
    reason: 'Shiro is read-only explorer'
  },
  'hiroshi.md': {
    forbidden: [/Edit|Write|코드.*작성/],
    reason: 'Hiroshi is advisor, not implementer'
  },
  'nene.md': {
    forbidden: [/코드.*작성/],
    reason: 'Nene is planner, not implementer'
  }
};

function validateAgent(filePath) {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors = [];
  const warnings = [];

  // Check required patterns
  REQUIRED_PATTERNS.forEach(({ name, pattern }) => {
    if (!pattern.test(content)) {
      errors.push(`Missing: ${name}`);
    }
  });

  // Check role restrictions
  const restriction = ROLE_RESTRICTIONS[fileName];
  if (restriction) {
    restriction.forbidden.forEach(pattern => {
      if (pattern.test(content)) {
        warnings.push(`Role violation: ${restriction.reason} (found pattern: ${pattern})`);
      }
    });
  }

  // Check for empty or too short content
  if (content.length < 100) {
    errors.push('Content too short (< 100 chars)');
  }

  return {
    file: fileName,
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function runValidation() {
  console.log('========================================');
  console.log('  Agent Schema Validation');
  console.log('========================================\n');

  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
  let hasErrors = false;
  let totalErrors = 0;
  let totalWarnings = 0;

  files.forEach(file => {
    const result = validateAgent(path.join(AGENTS_DIR, file));
    const status = result.valid ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';

    console.log(`${status} ${result.file}`);

    if (result.errors.length > 0) {
      hasErrors = true;
      totalErrors += result.errors.length;
      result.errors.forEach(e => console.log(`    \x1b[31mERROR: ${e}\x1b[0m`));
    }

    if (result.warnings.length > 0) {
      totalWarnings += result.warnings.length;
      result.warnings.forEach(w => console.log(`    \x1b[33mWARN: ${w}\x1b[0m`));
    }
  });

  console.log('\n----------------------------------------');
  console.log(`Agents: ${files.length} | Errors: ${totalErrors} | Warnings: ${totalWarnings}`);
  console.log('----------------------------------------\n');

  return hasErrors ? 1 : 0;
}

if (require.main === module) {
  process.exit(runValidation());
}

module.exports = { validateAgent, runValidation };
