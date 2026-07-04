# Hardcoded Exceptions

**Date:** 2026-07-04  
**Status:** Adopted

skills-house is a **framework**. Install commands and repo slugs must derive from each project's `package.json` `repository` URL wherever tooling runs in a fork or scaffolded project.

## Dynamic (default)

| Component | Source |
|-----------|--------|
| `@skills-house/build` dependency notes | `getRepoSlug(repoRoot)` from root `package.json` |
| Scaffolded projects | `repository` auto-filled from `git remote origin` when present; otherwise `YOUR_ORG/<project>` placeholder until authors push to GitHub |

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

- Forked or scaffolded project tooling (CLI errors, build output)
- `internal-scripts/create` templates (use `YOUR_ORG/repo` placeholders)

## Install channels (reminder)

| Channel | When |
|---------|------|
| `npx skills add owner/repo --skill name` | Consumer repos; installs GitHub **source** |
| `pnpm install:skills` | Monorepo dev only; installs **dist** locally |

## Related

- [Distribution](../architecture/distribution.md)
- [Package naming](./package-naming.md)
