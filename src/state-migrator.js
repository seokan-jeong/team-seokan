#!/usr/bin/env node
/**
 * State Migrator — Team-Shinchan
 * Migrates WORKFLOW_STATE.yaml between schema versions.
 * Zero npm dependencies. Regex-based YAML parsing.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const CURRENT_SCHEMA_VERSION = 2;

// ─── Migrations ──────────────────────────────────────────────────────
const migrations = {
  1: migrateV1toV2
};

function migrateV1toV2(content) {
  // 1. Replace "version: 1" with "schema_version: 2"
  content = content.replace(/^version:\s*1\s*$/m, 'schema_version: 2');

  // 2. Add context_budget if not present
  if (!/context_budget:/.test(content)) {
    // Insert after updated: line or after doc_id:
    const insertAfter = /^(updated:.*$)/m;
    if (insertAfter.test(content)) {
      content = content.replace(insertAfter, '$1\ncontext_budget: 4000');
    }
  }

  // 3. Add hard_limit to budget section if budget exists but no hard_limit
  if (/^budget:\s*$/m.test(content) && !/hard_limit:/.test(content)) {
    // Find the last field in the budget section and add hard_limit after it
    content = content.replace(
      /(budget:\s*\n(?:\s+\w+:.*\n)*?)(\s+used_phase:.*$)/m,
      '$1$2\n  hard_limit: false'
    );
  }

  return content;
}

// ─── Core ────────────────────────────────────────────────────────────
function detectVersion(content) {
  const schemaMatch = content.match(/^schema_version:\s*(\d+)\s*$/m);
  if (schemaMatch) return parseInt(schemaMatch[1]);

  const versionMatch = content.match(/^version:\s*(\d+)\s*$/m);
  if (versionMatch) return parseInt(versionMatch[1]);

  return 1; // Default to v1
}

function migrate(filePath) {
  if (!fs.existsSync(filePath)) {
    return { status: 'error', message: `File not found: ${filePath}` };
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const currentVersion = detectVersion(content);

  if (currentVersion >= CURRENT_SCHEMA_VERSION) {
    return { status: 'current', version: currentVersion, message: 'Already at latest version' };
  }

  // Create backup
  const bakPath = filePath + '.bak';
  fs.writeFileSync(bakPath, content);

  // Apply migrations sequentially
  let version = currentVersion;
  const applied = [];

  while (version < CURRENT_SCHEMA_VERSION) {
    const migrateFn = migrations[version];
    if (!migrateFn) {
      return { status: 'error', message: `No migration found for v${version}` };
    }
    content = migrateFn(content);
    applied.push(`v${version} → v${version + 1}`);
    version++;
  }

  fs.writeFileSync(filePath, content);

  return {
    status: 'migrated',
    from: currentVersion,
    to: CURRENT_SCHEMA_VERSION,
    applied,
    backup: bakPath
  };
}

function migrateAll(docsDir) {
  const results = [];
  if (!fs.existsSync(docsDir)) return results;

  const entries = fs.readdirSync(docsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const yamlPath = path.join(docsDir, entry.name, 'WORKFLOW_STATE.yaml');
    if (fs.existsSync(yamlPath)) {
      const result = migrate(yamlPath);
      results.push({ doc_id: entry.name, ...result });
    }
  }
  return results;
}

// ─── CLI ─────────────────────────────────────────────────────────────
function cli() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === '--help') {
    console.log('Usage: state-migrator <command>');
    console.log('Commands:');
    console.log('  migrate <file>    Migrate a single WORKFLOW_STATE.yaml');
    console.log('  migrate-all       Migrate all workflows in .shinchan-docs/');
    console.log('  check <file>      Check current schema version');
    return;
  }

  switch (cmd) {
    case 'migrate': {
      const file = args[1];
      if (!file) { console.log('Usage: state-migrator migrate <file>'); return; }
      const result = migrate(file);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'migrate-all': {
      const docsDir = path.join(process.cwd(), '.shinchan-docs');
      const results = migrateAll(docsDir);
      if (results.length === 0) { console.log('No workflows found.'); return; }
      for (const r of results) {
        console.log(`${r.doc_id}: ${r.status}${r.applied ? ` (${r.applied.join(', ')})` : ''}`);
      }
      break;
    }
    case 'check': {
      const file = args[1];
      if (!file) { console.log('Usage: state-migrator check <file>'); return; }
      if (!fs.existsSync(file)) { console.log(`File not found: ${file}`); return; }
      const content = fs.readFileSync(file, 'utf-8');
      const version = detectVersion(content);
      console.log(`Schema version: ${version} (latest: ${CURRENT_SCHEMA_VERSION})`);
      if (version < CURRENT_SCHEMA_VERSION) console.log('Migration available. Run: state-migrator migrate <file>');
      break;
    }
    default:
      console.log(`Unknown command: ${cmd}. Run with --help.`);
  }
}

if (require.main === module) cli();

module.exports = { migrate, migrateAll, detectVersion, CURRENT_SCHEMA_VERSION };
