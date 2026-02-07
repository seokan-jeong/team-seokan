#!/usr/bin/env node
/**
 * Skill Format Validator
 * Validates all skill SKILL.md files follow standard format
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');
const SKILLS_DIR = path.join(ROOT_DIR, 'skills');

function validateSkillFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors = [];

  // Check 1: Has YAML frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    errors.push('Missing YAML frontmatter (---...---)');
  } else {
    // Check frontmatter has required fields
    const frontmatter = frontmatterMatch[1];

    if (!frontmatter.includes('name:')) {
      errors.push('Frontmatter missing: name');
    }
    if (!frontmatter.includes('description:')) {
      errors.push('Frontmatter missing: description');
    }
  }

  // Check 2: Has input validation or step section (optional for utility skills)
  const hasValidation = /##\s*(Step 1|Input Validation|Validate Input|Usage|Process)/i.test(content);
  const hasHeader = /##\s+/i.test(content);

  // Only require validation if it's not a simple utility skill
  if (!hasValidation && !hasHeader) {
    errors.push('Missing structured sections');
  }

  // Check 3: Has at least some content sections (lenient check)
  const sectionCount = (content.match(/##\s+/g) || []).length;
  if (sectionCount < 1) {
    errors.push('Missing content sections');
  }

  return errors;
}

function runValidation() {
  console.log('========================================');
  console.log('  Skill Format Validation');
  console.log('========================================\n');

  if (!fs.existsSync(SKILLS_DIR)) {
    console.log('Skills directory not found, skipping...\n');
    return 0;
  }

  let hasErrors = false;
  let totalErrors = 0;

  // Find all SKILL.md files
  const skillDirs = fs.readdirSync(SKILLS_DIR);

  skillDirs.forEach(dir => {
    const skillPath = path.join(SKILLS_DIR, dir, 'SKILL.md');

    if (fs.existsSync(skillPath)) {
      const errors = validateSkillFile(skillPath, `${dir}/SKILL.md`);

      if (errors.length === 0) {
        console.log(`\x1b[32m✓\x1b[0m ${dir}/SKILL.md`);
      } else {
        hasErrors = true;
        totalErrors += errors.length;
        console.log(`\x1b[31m✗\x1b[0m ${dir}/SKILL.md`);
        errors.forEach(e => console.log(`    \x1b[31mERROR: ${e}\x1b[0m`));
      }
    }
  });

  console.log('\n----------------------------------------');
  console.log(`Errors: ${totalErrors}`);
  console.log('----------------------------------------\n');

  return hasErrors ? 1 : 0;
}

if (require.main === module) {
  process.exit(runValidation());
}

module.exports = { runValidation };
