# RFC 0004: `@skills-house/install`

**Status:** Accepted  
**Date:** 2026-07-05  
**Depends on:** [RFC 0001](./0001-framework-foundation.md), [RFC 0003](./0003-build.md)  
**Related:** [distribution.md](../architecture/distribution.md)

## Summary

Normative behavior for installing **built Agent Skills dist** into agent-readable directories during development and dogfooding.

**Not** the consumer install channel — end users install Git **source** via [skills.sh](https://www.skills.sh). This tool installs **dist** produced by `@skills-house/build`.

## 1. Purpose

Copy or symlink skill folders from a dist directory into agent skill paths so **reading agents** (Cursor, Claude Code, Codex, …) load compiled skills from the author's machine or CI artifact.

## 2. Core inputs

Every install operation is defined by two dimensions:

| Input | Description | Examples |
|-------|-------------|----------|
| **Source** | Directory containing built skill dist folders | `./skills-dist`, `--from /path/to/dist` |
| **Target** | Agent runtime(s) + scope | `cursor`, `claude`, `agents`, `all`; `project` or `global` |

### 2.1 Source resolution (priority order)

1. **`--from <path>`** — explicit dist root (must contain `<skill-name>/SKILL.md`).
2. **Monorepo default** — `<repo-root>/skills-dist/` when skill exists there.
3. **Fallback messaging** — direct user to `pnpm build` or `npx skills add owner/repo --skill <name>` (consumer channel).

Source MUST be **built dist**, not raw `skills/<name>/` source (unless source happens to match dist layout — not supported).

### 2.2 Target agents

| Alias | Project path(s) | Global path(s) |
|-------|-----------------|----------------|
| `agents` | `<root>/.agents/skills/` | `~/.agents/skills/` |
| `codex` | `<root>/.agents/skills/` | `~/.codex/skills/` |
| `cursor` | `<root>/.agents/skills/`, `<root>/.cursor/skills/` | `~/.cursor/skills/` |
| `claude` | `<root>/.claude/skills/` | `~/.claude/skills/` |
| *(omit flag)* | **All agents above** | Same |

`<root>` = project directory for `--scope project`, else user home for global scope on path resolution.

**`all` agents:** When no `--agent` filter is set, install to every alias in `ALL_AGENTS`.

### 2.3 Skills selection

| Mode | Behavior |
|------|----------|
| `<name>` positional | Install single skill |
| `--skill <name>` (shell script) | Install single skill |
| Default (script) | All skills in dist except test fixtures (`minimal-skill` unless `--all`) |
| Glob / pattern | **Future:** `--skill 'audit-*'` (see §6) |

## 3. CLI surface

### Node CLI (`install-skills`)

```bash
install-skills add <skill-name> [options]

Options:
  --agent <name>       agents | codex | cursor | claude  (default: all)
  --scope <scope>      global (default) | project
  --from <path>        Dist directory root
  --copy               Copy files instead of symlink (default: symlink)
  --dry-run            Print actions only
  --help
```

### Shell scripts (monorepo dev)

```bash
./install-skills.sh [--agent …] [--skill …] [--scope …] [--copy] [--all] [--dry-run]
./remove-skills.sh   # symmetric removal
```

Environment:

| Variable | Purpose |
|----------|---------|
| `SKILLS_DIST_DIR` | Override dist root |
| `SKILLS_REPO_ROOT` | Project root for `--scope project` |

### Package scripts

```json
{
  "install:skills": "bash internal-scripts/install/install-skills.sh",
  "install:cli": "node internal-scripts/install/dist/cli.js"
}
```

## 4. Install mechanics

For each `(skill, target-path)` pair:

1. Ensure target directory exists.
2. Remove existing `<target>/<skill-name>/` if present.
3. **Symlink** (default) or **copy** (`--copy`) dist skill folder into target.

Symlinks preferred for local dev (instant rebuild visibility after `pnpm build`).

## 5. Relationship to skills.sh

| Channel | Source | Tool |
|---------|--------|------|
| **Consumer** | GitHub `skills/<name>/` **source** | `npx skills add owner/repo --skill name` |
| **Author dev** | Local `skills-dist/` **dist** | `@skills-house/install` |

Install RFC applies only to the author dev row. Dependency notes in dist still point consumers to skills.sh.

## 6. Featureful CLI (required capabilities)

The install product MUST support these use cases (current + planned):

| Capability | Status | Interface |
|------------|--------|-----------|
| Single skill install | Implemented | `add <name>` |
| All skills | Implemented | shell default |
| Agent filter | Implemented | `--agent` |
| Scope project/global | Implemented | `--scope` |
| Custom dist root | Implemented | `--from` |
| Copy vs symlink | Implemented | `--copy` |
| Dry run | Implemented | `--dry-run` |
| Remove / uninstall | Implemented | `remove-skills.sh` |
| Multi-skill glob | Implemented | `--skill 'pattern'` / `add <pattern>` |
| Target `all` explicit | Implemented | omit `--agent` |
| List dist skills | Implemented | `install-skills list --from …` |

## 7. Control boundary

Install operates on **dist output** from sources the author controls:

- Local `pnpm build`
- CI artifact path via `--from`
- Optional npm skill dist packages (legacy fallback in CLI — **not** a distribution goal per RFC 0001)

Install MUST NOT silently pull unpublished source from arbitrary paths without explicit `--from`.

## 8. Product skill

Agents discover install capabilities via the **`install` product skill** (RFC 0006) — flags, examples, source/target vocabulary.

## 9. Non-goals

- Replacing skills.sh for consumer installs
- Installing source packages without build
- Resolving skill dependency graphs automatically
- Version pinning across installs

## 10. Compliance checklist

- [ ] Installs only from dist directories
- [ ] Supports all agent aliases in §2.2
- [ ] Project scope uses repo root from cwd / env
- [ ] Documents skills.sh as consumer path in errors/help
