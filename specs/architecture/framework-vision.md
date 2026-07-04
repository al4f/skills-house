# Skills House Framework Vision

**Status:** Active  
**Date:** 2026-07-04

## Definition

skills-house is an open-source **framework** for building **agentic, skill-based software** with [Agent Skills](https://agentskills.io).

**Ease of use** is a first-class goal: scaffold a project with one command (like `create-next-app` for web apps), author skills in freeform source, and let the framework compile, validate, and ship them to any agent runtime.

**Who it's for** goes beyond traditional developers. With tools like Cursor, Claude Code, Cursor mobile, or Claude mobile, teams can use skills as the building blocks of agentic applications — the framework supplies structure and delivery; agents supply execution.

**Not a skill catalog** — this repo ships one example skill (`skill-auditor`) to demonstrate patterns.

**Website** — [al4f.dev](https://al4f.dev) explains how to work with the framework and what you can build with it. Browsing or showcasing skills is not its purpose.

## Principles

1. **One-command onboarding** — `npx create-skills-house` scaffolds a ready-to-build project (`internal-scripts/create/`).
2. **Source is freeform** — only `SKILL.md` is required; `@include` and markdown links compose larger skills.
3. **Build produces spec-compliant dist** — `@skills-house/build` is the framework core.
4. **Authors bring skills; the framework handles compile and ship** — validation, metadata generation, and install paths are provided.
5. **Framework changes require humans** — build system, CLI, generators, website, and CI never auto-merge.
6. **GitHub is the source of truth** — generated metadata and site data come from repository contents.

## Contribution model

| Type | Paths | Review | Auto-merge |
|------|-------|--------|------------|
| Skill | `skills/<name>/` | Automated checks only | Yes, when checks pass |
| Framework | Everything else | Maintainer review | Never |

### Skill checks

- Schema validation (`specs/schema/skill-frontmatter.schema.json`)
- Per-package lint (`pnpm validate`)
- Registry generation (`pnpm generate`)
- Dependency and reference validation

## Framework components

| Component | Path | Role |
|-----------|------|------|
| Scaffold CLI | `internal-scripts/create/` (`create-skills-house`) | One-command project setup |
| Build pipeline | `internal-scripts/build/` | `@skills-house/build` — markers, links, dist writer |
| Shared scripts | `scripts/<name>/` | Reusable execution packages referenced from skills |
| Metadata generator | `@skills-house/registry` (`pnpm generate`) | Skill + script metadata for CI and internal tooling |
| Install scripts | `internal-scripts/install/` | Local dist install for dogfooding |
| Example skill | `skills/skill-auditor/` | Demonstrates authoring patterns |

## Generated artifacts

Internal outputs from `pnpm generate` — not a public skill catalog. Maintainer details: [registry.md](./registry.md).

| Artifact | Path | Purpose |
|----------|------|---------|
| Registry index | `generated/registry.json` | Skill + script metadata |
| Search index | `generated/search-index.json` | Internal search data |
| Dependency graph | `generated/dependency-graph.json` | Skill ↔ script relationships |
| Website data | `website/public/data/*.json` | Static site consumption |

## Website

[al4f.dev](https://al4f.dev) is framework documentation — not a skill marketplace.

**In scope:**

- How to scaffold, author, build, and ship with skills-house
- Use cases: agentic apps, multi-agent workflows, mobile agent tooling
- Architecture articles and build logs

**Out of scope:**

- Skill discovery UI or registry browsing as a product surface
- Marketplace, leaderboard, or catalog positioning

## Distribution

Install channels, consumer commands, and npm publish workflow: **[distribution.md](./distribution.md)**.

## Branding

Framework docs reinforce Skills House by **al4f**, linking to:

- [al4f.dev](https://al4f.dev)
- [GitHub repository](https://github.com/al4f/skills-house)
- [Documentation](https://github.com/al4f/skills-house/tree/main/specs)

## Automation

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci.yml` | PR + push | Build, test, validate, `generate:check` |
| `generate-registry.yml` | Push to `main` | Regenerate and commit artifacts |
| `auto-merge-skills.yml` | Skill-only PR | Approve + auto-merge when CI passes |
| `deploy-al4f-dev.yml` | Website changes | Deploy GitHub Pages |

## Related

- [Monorepo overview](./monorepo-overview.md)
- [Distribution](./distribution.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
