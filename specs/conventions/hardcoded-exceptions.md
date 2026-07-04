# Hardcoded Exceptions

**Date:** 2026-07-04  
**Status:** Adopted

skills-house is a **framework**. Install commands and repo slugs must derive from each project's `package.json` `repository` URL wherever tooling runs in a fork or scaffolded project.

## Dynamic (default)

| Component | Source |
|-----------|--------|
| `@skills-house/build` dependency notes | `getRepoSlug(repoRoot)` from root `package.json` |
| `@skills-house/registry` `installCommand` + `repository` | Same |
| Scaffolded projects | Authors set `repository` in root `package.json` after `npx create-skills-house` |

**Canonical install form:** `npx skills add <owner>/<repo> --skill <skill-name>`

Uses the official [skills.sh](https://www.skills.sh/docs/cli) CLI on the **consumer's repo** (where agents run). Not a custom skills-house CLI.

## Allowed hardcoding

These may use `al4f/skills-house` as the **reference monorepo** example:

| Location | Why |
|----------|-----|
| Reference repo README consumer install block | Documents this repo's example skill |
| `specs/` examples and distribution.md | Illustrates canonical reference install |
| `content/publish/INSTALL.md` | Consumer guide for this repo |
| Brand content (social, demo scripts) | Marketing for the reference implementation |
| Website home CTA install example | Documents this repo's example skill |

Do **not** hardcode `al4f/skills-house` in:

- Forked or scaffolded project tooling (CLI errors, build output, registry)
- `internal-scripts/create` templates (use `YOUR_ORG/repo` placeholders)

## Install channels (reminder)

| Priority | Channel | When |
|----------|---------|------|
| **Primary** | `npx skills add owner/repo --skill name` | Any consumer repo; installs GitHub **source** from the framework repo |
| **Secondary** | `@skills-house/skill-*` npm packages | Semver / metrics only |
| **Dev only** | `pnpm install:skills` | Monorepo dogfooding of **dist** |

## Related

- [Distribution](../architecture/distribution.md)
- [Package naming](./package-naming.md)
