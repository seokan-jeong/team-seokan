#!/usr/bin/env node
/**
 * Performance Profile Report
 * Measures file sizes, token counts, and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '../..');
const CLAUDE_MD = path.join(PROJECT_ROOT, 'CLAUDE.md');
const AGENTS_DIR = path.join(PROJECT_ROOT, 'agents');
const SHARED_OUTPUT = path.join(AGENTS_DIR, '_shared/output-formats.md');

const CHAR_THRESHOLD = 10000;
const EST_TOKEN_RATIO = 4;

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').length;
  const chars = content.length;
  const estTokens = Math.round(chars / EST_TOKEN_RATIO);

  return { lines, chars, estTokens, content };
}

function analyzeCLAUDEParts(content) {
  const lines = content.split('\n');
  const parts = [];
  let currentPart = null;

  lines.forEach((line, idx) => {
    const match = line.match(/^##\s+PART\s+(\d+(?:\.\d+)?):?\s+(.+)/);
    if (match) {
      if (currentPart) {
        currentPart.endLine = idx - 1;
        currentPart.lineCount = currentPart.endLine - currentPart.startLine + 1;
        currentPart.charCount = lines.slice(currentPart.startLine, currentPart.endLine + 1).join('\n').length;
        parts.push(currentPart);
      }
      currentPart = {
        number: match[1],
        title: match[2].trim(),
        startLine: idx,
        endLine: null,
        lineCount: 0,
        charCount: 0
      };
    }
  });

  // Close last part
  if (currentPart) {
    currentPart.endLine = lines.length - 1;
    currentPart.lineCount = currentPart.endLine - currentPart.startLine + 1;
    currentPart.charCount = lines.slice(currentPart.startLine, currentPart.endLine + 1).join('\n').length;
    parts.push(currentPart);
  }

  return parts;
}

function formatTable(rows, headers) {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i] || '').length))
  );

  const separator = colWidths.map(w => '─'.repeat(w)).join('  ');
  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join('  ');

  const dataRows = rows.map(row =>
    row.map((cell, i) => String(cell).padEnd(colWidths[i])).join('  ')
  );

  return [headerRow, separator, ...dataRows].join('\n  ');
}

function generateReport() {
  console.log('========================================');
  console.log('  Performance Profile Report');
  console.log('========================================\n');

  // Collect file stats
  const fileStats = [];

  // CLAUDE.md
  const claudeStats = analyzeFile(CLAUDE_MD);
  fileStats.push({
    file: 'CLAUDE.md',
    ...claudeStats,
    relativePath: 'CLAUDE.md'
  });

  // Agent files
  const agentFiles = fs.readdirSync(AGENTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .sort();

  agentFiles.forEach(file => {
    const stats = analyzeFile(path.join(AGENTS_DIR, file));
    fileStats.push({
      file: `agents/${file}`,
      ...stats,
      relativePath: `agents/${file}`
    });
  });

  // Shared output formats
  if (fs.existsSync(SHARED_OUTPUT)) {
    const stats = analyzeFile(SHARED_OUTPUT);
    fileStats.push({
      file: 'agents/_shared/output-formats.md',
      ...stats,
      relativePath: 'agents/_shared/output-formats.md'
    });
  }

  // Sort by chars descending
  fileStats.sort((a, b) => b.chars - a.chars);

  // File Size Analysis
  console.log('File Size Analysis:');
  const tableRows = fileStats.map(stat => {
    const oversized = stat.chars > CHAR_THRESHOLD ? '  ⚠️ OVERSIZED' : '';
    return [
      stat.file,
      stat.lines.toLocaleString(),
      stat.chars.toLocaleString(),
      stat.estTokens.toLocaleString() + oversized
    ];
  });

  const totals = fileStats.reduce(
    (acc, s) => ({
      lines: acc.lines + s.lines,
      chars: acc.chars + s.chars,
      estTokens: acc.estTokens + s.estTokens
    }),
    { lines: 0, chars: 0, estTokens: 0 }
  );

  tableRows.push(['─'.repeat(30), '─'.repeat(8), '─'.repeat(10), '─'.repeat(14)]);
  tableRows.push([
    'TOTAL',
    totals.lines.toLocaleString(),
    totals.chars.toLocaleString(),
    totals.estTokens.toLocaleString()
  ]);

  const table = formatTable(tableRows, ['File', 'Lines', 'Chars', 'Est.Tokens']);
  console.log(`  ${table}\n`);

  // PART Analysis
  console.log('PART Analysis (CLAUDE.md):');
  const parts = analyzeCLAUDEParts(claudeStats.content);

  const partRows = parts.map(p => [
    p.number,
    p.title.length > 30 ? p.title.substring(0, 27) + '...' : p.title,
    p.lineCount.toString(),
    p.charCount.toLocaleString(),
    Math.round(p.charCount / EST_TOKEN_RATIO).toLocaleString()
  ]);

  const partTable = formatTable(partRows, ['PART', 'Title', 'Lines', 'Chars', 'Est.Tokens']);
  console.log(`  ${partTable}\n`);

  // Oversized files
  const oversized = fileStats.filter(s => s.chars > CHAR_THRESHOLD);
  if (oversized.length > 0) {
    console.log(`Oversized Files (>${CHAR_THRESHOLD.toLocaleString()} chars):`);
    oversized.forEach((s, i) => {
      const ratio = (s.chars / CHAR_THRESHOLD).toFixed(1);
      console.log(`  ${i + 1}. ${s.file} (${s.chars.toLocaleString()} chars) - ${ratio}x threshold`);
    });
    console.log();
  }

  // Recommendations
  console.log('Recommendations:');

  if (oversized.length > 0) {
    console.log('  - High Priority:');
    oversized.forEach(s => {
      if (s.file === 'CLAUDE.md') {
        const largestParts = parts.sort((a, b) => b.charCount - a.charCount).slice(0, 3);
        console.log(`    • CLAUDE.md: Consider extracting large diagrams or condensing verbose sections`);
        console.log(`      Largest PARTs: ${largestParts.map(p => `PART ${p.number} (${p.charCount} chars)`).join(', ')}`);
      } else {
        console.log(`    • ${s.file}: Review for content that could be moved to shared files`);
      }
    });
  }

  const mediumFiles = fileStats.filter(s => s.chars > 7000 && s.chars <= CHAR_THRESHOLD);
  if (mediumFiles.length > 0) {
    console.log('  - Medium Priority:');
    mediumFiles.forEach(s => {
      console.log(`    • ${s.file}: Approaching threshold (${s.chars.toLocaleString()} chars)`);
    });
  }

  console.log('  - General:');
  console.log('    • Extract repetitive ASCII diagrams to separate reference files');
  console.log('    • Move common patterns to shared documentation');
  console.log('    • Consider condensing verbose tables and examples');
  console.log();

  return {
    fileStats,
    parts,
    oversized,
    totals
  };
}

if (require.main === module) {
  generateReport();
}

module.exports = { analyzeFile, analyzeCLAUDEParts, generateReport };
