#!/usr/bin/env node
/**
 * Workflow State Schema Validator
 * Validates stage_rules (in CLAUDE.md Stage-Tool Matrix) and transition_gates (in CLAUDE.md Transition Gates)
 * Also checks that skills/start/SKILL.md has a WORKFLOW_STATE.yaml template
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');
const START_SKILL = path.join(ROOT_DIR, 'skills/start/SKILL.md');
const CLAUDE_MD = path.join(ROOT_DIR, 'CLAUDE.md');

const REQUIRED_STAGES = ['requirements', 'planning', 'execution', 'completion'];
const REQUIRED_GATES = [
  'requirements_to_planning',
  'planning_to_execution',
  'execution_to_completion',
  'completion_to_done'
];

function runValidation() {
  console.log('========================================');
  console.log('  Workflow State Schema Validation');
  console.log('========================================\n');

  const errors = [];

  // Check SKILL.md exists and has YAML template
  if (!fs.existsSync(START_SKILL)) {
    console.log('\x1b[31m✗ skills/start/SKILL.md not found\x1b[0m\n');
    return 1;
  }

  const skillContent = fs.readFileSync(START_SKILL, 'utf-8');
  const hasYamlTemplate = skillContent.match(/```yaml[\s\S]*?current:[\s\S]*?stage:[\s\S]*?```/);
  if (hasYamlTemplate) {
    console.log('  \x1b[32m✓\x1b[0m WORKFLOW_STATE.yaml template found in SKILL.md');
  } else {
    errors.push('Missing WORKFLOW_STATE.yaml template in SKILL.md');
    console.log('  \x1b[31m✗\x1b[0m Missing WORKFLOW_STATE.yaml template in SKILL.md');
  }

  // Check CLAUDE.md exists
  if (!fs.existsSync(CLAUDE_MD)) {
    console.log('\x1b[31m✗ CLAUDE.md not found\x1b[0m\n');
    return 1;
  }

  const claudeContent = fs.readFileSync(CLAUDE_MD, 'utf-8');

  // Check stage rules across CLAUDE.md, agents/shinnosuke.md, and hooks/workflow-guard.md
  console.log('\nChecking stage_rules...');

  const stageSearchFiles = [
    { rel: 'CLAUDE.md', content: claudeContent },
    { rel: 'agents/shinnosuke.md', content: '' },
    { rel: 'hooks/workflow-guard.md', content: '' },
    { rel: 'hooks/shinnosuke-orchestrate.md', content: '' }
  ];
  stageSearchFiles.forEach(f => {
    if (!f.content) {
      const p = path.join(ROOT_DIR, f.rel);
      if (fs.existsSync(p)) f.content = fs.readFileSync(p, 'utf-8');
    }
  });
  const stagesCombined = stageSearchFiles.map(f => f.content).join('\n');

  REQUIRED_STAGES.forEach(stage => {
    const stagePattern = new RegExp(stage, 'i');
    if (stagePattern.test(stagesCombined)) {
      // Find which file matched for reporting
      const source = stageSearchFiles.find(f => stagePattern.test(f.content));
      console.log(`  \x1b[32m✓\x1b[0m ${stage} (in ${source ? source.rel : 'unknown'})`);
    } else {
      errors.push(`Missing stage_rules for: ${stage}`);
      console.log(`  \x1b[31m✗\x1b[0m ${stage}`);
    }
  });

  // Check Transition Gates across CLAUDE.md, shinnosuke.md, orchestrate hook, and workflow-guide
  console.log('\nChecking transition_gates...');

  const gateLabels = {
    'requirements_to_planning': /requirements.*→.*planning|requirements.*planning|Stage 1→2|Stage 1.*Stage 2|S1→S2|S1.*S2.*REQUESTS/i,
    'planning_to_execution': /planning.*→.*execution|planning.*execution|Stage 2→3|Stage 2.*Stage 3|S2→S3|S2.*S3.*PROGRESS/i,
    'execution_to_completion': /execution.*→.*completion|execution.*completion|Stage 3→4|Stage 3.*Stage 4|S3→S4|S3.*S4.*complete/i,
    'completion_to_done': /completion.*→.*done|Final review|Completion.*RETROSPECTIVE|Completion Gate|final.*review.*passed|Done:.*RETROSPECTIVE/i
  };

  // Combine content from all relevant files
  const gateSearchFiles = [
    'CLAUDE.md', 'agents/shinnosuke.md', 'hooks/shinnosuke-orchestrate.md', 'docs/workflow-guide.md'
  ];
  let combinedContent = claudeContent;
  gateSearchFiles.slice(1).forEach(rel => {
    const p = path.join(ROOT_DIR, rel);
    if (fs.existsSync(p)) combinedContent += '\n' + fs.readFileSync(p, 'utf-8');
  });

  REQUIRED_GATES.forEach(gate => {
    const pattern = gateLabels[gate];
    if (pattern.test(combinedContent)) {
      console.log(`  \x1b[32m✓\x1b[0m ${gate}`);
    } else {
      errors.push(`Missing transition_gate: ${gate}`);
      console.log(`  \x1b[31m✗\x1b[0m ${gate}`);
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
