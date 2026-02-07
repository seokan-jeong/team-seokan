#!/usr/bin/env node
/**
 * Input Validation Checker
 * Validates that all user-invocable skills have input validation sections
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');
const SKILLS_DIR = path.join(ROOT_DIR, 'skills');

// Skills that require input validation (user-invocable, non-utility)
const SKILLS_REQUIRING_VALIDATION = [
  'start',
  'autopilot',
  'ralph',
  'ultrawork',
  'plan',
  'analyze',
  'deepsearch',
  'debate'
];

// Keywords that indicate validation exists
const VALIDATION_KEYWORDS = [
  'Validate Input',
  'validation',
  'args is empty',
  'args length',
  '2000'
];

function checkValidation(filePath, skillName) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if any validation keywords are present
  const hasValidation = VALIDATION_KEYWORDS.some(keyword =>
    content.includes(keyword)
  );

  return hasValidation;
}

function runValidation() {
  console.log('========================================');
  console.log('  Input Validation Check');
  console.log('========================================\n');

  if (!fs.existsSync(SKILLS_DIR)) {
    console.log('Skills directory not found, skipping...\n');
    return 0;
  }

  let hasErrors = false;
  const results = {
    withValidation: [],
    withoutValidation: []
  };

  SKILLS_REQUIRING_VALIDATION.forEach(skillName => {
    const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');

    if (!fs.existsSync(skillPath)) {
      console.log(`\x1b[33m⚠\x1b[0m ${skillName}/SKILL.md not found`);
      results.withoutValidation.push(skillName);
      hasErrors = true;
      return;
    }

    const hasValidation = checkValidation(skillPath, skillName);

    if (hasValidation) {
      console.log(`\x1b[32m✓\x1b[0m ${skillName} has input validation`);
      results.withValidation.push(skillName);
    } else {
      console.log(`\x1b[31m✗\x1b[0m ${skillName} missing input validation`);
      results.withoutValidation.push(skillName);
      hasErrors = true;
    }
  });

  console.log('\n----------------------------------------');
  console.log(`Skills with validation: ${results.withValidation.length}/${SKILLS_REQUIRING_VALIDATION.length}`);
  console.log(`Skills without validation: ${results.withoutValidation.length}/${SKILLS_REQUIRING_VALIDATION.length}`);

  if (results.withoutValidation.length > 0) {
    console.log('\nMissing validation in:');
    results.withoutValidation.forEach(skill => {
      console.log(`  - ${skill}`);
    });
  }

  console.log('----------------------------------------\n');

  return hasErrors ? 1 : 0;
}

if (require.main === module) {
  process.exit(runValidation());
}

module.exports = { runValidation };
