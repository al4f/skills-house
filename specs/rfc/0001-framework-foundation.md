# RFC 0001: Framework Foundation

**Status:** Accepted  
**Date:** 2026-07-05  
**Supersedes:** —  
**Related:** [framework-vision.md](../architecture/framework-vision.md)

## Summary

Defines what skills-house adopts from the ecosystem, what it adds, and the non‑negotiable principles that govern all framework products.

## 1. Skill format — Agent Skills (agentskills.io)

skills-house **adopts** the [Agent Skills](https://agentskills.io) open format without extension to the dist layout.

A skill is a folder whose required entry is `SKILL.md` with YAML frontmatter (`name`, `description`, …) and procedural instructions. Optional folders (`scripts/`, `references/`, `assets/`, …) follow the Agent Skills specification.

**Progressive disclosure** (discovery → activation → execution) is assumed by all supported agents. skills-house does not invent a parallel skill format.

### Source vs dist

| Layer | Format | Rule |
|-------|--------|------|
| **Source** (`skills/<name>/`) | skills-house authoring model (RFC 0002) | Freeform layout; `SKILL.md` + `package.json` |
| **Dist** (`skills-dist/<name>/`) | Agent Skills spec | Build output only; no extra markers |

## 2. Supported agent runtimes

Install and authoring docs MUST treat these as first-class targets:

| Agent family | Project scope | Global scope | Notes |
|--------------|---------------|--------------|-------|
| **Universal** (Cursor, Codex, OpenCode, …) | `.agents/skills/` | `~/.agents/skills/` | [agentskills.io](https://agentskills.io) universal pattern |
| **Claude Code / Claude** | `.claude/skills/` | `~/.claude/skills/` | Separate path; also receives project installs where applicable |
| **Cursor (legacy path)** | `.cursor/skills/` | `~/.cursor/skills/` | Installed alongside `.agents/skills/` in project scope |

The canonical list of agent aliases and path resolution lives in `@skills-house/install` (RFC 0004). New agents that follow `.agents/skills` SHOULD map to the `agents` alias without framework changes.

## 3. Implementation language policy

### 3.1 Framework internals — TypeScript

All **framework products** (`@skills-house/build`, `@skills-house/install`, `@skills-house/create`, registry tooling, pack scripts that ship with those packages) MUST be implemented in **TypeScript**, compiled for Node.js.

**Assumption:** Node.js is available on the developer machine (see `.nvmrc` in scaffolded projects). Framework CLIs are Node binaries (`#!/usr/bin/env node`).

### 3.2 External execution — language-agnostic

Scripts and tools that **skills invoke at runtime** (bundled in dist `scripts/`, referenced from `scripts/` workspace packages, or authored inside a skill folder) MUST NOT be restricted to TypeScript or JavaScript.

Authors MAY use Python, Bash, Go, or any other language. The build pipeline copies or bundles files; it does not mandate a runtime.

> **Repository rule:** This policy applies at repo level (`CONTRIBUTING.md`, scaffold templates) and is repeated in RFC 0002 and RFC 0003 so agents reading specs encounter it consistently.

## 4. Product KPIs — adopt, don't invent

Framework success is measured by **full adoption of existing standards**, not by new framework-specific rules.

| KPI | Requirement |
|-----|-------------|
| **Format adoption** | Dist output validates against Agent Skills layout and frontmatter expectations |
| **Install adoption** | Consumer installs use [skills.sh](https://www.skills.sh) (`npx skills add owner/repo --skill name`) where Git source is intended |
| **No parallel rule systems** | Do not introduce custom skill metadata, proprietary directory trees, or agent-specific dist variants |
| **Minimal author burden** | Authoring extensions are limited to `@include` and markdown link resolution (see authoring spec) |

When a choice exists between an ecosystem convention and a skills-house shortcut, **choose the ecosystem convention**.

## 5. Framework product family

Published npm packages under `@skills-house/*`:

| Package | RFC | Purpose |
|---------|-----|---------|
| `@skills-house/build` | [0003](./0003-build.md) | Compile source skills → Agent Skills dist |
| `@skills-house/install` | [0004](./0004-install.md) | Install **built dist** into agent directories |
| `@skills-house/create` | [0005](./0005-create.md) | Scaffold a skills-house project |

Each product MUST ship a **product skill** (RFC 0006) so agents working in any repo can discover CLI capabilities without reading npm READMEs.

## 6. Distribution (summary)

- **Skills (consumer):** [skills.sh](https://www.skills.sh) only — installs Git **source** from `skills/<name>/`.
- **Framework packages (author):** npm tag publish — see [distribution.md](../architecture/distribution.md).
- **Local dev:** `pnpm build` → `skills-dist/` + `@skills-house/install` — not a consumer channel.

Full detail remains in architecture docs; behavior normative for install/build/create is in RFCs 0003–0005.

## 7. Non-goals

- npm packages for individual skills
- Skill marketplace or registry UI in this repo
- Framework-enforced language for skill scripts
- Custom agent skill formats per vendor

## 8. Compliance

A release of `@skills-house/*` is **RFC-compliant** when:

1. Its behavior matches the Accepted RFC set at release tag.
2. Dist output from `@skills-house/build` conforms to Agent Skills.
3. No new author-facing rules are added without a new or amended RFC.
