#!/usr/bin/env node
/**
 * Error Handling Documentation Checker
 * Validates that key files have error handling sections
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');

// Files that must have error handling documentation
// CLAUDE.md is optional (warn-only) since v3.9.0 moved content to agent/hook files
const FILES_TO_CHECK = [
  {
    path: 'CLAUDE.md',
    requiredSection: 'Error Handling',
    keywords: ['Error Handling', 'error', 'failure', 'retry'],
    optional: true
  },
  {
    path: 'agents/shinnosuke.md',
    requiredSection: 'Error Handling',
    keywords: ['Error Handling', 'Task call fails', 'recovery', 'retry']
  },
  {
    path: 'agents/midori.md',
    requiredSection: 'Error Handling',
    keywords: ['Error Handling', 'Debate Failure', 'panel Task fails', 'recovery']
  },
  {
    path: 'hooks/workflow-guard.md',
    requiredSection: 'Error Handling',
    keywords: ['Error Handling', 'Corrupted State', 'missing', 'Recovery']
  }
];

function checkErrorHandling(fileConfig) {
  const filePath = path.join(ROOT_DIR, fileConfig.path);

  if (!fs.existsSync(filePath)) {
    return {
      exists: false,
      hasSection: false,
      hasKeywords: false
    };
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if required section exists
  const hasSection = content.includes(fileConfig.requiredSection);

  // Check if error handling keywords are present
  const hasKeywords = fileConfig.keywords.some(keyword =>
    content.toLowerCase().includes(keyword.toLowerCase())
  );

  return {
    exists: true,
    hasSection,
    hasKeywords
  };
}

function runValidation() {
  console.log('========================================');
  console.log('  Error Handling Documentation Check');
  console.log('========================================\n');

  let hasErrors = false;
  const results = [];

  FILES_TO_CHECK.forEach(fileConfig => {
    const result = checkErrorHandling(fileConfig);

    if (!result.exists) {
      if (fileConfig.optional) {
        console.log(`\x1b[33m⚠\x1b[0m ${fileConfig.path} - File not found (optional, skipped)`);
        results.push({ file: fileConfig.path, status: 'skipped' });
      } else {
        console.log(`\x1b[31m✗\x1b[0m ${fileConfig.path} - File not found`);
        hasErrors = true;
        results.push({ file: fileConfig.path, status: 'missing' });
      }
      return;
    }

    if (!result.hasSection || !result.hasKeywords) {
      if (fileConfig.optional) {
        console.log(`\x1b[33m⚠\x1b[0m ${fileConfig.path} - No error handling section (optional, skipped)`);
        results.push({ file: fileConfig.path, status: 'skipped' });
      } else {
        console.log(`\x1b[31m✗\x1b[0m ${fileConfig.path} - Missing error handling`);
        if (!result.hasSection) {
          console.log(`    Missing section: "${fileConfig.requiredSection}"`);
        }
        if (!result.hasKeywords) {
          console.log(`    Missing keywords: ${fileConfig.keywords.join(', ')}`);
        }
        hasErrors = true;
        results.push({ file: fileConfig.path, status: 'incomplete' });
      }
    } else {
      console.log(`\x1b[32m✓\x1b[0m ${fileConfig.path} has error handling`);
      results.push({ file: fileConfig.path, status: 'ok' });
    }
  });

  // At least one non-optional file must have error handling
  const requiredFiles = FILES_TO_CHECK.filter(f => !f.optional);
  const requiredOk = results.filter(r => {
    const config = FILES_TO_CHECK.find(f => f.path === r.file);
    return !config.optional && r.status === 'ok';
  });
  if (requiredOk.length === 0 && requiredFiles.length > 0) {
    console.log('\n\x1b[31m✗ No required file has error handling documentation\x1b[0m');
    hasErrors = true;
  }

  console.log('\n----------------------------------------');
  const okCount = results.filter(r => r.status === 'ok').length;
  const totalRequired = FILES_TO_CHECK.filter(f => !f.optional).length;
  console.log(`Files with error handling: ${okCount}/${totalRequired} required + ${FILES_TO_CHECK.length - totalRequired} optional`);
  console.log('----------------------------------------\n');

  return hasErrors ? 1 : 0;
}

if (require.main === module) {
  process.exit(runValidation());
}

module.exports = { runValidation };
