# Distribution Model

**Date:** 2026-07-03  
**Status:** Adopted (Jul 2026)

## Positioning

skills-house is a **framework for building agentic, skill-based software** — not a skill catalog. Distribution serves authors who ship their own skills and consumers who install them — without requiring the monorepo. See [framework-vision.md](./framework-vision.md).

## Channels

| Priority | Channel | Install command | Source |
|----------|---------|-----------------|--------|
| **Primary** | [skills.sh](https://www.skills.sh) | `npx skills add al4f/skills-house --skill <name>` | Public GitHub repo (`skills/<name>/` source) |
| **Secondary** | npm registry | Tag-driven publish → `@skills-house/skill-<name>` | Built `skills-dist/<name>/` only |

### Primary: Git + skills.sh

- Uses the official [`skills`](https://www.npmjs.com/package/skills) CLI ([docs](https://www.skills.sh/docs/cli)).
- No submission flow; public repo + install telemetry.
- Installs **source** skill layout from GitHub (sections, references — not pre-expanded dist).
- Works across Cursor, Claude, Codex, and 40+ agents.

```bash
npx skills add al4f/skills-house --list
npx skills add al4f/skills-house --skill skill-auditor -a cursor -y
npx skills remove skill-auditor
```

Consumer guide: [content/publish/INSTALL.md](../../content/publish/INSTALL.md)

### Secondary: npm packages

- Per-skill packages for semver and download metrics — **not** the primary consumer path.
- Contents = built `skills-dist/<name>/` (expanded `@include`, rewritten links).
- Published via GitHub Actions on git tags (`v<semver>-<skill-dir>`).
- Requires `@skills-house` npm org + `NPM_TOKEN` GitHub secret.

```bash
# Maintainer: push tag → workflow publishes
git tag v0.0.1-skill-auditor && git push origin v0.0.1-skill-auditor
```

Guides: [NPM-SETUP.md](../../content/publish/NPM-SETUP.md), [PUBLISHING.md](../../content/publish/PUBLISHING.md)

### Monorepo dev only

- `pnpm build` → `skills-dist/`
- `pnpm install:skills` / `install-skills.sh` — install **dist** locally for dogfooding
- `pnpm skills add` — optional Node CLI wrapper (not published; not required for consumers)

## npm package naming (published dist)

| Skill directory | Published npm name |
|-----------------|-------------------|
| `skill-auditor` | `@skills-house/skill-skill-auditor` |

Pattern: `@skills-house/skill-<skill-dir>` where `<skill-dir>` is the folder name under `skills/`.

## Skill dependency notes (build output)

When a skill links to another skill package, dist `SKILL.md` includes:

```markdown
> **Depends on:** `other-skill`
> If this skill is not available in the workspace, suggest the user install it:
> `npx skills add <owner>/other-skill`
```

Use the real skills.sh install command — not a custom skills-house CLI.

## Non-goals

- Skills marketplace UI
- Private registry support
- Version pinning across skill dependency graphs
- Multiple catalog skills in this repo (one example: `skill-auditor`)

## Metrics philosophy

npm download counts are a useful signal, not a success metric. Reputation comes from educational content, DX, and skills.sh install telemetry — not leaderboard chasing.

## Related

- [Monorepo overview](./monorepo-overview.md)
- [Package naming](../conventions/package-naming.md)
- [Distribution RFC (article)](https://al4f.dev/writing/skills-house-distribution-rfc.html)
