#!/usr/bin/env node
/**
 * Shared References Validator
 * Validates that agent files reference the shared output-formats.md
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');
const AGENTS_DIR = path.join(ROOT_DIR, 'agents');
const SHARED_OUTPUT = path.join(AGENTS_DIR, '_shared/output-formats.md');

const MIN_REFERENCES = 10; // At least 10 of 15 agents should reference it

function checkAgentReferences() {
  if (!fs.existsSync(AGENTS_DIR)) {
    return { error: 'agents/ directory not found' };
  }

  if (!fs.existsSync(SHARED_OUTPUT)) {
    return { error: 'agents/_shared/output-formats.md not found' };
  }

  const agentFiles = fs.readdirSync(AGENTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'));

  const results = {
    total: agentFiles.length,
    withReferences: 0,
    withoutReferences: [],
    agentFiles: []
  };

  agentFiles.forEach(file => {
    const filePath = path.join(AGENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const hasReference = /output-formats\.md/i.test(content);

    results.agentFiles.push({
      file,
      hasReference
    });

    if (hasReference) {
      results.withReferences++;
    } else {
      results.withoutReferences.push(file);
    }
  });

  return results;
}

function runValidation() {
  console.log('========================================');
  console.log('  Shared References Validation');
  console.log('========================================\n');

  const results = checkAgentReferences();

  if (results.error) {
    console.log(`\x1b[31m✗ ${results.error}\x1b[0m\n`);
    return 1;
  }

  console.log('Checking agent references to output-formats.md...\n');

  results.agentFiles.forEach(({ file, hasReference }) => {
    if (hasReference) {
      console.log(`  \x1b[32m✓\x1b[0m ${file}`);
    } else {
      console.log(`  \x1b[33m?\x1b[0m ${file} (no reference)`);
    }
  });

  console.log('\n----------------------------------------');
  console.log(`Total agents: ${results.total}`);
  console.log(`With references: ${results.withReferences}`);
  console.log(`Without references: ${results.withoutReferences.length}`);
  console.log('----------------------------------------\n');

  // Check if minimum threshold is met
  if (results.withReferences < MIN_REFERENCES) {
    console.log(`\x1b[31m✗ Less than ${MIN_REFERENCES} agents reference output-formats.md\x1b[0m`);
    console.log(`  Missing in: ${results.withoutReferences.join(', ')}\n`);
    return 1;
  }

  console.log(`\x1b[32m✓ At least ${MIN_REFERENCES} agents reference output-formats.md\x1b[0m\n`);
  return 0;
}

if (require.main === module) {
  process.exit(runValidation());
}

module.exports = { runValidation };
