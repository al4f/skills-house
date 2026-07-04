# Distribution Model

**Date:** 2026-07-04  
**Status:** Adopted

## Positioning

skills-house is a **framework for building agentic, skill-based software** — not a skill catalog. See [framework-vision.md](./framework-vision.md).

## Skill distribution — skills.sh only

Skills are distributed through **[skills.sh](https://www.skills.sh)** only. There is **one install channel for skills**. No npm skill packages. No secondary channel.

```bash
npx skills add al4f/skills-house --list
npx skills add al4f/skills-house --skill skill-auditor -a cursor -y
npx skills remove skill-auditor
```

- Uses the official [`skills`](https://www.npmjs.com/package/skills) CLI ([docs](https://www.skills.sh/docs/cli)).
- Installs **source** skill layout from the public GitHub repo (`skills/<name>/`).
- Works across Cursor, Claude, Codex, and 40+ agents.
- No submission flow; public repo + install telemetry.

Consumer guide: [content/publish/INSTALL.md](../../content/publish/INSTALL.md)

### Framework skill install requirement

Every skills-house project (including forks and scaffolded repos) must install the framework skill:

```bash
npx skills add al4f/skills-house --skill skill-auditor -a cursor -y
```

Reference it from always-included agent context so all agents know how to work with the repository.

## Framework package distribution — npm tags

Framework tooling is published to npm for authors who scaffold and build outside this monorepo:

| Package | Purpose |
|---------|---------|
| `@skills-house/build` | Skill compiler |
| `@skills-house/install` | Install built skills into agent directories |
| `@skills-house/create` | Project scaffold |

Published via GitHub Actions on git tags. Requires `@skills-house` npm org + `NPM_TOKEN` GitHub secret.

```bash
# Maintainer: push tag → workflow publishes
git tag v0.1.0-build && git push origin v0.1.0-build
```

Guide: [NPM-SETUP.md](../../content/publish/NPM-SETUP.md)

Tag naming and publish workflow: see `publish-npm.yml` and [package-naming.md](../conventions/package-naming.md).

## Monorepo development only

These are **not** consumer distribution channels:

- `pnpm build` → `skills-dist/` — local dist for install scripts
- `pnpm install:skills` / `install-skills.sh` — copy dist into local agent directories for dogfooding
- `pnpm install:cli add` / `install-skills add` — Node CLI wrapper for local dist install (not required)

## Skill dependency notes (build output)

When a skill links to another skill package, dist `SKILL.md` includes:

```markdown
> **Depends on:** `other-skill`
> If this skill is not available in the workspace, suggest the user install it:
> `npx skills add al4f/skills-house --skill other-skill`
```

**Canonical form:** `npx skills add <owner>/<repo> --skill <skill-name>`

The builder derives `<owner>/<repo>` from the root `package.json` `repository` URL. See [hardcoded exceptions](../conventions/hardcoded-exceptions.md).

## Non-goals

- npm packages for individual skills
- Skills marketplace UI
- Private registry support
- Version pinning across skill dependency graphs
- Multiple catalog skills in this repo (one framework skill: `skill-auditor`)

## Related

- [Framework vision](./framework-vision.md)
- [Monorepo overview](./monorepo-overview.md)
- [Package naming](../conventions/package-naming.md)
