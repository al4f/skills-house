---
name: skills-house-install
description: "Use when installing built skills-house dist into agent skill directories. Covers source/target model, install-skills CLI flags, scope, and the difference from skills.sh consumer installs."
metadata:
  author: al4f
  version: "0.1.0"
  tags:
    - install
    - skills-house
    - framework
---

# skills-house Install

Operational guide for `@skills-house/install` — copies or symlinks **built dist** into agent-readable paths.

## When to use

- After `pnpm build`, agent should load updated skills locally
- Installing dist to project scope (`.agents/skills/`, `.claude/skills/`, …)
- Distinguishing dev install from consumer `npx skills add`

## Command synopsis

```bash
# Shell (monorepo)
pnpm install:skills [options]
bash internal-scripts/install/install-skills.sh [options]

# Node CLI
install-skills add <skill-name> [options]
pnpm install:cli add <skill-name> [options]
```

### Inputs

| Input | Flag / arg | Description |
|-------|------------|-------------|
| **Source** | `--from <path>` | Dist root (default: `./skills-dist`) |
| **Skill** | `<name>` or `--skill <name>` | Single skill (default script: all except fixtures) |
| **Target agent** | `--agent <name>` | `agents`, `codex`, `cursor`, `claude` (default: all) |
| **Scope** | `--scope <scope>` | `global` (default) or `project` |
| **Mode** | `--copy` | Copy files (default: symlink) |
| **Preview** | `--dry-run` | Print actions only |

### Target paths (project scope)

| Agent | Path(s) |
|-------|---------|
| `agents` | `.agents/skills/` |
| `codex` | `.agents/skills/` |
| `cursor` | `.agents/skills/`, `.cursor/skills/` |
| `claude` | `.claude/skills/` |

## Examples

**Minimal — install one skill for Cursor in this repo:**

```bash
pnpm install:skills --skill skill-auditor --agent cursor --scope project
```

**Common — all built skills, all agents, project scope:**

```bash
pnpm install:skills --scope project
```

**Advanced — glob pattern + list dist:**

```bash
install-skills list --from ./skills-dist --skill 'skills-house-*'
install-skills add 'skills-house-*' --agent cursor --scope project
pnpm install:skills --skill 'skills-house-*' --scope project
```

## Boundaries

| Channel | Source | Tool |
|---------|--------|------|
| **Author dev** | Local `skills-dist/` (built) | `@skills-house/install` |
| **Consumer** | GitHub `skills/<name>/` (source) | `npx skills add owner/repo --skill name` |

Install does **not** replace skills.sh for end users. It does **not** build skills or install raw source without dist layout.

## Related RFC

`specs/rfc/0004-install.md`
