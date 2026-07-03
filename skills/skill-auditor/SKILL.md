---
name: skill-auditor
description: "Use when reviewing, publishing, or contributing Agent Skills. Validates SKILL.md frontmatter, directory naming, in-package links, and Agent Skills layout conventions before merge or release."
metadata:
  author: al4f
  version: "0.1.0"
  tags:
    - validation
    - publishing
    - agent-skills
---

# Skill Auditor

Audit Agent Skills source directories before publishing or opening a PR. Catches common mistakes that break agent loading or waste context.

## When to use

- Before publishing a new skill
- When reviewing a skill PR in skills-house or any Agent Skills repo
- After refactoring skill structure or renaming directories

@include /sections/checklist.md

## Automated validation

Run the bundled validator on a skill directory:

[Validate skill](skill-auditor-tools/validate)

```bash
# Example (from repo root after build + install)
bash scripts/validate.sh path/to/skill-dir
```

The script checks:

- `SKILL.md` exists
- Frontmatter `name` matches directory name
- Frontmatter `description` is present and reasonably sized
- In-package markdown links (`/references/...`, `/sections/...`) resolve to real files

## Manual review

@include /sections/manual-review.md

## Agent Skills layout reference

See [layout guide](/references/agent-skills-layout.md) for the dist contract agents expect.

## Related

If the skill depends on another skill package, verify install notes appear in dist after build. skills-house injects dependency suggestions automatically at build time.
