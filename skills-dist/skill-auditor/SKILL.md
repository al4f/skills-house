---
name: skill-auditor
description: Use when reviewing, publishing, or contributing Agent Skills.
  Validates SKILL.md frontmatter, directory naming, in-package links, and Agent
  Skills layout conventions before merge or release.
metadata:
  author: al4f
  version: 0.1.0
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

## Audit checklist

1. **Frontmatter** — `name` and `description` present; `name` matches directory
2. **Description quality** — explains what the skill does AND when to activate it
3. **Body structure** — headings, progressive disclosure; avoid one giant wall of text
4. **Links** — in-package paths use root-absolute hrefs (`/references/foo.md`)
5. **Scripts** — executable files in `scripts/` or referenced from shared packages
6. **Dist layout** — after build: `SKILL.md`, optional `references/`, `scripts/`, `assets/`
7. **No secrets** — no API keys, tokens, or credentials in skill files

Report findings as a short table: **check | status | notes**.

## Automated validation

Run the bundled validator on a skill directory:

[Validate skill](scripts/validate.sh)

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

## Manual review points

### Description triggers

Read the `description` as if you were the agent router. Would you load this skill for the right tasks? Vague descriptions cause missed activations or false positives.

### Context budget

Estimate how many tokens the expanded `SKILL.md` consumes on activation. If over ~200 lines, consider `@include` sections or moving detail to `references/`.

### Script safety

Scripts run in the user's environment. Flag anything that:

- Deletes files outside the project
- Exfiltrates data
- Installs packages without user awareness

### Cross-skill dependencies

If the skill references another skill package, confirm the dist output includes an install suggestion note — not a broken file copy.

## Agent Skills layout reference

See [layout guide](references/agent-skills-layout.md) for the dist contract agents expect.

## Related

If the skill depends on another skill package, verify install notes appear in dist after build. skills-house injects dependency suggestions automatically at build time.
