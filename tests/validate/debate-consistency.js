#!/usr/bin/env node
/**
 * Debate Consistency Validator
 * Validates that all debate references route to Midori
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');
const CLAUDE_MD = path.join(ROOT_DIR, 'CLAUDE.md');
const AGENTS_DIR = path.join(ROOT_DIR, 'agents');

// Forbidden patterns - these should NOT exist
const FORBIDDEN_PATTERNS = [
  {
    pattern: /Direct Orchestration/i,
    reason: 'All debates should be facilitated by Midori, not direct orchestration'
  },
  {
    pattern: /Do NOT call Midori/i,
    reason: 'All debates should route to Midori'
  },
  {
    pattern: /Shinnosuke.*follow.*midori\.md.*directly/i,
    reason: 'Shinnosuke should delegate to Midori, not follow guidelines directly'
  }
];

function checkFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors = [];

  FORBIDDEN_PATTERNS.forEach(({ pattern, reason }) => {
    if (pattern.test(content)) {
      errors.push({
        file: fileName,
        pattern: pattern.toString(),
        reason: reason
      });
    }
  });

  return errors;
}

function runValidation() {
  console.log('========================================');
  console.log('  Debate Consistency Validation');
  console.log('========================================\n');

  const errors = [];

  // Check CLAUDE.md
  if (fs.existsSync(CLAUDE_MD)) {
    console.log('Checking CLAUDE.md...');
    const claudeErrors = checkFile(CLAUDE_MD, 'CLAUDE.md');
    errors.push(...claudeErrors);
    if (claudeErrors.length === 0) {
      console.log('  \x1b[32m✓ No forbidden patterns\x1b[0m');
    }
  } else {
    errors.push({ file: 'CLAUDE.md', reason: 'File not found' });
  }

  // Check agent files
  if (fs.existsSync(AGENTS_DIR)) {
    console.log('\nChecking agent files...');
    const agentFiles = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));

    agentFiles.forEach(file => {
      const filePath = path.join(AGENTS_DIR, file);
      const fileErrors = checkFile(filePath, `agents/${file}`);
      errors.push(...fileErrors);

      if (fileErrors.length === 0) {
        console.log(`  \x1b[32m✓\x1b[0m ${file}`);
      } else {
        console.log(`  \x1b[31m✗\x1b[0m ${file}`);
      }
    });
  }

  // Report errors
  if (errors.length > 0) {
    console.log('\n\x1b[31m✗ Found forbidden patterns:\x1b[0m');
    errors.forEach(e => {
      console.log(`\n  File: ${e.file}`);
      console.log(`  Pattern: ${e.pattern}`);
      console.log(`  Reason: ${e.reason}`);
    });
  }

  console.log('\n----------------------------------------');
  console.log(`Errors: ${errors.length}`);
  console.log('----------------------------------------\n');

  return errors.length > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exit(runValidation());
}

module.exports = { runValidation };
