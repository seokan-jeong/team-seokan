#!/usr/bin/env node
/**
 * Quick Fix Path Validator
 * Validates that Quick Fix workflow is properly defined in CLAUDE.md and shinnosuke.md
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');
const CLAUDE_MD = path.join(ROOT_DIR, 'CLAUDE.md');
const SHINNOSUKE_MD = path.join(ROOT_DIR, 'agents/shinnosuke.md');
const ORCHESTRATE_MD = path.join(ROOT_DIR, 'hooks/shinnosuke-orchestrate.md');

const REQUIRED_ELEMENTS = [
  { name: 'Quick Fix criteria defined', pattern: /Quick Fix.*criteria|criteria.*Quick Fix|Quick Fix Path|ALL true.*single file|ALL true.*no design|<=\d+ files.*no design/i },
  { name: 'Action Kamen review mandatory', pattern: /Action Kamen.*(?:MANDATORY|mandatory|required)|Action Kamen review \((?:MANDATORY|required)\)/i },
  { name: 'Bo delegation mentioned', pattern: /(?:Delegate|delegate).*Bo|Bo.*(?:implement|fix)|Bo →|→ Bo/i },
];

function runValidation() {
  console.log('========================================');
  console.log('  Quick Fix Path Validation');
  console.log('========================================\n');

  const errors = [];

  // Check CLAUDE.md
  if (!fs.existsSync(CLAUDE_MD)) {
    console.log('\x1b[31m✗ CLAUDE.md not found\x1b[0m\n');
    return 1;
  }

  const claudeContent = fs.readFileSync(CLAUDE_MD, 'utf-8');
  const shinnosukeContent = fs.existsSync(SHINNOSUKE_MD) ? fs.readFileSync(SHINNOSUKE_MD, 'utf-8') : '';
  const orchestrateContent = fs.existsSync(ORCHESTRATE_MD) ? fs.readFileSync(ORCHESTRATE_MD, 'utf-8') : '';

  // Check Quick Fix / Lite Mode exists in any of the relevant files
  console.log('Checking Quick Fix / Lite Mode definition...');
  const quickFixSources = [
    { name: 'CLAUDE.md', content: claudeContent },
    { name: 'agents/shinnosuke.md', content: shinnosukeContent },
    { name: 'hooks/shinnosuke-orchestrate.md', content: orchestrateContent }
  ];

  const quickFixPattern = /Quick Fix|Lite Mode|Lite.*Otherwise.*Full/i;
  const foundIn = quickFixSources.filter(s => quickFixPattern.test(s.content));
  if (foundIn.length > 0) {
    foundIn.forEach(s => console.log(`  \x1b[32m✓\x1b[0m Quick Fix / Lite Mode found in ${s.name}`));
  } else {
    errors.push('Quick Fix / Lite Mode not found in any source file');
    console.log('  \x1b[31m✗\x1b[0m Quick Fix / Lite Mode section missing from all files');
  }

  // Verify at least shinnosuke.md or orchestrate hook exists
  if (!shinnosukeContent && !orchestrateContent) {
    console.log('\x1b[31m✗ Neither agents/shinnosuke.md nor hooks/shinnosuke-orchestrate.md found\x1b[0m\n');
    return 1;
  }

  // Check required elements across all relevant files
  const combined = claudeContent + '\n' + shinnosukeContent + '\n' + orchestrateContent;
  console.log('\nChecking required elements...');

  REQUIRED_ELEMENTS.forEach(({ name, pattern }) => {
    if (pattern.test(combined)) {
      console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    } else {
      errors.push(`Missing: ${name}`);
      console.log(`  \x1b[31m✗\x1b[0m ${name}`);
    }
  });

  console.log('\n----------------------------------------');
  console.log(`Errors: ${errors.length}`);
  console.log('----------------------------------------\n');

  if (errors.length > 0) {
    console.log('Errors:');
    errors.forEach(e => console.log(`  \x1b[31m• ${e}\x1b[0m`));
    console.log();
  }

  return errors.length > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exit(runValidation());
}

module.exports = { runValidation };
