# Skills House Framework Vision

**Status:** Active  
**Date:** 2026-07-05  
**Normative detail:** [specs/rfc/](../rfc/README.md) (Accepted RFCs bind releases until LTS)

## Definition

skills-house is an open-source **framework** for building **agentic, skill-based software** with [Agent Skills](https://agentskills.io).

**Ease of use** is a first-class goal: scaffold a project with one command (like `create-next-app`), author skills in freeform source, and let the framework compile and ship them to any agent runtime.

**Who it's for** goes beyond traditional developers. With Cursor, Claude Code, mobile agents, or cloud agents, teams use skills as building blocks — the framework supplies structure and delivery; agents supply execution.

**Not a skill catalog** — this repo ships one **framework skill** (`skill-auditor`) that documents how the framework works. Fork authors ship their own skills from their own repositories.

**Website** — [al4f.dev](https://al4f.dev) explains how to work with the framework. Browsing or showcasing skills is not its purpose.

## Core purpose of build

`@skills-house/build` exists to:

1. **Compile** freeform skill source into spec-compliant Agent Skills dist.
2. **Wire executable scripts** from `scripts/` into skill output so agents can invoke them.
3. **Enable execution where the runtime cannot** — some agent runtimes (mobile, cloud) cannot run bundled scripts locally. When the repo is connected via **GitHub integration**, those runtimes can still trigger script execution against the repository (CI workflows, repo-connected cloud agents). Build output must make script entry points discoverable and documented for both local and GitHub-backed execution.

Build does **not** exist to generate catalogs, search indexes, or dependency graphs for product features.

## Principles

1. **Adopt, don't invent** — Agent Skills format, skills.sh consumer installs, universal `.agents/skills` paths; no parallel rule systems ([RFC 0001](../rfc/0001-framework-foundation.md)).
2. **One-command onboarding** — target DX: `npx @skills-house/create` scaffolds a ready-to-build project ([RFC 0005](../rfc/0005-create.md)).
3. **Source is freeform** — skill source packages with `SKILL.md` + `package.json`; `@include` and markdown links compose larger skills ([RFC 0002](../rfc/0002-skill-source-package.md)).
4. **Build produces spec-compliant dist** — `@skills-house/build` is the framework core ([RFC 0003](../rfc/0003-build.md)).
5. **Scripts are first-class and language-agnostic** — shared packages in `scripts/` link into skills at build time; runtime scripts may be any language.
6. **Product skills** — each CLI product ships an Agent Skill documenting its full surface for reading agents ([RFC 0006](../rfc/0006-product-skills.md)).
7. **GitHub is the source of truth** — website data, when needed, is derived from repository contents at build time.

## Contribution

Same as any open-source repository:

- Open an **issue** before substantial work.
- All changes require **maintainer review and approval** before merge.
- **No auto-merge. No exceptions.**

## Framework components

| Component | Path | Role |
|-----------|------|------|
| Scaffold CLI | `internal-scripts/create/` (`@skills-house/create`) | One-command project setup |
| Build pipeline | `internal-scripts/build/` (`@skills-house/build`) | Compile skills, resolve links, bundle scripts into dist |
| Shared scripts | `scripts/<name>/` | Reusable execution packages referenced from skills |
| Install tool | `internal-scripts/install/` (`@skills-house/install`) | Install built dist into agent skill directories |
| Framework skill | `skills/skill-auditor/` | Canonical framework documentation — not a demo |

### Framework skill (`skill-auditor`)

This skill is **required reading for agents working in a skills-house repository**. Every scaffolded project installs it and references it from always-included agent context (e.g. `AGENTS.md`, Cursor rules).

It documents:

- How to define skills and scripts and what each is for
- How to build skills (`pnpm build`, per-skill commands)
- How to install skills for use by other agents (`install-skills.sh`, skills.sh)
- Repository conventions agents must follow

It is **not** an example or optional add-on. It is the operational manual for the framework inside Agent Skills format.

### Install tool

`@skills-house/install` copies built dist into agent skill directories so **other agents** (not just the authoring agent) can load and use skills from this repo during development. It includes a Node CLI (`install-skills add`) and shell scripts (`install-skills.sh`, `remove-skills.sh`).

## Generated artifacts

Only **website data** is a retained generated output:

| Artifact | Path | Purpose |
|----------|------|---------|
| Website data | `website/public/data/*.json` | Static site consumption |

Registry indexes, search indexes, and dependency graphs are **not** framework outputs. If the website needs repo metadata, generate it with simple build-time scripts — not a dedicated metadata subsystem.

## Website

[al4f.dev](https://al4f.dev) is framework documentation — not a skill marketplace.

**In scope:**

- How to scaffold, author, build, and ship with skills-house
- Use cases: agentic apps, multi-agent workflows, mobile and cloud agent tooling
- Architecture articles and build logs

**Out of scope:**

- Skill discovery UI or registry browsing
- Marketplace, leaderboard, or catalog positioning

## Distribution

See **[distribution.md](./distribution.md)**.

- **Skills** — [skills.sh](https://www.skills.sh) only (`npx skills add owner/repo --skill <name>`).
- **Framework packages** — npm, tag-driven publish (`@skills-house/build`, `@skills-house/create`, etc.).

## Branding

Framework docs reinforce Skills House by **al4f**, linking to:

- [al4f.dev](https://al4f.dev)
- [GitHub repository](https://github.com/al4f/skills-house)
- [Documentation](https://github.com/al4f/skills-house/tree/main/specs)

## Automation

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci.yml` | PR + push | Build, test, validate |
| `deploy-al4f-dev.yml` | Website changes | Deploy GitHub Pages |
| `publish-npm.yml` | Version tag | Publish framework packages to npm |

## Related

- [RFC index](../rfc/README.md)
- [Monorepo overview](./monorepo-overview.md)
- [Distribution](./distribution.md)
- [Project layout (`.house`)](../rfc/0007-project-layout.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
