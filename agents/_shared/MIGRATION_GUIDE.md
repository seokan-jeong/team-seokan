# Migration Guide

Guide for upgrading Team-Shinchan components when shared formats or conventions change.

## Adding a New Shared Format

### Step 1: Create the shared file
Location: `agents/_shared/{format-name}.md`

### Step 2: Update agent files
For each agent file in `agents/`:
1. Find the section that duplicates the shared content
2. Replace with a reference line:
   ```
   See agents/_shared/{format-name}.md for {description}.
   ```

### Step 3: Validate
Run: `cd tests/validate && node index.js`
Ensure shared-refs validator passes.

## Adding a New Agent

1. Create `agents/{name}.md` with standard structure:
   - YAML frontmatter (name, description, model, color, tools)
   - Signature table
   - Responsibilities section
   - Output Format reference to `_shared/output-formats.md`
2. Add agent to CLAUDE.md PART 8 (Agent Team) table
3. Add agent to CLAUDE.md PART 14 (Quick Reference) agent IDs
4. Run validators: `cd tests/validate && node index.js`

## Adding a New Skill

1. Create `skills/{name}/SKILL.md` with:
   - YAML frontmatter (name, description, user-invocable)
   - Input validation section
   - Execution steps
   - Error handling
2. Add skill to CLAUDE.md PART 11 (Skills & Commands) table
3. Add skill to `skills/help/SKILL.md` Skills List table
4. Run validators: `cd tests/validate && node index.js`

## Adding a New Validator

1. Create `tests/validate/{name}.js`
2. Export `{ runValidation }` function returning 0 (pass) or 1 (fail)
3. Register in `tests/validate/index.js`:
   ```javascript
   const { runValidation: runNewValidator } = require('./{name}');
   // Add to validators array
   ```
4. Update COVERAGE.md with what the new validator checks
5. Run: `cd tests/validate && node index.js`

## Version History

### Month 1 (main-012): v2.12.0 → Unreleased
- Stage-Tool Matrix unified (9 tools × 4 stages)
- Debate system unified under Midori
- Error handling framework added (PART 13)
- Code deduplication via _shared/output-formats.md
- 8 validators + 10 promptfoo tests added

### Month 2 (main-013): Unreleased
- GitHub Actions CI/CD added
- 15/15 agent shared template migration
- orchestrate skill created
- CLAUDE.md PARTs renumbered 1-14
- 13 validators + 25 promptfoo tests

### Month 3 (main-014): Unreleased
- CI/CD completed (promptfoo in GitHub Actions)
- Performance profiling system
- Debate templates and decision memory
- /status skill, improved error messages
